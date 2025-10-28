import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getAdminInfo} from "@/utils/roles"
import Sentry from "@sentry/nextjs"  


export async function GET(req: Request, {params}: {params: Promise<{courseId: string}>}){
    const {courseId } = await params
    try{
        const attachments = await db.attachment.findMany({
            where: {
                courseId: courseId,
            },
        })
        return NextResponse.json(attachments)
    }catch{
        return NextResponse.json({error: "can't find attachments"}, {status: 404})
    }
}

export async function POST(req: Request, {params}: {params: Promise<{courseId: string}>}){
    const { courseId } = await params
    const { logger } = Sentry
    try{
        const body = await req.json()   

        // add courseId to the body
        const values = body.map((value: {url: string, type: string, name: string}) => ({...value, courseId}))

        const {userId, isAdmin} = await getAdminInfo()       
        if(!isAdmin){
            logger.info(`[COURSE_ID_ATTACHMENT_POST]: Unauthorized: User ${userId} is not an admin to create attachments for course ${courseId}`)
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }

        // const courseOwner = await db.course.findUnique({
        //     where: {
        //         id: courseId,
        //         userId
        //     }
        // })
        // if(!courseOwner){
        //     logger.warn(`[COURSE_ID_ATTACHMENT_POST]: Unauthorized: User ${userId} is not the owner of course ${courseId}`)
        //     return NextResponse.json({error: "Unauthorized"}, {status: 401})
        // }
        
        const attachments = await db.attachment.createMany({
            data: values
        })

        logger.info(`[COURSE_ID_ATTACHMENT_POST]: Attachments created for course ${courseId}`)
        return NextResponse.json(attachments)
    }catch(error){
        logger.error(`[COURSE_ID_ATTACHMENT_POST]: Error: failed to create attachments for course ${courseId} ${error}`)
        Sentry.captureException(error)
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}