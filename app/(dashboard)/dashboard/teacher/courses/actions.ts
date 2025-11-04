'use server'
import { db } from "@/lib/db"
import { logger, Sentry } from "@/lib/sentryLogger"
import { revalidatePath, updateTag } from "next/cache"
import { z } from "zod"

import { getAdminInfo } from "@/utils/roles"
import { TZDate } from "@date-fns/tz"


const validatePromoCode = z.object({
    code: z.string().min(6).max(6),
    discount: z.coerce.number().min(1).max(100),
    appliedFrom: z.coerce.date(),
    expiredAt: z.coerce.date(),
})


function toUTCMidnight(date: Date, timeZone: string) {
    const tzMidnight = new TZDate(date.getFullYear(), date.getMonth(), date.getDate(), timeZone)
    return new Date(tzMidnight.toISOString())
  }
  
// function toUTCEndOfDay(date: Date, timeZone: string) {
// const tzEnd = new TZDate(date.getFullYear(), date.getMonth(), date.getDate(), timeZone)
// tzEnd.setHours(23, 59, 59, 999)
// return new Date(tzEnd.toISOString())
// }
  
  
  export async function addPromocode(courseId: string, formData: FormData) {
    const timeZone = "Africa/Addis_Ababa"  
    try {
        // validate the promocode
        const isValid = validatePromoCode.safeParse({
            code: formData.get("code") as string,
            discount: Number(formData.get("discount")),
            appliedFrom: toUTCMidnight(new Date(formData.get("appliedFrom") as string), timeZone),
            expiredAt: toUTCMidnight(new Date(formData.get("expiredAt") as string), timeZone),
        })

        if(!isValid.success){
            logger.warn(
                `[ADD_PROMOCODE_SERVER_ACTION]: Invalid promocode: ${isValid.error}`
            )
            return {message: "Invalid promocode", status: 400}
        }
        // validate if user is an admin
        const {userId, isAdmin} = await getAdminInfo()
        if(!isAdmin){
            logger.warn(
                `[ADD_PROMOCODE_SERVER_ACTION]: Unauthorized: User ${userId} is not authorized yet to add promocode`
            )
            return {message: "Unauthorized", status: 401}
        }

        const promocode = await db.coursePromocode.create({
            data: {
                code: isValid.data.code,
                discount: isValid.data.discount,
                courseId,
                startDate: isValid.data.appliedFrom,
                expiresIn: isValid.data.expiredAt,
            }
        })
        if(!promocode){
            logger.warn(
                `[ADD_PROMOCODE_SERVER_ACTION]: Failed to add promocode: ${promocode}`
            )
            return {message: "Failed to add promocode", status: 500}
        }
        logger.info(
            `[ADD_PROMOCODE_SERVER_ACTION]: Promocode added successfully: ${promocode}`
        )
        revalidatePath(`/dashboard/teacher/courses/${courseId}`)
        updateTag(`${courseId}/promocodes`);
        
    } catch (error) {
        Sentry.captureException(error)
        logger.error(`[ADD_PROMOCODE_SERVER_ACTION]: Internal Error: Failed to add promocode ${error}`)
    }
}

export async function deletePromoCode(id: string, courseId: string){
    try {
        const promocode = await db.coursePromocode.delete({
            where: {
                id,
            }
        })
        if(!promocode){
            logger.warn(
                `[DELETE_PROMOCODE_SERVER_ACTION]: Failed to delete promocode: ${promocode}`
            )
            return {}
        }

        revalidatePath(`/dashboard/teacher/courses/${courseId}`)
        updateTag(`${courseId}/promocodes`);
    } catch (error) {
        console.log(error)
        Sentry.captureException(error)
        logger.error(`[DELETE_PROMOCODE_SERVER_ACTION]: Internal Error: Failed to delete promocode ${error}`)
    }
}