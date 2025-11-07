import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import * as Sentry from "@sentry/nextjs"
import { logger } from "@/lib/sentryLogger"
import z from 'zod'

import { revalidatePath, revalidateTag } from "next/cache"

const categorySchema = z.object({
    category: z
      .string()
      .min(1, { message: "category must be atleast 3 characters long" }),
  });

export async function POST(req: NextRequest, { params }: { params: Promise<{ courseId: string, chapterId: string }> }) {
    const {category} =  await req.json()
    const {courseId, chapterId} = await params
    const validatedData = categorySchema.safeParse({category})
    if(!validatedData.success){
        return NextResponse.json({error: "Validation Error"}, { status: 400 })
    }

    try {
        const category = validatedData.data.category
        const newCategory = await db.chapterCategory.create({
            data: {
                name: category,
            },
        })
        logger.info(`[CHAPTER_CATEGORY_ADD_SERVER_ACTION]: Category added successfully ${newCategory.id}`)
        revalidatePath(`/dashboard/teacher/courses/${courseId}/chapters/${chapterId}`)
        revalidateTag(`chapters`, 'max')
        revalidateTag(`chapters/${chapterId}`, 'max')
        return NextResponse.json(newCategory)
    } catch (error) {
        console.log(error)
        logger.error(`[CHAPTER_CATEGORY_ADD_SERVER_ACTION]: Internal Error: Failed to add category ${error}`)
        Sentry.captureException(error)
        return NextResponse.json({error: "Internal Error"}, { status: 500 })
    }
}
