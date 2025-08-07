import { db } from "@/lib/db";

export async function isCoursePaymentVerified(courseId: string, userId: string) {
    const purchase = await db.purchase.findFirst({
        where: {
            courseId: courseId,
            userId: userId,
            approved: true
        }
    })
    
    return !!purchase;
}
