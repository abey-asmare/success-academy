import { db } from "@/lib/db"
import { Sentry } from "@/lib/sentryLogger"
import { getAdminInfo } from "@/utils/roles"
import { revalidatePath, revalidateTag } from "next/cache"
import { NextResponse } from "next/server"


export async function GET(req: Request, {params}: {params: Promise<{courseId: string}>}) {
    const {courseId} = await params
    try{
        const chapters = await db.chapter.findMany({
            where: {
                courseId, 
                isPublished: true,
            },
            include: {
                exams: true, 
                category: true,
            },
            orderBy: {
                position: "asc"
            }
        })
        return NextResponse.json(chapters)
    }catch(error){
        Sentry.captureException(error)
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}


export async function POST(req: Request, {params}: {params: Promise<{courseId: string}>}) {
    const {courseId} = await params
    const {title} = await req.json()
    try{
        const { isAdmin } = await getAdminInfo()
        if(!isAdmin){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }

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
        
        revalidatePath(`/courses/${courseId}/chapters/${chapter.id}`)
        revalidateTag(`courses/${courseId}`, 'max')
        revalidateTag('courses', 'max')
        return NextResponse.json(chapter)
    }catch(error){
        Sentry.captureException(error)
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }    
}