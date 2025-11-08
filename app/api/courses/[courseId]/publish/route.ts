import { db } from "@/lib/db";
import { getAdminInfo } from "@/utils/roles";
import { Sentry } from "@/lib/sentryLogger"
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { userId, isAdmin } = await getAdminInfo();
  const { courseId } = await params;
  try {
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
      return  NextResponse.json({error: "Not found"}, { status: 404 });
    }

    const hasPublishedChapter = course.chapters.some(
      (chapter) => chapter.isPublished
    );

    if (!course.title || !course.imageUrl || !hasPublishedChapter) {
      return  NextResponse.json({error: "Missing required fields"}, { status: 400 });
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
    revalidateTag(`courses`, "max");
    revalidateTag("home", "max");
    revalidateTag('page/dashboard', "max");
    revalidateTag('page/search', "max");
    revalidateTag(`courses/${courseId}`, "max");
    revalidateTag(`courses/telegram-registration`, "max");
    
    return NextResponse.json(publishedCourse);
  } catch (error) {
    Sentry.captureException(error);
    return  NextResponse.json({error: "Internal Error"}, { status: 500 });
  }
}
