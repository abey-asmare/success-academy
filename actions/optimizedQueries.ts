import { db } from "@/lib/db"
import { CoursePromocode, MuxData, Attachment, UserProgress, Chapter } from "@/prisma/app/generated/prisma/client"
import { ChaptersGenericViewType, CourseGenericViewType } from "@/types"
import { cacheLife } from "next/dist/server/use-cache/cache-life"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"


export const getCourses = async():Promise<CourseGenericViewType[]>=> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses`, {
        next: {
            revalidate: 60 * 60 * 24 * 30 // REVALIDATE_MONTHLY
        }
    })
    return  await response.json()
}
export const getCourse = async (courseId: string): Promise<CourseGenericViewType> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${courseId}`, {
        next: {
            revalidate: 60 * 60 * 24 * 30 // REVALIDATE_MONTHLY
        }
    })
    return await response.json()
}

export const getChapters = async (courseId: string): Promise<ChaptersGenericViewType[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${courseId}/chapters`, {
        next: {
            revalidate: 60 * 60 * 24 * 30 // REVALIDATE_MONTHLY
        }
    })
    return  await response.json()
}

export const getPromoCodes = async (courseId: string): Promise<CoursePromocode[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${courseId}/promocodes`, {
        next: {
            revalidate: 60 * 60 * 24 * 30 // REVALIDATE_MONTHLY
        }
    })
    return  await response.json()
}



export const getAttachments = async (courseId: string): Promise<Attachment[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${courseId}/attachments`, {
        next: {
            revalidate: 60 * 60 * 24 * 30 // REVALIDATE_MONTHLY
        }
    })
    return  await response.json()
}

export const getMuxData = async (courseId: string, chapterId: string): Promise<MuxData> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${courseId}/chapters/${chapterId}/muxData`, {
        next: {
            revalidate: 60 * 60 * 24 * 30 // REVALIDATE_MONTHLY
        }
    })
    return  await response.json()
}



export const getChapter = async ( courseId: string, chapterId: string): Promise<ChaptersGenericViewType> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${courseId}/chapters/${chapterId}`, {
        next: {
            revalidate: 60 * 60 * 24 * 30 // REVALIDATE_MONTHLY
        }
    })
    return  await response.json()
}


export const getNextChapter = async (courseId: string, chapterId: string, chapterPosition: number): Promise<Chapter> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${courseId}/chapters/${chapterId}/nextChapter?position=${chapterPosition}`, {
        next: {
            revalidate: 60 * 60 * 24 * 30 // REVALIDATE_MONTHLY
        }
    })
    return  await response.json()
}


// personalized routes
export const getPurchase = async (userId: string, courseId: string)=> {
    'use cache'
    cacheLife('weeks')
    cacheTag(`${userId}/purchase/${courseId}`)
    return  await db.purchase.findUnique({
          where: {
            userId_courseId: {
              userId,
              courseId,
            }
          }
        });
}



export const getUserProgress = async (userId: string, chapterId: string): Promise<UserProgress | null>=> {
    'use cache'
    cacheLife('weeks')
    cacheTag(`${userId}/progress/${chapterId}`)
    return await db.userProgress.findUnique({
        where: {
            userId_chapterId: {
                userId,
                chapterId,
            }
        }
    })
}


