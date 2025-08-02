import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { isAdmin } from "@/utils/roles"

export async function POST(req: Request, {params}: {params: Promise<{courseId: string}>}){
    const { courseId } = await params
    try{
        const {userId} = await auth()
        const { url } = await req.json()   
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
        
        const attachment = await db.attachment.create({
            data: {
                courseId: courseId,
                url, 
                name: url.split('/').pop() || '',
            }
        })

        return NextResponse.json(attachment)
    }catch(error){
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}