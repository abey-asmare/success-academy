'use cache'

import { db } from "@/lib/db"
import {Attachment, CoursePromocode, Prisma } from "@/prisma/app/generated/prisma/client/client";
import { cacheLife, cacheTag } from "next/cache"




export type CourseGenericViewType = Omit<
Prisma.CourseGetPayload<{
  include: {
    chapters: true;
    exams: true;
  };
}>, 'chapters'> & {
    chapters?: Prisma.CourseGetPayload<{include: {chapters: true}}>['chapters']
} 

export const getCourses = async():Promise<CourseGenericViewType[]>=> {
    cacheLife('weeks')
    cacheTag('courses')
     return await db.course.findMany({
      where: {
        isPublished: true,

      },
      include: {
          exams: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
}

// getting course with exam and published chapters
export const getCourse = async (courseId: string): Promise<CourseGenericViewType | null> => {
    cacheLife('weeks')
    cacheTag(`courses/${courseId}`)
    return  await db.course.findUnique({
                where: {
                    id: courseId,
                },
                include: {
                    exams: true, 
                    chapters: {
                        where: {
                            isPublished: true,
                        },
                        orderBy: {
                            position: "asc"
                        }
                    },
                },
            });
}



export const getPromoCodes = async (courseId: string): Promise<CoursePromocode[]> => {
    cacheLife('weeks')
    cacheTag(`${courseId}/promocodes`)
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${courseId}/promocodes`)
    return  await response.json()
}



export const getAttachments = async (courseId: string): Promise<Attachment[]> => {
       cacheLife('months')
    cacheTag(`${courseId}/attachments`)
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${courseId}/attachments`, {
        next: {
            revalidate: 60 * 60 * 24 * 30 // REVALIDATE_MONTHLY
        }
    })
    return  await response.json()
}
