import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/utils/roles";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params
  try {
    const { userId } = await auth();

    if (!userId || !isAdmin()) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    const unpublishedCourse = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {         
        isPublished: false,
      },
    });

    return NextResponse.json(unpublishedCourse);
  } catch {
    return new NextResponse("Internal Error", { status: 500 });
  }
}