'use server'

import { db } from "@/lib/db";
import { revalidatePath, updateTag } from "next/cache";

export async function cancelPayment(id: string) {
    try {
      const payment = await db.purchase.findUnique({
        where: {    
          id,
        },
      });
      if (!payment) return { message: "Payment not found", status: 404 };
  
      await db.purchase.update({
        where: {
          id,
        },
        data: {
          approved: false,
        },
      });
  
      updateTag(`${payment.userId}/purchase/${payment.courseId}`)
      return { message: "Payment cancelled", status: 200 };
    } catch (err) {
      return { message: err, status: 500 };
    }  finally {
      revalidatePath("/dashboard/teacher/payment");
      revalidatePath("/dashboard/search");
      revalidatePath("/dashboard/teacher/courses");
      revalidatePath(`/courses/${id}`);

      
    }   
  }
  
  export async function approvePayment(id: string) {
    try {
      const payment = await db.purchase.findUnique({
        where: {
          id
        },
      });
      if (!payment) return { message: "Payment not found", status: 404 };
  
      await db.purchase.update({
        where: {
          id
        },
        data: {
          approved: true,
        },
      });
  
      updateTag(`${payment.userId}/purchase/${payment.courseId}`)
      return { message: "Payment approved", status: 200 };
    } catch (err) {
      return { message: err, status: 500 };
    }
    finally {
      revalidatePath("/dashboard/teacher/payment");
      revalidatePath("/dashboard/search");
      revalidatePath("/dashboard/teacher/courses");
      revalidatePath(`/courses/${id}`);
    }    
  }
