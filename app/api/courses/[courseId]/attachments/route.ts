import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { isTeacher } from "@/lib/teacher"

export async function POST(req: Request, {params}: {params: {courseId: string}}){
    try{
        const {userId} = await auth()
        const { url } = await req.json()   
        if(!userId || !isTeacher(userId)){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        })
        if(!courseOwner){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }
        
        const attachment = await db.attachment.create({
            data: {
                courseId: params.courseId,
                url, 
                name: url.split('/').pop() || '',
            }
        })

        return NextResponse.json(attachment)
    }catch(error){
        console.log(error)
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}