import { db } from "@/lib/db";
import { getAdminInfo } from "@/utils/roles";
import Sentry from "@sentry/nextjs";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  const { courseId, chapterId } = await params;
  const { logger } = Sentry;
  try {
    const { userId, isAdmin } = await getAdminInfo();

    if (!isAdmin) {
      logger.warn(
        `[COURSE_ID_CHAPTER_ID_UNPUBLISH_PATCH]: Unauthorized: User ${userId} is not an admin to unpublish chapter ${chapterId}`
      );
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // const ownCourse = await db.course.findUnique({
    //   where: {
    //     id: courseId,
    //     userId,
    //   },
    // });

    // if (!ownCourse) {
    //   logger.warn(`[COURSE_ID_CHAPTER_ID_UNPUBLISH_PATCH]: Unauthorized: User ${userId} is not the owner of course ${courseId}`)
    //   return new NextResponse("Unauthorized", { status: 401 });
    // }

    const unpublishedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId: courseId,
      },
      data: {
        isPublished: false,
      },
    });

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
    });

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    logger.info(
      `[COURSE_ID_CHAPTER_ID_UNPUBLISH_PATCH]: OK: Chapter ${chapterId} unpublished successfully`
    );
    revalidateTag(`courses/${courseId}`, "max");
    revalidateTag(`chapters/${chapterId}`, "max");

    return NextResponse.json(unpublishedChapter);
  } catch (error) {
    logger.error(
      `[COURSE_ID_CHAPTER_ID_UNPUBLISH_PATCH]: Internal Error: Failed to unpublish chapter ${chapterId} ${error}`
    );
    Sentry.captureException(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
