import { db } from "@/lib/db"
import { isAdmin } from "@/utils/roles"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function DELETE(req: Request, {params}: {params: Promise<{courseId: string, attachmentId: string}>}){
    const {courseId, attachmentId} = await params
    try{
        const {userId} = await auth()
        if(!userId || !isAdmin()){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }
        const courseOwner = await db.course.findUnique({
            where: {
               id: courseId, 
               userId: userId
            }
        })
        if(!courseOwner)
            return NextResponse.json("unauthorized", {status: 401})
        
        const attachment = await db.attachment.delete({
            where: {
                courseId,
                id: attachmentId
            }
        })
        return NextResponse.json(attachment)

    }catch{
            return NextResponse.json({error: "Internal server error"}, {status: 500})
        }
}
