import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const chapterPositionSchema = z.object({
    position: z.coerce.number(),
})

export async function GET(req: NextRequest, {params}: {params: Promise<{courseId: string}>}){
    const {courseId} = await params
    const pos = req.nextUrl.searchParams.get("position")
    const isChapterPositionValid = chapterPositionSchema.safeParse(pos)
    if(!isChapterPositionValid.success){
        return NextResponse.json({error: "Invalid chapter position"}, {status: 400})
    }
    const {position} = isChapterPositionValid.data
    
    try{
        const nextChapter = await db.chapter.findFirst({
                        where: {
                            courseId: courseId,
                            isPublished: true,
                            position: {
                                gt: position,
                            },
                        },
                        orderBy: {
                            position: "asc",
                        },
                    });
        
        return NextResponse.json(nextChapter)
    }catch{
        return NextResponse.json({error: "can't find nextChapter"}, {status: 404})
    }
}