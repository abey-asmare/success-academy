import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { Sentry } from "@/lib/sentryLogger";


export async function PUT(
  req: Request,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  const {chapterId} = await params
  try {
    const { userId } = await auth();
    const { isCompleted } = await req.json();

    if (!userId) {
      return NextResponse.json({error: "Unauthorized"}, { status: 401 });
    }

    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },  
      update: {
        isCompleted,
      },
      create: {
        userId,
        chapterId,
        isCompleted,
      },
    });

    revalidateTag(`${userId}/progress/${chapterId}`, 'max')

    return NextResponse.json(userProgress);
  } catch (error) {
    Sentry.captureException(error)  
    return NextResponse.json({error: "Internal Error"}, { status: 500 });
  }
}