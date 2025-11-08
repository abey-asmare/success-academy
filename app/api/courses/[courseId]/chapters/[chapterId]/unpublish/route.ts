import { db } from "@/lib/db";
import { Sentry } from "@/lib/sentryLogger";
import { getAdminInfo } from "@/utils/roles";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  const { courseId, chapterId } = await params;
  try {
    const { isAdmin } = await getAdminInfo();

    if (!isAdmin) {
      return NextResponse.json({error: "Unauthorized"}, { status: 401 });
    }
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

    revalidateTag(`courses/${courseId}`, "max");
    revalidateTag(`chapters/${chapterId}`, "max");

    return NextResponse.json(unpublishedChapter);
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({error: "Internal Error"}, { status: 500 });
  }
}
