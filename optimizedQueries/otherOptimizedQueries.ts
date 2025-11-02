'use cache'

import { db } from "@/lib/db";
import { Prisma } from "@/prisma/app/generated/prisma/client";
import { cacheLife, cacheTag } from "next/cache";
import { cache } from "react";




export const getProfileCount =  cache(async () => {       
    cacheLife('weeks')
    return await db.profile.count()
})


export type ExamGenericType = Prisma.ExamGetPayload<{
    include: {
        questions: {
            include: {
                answers: true, 
            }
        }
    }
}>


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
})