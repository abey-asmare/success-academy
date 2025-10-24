import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getAdminInfo } from "@/utils/roles";
import { Sentry, logger } from "@/lib/sentryLogger";
import { examSchema } from "@/schemas/validationSchemas";
import { notFound } from "next/navigation";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string; examId: string }> }
) {
  const { courseId, chapterId, examId } = await params;

  try {
    const { userId, isAdmin } = await getAdminInfo();

    if (!isAdmin) {
      logger.info(
        `[COURSE_ID_CHAPTER_ID_EXAM_PUT]: Unauthorized: User ${userId} is not an admin to update exam ${examId}`
      );
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

    // delete duplicate if any
    const uniqueQuestions = questions.filter(
      (q, index, self) =>
        index ===
        self.findIndex(
          (other) =>
            other.question.trim() === q.question.trim() &&
            (other.imageUrl || "") === (q.imageUrl || "")
        )
    );

    // Ensure chapter exists
    const chapter = await db.chapter.findUnique({
      where: { id: chapterId, courseId },
    });

    if (!chapter) {
      logger.info(
        `[COURSE_ID_CHAPTER_ID_EXAM_PUT]: Not Found: Chapter ${chapterId} not found for course ${courseId}`
      );
      notFound()
      // return new NextResponse("Chapter not found", { status: 404 });
    }

    // Ensure exam exists
    const existingExam = await db.exam.findUnique({
      where: { id: examId, chapterId },
    });

    if (!existingExam) {
      logger.info(
        `[COURSE_ID_CHAPTER_ID_EXAM_PUT]: Not Found: Exam ${examId} not found for chapter ${chapterId}`
      );
      notFound()
      // return new NextResponse("Exam not found", { status: 404 });
    }

    // atomic transaction
    const updatedExam = await db.$transaction(async (tx) => {
      // Remove old questions + answers
      await tx.question.deleteMany({ where: { examId } });

      // Insert new questions
      await tx.question.createMany({
        data: uniqueQuestions.map((q) => ({
          question: q.question.trim(),
          imageUrl: q.imageUrl || null,
          answerDescription: q.answerDescription || null,
          examId,
        })),
      });

      // Fetch back inserted questions
      const dbQuestions = await tx.question.findMany({
        where: { examId },
        select: { id: true, question: true, imageUrl: true, answerDescription: true },
      });

      // Build answers for bulk insert
      const answersData = uniqueQuestions.flatMap((q) => {
        const parent = dbQuestions.find(
          (dq) =>
            dq.question.trim() === q.question.trim() &&
            (dq.imageUrl || "") === (q.imageUrl || "")
        );
        if (!parent) return [];
        return q.answers.map((a) => ({
          text: a.text,
          isCorrect: a.isCorrect,
          questionId: parent.id,
        }));
      });

      if (answersData.length > 0) {
        await tx.answer.createMany({ data: answersData });
      }

      // Update exam metadata
      return tx.exam.update({
        where: { id: examId },
        data: {
          name,
          description,
          updatedAt: new Date(),
        },
        include: {
          questions: {
            include: { answers: true },
          },
        },
      });
    }, {
      timeout: 10_000,
      maxWait: 10_000,
    });

    logger.info(
      `[COURSE_ID_CHAPTER_ID_EXAM_PUT]: OK: Exam ${examId} updated successfully`
    );
    return NextResponse.json(updatedExam);
  } catch (error) {
    logger.error(
      `[COURSE_ID_CHAPTER_ID_EXAM_PUT]: Internal Error: Failed to update exam ${examId}, ${error}`
    );
    Sentry.captureException(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string; examId: string }> }
 ){
  const {examId} = await params
  try{
     const exam = await db.exam.findUnique({
          where: {
              id: examId,
          },
          include: {
              questions: {
                  include: {
                      answers: true,
                  },
              },
          },
      })
      return NextResponse.json(exam, {status: 200})
  }catch{
    return new NextResponse("Internal Server Error", { status: 500 });
  }
 }
