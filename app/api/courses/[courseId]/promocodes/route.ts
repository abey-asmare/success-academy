import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { TZDate } from "react-day-picker";

function todayInUserZone(timeZone: string) {
  const now = new TZDate(TZDate.now(), timeZone);
  return new Date(now.toISOString());
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;

  try {
    const today = todayInUserZone("Africa/Addis_Ababa");

    const promocodes = await db.coursePromocode.findMany({
      where: {
        courseId: courseId,
        startDate: {
          lte: today,
        },
        expiresIn: {
          gte: today,
        },
      },
    });
    return NextResponse.json({ promocodes });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch promocodes" },
      { status: 500 }
    );
  }
}
