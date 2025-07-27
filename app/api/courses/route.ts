import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function POST(req: Request){
    try{
        const { userId } = await auth()
        console.log('userid', userId)
        if(!userId || !isTeacher(userId)){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }
        const {title} = await req.json()   
        
        const course = await db.course.create({
            data: {
                title,
                userId,
            }
        })

        return NextResponse.json(course)
    }catch(error){
        console.log(error)
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}
