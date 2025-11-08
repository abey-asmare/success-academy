import { db } from "@/lib/db";
import { Sentry } from "@/lib/sentryLogger";
import { getAdminInfo } from "@/utils/roles";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * 
 * @returns get courses with exams
 */
export async function GET(){
  try{
    const courses = await db.course.findMany({
      where: {
        isPublished: true,

      },
      include: {
          exams: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(courses);
  }catch(error){
    Sentry.captureException(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
export async function POST(req: Request) {
  const { title } = await req.json();
  try {
    const { userId, isAdmin } = await getAdminInfo();
    if (!isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const course = await db.course.create({
      data: {
        title,
        userId,
      },
    });

    revalidateTag('courses', 'max')
    return NextResponse.json(course);
  } catch (error) {
    Sentry.captureException(error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
