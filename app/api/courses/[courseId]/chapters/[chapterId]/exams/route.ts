import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db";
import { Answer } from "@/prisma/app/generated/prisma/client";
import { isAdmin } from "@/utils/roles";
    
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
    const {courseId, chapterId} = await params
  try {
    const { userId } = await auth();
    
    if (!userId || !isAdmin()) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { name, description, questions } = body;

    // Validate required fields
    if (!name || !questions || questions.length === 0) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Check if user owns the course
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Check if the chapter exists and belongs to the course
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      },
    });

    if (!chapter) {
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
      return new NextResponse("An exam with this name already exists for this chapter", { status: 409 });
    }

    // Process questions and check for duplicates within this chapter
    const processedQuestions = [];
    
    for (const questionData of questions) {
      // Check if question with exact text already exists in any exam for this chapter
      const existingQuestion = await db.question.findFirst({
        where: {
          question: questionData.question,
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
          answers: {
            create: newAnswers,
          },
        });
      } else {
        // New question, create with all answers
        processedQuestions.push({
          question: questionData.question,
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
    console.error("[CHAPTER_EXAM_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
    const {courseId, chapterId} = await params
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    // Check if user owns the course
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Check if the chapter exists and belongs to the course
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      },
    });

    if (!chapter) {
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

    return NextResponse.json(exams);
  } catch (error) {
    console.error("[CHAPTER_EXAMS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
