import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, {params }: {params: Promise<{chapterId: string}>}){
    const {chapterId} = await params

    try {
        const muxData = await db.muxData.findUnique({
            where: {
                chapterId: chapterId,
            },
        });
        return NextResponse.json({muxData})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error: "Failed to fetch muxData"}, {status: 500})
    }
}