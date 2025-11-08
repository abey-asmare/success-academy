import { db } from "@/lib/db";
import { isAdmin } from "@/utils/roles";
import { currentUser } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { Sentry } from "@/lib/sentryLogger"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  try {
    const user = await currentUser();
    if (!user || !user.id || !isAdmin()) {
      return NextResponse.json({error: "Unauthorized"}, { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
    });

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: courseId,
        },
      },
    });


    if (purchase) {
      return NextResponse.json({error: "Already Purchased"}, { status: 400 });
    }

    if (!course) {
      return NextResponse.json({error: "Not Found"}, { status: 404 });
    }
    revalidateTag(`courses/${courseId}`, "max")
    revalidateTag(`${user.id}/purchase`, 'max')
    
    return NextResponse.json({ url: "" }, { status: 200 });
  } catch (error) {
    Sentry.captureException(error)
    return NextResponse.json({error: "Internal Error"}, { status: 500 });
  }
}
