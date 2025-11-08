import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { getAdminInfo } from "@/utils/roles";
import { Sentry } from "@/lib/sentryLogger";
import { examSchema } from "@/schemas/validationSchemas";
import { notFound } from "next/navigation";
import { revalidateTag } from "next/cache";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ simulationId: string }> }
) {
  const { simulationId } = await params;

  try {
    const { userId, isAdmin } = await getAdminInfo();

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

    const { courseId, name, description, questions } = validatedData.data;

    if (!courseId || !name || !questions || questions.length === 0) {
      return NextResponse.json({error: "Missing required fields"}, { status: 400 });
    }

    // Ensure simulation exists
    const simulation = await db.exam.findUnique({
      where: { id: simulationId, isSimulation: true },
    });

    if (!simulation) {
      notFound();
    }

    // Deduplicate questions before transaction
    const uniqueQuestions = questions.filter(
      (q, index, self) =>
        index ===
        self.findIndex(
          (other) =>
            other.question.trim() === q.question.trim() &&
            (other.imageUrl || "") === (q.imageUrl || "")
        )
    );

    // Optimized transaction
    const updatedSimulation = await db.$transaction(
      async (tx) => {
        // Remove old questions (cascade deletes answers)
        await tx.question.deleteMany({ where: { examId: simulationId } });

        // Insert new questions in bulk
        await tx.question.createMany({
          data: uniqueQuestions.map((q) => ({
            question: q.question.trim(),
            imageUrl: q.imageUrl || null,
            answerDescription: q.answerDescription || null,
            examId: simulationId,
          })),
        });

        // Fetch back inserted questions with IDs
        const dbQuestions = await tx.question.findMany({
          where: { examId: simulationId },
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

        // Update simulation metadata
        return tx.exam.update({
          where: { id: simulationId },
          data: {
            courseId,
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
    revalidateTag("courses", "max");
    revalidateTag("teacher/simulations", "max");
    revalidateTag(`courses/${courseId}`, "max");

    return NextResponse.json(updatedSimulation);
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({error: "Internal Server Error"}, { status: 500 });
  }
}
