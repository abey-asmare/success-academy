import { db } from "@/lib/db";
import { Sentry } from "@/lib/sentryLogger";
import { sendPurchaseRequestToTelegram } from "@/lib/telegram-api";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { deleteFile } from "@/lib/s3/query";

const deletePurchase = async (purchaseId: string, purchaseImageUrl: string) => {
  try {
    await deleteFile(purchaseImageUrl);
    await db.purchase.delete({
      where: {
        id: purchaseId,
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({error: "Internal server error"}, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  const { imageUrl } = await req.json();  
  try {
    const {userId} = await auth() 
    if (!userId) {
      return NextResponse.json({error: "Unauthorized"}, { status: 401 });
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
      await deletePurchase(purchase.id, purchase.imageUrl);
    }

    const newPurchase = await db.purchase.create({
      data: {
        courseId,
        userId,
        imageUrl,
      },
    });


    await sendPurchaseRequestToTelegram(userId, courseId, imageUrl, newPurchase.id);
    revalidatePath('page/teacher/purchases')
    revalidateTag(`courses/${courseId}`, "max")
    revalidateTag(`${userId}/purchase/${courseId}`, 'max')
    revalidateTag(`${userId}/purchase`, 'max')
    
    return NextResponse.json(newPurchase, { status: 200 });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({error: "Internal server error"}, { status: 500 });
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