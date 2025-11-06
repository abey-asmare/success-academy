import { db } from "@/lib/db";
import { getAdminInfo } from "@/utils/roles";
import * as Sentry from "@sentry/nextjs";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const { logger } = Sentry;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  try {
    const { userId, isAdmin } = await getAdminInfo();
    if (!isAdmin) {
      logger.warn(
        `[COURSE_ID_UNPUBLISH_PATCH]: Unauthorized: User ${userId} is not an admin to unpublish the course ${courseId}`
      );
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      logger.warn(
        `[COURSE_ID_UNPUBLISH_PATCH]: Not Found: Course ${courseId} not found`
      );
      return new NextResponse("Not found", { status: 404 });
    }

    const unpublishedCourse = await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        isPublished: false,
      },
    });
    revalidateTag(`courses`, "max");
    revalidateTag(`courses/${courseId}`, "max");
    revalidateTag("home", "max");
    revalidateTag('page/dashboard', "max");
    revalidateTag('page/search', "max");

    return NextResponse.json(unpublishedCourse);
  } catch (error) {
    logger.error(
      `[COURSE_ID_UNPUBLISH_PATCH]: Internal Error: Failed to unpublish course ${courseId} ${error}`
    );
    Sentry.captureException(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
