import { db } from "@/lib/db";
import { sendPurchaseRequestToTelegram } from "@/lib/telegram-api";
import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { logger } = Sentry;
  const { courseId } = await params;
  const { imageUrl } = await req.json();
  try {
    const {userId} = await auth() 
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

    if (!newPurchase) {
      logger.error(
        `[COURSE_ID_PURCHASE_POST]: Internal Error: Failed to purchase course ${courseId}`
      );
      return new NextResponse("Internal server error", { status: 500 });
    }
    logger.info(
      `[COURSE_ID_PURCHASE_POST]: OK: Course ${courseId} purchased successfully`
    );
    logger.info(`[COURSE_ID_PURCHASE_POST]: OK: Course ${courseId} attempt to send.`)

  //  fetch for telegram
    await sendPurchaseRequestToTelegram(userId, courseId, imageUrl, newPurchase.id);
    revalidateTag(`courses/${courseId}`, "max")
    revalidateTag(`${userId}/purchase/${courseId}`, 'max')
    revalidateTag(`${userId}/purchase`, 'max')
    return NextResponse.json(newPurchase);
  } catch (error) {
    logger.error(
      `[COURSE_ID_PURCHASE_POST]: Internal Error: Failed to purchase course ${courseId} ${error}`
    );
    Sentry.captureException(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}


export async function GET(req: NextRequest, {params}: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json([])
  }
  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        courseId,
        userId,
      },
    },
  });
  return NextResponse.json(purchase);
} 