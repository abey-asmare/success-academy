import { db } from "@/lib/db";
import { getAdminInfo } from "@/utils/roles";
import * as Sentry from "@sentry/nextjs";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {

  const { userId, isAdmin } = await getAdminInfo();
  const { logger } = Sentry;
  const { courseId } = await params;
  try {
    if (!isAdmin) {
      logger.warn(
        `[COURSE_ID_PUBLISH_PATCH]: Unauthorized: User ${userId} is not an admin to publish course ${courseId}`
      );
      return NextResponse.json({error: "Unauthorized"}, { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      logger.warn(
        `[COURSE_ID_PUBLISH_PATCH]: Not Found: Course ${courseId} not found for user ${userId}`
      );
      return new NextResponse("Not found", { status: 404 });
    }

    const hasPublishedChapter = course.chapters.some(
      (chapter) => chapter.isPublished
    );

    if (
      !course.title ||
      !course.imageUrl ||
      !hasPublishedChapter
    ) {
      logger.info(
        `[COURSE_ID_PUBLISH_PATCH]: Bad Request: Course ${courseId} is missing required fields for user ${userId}`
      );
      revalidateTag(`courses`, "max")
      revalidateTag(`courses/${courseId}`, "max")
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const publishedCourse = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });
    logger.info(
      `[COURSE_ID_PUBLISH_PATCH]: OK: Course ${courseId} published successfully for user ${userId}`
    );
    return NextResponse.json(publishedCourse);
  } catch (error) {
    logger.error(
      `[COURSE_ID_PUBLISH_PATCH]: Internal Error: Failed to publish course ${courseId} ${error}`
    );
    Sentry.captureException(error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
