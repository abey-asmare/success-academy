'use cache'

import { db } from "@/lib/db"
import { UserProgress } from "@/prisma/app/generated/prisma/client"
import { REVALIDATE_INSTANT } from "@/server-constants"
import { cacheLife, cacheTag } from "next/cache"


// personalized routes
export const getPurchase = async (userId: string, courseId: string)=> {
    cacheLife('hours')
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
  
  export const getAllPurchaseCourses = async(userId: string) => {
    cacheLife('weeks')
    cacheTag(`${userId}/purchase`)
    return  await db.purchase.findMany({
      where: {
              userId: userId
          }
        });

}


export const getUserProgress = async (userId: string, chapterId: string): Promise<UserProgress | null>=> {
    cacheLife({revalidate: REVALIDATE_INSTANT, stale:  REVALIDATE_INSTANT})
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


