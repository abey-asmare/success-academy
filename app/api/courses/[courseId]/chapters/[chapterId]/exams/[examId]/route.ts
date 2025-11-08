import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getAdminInfo } from "@/utils/roles";
import { examSchema } from "@/schemas/validationSchemas";
import { notFound } from "next/navigation";
import { revalidateTag } from "next/cache";
import { Sentry } from "@/lib/sentryLogger";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ courseId: string; chapterId: string; examId: string }>;
  }
) {
  const { examId } = await params;
  try {
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
    });
    return NextResponse.json(exam, { status: 200 });
  } catch(error) {
      Sentry.captureException(error)
    return NextResponse.json({error: "Internal Server Error"}, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ courseId: string; chapterId: string; examId: string }>;
  }
) {
  const { courseId, chapterId, examId } = await params;

  try {
    const { isAdmin } = await getAdminInfo();

    if (!isAdmin) {
      return NextResponse.json({error: "Unauthorized"}, { status: 401 });
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
      return NextResponse.json({error: "Missing required fields"}, { status: 400 });
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

    // Ensure exam exists
    const existingExam = await db.exam.findUnique({
      where: { id: examId, chapterId },
    });

    if (!existingExam) {
      notFound();
    }

    // atomic transaction
    const updatedExam = await db.$transaction(
      async (tx) => {
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
          select: {
            id: true,
            question: true,
            imageUrl: true,
            answerDescription: true,
          },
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
      },
      {
        timeout: 10_000,
        maxWait: 10_000,
      }
    );
    revalidateTag("chapters", "max");
    revalidateTag(`chapters/${chapterId}`, "max");
    revalidateTag(`exams/${examId}`, "max");

    return NextResponse.json(updatedExam);
  } catch (error) {
    Sentry.captureException(error)
    return NextResponse.json({error: "Internal Server Error"}, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ courseId: string; chapterId: string; examId: string }>;
  }
) {
  const { courseId, chapterId, examId } = await params;
  if (!courseId || !chapterId || !examId) {
    return NextResponse.json({error: "Invalid parameters"}, { status: 400 });
  }
  const { isAdmin } = await getAdminInfo();
  if (!isAdmin) {
    return NextResponse.json({error: "Unauthorized"}, { status: 401 });
  }

  try {
    const exam = await db.exam.delete({
      where: { id: examId },
    });

    revalidateTag("chapters", "max");
    revalidateTag(`chapters/${chapterId}`, "max");
    revalidateTag(`exams/${examId}`, "max");
    return NextResponse.json(exam, { status: 200 });
  } catch (error) {
    Sentry.captureException(error)
    return NextResponse.json({error: "Internal Server Error"}, { status: 500 });
  }
}
