import { db } from "@/lib/db";
import { Sentry } from "@/lib/sentryLogger";
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
        Sentry.captureException(error)
        return NextResponse.json({error: "Failed to fetch muxData"}, {status: 500})
    }
}