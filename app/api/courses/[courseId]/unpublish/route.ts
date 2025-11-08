import { db } from "@/lib/db";
import { getAdminInfo } from "@/utils/roles";
import * as Sentry from "@sentry/nextjs";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  try {
    const { isAdmin } = await getAdminInfo(); 
    if (!isAdmin) {
      return NextResponse.json({error: "Unauthorized"}, { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
    });

    if (!course) {
      return NextResponse.json({error: "Not found"}, { status: 404 });
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
    revalidateTag(`courses/telegram-registration`, "max");

    return NextResponse.json(unpublishedCourse);
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({error: "Internal server error"}, { status: 500 });
  }
}
