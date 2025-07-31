import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/utils/roles";
import { Course } from "@/prisma/app/generated/prisma/client";
import { CourseMinimized } from "@/types";
import { placeholderCourseImage } from "@/app/constants";



// fetch all courses if needed
export async function GET(req: NextRequest){
    try{
        const courses = await db.course.findMany({
            where: {
              isPublished: true  
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        const coursesMinimized: CourseMinimized[] = courses.map((course: Course) => ({
            id: course.id,
            imageUrl: course.imageUrl || placeholderCourseImage,
            title: course.title,
            description: course.description!,
            price: course.price!,
            createdAt: course.createdAt
        }))
        console.log('course min',coursesMinimized)
        return NextResponse.json(coursesMinimized)
    }catch(error){
        console.log(error)
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}
    






export async function POST(req: Request){
    try{
        const { userId } = await auth()
        console.log('userid', userId)
        if(!userId || !isAdmin()){
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

