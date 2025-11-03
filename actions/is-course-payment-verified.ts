import { db } from "@/lib/db";
import { REVALIDATE_INSTANT } from "@/server-constants";
import { cacheTag } from "next/cache";

export async function isCoursePaymentVerified(courseId: string, userId: string) {
    'use cache'
    cacheTag(`${userId}/payment/verified`)
    const purchase = await db.purchase.findFirst({
        where: {
            courseId: courseId,
            userId: userId,
            approved: true
        },
        cacheStrategy: {
            ttl: REVALIDATE_INSTANT,
            swr: REVALIDATE_INSTANT
        }
    })
    
    return !!purchase;
}
