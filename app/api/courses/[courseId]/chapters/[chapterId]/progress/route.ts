import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as Sentry from "@sentry/nextjs";
import { revalidateTag } from "next/cache";


export async function PUT(
  req: Request,
  { params }: { params: Promise<{ chapterId: string }> }
) {
  const { logger } = Sentry
  const {chapterId} = await params
  try {
    const { userId } = await auth();
    const { isCompleted } = await req.json();

    if (!userId) {
      logger.warn(`[COURSE_ID_CHAPTER_ID_PROGRESS_PUT]: Unauthorized: User ${userId} is not an admin to update the progress for chapter ${chapterId}`)
      return new NextResponse("Unauthorized", { status: 401 });
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

    logger.info(`[COURSE_ID_CHAPTER_ID_PROGRESS_PUT]: OK: Progress for chapter ${chapterId} updated successfully`)
    return NextResponse.json(userProgress);
  } catch (error) {
    logger.error(`[COURSE_ID_CHAPTER_ID_PROGRESS_PUT]: Internal Error: Failed to update progress for chapter ${chapterId} ${error}`)
    Sentry.captureException(error)  
    return new NextResponse("Internal Error", { status: 500 });
  }
}