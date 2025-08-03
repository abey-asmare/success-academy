import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/utils/roles";
import { db } from "@/lib/db";
import { Answer } from "@/prisma/app/generated/prisma/client";

// create a new simulation

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!isAdmin()) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const body = await req.json();
    const { courseId, name, description, questions } = body;

    // Validate required fields
    if ((!courseId && !name) || !questions || questions.length === 0) {
      return new NextResponse("Missing required fields", { status: 400 });
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
            courseId,
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
            (answer) =>
              answer.text.toLowerCase().trim() ===
              answerData.text.toLowerCase().trim()
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
        isSimulation: true,
        name,
        description,
        courseId,
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
    console.log("error happened here", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
