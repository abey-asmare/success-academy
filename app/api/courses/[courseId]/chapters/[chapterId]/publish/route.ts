import { db } from "@/lib/db";
import { getAdminInfo } from "@/utils/roles";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  const { logger } = Sentry
    const {courseId, chapterId} = await params
  try {
    const { userId, isAdmin } = await getAdminInfo();
    if (!isAdmin) {
      logger.warn(`[COURSE_ID_CHAPTER_ID_PUBLISH_PATCH]: Unauthorized: User ${userId} is not authorized to publish chapter ${chapterId}`)
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // const ownCourse = await db.course.findUnique({
    //   where: {
    //     id: courseId,
    //     userId,
    //   },
    // });

    // if (!ownCourse) {
    //   logger.warn(`[COURSE_ID_CHAPTER_ID_PUBLISH_PATCH]: Unauthorized: User ${userId} is not the owner of course ${courseId}`)
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      },
    });

    const muxData = await db.muxData.findUnique({
      where: {
        chapterId
      },
    });

    if (
      !chapter ||   
      !muxData ||
      !chapter.title ||
      !chapter.videoUrl
    ) {
      logger.info(`[COURSE_ID_CHAPTER_ID_PUBLISH_PATCH]: Missing required fields: Chapter ${chapterId} is missing required fields`)
      return NextResponse.json({error: "Missing required fields"}, { status: 400 });
    }

    const publishedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        isPublished: true,
      },
    });

    logger.info(`[COURSE_ID_CHAPTER_ID_PUBLISH_PATCH]: OK: Chapter ${chapterId} published successfully`)
    return NextResponse.json(publishedChapter);
  } catch (error) {
    logger.error(`[COURSE_ID_CHAPTER_ID_PUBLISH_PATCH]: Internal Error: Failed to publish chapter ${chapterId} ${error}`)
    Sentry.captureException(error)  
    return new NextResponse("Internal Error", { status: 500 });
  }
}