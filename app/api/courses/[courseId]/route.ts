import { db } from "@/lib/db"
import { getAdminInfo, isAdmin } from "@/utils/roles"
import { auth } from "@clerk/nextjs/server"
import Mux from "@mux/mux-node"
import { NextRequest, NextResponse } from "next/server"
import { utapi } from "@/lib/uploadthing-server"
import * as Sentry from "@sentry/nextjs"
import { revalidatePath } from "next/cache"

const {video: Video}= new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!
})


const { logger } = Sentry;
export async function DELETE(req: NextRequest, {params}: {params: Promise<{courseId: string}>}) {
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
            // delete the video from mux
            if(chapter.muxData?.assetId){
                await Video.assets.delete(chapter.muxData.assetId)
            }
            if (chapter.videoUrl){
                // delete the video from uploadthing
                const deletedFile = chapter.videoUrl?.split("/")?.pop();
                // delete the uploadthing using utApi
                const deletedFileResponse = await utapi.deleteFiles(deletedFile!);
                if (deletedFileResponse.success) {
                  logger.info(
                    `[COURSE_DELETE_UPLOADTHING_VIDEO]: Uploadthing file deleted successfully for chapter ${chapter.id}`
                  );
                }
            }
        }

        // delete uploadthing files

        // delete the course image from uploadthing
        const deletedFile = course.imageUrl?.split("/")?.pop();
        // delete the uploadthing using utApi
        const deletedFileResponse = await utapi.deleteFiles(deletedFile!);
        if (deletedFileResponse.success) {
          logger.info(
            `[COURSE_DELETE_SERVER_ACTION]: Uploadthing file deleted successfully for course ${courseId}`
          );
        }

        // delete course
        const deletedCourse = await db.course.delete({
            where: {
                id: courseId,
                // userId
            }
        }) 
        revalidatePath(`/dashboard/teacher/courses`)
        logger.info(`[COURSE_ID_DELETE_DELETE]: OK: Course ${courseId} deleted successfully`)
        return NextResponse.json(deletedCourse)
    }catch(error){
        logger.error(`[COURSE_ID_DELETE_DELETE]: Internal Error: Failed to delete course ${courseId}, ${error}`)
        Sentry.captureException(error)
        return new NextResponse("Internal server error", {status: 500})
    }    
}

export async function PATCH(req: NextRequest, {params}: {params: Promise<{courseId: string}>}) {
    const {courseId} = await params
    const {title, description, imageUrl, price, categoryId} = await req.json()
    try{
        //  admin users can update the course even if they didn't create it..
        const {userId} = await auth()
        const admin = await isAdmin()
        if(!userId || !admin){
            logger.warn(
                `[COURSE_ID_DELETE_DELETE]: Unauthorized: User ${userId} is not authorized yet to delete course ${courseId}`
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
            price,
            categoryId    
            }
        })
        console.log('patch request', course)
        return NextResponse.json(course)
    }catch(error){
        logger.error(`[COURSE_ID_DELETE_DELETE]: Internal Error: Failed to delete course ${courseId}, ${error}`)
        Sentry.captureException(error)
        return new NextResponse("Internal server error", {status: 500})
    }    
}
