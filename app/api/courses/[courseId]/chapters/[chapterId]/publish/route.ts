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

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      },
    });

    const muxData = await db.muxData.findUnique({
      where: {
        chapterId,
      },
    });

    if (!chapter || !muxData || !chapter.title || !chapter.videoUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
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
    revalidateTag(`courses/${courseId}`, "max");
    revalidateTag(`chapters/${chapterId}`, "max");

    return NextResponse.json(publishedChapter);
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({error: "Internal Error"}, { status: 500 });
  }
}
