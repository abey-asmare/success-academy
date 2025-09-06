import { db } from "@/lib/db";
import { getAdminInfo } from "@/utils/roles";
import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { examSchema } from "@/schemas/validationSchemas";

const { logger } = Sentry;

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ simulationId: string }> }
) {
  const { simulationId } = await params;

  try {
    const { isAdmin } = await getAdminInfo();
    if (!isAdmin) {
      logger.warn(
        `[COURSE_ID_SIMULATION_PUT]: Unauthorized attempt to update simulation ${simulationId}`
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

    const { courseId, name, description, questions } = validatedData.data;

    if (!courseId || !name || !questions || questions.length === 0) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const simulation = await db.exam.findUnique({
      where: {
        id: simulationId,
        isSimulation: true,
      },
    });

    if (!simulation) {
      return new NextResponse("Simulation not found", { status: 404 });
    }
    const updatedExam = await db.$transaction(async (tx) => {
      await tx.question.deleteMany({ where: { examId: simulationId } });
      for (const q of questions) {
        await tx.question.create({
          data: {
            question: q.question,
          imageUrl: q.imageUrl,
          examId: simulationId,
          answerDescription: q.answerDescription,
          answers: {
            create: q.answers.map((a) => ({
              text: a.text,
              isCorrect: a.isCorrect,
            })),
          },
        },
      });
    }
    return tx.exam.update({
      where: { id: simulationId },
      data: {
        courseId,
        name,
        description,
        updatedAt: new Date(),
      },
    });
  }, {
          timeout: 60_000, // 60 seconds
      maxWait: 10_000,
      })

    logger.info(
      `[COURSE_ID_SIMULATION_PUT]: OK: Simulation ${simulationId} updated successfully`
    );
    return NextResponse.json(updatedExam);
  } catch (error) {
    logger.error(
      `[COURSE_ID_SIMULATION_PUT]: Internal Error: Failed to update simulation ${simulationId}, ${error}`
    );
    Sentry.captureException(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
