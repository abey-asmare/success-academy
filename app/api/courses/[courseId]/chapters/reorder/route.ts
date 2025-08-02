import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { isAdmin } from "@/utils/roles"
export async function PUT(req: Request, {params}: {params: Promise<{courseId: string}>}) {
    const {courseId} = await params
    try{

        const {userId} = await auth()
        if(!userId || !isAdmin())
            return new NextResponse("Unauthorized", {status: 401})

        const {list} = await req.json()

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId
            }
        })

        if(!courseOwner)
            return new NextResponse("Unauthorized", {status: 401})

        for (const item of list){
            await db.chapter.update({
                where: {
                    id: item.id,
                    courseId
                },
                data: {
                    position: item.position
                }
            })
        }
        return NextResponse.json("success", {status: 200})
        
    }catch(error){
        return new NextResponse("Internal server error", {status: 500})
    }

}