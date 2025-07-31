import { db } from "@/lib/db"
import { isAdmin } from "@/utils/roles"
import { auth } from "@clerk/nextjs/server"
import Mux from "@mux/mux-node"
import { NextRequest, NextResponse } from "next/server"

const {video: Video}= new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!
})


export async function DELETE(req: NextRequest, {params}: {params: Promise<{courseId: string}>}) {
    const {courseId} = await params
    try{
        const {userId} = await auth()
        if(!userId || !isAdmin())
            return new NextResponse("Unauthorized", {status: 401})

        // find unique and including mux data
        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId
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
        if(!course)
            return new NextResponse("Not found", {status: 404})

        // delete mux data
        for(const chapter of course.chapters){
            if(chapter.muxData?.assetId){
                await Video.assets.delete(chapter.muxData.assetId)
            }
        }
        // delete course
        const deletedCourse = await db.course.delete({
            where: {
                id: courseId,
                userId
            }
        }) 

        return NextResponse.json(deletedCourse)
    }catch(error){
        console.log(error)
        return new NextResponse("Internal server error", {status: 500})
    }    
}

export async function PATCH(req: NextRequest, {params}: {params: Promise<{courseId: string}>}) {
    const {courseId} = await params
    const {title, description, imageUrl, price, categoryId} = await req.json()
    try{
        const {userId} = await auth()
        if(!userId || !isAdmin())
            return new NextResponse("Unauthorized", {status: 401})

        const course = await db.course.update({
            where: {
                id: courseId,
                userId
            },
            data: {
            title,
            description,
            imageUrl,
            price,
            categoryId    
            }
        })

        return NextResponse.json(course)
    }catch(error){
        console.log(error)
        return new NextResponse("Internal server error", {status: 500})
    }    
}
