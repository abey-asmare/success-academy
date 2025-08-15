import { db } from "@/lib/db";
import { getAdminInfo } from "@/utils/roles";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

const { logger } = Sentry;

// fetch all courses if needed
export async function GET() {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
      },
      include: {
        exams: {
          select: {
            id: true,
            name: true,
            description: true,
            courseId: true
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    logger.info(`[COURSE_GET]: OK: Courses fetched successfully`)
    return NextResponse.json(courses);
  } catch (error) {
    logger.error(`[COURSE_GET]: Internal Error: Failed to fetch courses ${error}`)
    Sentry.captureException(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId, isAdmin } = await getAdminInfo();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { title } = await req.json();

    const course = await db.course.create({
      data: {
        title,
        userId,
      },
    });
    logger.info(`[COURSE_POST]: OK: Course ${course.id} created successfully by ${userId}`)
    return NextResponse.json(course);
  } catch (error) {
    logger.error(`[COURSE_POST]: Internal Error: Failed to create course ${error}`)
    Sentry.captureException(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
