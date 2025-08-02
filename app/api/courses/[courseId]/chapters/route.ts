import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { isAdmin } from "@/utils/roles"

export async function POST(req: Request, {params}: {params: Promise<{courseId: string}>}) {
    const {courseId} = await params
    const {title} = await req.json()
    try{
        const {userId} = await auth()
        if(!userId || !isAdmin())
            return new NextResponse("Unauthorized", {status: 401})



        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        })

        if(!courseOwner)
            return new NextResponse("Unauthorized", {status: 401})

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
        return NextResponse.json(chapter)
    }catch{
        return new NextResponse("Internal server error", {status: 500})
    }    
}