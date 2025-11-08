import { db } from "@/lib/db"
import { Sentry } from "@/lib/sentryLogger"
import { getAdminInfo } from "@/utils/roles"
import { revalidateTag } from "next/cache"
import { NextResponse } from "next/server"


export async function GET(req: Request, {params}: {params: Promise<{courseId: string}>}){
    const {courseId } = await params
    try{
        const attachments = await db.attachment.findMany({
            where: {
                courseId: courseId,
            },
        })
        return NextResponse.json(attachments)
    }catch(error){  
        Sentry.captureException(error)
        return NextResponse.json({error: "can't find attachments"}, {status: 404})
    }
}

export async function POST(req: Request, {params}: {params: Promise<{courseId: string}>}){
    const { courseId } = await params
    try{
        const body = await req.json()   

        // add courseId to the body
        const values = body.map((value: {url: string, type: string, name: string}) => ({...value, courseId}))

        const {isAdmin} = await getAdminInfo()       
        if(!isAdmin){
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }

        
        const attachments = await db.attachment.createMany({
            data: values
        })
        revalidateTag(`${courseId}/attachments`, 'max');
        
        return NextResponse.json(attachments)
    }catch(error){
        Sentry.captureException(error)
        return NextResponse.json({error: "Internal server error"}, {status: 500})
    }
}