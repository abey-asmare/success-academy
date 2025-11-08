import { db } from "@/lib/db";
import { Sentry } from "@/lib/sentryLogger";
import { Chapter } from "@/prisma/app/generated/prisma/client";
import { getAdminInfo } from "@/utils/roles";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;

  try {
    const { isAdmin } = await getAdminInfo();
    if (!isAdmin) {
      return NextResponse.json({error: "Unauthorized"}, { status: 401 });
    }

    const { list } = await req.json();
    await db.$transaction(
      list.map((item: Chapter) =>
        db.chapter.update({
          where: { id: item.id, courseId },
          data: { position: item.position },
        })
      )
    );
    
    revalidateTag(`courses/${courseId}`, "max");
    
    return NextResponse.json({message: "success"}, { status: 200 });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({error: "Internal server error"}, { status: 500 });
  }
}
