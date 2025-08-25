import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";  
import { NextResponse } from "next/server";

import {logger, Sentry} from "@/lib/sentryLogger";


export async function POST(request: Request) {
    const {id} = await request.json()
    console.log(id)
    try {
      const payment = await db.purchase.findUnique({
        where: {
          id
        },
      });
      if (!payment) return NextResponse.json({ message: "Payment not found", status: 404 });
  
      await db.purchase.update({
        where: {
          id
        },
        data: {
          approved: false,
        },
      });
  
      return NextResponse.json({ message: "Payment declined successfully", status: 200 });
    } catch (err) {
      logger.error(
        `[TELEGRAM_BOT_DECLINE_PAYMENT]: Internal Error: Failed to decline payment ${err}`
      );
      Sentry.captureException(err);
      return NextResponse.json({ message: err, status: 500 });
    }
    finally {
      revalidatePath("/dashboard/teacher/payment");
      revalidatePath("/dashboard/search");
      revalidatePath("/dashboard/teacher/courses");
      revalidatePath(`/courses/${id}`);
    }    
  }
