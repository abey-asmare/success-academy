'use server'
import {logger, Sentry} from "@/lib/sentryLogger"
import { db } from "@/lib/db"
import { getAdminInfo } from "@/utils/roles"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const validatePromoCode = z.object({
    code: z.string().min(6).max(6),
    discount: z.coerce.number().min(1).max(100),
    appliedFrom: z.coerce.date(),
    expiredAt: z.coerce.date(),
})

export async function addPromocode( courseId: string, formData: FormData) {
    console.log("action called witht he data" , formData)
    try {
        // validate the promocode
        const isValid = validatePromoCode.safeParse({
            code: formData.get("code") as string,
            discount: Number(formData.get("discount")),
            appliedFrom: new Date(formData.get("appliedFrom") as string),
            expiredAt: new Date(formData.get("expiredAt") as string),
        })
        console.log("isValid", isValid)
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


    } catch (error) {
        console.log(error)
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
    } catch (error) {
        console.log(error)
        Sentry.captureException(error)
        logger.error(`[DELETE_PROMOCODE_SERVER_ACTION]: Internal Error: Failed to delete promocode ${error}`)
    }
}