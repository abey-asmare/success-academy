import { db } from "@/lib/db";
import { examSchema } from "@/schemas/validationSchemas";
import { getAdminInfo } from "@/utils/roles";
import Sentry from "@sentry/nextjs";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const BATCH_SIZE = 100; // Adjust for DB payload limits

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  const { courseId, chapterId } = await params;

  try {
    const { userId, isAdmin } = await getAdminInfo();
    if (!isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validatedData = examSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: "Validation Error", details: validatedData.error.flatten() },
        { status: 400 }
      );
    }

    const { name, description, questions } = validatedData.data;

    if (!name || !questions || questions.length === 0) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Ensure chapter exists
    const chapter = await db.chapter.findUnique({
      where: { id: chapterId, courseId },
    });
    if (!chapter) {
      return new NextResponse("Chapter not found", { status: 404 });
    }

    // Check for existing exam name in this chapter
    const existingExam = await db.exam.findFirst({
      where: { name, chapterId },
    });
    if (existingExam) {
      return new NextResponse("An exam with this name already exists", {
        status: 409,
      });
    }

    // Deduplicate questions before DB
    const uniqueQuestions = questions.filter(
      (q, index, self) =>
        index ===
        self.findIndex(
          (other) =>
            other.question.trim() === q.question.trim() &&
            (other.imageUrl || "") === (q.imageUrl || "")
        )
    );

    // Transaction: create exam + bulk insert questions and answers
    const exam = await db.$transaction(async (tx) => {
      const createdExam = await tx.exam.create({
        data: { name, description, chapterId },
      });

      for (let i = 0; i < uniqueQuestions.length; i += BATCH_SIZE) {
        const chunk = uniqueQuestions.slice(i, i + BATCH_SIZE);

        // Bulk insert questions (createMany)
        await tx.question.createMany({
          data: chunk.map((q) => ({
            question: q.question.trim(),
            imageUrl: q.imageUrl || null,
            answerDescription: q.answerDescription || null,
            examId: createdExam.id,
          })),
        });

        // Fetch inserted questions to get IDs
        const dbQuestions = await tx.question.findMany({
          where: { examId: createdExam.id },
          select: { id: true, question: true, imageUrl: true },
        });

        // Map question text → ID
        const idMap = new Map<string, string>();
        dbQuestions.forEach((q) =>
          idMap.set(q.question.trim().toLowerCase(), q.id)
        );

        // Build answers for bulk insert
        const answersData = chunk.flatMap((q) =>
          q.answers.map((a) => ({
            text: a.text,
            isCorrect: a.isCorrect,
            questionId: idMap.get(q.question.trim().toLowerCase())!,
          }))
        );

        // Bulk insert answers in batches
        for (let j = 0; j < answersData.length; j += BATCH_SIZE) {
          const ansChunk = answersData.slice(j, j + BATCH_SIZE);
          await tx.answer.createMany({ data: ansChunk });
        }
      }

      return tx.exam.findUnique({
        where: { id: createdExam.id },
        include: { questions: { include: { answers: true } } },
      });
    });

    revalidateTag('chapters', 'max')
    revalidateTag(`chapters/${chapterId}`, 'max')

    return NextResponse.json(exam);
  } catch (error) {
    Sentry.captureException(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  const { logger } = Sentry;
  const { courseId, chapterId } = await params;
  try {
    const { userId, isAdmin } = await getAdminInfo();

    if (!isAdmin) {
      logger.warn(
        `[COURSE_ID_CHAPTER_ID_EXAM_GET]: Unauthorized: User ${userId} is not authorized to get exams for a course ${courseId}`
      );
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user owns the course
    // const course = await db.course.findUnique({
    //   where: {
    //     id: courseId,
    //     userId: userId,
    //   },
    // });

    // if (!course) {
    //   logger.info(`[COURSE_ID_CHAPTER_ID_EXAM_GET]: Not Found: Course ${courseId} not found for user ${userId}`)
    //   return new NextResponse("Course not found", { status: 404 });
    // }

    // Check if the chapter exists and belongs to the course
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      },
    });

    if (!chapter) {
      logger.info(
        `[COURSE_ID_CHAPTER_ID_EXAM_GET]: Not Found: Chapter ${chapterId} not found for course ${courseId}`
      );
      return new NextResponse("Chapter not found", { status: 404 });
    }

    // Get all exams for this specific chapter
    const exams = await db.exam.findMany({
      where: {
        chapterId: chapterId,
      },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    logger.info(
      `[COURSE_ID_CHAPTER_ID_EXAM_GET]: OK: Exams for chapter ${chapterId} retrieved successfully`
    );
    return NextResponse.json(exams);
  } catch (error) {
    logger.error(
      `[COURSE_ID_CHAPTER_ID_EXAM_GET]: Internal Error: Failed to get exams for chapter ${chapterId} ${error}`
    );
    return new NextResponse("Internal Error", { status: 500 });
  }
}
