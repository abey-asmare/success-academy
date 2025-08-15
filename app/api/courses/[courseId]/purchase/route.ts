import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { logger } = Sentry;
  const { courseId } = await params;
  const { imageUrl } = await req.json();
  try {
    const { userId } = await auth();
    if (!userId) {
      logger.warn(
        `[COURSE_ID_PURCHASE_POST]: Unauthorized: User ${userId} is not authorized yet to purchase course ${courseId}`
      );
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          courseId,
          userId,
        },
      },
    });

    if (purchase) {
      await db.purchase.delete({
        where: {
          userId_courseId: {
            courseId,
            userId,
          },
        },
      });
    }

    const newPurchase = await db.purchase.create({
      data: {
        courseId,
        userId,
        imageUrl,
      },
    });

    logger.info(`[COURSE_ID_PURCHASE_POST]: OK: Course ${courseId} purchased successfully`)
    return NextResponse.json(newPurchase);
  } catch(error) {
    logger.error(`[COURSE_ID_PURCHASE_POST]: Internal Error: Failed to purchase course ${courseId} ${error}`)
    Sentry.captureException(error)
    return new NextResponse("Internal server error", { status: 500 });
  }
}
