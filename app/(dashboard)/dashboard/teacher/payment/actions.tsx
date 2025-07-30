'use server'

import { db } from "@/lib/db";

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
  
      return { message: "Payment cancelled", status: 200 };
    } catch (err) {
      return { message: err, status: 500 };
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
  
      return { message: "Payment approved", status: 200 };
    } catch (err) {
      return { message: err, status: 500 };
    }
  }
  