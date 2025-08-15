import { db } from "@/lib/db"
import { getAdminInfo } from "@/utils/roles"
import * as Sentry from "@sentry/nextjs"
import { NextResponse } from "next/server"

export async function PUT(req: Request, {params}: {params: Promise<{courseId: string}>}) {
    const {courseId} = await params

    const {logger} = Sentry
    try{

        const {userId, isAdmin} = await getAdminInfo()
        if(!isAdmin){
            logger.warn(`[COURSE_ID_CHAPTERS_REORDER]: Unauthorized: User ${userId} is not an admin to reorder chapters for course ${courseId}`)
            return new NextResponse("Unauthorized", {status: 401})
        }

        const {list} = await req.json()

        // const courseOwner = await db.course.findUnique({
        //     where: {
        //         id: courseId,
        //         userId
        //     }
        // })

        // if(!courseOwner){
        //     logger.info(`[COURSE_ID_CHAPTERS_REORDER]: Unauthorized: User ${userId} is not the owner of course ${courseId}`)       
        //     return new NextResponse("Unauthorized", {status: 401})
        // }

        for (const item of list){
            await db.chapter.update({
                where: {
                    id: item.id,
                    courseId
                },
                data: {
                    position: item.position
                }
            })
        }
        logger.info(`[COURSE_ID_CHAPTERS_REORDER]: OK: Chapters reordered successfully for course ${courseId}`)
        return NextResponse.json("success", {status: 200})
        
    }catch(error){
        logger.error(`[COURSE_ID_CHAPTERS_REORDER]: Internal Error: Failed to reorder chapters for course ${courseId} ${error}`)
        Sentry.captureException(error)
        return new NextResponse("Internal server error", {status: 500})
    }

}