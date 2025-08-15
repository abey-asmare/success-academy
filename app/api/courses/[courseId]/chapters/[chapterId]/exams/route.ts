import { db } from "@/lib/db";
import { Answer } from "@/prisma/app/generated/prisma/client";
import { getAdminInfo } from "@/utils/roles";
import Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

    
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
    const {courseId, chapterId} = await params
    const { logger } = Sentry
    try {
    const { userId, isAdmin } = await getAdminInfo()
      
    if (!isAdmin) {
      logger.warn(`[COURSE_ID_CHAPTER_ID_EXAM_POST]: Unauthorized: User ${userId} is not an admin`)
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { name, description, questions } = body;

    // Validate required fields
    if (!name || !questions || questions.length === 0) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // // Check if user owns the course
    // const course = await db.course.findUnique({
    //   where: {
    //     id: courseId,
    //     userId: userId,
    //   },
    // });

    // if (!course) {
    //   logger.warn(`[COURSE_ID_CHAPTER_ID_EXAM_POST]: Not Found: Course ${courseId} not found for user ${userId}`)
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
      logger.warn(`[COURSE_ID_CHAPTER_ID_EXAM_POST]: Not Found: Chapter ${chapterId} not found for course ${courseId}`)
      return new NextResponse("Chapter not found", { status: 404 });
    }

    // Check if exam with the same name already exists for this chapter
    const existingExam = await db.exam.findFirst({
      where: {
        name: name,
        chapterId: chapterId,
      },
    });

    if (existingExam) {
      logger.info(`[COURSE_ID_CHAPTER_ID_EXAM_POST]: Conflict: An exam with this name already exists for this chapter ${chapterId}`)
      return new NextResponse("An exam with this name already exists for this chapter", { status: 409 });
    }

    // Process questions and check for duplicates within this chapter
    const processedQuestions = [];
    
    for (const questionData of questions) {
      // Check if question with exact text already exists in any exam for this chapter
      const existingQuestion = await db.question.findFirst({
        where: {
          question: questionData.question,
          imageUrl: questionData.imageUrl,
          exam: {
            chapterId: chapterId,
          },
        },
        include: {
          answers: true,
        },
      });

      if (existingQuestion) {
        // Question exists, check if we need to add new answers
        const newAnswers = [];
        
        for (const answerData of questionData.answers) {
          const existingAnswer = existingQuestion.answers.find(
            (answer) => answer.text.toLowerCase().trim() === answerData.text.toLowerCase().trim()
          );
          
          if (!existingAnswer) {
            newAnswers.push({
              text: answerData.text,
              isCorrect: answerData.isCorrect,
            });
          }
        }
        // Use existing question but add new answers if any
        processedQuestions.push({
          question: questionData.question,
          imageUrl: questionData.imageUrl,
          answers: {
            create: newAnswers,
          },
        });
      } else {
        // New question, create with all answers
        processedQuestions.push({
          question: questionData.question,
          imageUrl: questionData.imageUrl,
          answers: {
            create: questionData.answers.map((answerData: Answer) => ({
              text: answerData.text,
              isCorrect: answerData.isCorrect,
            })),
          },
        });
      }
    }

    // Create the exam with processed questions for the specific chapter
    const exam = await db.exam.create({
      data: {
        name,
        description,
        chapterId: chapterId,
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
    
    return NextResponse.json(exam);
  } catch (error) {
    logger.error(`[COURSE_ID_CHAPTER_ID_EXAM_POST]: Internal Error: Failed to create exam for a course ${courseId} ${error}`)
    Sentry.captureException(error)  
    return new NextResponse("Internal Error", { status: 500 });
  }
}


export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  const { logger } = Sentry
    const {courseId, chapterId} = await params
  try {
    const { userId, isAdmin } = await getAdminInfo();
    
    if (!isAdmin) {
      logger.warn(`[COURSE_ID_CHAPTER_ID_EXAM_GET]: Unauthorized: User ${userId} is not authorized to get exams for a course ${courseId}`)
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
      logger.info(`[COURSE_ID_CHAPTER_ID_EXAM_GET]: Not Found: Chapter ${chapterId} not found for course ${courseId}`)
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
        createdAt: 'desc',
      },
    });

    logger.info(`[COURSE_ID_CHAPTER_ID_EXAM_GET]: OK: Exams for chapter ${chapterId} retrieved successfully`)
    return NextResponse.json(exams);
  } catch (error) {
    logger.error(`[COURSE_ID_CHAPTER_ID_EXAM_GET]: Internal Error: Failed to get exams for chapter ${chapterId} ${error}`)
    return new NextResponse("Internal Error", { status: 500 });
  }
}