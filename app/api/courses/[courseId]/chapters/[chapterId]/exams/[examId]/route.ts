import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getAdminInfo } from "@/utils/roles";
import {Answer, Question} from "@/prisma/app/generated/prisma/client"
import Sentry from "@sentry/nextjs"






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

type QuestionData =  (Question & {
  answers: Answer[]
})

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string; examId: string }> }
) {



  const {userId, isAdmin }   = await getAdminInfo()    
  const { logger } = Sentry
  const { courseId, chapterId, examId } = await params;
  
  try {
    
    if (!isAdmin) {
      logger.info(`[COURSE_ID_CHAPTER_ID_EXAM_PUT]: Unauthorized: User ${userId} is not an admin to update the exam ${examId}`)
      return new NextResponse("Unauthorized", { status: 401 });
    }
    
    const body = await req.json();
    const { name, description, questions } = body;
    
    // Validate required fields
    if (!name || !questions || questions.length === 0) {
      return new NextResponse("Missing required fields", { status: 400 });
    }
    
    // Check if user owns the course
    // const course = await db.course.findUnique({
    //   where: {
    //     id: courseId,
    //     userId: userId,
    //   },
    // });
    
    // if (!course) {
    //   logger.info(`[COURSE_ID_CHAPTER_ID_EXAM_PUT]: Not Found: Course ${courseId} not found for user ${userId}`)
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
      logger.info(`[COURSE_ID_CHAPTER_ID_EXAM_PUT]: Not Found: Chapter ${chapterId} not found for course ${courseId}`)
      return new NextResponse("Chapter not found", { status: 404 });
    }
    
    // Check if the exam exists and belongs to this chapter
    const existingExam = await db.exam.findUnique({
      where: {
        id: examId,
        chapterId: chapterId,
      },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });
    
    if (!existingExam) {
      logger.info(`[COURSE_ID_CHAPTER_ID_EXAM_PUT]: Not Found: Exam ${examId} not found for chapter ${chapterId}`)
      return new NextResponse("Exam not found", { status: 404 });
    }
    
    // Check if another exam with the same name exists (excluding current exam)
    const duplicateExam = await db.exam.findFirst({
      where: {
        name: name,
        chapterId: chapterId,
        id: {
          not: examId,
        },
      },
    });
    
    if (duplicateExam) {
      logger.info(`[COURSE_ID_CHAPTER_ID_EXAM_PUT]: Conflict: An exam with this name already exists for this chapter ${chapterId}`)
      return new NextResponse("An exam with this name already exists for this chapter", { status: 409 });
    }
    
    // Delete existing questions and answers
    await db.answer.deleteMany({
      where: {
        question: {
          examId: examId,
        },
      },
    });
    
    await db.question.deleteMany({
      where: {
        examId: examId,
      },
    });
    
    // Process new questions
    const processedQuestions = questions.map((questionData: QuestionData) => ({
      question: questionData.question,
      imageUrl: questionData.imageUrl, 
      answers: {
        create: questionData.answers.map((answerData: Answer) => ({
          text: answerData.text,
          isCorrect: answerData.isCorrect,
        })),
      },
    }));
    
    // Update the exam with new data
    const updatedExam = await db.exam.update({
      where: {
        id: examId,
      },
      data: {
        name,
        description,
        questions: {
          create: processedQuestions,
        },
      },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });
    
    logger.info(`[COURSE_ID_CHAPTER_ID_EXAM_PUT]: OK: Exam ${examId} updated successfully`)
    return NextResponse.json(updatedExam);
  } catch(error) {
    logger.error(`[COURSE_ID_CHAPTER_ID_EXAM_PUT]: Internal Error: Failed to update exam ${examId} ${error}`)
    Sentry.captureException(error)  
    return new NextResponse("Internal Error", { status: 500 });
  }
}