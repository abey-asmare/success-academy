import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { isAdmin } from "@/utils/roles"

export async function POST(req: Request, {params}: {params: Promise<{courseId: string}>}){
    const { courseId } = await params
    try{
        const {userId} = await auth()
        const body = await req.json()   

        // add courseId to the body
        const values = body.map((value: {url: string, type: string, name: string}) => ({...value, courseId}))

        if(!userId || !isAdmin()){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        })
        if(!courseOwner){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }
        
        const attachments = await db.attachment.createMany({
            data: values
        })

        return NextResponse.json(attachments)
    }catch(error){
        console.log('uploadthing error', error)
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}