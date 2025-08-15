// checkout will be hitting here
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/utils/roles";
import * as Sentry from "@sentry/nextjs"

// ready to be deprecate
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { logger } = Sentry
  const { courseId } = await params;
  try {
    const user = await currentUser();
    logger.info("checkout called even once, this route was marked to be depreciated")

    if (!user || !user.id || !isAdmin()) {
      return new NextResponse("Unauthorized", { status: 401 });
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
      return new NextResponse("Already Purchased", { status: 400 });
    }

    if (!course) {
      return new NextResponse("Not Found", { status: 404 });
    }
    return NextResponse.json({ url: "" });
  } catch {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
