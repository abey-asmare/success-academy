import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/utils/roles";
import {Answer, Question} from "@/prisma/app/generated/prisma/client"


export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ courseId: string; chapterId: string; examId: string }> }
) {
    const {courseId, chapterId, examId} = await params
  try {
    const { userId } = await auth();

    if (!userId || !isAdmin()) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      },
    });

    if (!chapter) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const exam = await db.exam.findUnique({
      where: {
        id: examId,
        chapterId: chapterId,
      },
    });

    if (!exam) {
      return new NextResponse("Not Found", { status: 404 });
    }

    await db.exam.delete({ where: { id: examId } });

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
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
  const { courseId, chapterId, examId } = await params;
  
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
    
    return NextResponse.json(updatedExam);
  } catch {
    return new NextResponse("Internal Error", { status: 500 });
  }
}