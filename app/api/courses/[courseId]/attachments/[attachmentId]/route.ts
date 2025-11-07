import { db } from "@/lib/db"
import { getAdminInfo } from "@/utils/roles"
import Sentry from "@sentry/nextjs"
import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse } from "next/server"

export async function DELETE(req: Request, {params}: {params: Promise<{courseId: string, attachmentId: string}>}){
    const {courseId, attachmentId} = await params
    const { logger } = Sentry
    try{
        const {userId, isAdmin} = await getAdminInfo()       
        if(!isAdmin){
            logger.info(`[COURSE_ID_ATTACHMENT_DELETE]: Unauthorized: User ${userId} is not an admin to delete the attachment ${attachmentId}`)
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }
        // const courseOwner = await db.course.findUnique({
        //     where: {
        //        id: courseId, 
        //        userId: userId
        //     }
        // })
        // if(!courseOwner){
        //     logger.info(`[COURSE_ID_ATTACHMENT_DELETE]: Unauthorized: User ${userId} is not the owner of course ${courseId}`)
        //     return NextResponse.json("unauthorized", {status: 401})
        // }
        
        const attachment = await db.attachment.delete({
            where: {
                courseId,
                id: attachmentId
            }
        })
        logger.info(`[COURSE_ID_ATTACHMENT_DELETE]: OK: Attachment ${attachmentId} deleted successfully`)
        revalidatePath(`page/attachments/${attachmentId}`)
        revalidatePath(`/courses/${courseId}`)
        revalidateTag(`${courseId}/attachments`, 'max');
        revalidateTag(`attachments/${attachmentId}`, 'max')
        return NextResponse.json(attachment)    

    }catch(error){
            logger.error(`[COURSE_ID_ATTACHMENT_DELETE]: Internal Error: Failed to delete attachment ${attachmentId} ${error}`)
            Sentry.captureException(error)
            return NextResponse.json({error: "Internal server error"}, {status: 500})
        }
}
