'use cache'

import { db } from "@/lib/db";
import { Prisma } from "@/prisma/app/generated/prisma/client";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";




export type ExamGenericType = Prisma.ExamGetPayload<{
    include: {
        questions: {
            include: {
                answers: true, 
            }
        }
    }
}>


export const getProfileCount =  cache(async () => {       
    cacheLife('weeks')
    return await db.profile.count()
})



export const getProfile = cache(async ()=> {
    cacheTag('profile')
    cacheLife('days')
    return await db.profile.findMany()
})


export const getExamById = cache(async(examId: string)=> {
    cacheLife('weeks')
    cacheTag(`exams/${examId}`)
    return await db.exam.findUnique({
          where: {
              id: examId,
          },
          include: {
              questions: {
                  include: {
                      answers: true,
                  },
              },
          },
      })
});
export const getAllChapterCategories = cache(async () => {
    cacheLife('weeks')
    cacheTag('chapterCategories')
    return await db.chapterCategory.findMany({
    orderBy: {
      name: "asc",
    },
  });
});

