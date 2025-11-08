import { db } from "@/lib/db"
import { getAdminInfo } from "@/utils/roles"
import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse } from "next/server"
import { Sentry } from "@/lib/sentryLogger"

export async function DELETE(req: Request, {params}: {params: Promise<{courseId: string, attachmentId: string}>}){
    const {courseId, attachmentId} = await params
    try{
        const {userId, isAdmin} = await getAdminInfo()       
        if(!isAdmin){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }
        const attachment = await db.attachment.delete({
            where: {
                courseId,
                id: attachmentId
            }
        })
        revalidatePath(`page/attachments/${attachmentId}`)
        revalidatePath(`/courses/${courseId}`)
        revalidateTag(`${courseId}/attachments`, 'max');
        revalidateTag(`attachments/${attachmentId}`, 'max')
        return NextResponse.json(attachment)    

    }catch(error){
        Sentry.captureException(error)
            return NextResponse.json({
                error: "Internal server error"}, {status: 500})
        }
}
