import { db } from "@/lib/db"
import { getAdminInfo } from "@/utils/roles"
import * as Sentry from "@sentry/nextjs"
import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse } from "next/server"


/**
 * 
 * @returns chapters with exams and category 
 */

export async function GET(req: Request, {params}: {params: Promise<{courseId: string}>}) {
    const {courseId} = await params
    try{
        const chapters = await db.chapter.findMany({
            where: {
                courseId, 
                isPublished: true,
            },
            include: {
                exams: true, 
                category: true,
            },
            orderBy: {
                position: "asc"
            }
        })
        return NextResponse.json(chapters)
    }catch(error){
        Sentry.captureException(error)
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}


export async function POST(req: Request, {params}: {params: Promise<{courseId: string}>}) {
    const {logger} = Sentry
    const {courseId} = await params
    const {title} = await req.json()
    try{
        const {userId, isAdmin} = await getAdminInfo()
        if(!isAdmin){
            logger.warn(`[COURSE_ID_CHAPTERS_POST]: Unauthorized: User ${userId} is not an admin to create a chapter for course ${courseId}`)
            return new NextResponse("Unauthorized", {status: 401})
        }


        // const courseOwner = await db.course.findUnique({
        //     where: {
        //         id: courseId,
        //         userId
        //     }
        // })

        // if(!courseOwner){
        //     logger.info(`[COURSE_ID_CHAPTERS_POST]: Unauthorized: User ${userId} is not the owner of course ${courseId}`)
        //     return new NextResponse("Unauthorized", {status: 401})
        // }

        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId
            }, 
            orderBy: {
                position: "desc"
            }
        })
        const newPosition = lastChapter ? lastChapter.position + 1: 1
        const chapter = await db.chapter.create({
            data: {
                title,
                position: newPosition,
                courseId
            }
        })
        revalidatePath(`/courses/${courseId}/chapters/${chapter.id}`)
        revalidateTag(`courses/${courseId}`, 'max')
        
        logger.info(`[COURSE_ID_CHAPTERS_POST]: OK: Chapter ${chapter.id} created successfully`)
        return NextResponse.json(chapter)
    }catch(error){
        logger.error(`[COURSE_ID_CHAPTERS_POST]: Internal Error: Failed to create chapter for course ${courseId} ${error}`)
        Sentry.captureException(error)
        return new NextResponse("Internal server error", {status: 500})
    }    
}