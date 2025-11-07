import { db } from "@/lib/db"
import { logger } from "@/lib/sentryLogger"
import { utapi } from "@/lib/uploadthing-server"
import { getAdminInfo, isAdmin } from "@/utils/roles"
import { auth } from "@clerk/nextjs/server"
import * as Sentry from "@sentry/nextjs"
import { revalidatePath, revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"


type Props = {params: Promise<{courseId: string}>}

/**
 * 
 * @returns course with associated chapters and exams 
 */
export async function GET(req: NextRequest, {params}: Props){
    const {courseId} = await params
    try{
        const course = await db.course.findUnique({
            where: {
                id: courseId,
            },
            include: {
                exams: true, 
                chapters: {
                    where: {
                        isPublished: true,
                    },
                    orderBy: {
                        position: "asc"
                    }
                },
            },
        });
        if(!course){
            logger.warn(
                `[COURSE_ID_GET]: Not Found: Course ${courseId} not found`
            )
            return new NextResponse("Not found", {status: 404})
        }
        return NextResponse.json(course)
    }catch(error){
        logger.error(`[COURSE_ID_GET]: Internal Error: Failed to get course ${courseId}, ${error}`)
        Sentry.captureException(error)
        return new NextResponse("Internal server error", {status: 500})
    }
}


export async function PATCH(req: NextRequest, {params}: Props) {
    const {courseId} = await params
    const {title, description, imageUrl, bgImageUrl, price, categoryId} = await req.json()
    try{
        //  admin users can update the course even if they didn't create it..
        const {userId} = await auth()
        const admin = await isAdmin()
        if(!userId || !admin){
            logger.warn(
                `[COURSE_ID_DELETE_DELETE]: Unauthorized: User ${userId} is not authorized yet to update course ${courseId}`
            )
            return new NextResponse("Unauthorized", {status: 401})
        }

        const course = await db.course.update({
            where: {
                id: courseId,
            },
            data: {
            title,
            description,
            imageUrl,
            bgImageUrl,
            price,
            categoryId    
            }
        })
        revalidatePath(`/courses/${courseId}`)
        revalidatePath(`/dashboard/teacher/courses`)
        revalidateTag('courses', 'max')
        revalidateTag(`courses/${courseId}`, 'max')
        revalidateTag('courses/telegram-registration', 'max')
        
        
        return NextResponse.json(course)
    }catch(error){
        logger.error(`[COURSE_ID_PATCH]: Internal Error: Failed to update course ${courseId}, ${error}`)
        Sentry.captureException(error)
        return new NextResponse("Internal server error", {status: 500})
    }    
}



export async function DELETE(req: NextRequest, {params}: Props) {
    const {courseId} = await params
    try{
        const {userId, isAdmin} = await getAdminInfo()
        if(!isAdmin){
            logger.warn(
                `[COURSE_ID_DELETE_DELETE]: Unauthorized: User ${userId} is not authorized yet to delete course ${courseId}`
            )
            return new NextResponse("Unauthorized", {status: 401})
        }

        // find unique and including mux data
        const course = await db.course.findUnique({
            where: {
                id: courseId,
                // userId
            },
            include: {
                chapters: {
                    include: {
                        muxData: true
                    }
                }
            }
        })

        // if no course found
        if(!course){
            logger.warn(
                `[COURSE_ID_DELETE_DELETE]: Not Found: Course ${courseId} not found`
            )
            return new NextResponse("Not found", {status: 404})
        }

        // delete mux data
        for(const chapter of course.chapters){
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${courseId}/chapters/${chapter.id}`, {
                method: "DELETE"
            })
        }

            if(course.imageUrl){
                // delete the course image from uploadthing
                const deletedFile = course.imageUrl?.split("/")?.pop();
                // delete the uploadthing using utApi
                const deletedFileResponse = await utapi.deleteFiles(deletedFile!);
                if (deletedFileResponse.success) {
                    logger.info(
                        `[COURSE_DELETE_SERVER_ACTION]: Uploadthing file deleted successfully for course ${courseId}`
                    );
                }
            }

        // delete course
        const deletedCourse = await db.course.delete({
            where: {
                id: courseId,
                // userId
            }
        }) 
        revalidatePath(`/dashboard/teacher/courses`)
        revalidatePath(`/courses/${courseId}`)
        revalidateTag('courses', 'max')
        revalidateTag(`courses/${courseId}`, 'max')
        revalidateTag('courses/telegram-registration', 'max')

        
        logger.info(`[COURSE_ID_DELETE_DELETE]: OK: Course ${courseId} deleted successfully`)
        return NextResponse.json(deletedCourse)
    }catch(error){
        logger.error(`[COURSE_ID_DELETE_DELETE]: Internal Error: Failed to delete course ${courseId}, ${error}`)
        Sentry.captureException(error)
        return new NextResponse("Internal server error", {status: 500})
    }    
}

