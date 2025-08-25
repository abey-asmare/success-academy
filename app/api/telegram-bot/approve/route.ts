import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { logger, Sentry } from "@/lib/sentryLogger";

const SECRET = process.env.SHARED_SECRET_KEY!;

export async function POST(request: NextRequest) {
  try {
    // Parse JSON payload
    const { id, signature } = await request.json();
    console.log("id sig", id, signature, SECRET, signature === SECRET)

    if (!signature || signature !== SECRET) return NextResponse.json({message: "Invalid signature"}, { status: 401 });

    // Check if payment exists
    const payment = await db.purchase.findUnique({ where: { id } });
    if (!payment)
      return NextResponse.json({ message: "Payment not found" }, {status: 404});

    // Update payment
    const paymentResponse = await db.purchase.update({
      where: { id },
      data: { approved: true },
    });

    if (!paymentResponse) return NextResponse.json({ message: "Payment not found" }, {status: 404});

    // Revalidate relevant paths
    revalidatePath("/dashboard/teacher/payment");
    revalidatePath("/dashboard/search");
    revalidatePath("/dashboard/teacher/courses");
    revalidatePath(`/courses/${id}`);

    return NextResponse.json({
      message: "Payment approved successfully",
    }, {status: 200});
  } catch (err) {
    logger.error(
      `[TELEGRAM_BOT_APPROVE_PAYMENT]: Internal Error: Failed to approve payment ${err}`
    );
    Sentry.captureException(err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
