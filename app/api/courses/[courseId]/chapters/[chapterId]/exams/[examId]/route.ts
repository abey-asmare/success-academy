import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ courseId: string; chapterId: string; examId: string }> }
) {
    const {courseId, chapterId, examId} = await params
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await auth()
     db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      },
    });

    if (!chapter) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const exam = await db.exam.findUnique({
      where: {
        id: examId,
        chapterId: chapterId,
      },
    });

    if (!exam) {
      return new NextResponse("Not Found", { status: 404 });
    }

    await db.exam.delete({ where: { id: examId } });

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
