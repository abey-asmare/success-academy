import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getAdminInfo } from "@/utils/roles";
import {Sentry, logger} from "@/lib/sentryLogger"
import { examSchema } from "@/schemas/validationSchemas";


export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ courseId: string; chapterId: string; examId: string }> }
) {
  const {userId, isAdmin }   = await getAdminInfo()    

  const {courseId, chapterId, examId} = await params
    const { logger } = Sentry
  try {
    if (!isAdmin) {
      logger.warn(`[COURSE_ID_CHAPTER_ID_EXAM_DELETE]: Unauthorized: User ${userId} is not an admin to update the exam ${examId}`)
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // const ownCourse = await db.course.findUnique({
    //   where: {
    //     id: courseId,
    //     userId,
    //   },
    // });

    // if (!ownCourse) {
    //   logger.warn(`[COURSE_ID_CHAPTER_ID_EXAM_DELETE]: Unauthorized: User ${userId} is not the owner of course ${courseId}`)
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      },
    });

    if (!chapter) {
      logger.info(`[COURSE_ID_CHAPTER_ID_EXAM_DELETE]: Not Found: Chapter ${chapterId} not found for course ${courseId}`)
      return NextResponse.json({error: "Not Found"}, { status: 404 });
    }

    const exam = await db.exam.findUnique({
      where: {
        id: examId,
        chapterId: chapterId,
      },
    });

    if (!exam) {
      logger.info(`[COURSE_ID_CHAPTER_ID_EXAM_DELETE]: Not Found: Exam ${examId} not found for chapter ${chapterId}`)
      return NextResponse.json({error: "Not Found"}, { status: 404 });
    }

    await db.exam.delete({ where: { id: examId } });

    return NextResponse.json({message: "OK"}, { status: 200 });
  } catch (error) {
    Sentry.captureException(error)  
    logger.error(`[COURSE_ID_CHAPTER_ID_EXAM_DELETE]: Internal Server Error: ${error}`)
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

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

    // chapter exists
    const chapter = await db.chapter.findUnique({
      where: { id: chapterId, courseId },
    });

    if (!chapter) {
      logger.info(
        `[COURSE_ID_CHAPTER_ID_EXAM_PUT]: Not Found: Chapter ${chapterId} not found for course ${courseId}`
      );
      return new NextResponse("Chapter not found", { status: 404 });
    }

    // exam exists
    const existingExam = await db.exam.findUnique({
      where: { id: examId, chapterId },
    });

    if (!existingExam) {
      logger.info(
        `[COURSE_ID_CHAPTER_ID_EXAM_PUT]: Not Found: Exam ${examId} not found for chapter ${chapterId}`
      );
      return new NextResponse("Exam not found", { status: 404 });
    }

    // Filter out duplicate questions (by text + imageUrl combo)
    const uniqueQuestions = questions.filter(
      (q, index, self) =>
        index ===
        self.findIndex(
          (other) =>
            other.question.trim() === q.question.trim() &&
            (other.imageUrl || "") === (q.imageUrl || "")
        )
    );

    // Run everything atomically
    const updatedExam = await db.$transaction(async (tx) => {
      // Delete old questions (cascade removes answers)
      await tx.question.deleteMany({ where: { examId } });

      // Recreate unique questions with answers
      for (const q of uniqueQuestions) {
        await tx.question.create({
          data: {
            question: q.question,
            imageUrl: q.imageUrl,
            examId,
            answers: {
              create: q.answers.map((a) => ({
                text: a.text,
                isCorrect: a.isCorrect,
              })),
            },
          },
        });
      }

      // Update exam info
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
        timeout: 50_000, // 50 seconds
    maxWait: 5_000,
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