import { db } from "@/lib/db"
import { isAdmin } from "@/utils/roles"
import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(req: Request, {params}: {params: {courseId: string}}) {
    const {courseId} = params
    const {imageUrl} = await req.json()
    try{
        const {userId} = await auth()
        if(!userId || !isAdmin())
            return new NextResponse("Unauthorized", {status: 401})

        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    courseId,
                    userId
                }
            }
        })

if(purchase){

    await db.purchase.delete({
        where: {
            userId_courseId: {
                courseId,
                userId
            }
        }
    })
}

const newPurchase = await db.purchase.create({
    data: {
        courseId, 
        userId,
        imageUrl
    }
})

        return NextResponse.json(newPurchase)
    }catch(error){
        console.log(error)
        return new NextResponse("Internal server error", {status: 500})
    }    
}
