
import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { Course } from "@/schemas/validationSchemas";
import { REVALIDATE_INSTANT, REVALIDATE_RARELY } from "@/server-constants";
import { CourseWithProgressWithCategory } from "@/types";
import { cache } from "react";
import { isCoursePaymentVerified } from "./is-course-payment-verified";
type GetCourses = {
  userId: string;
  title?: string;
  categoryId?: string;
};

export const getCourses = async ({
  userId,
  title,
  categoryId
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
                    contains: title,
                    mode: "insensitive",
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          }
        },
        purchases: {
          where: {
            userId,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      }, cacheStrategy: {
        ttl: REVALIDATE_INSTANT,
            swr: REVALIDATE_INSTANT
      } 
    });
    
    const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
      courses.map(async (course) => {
        if (course.purchases.length === 0) {
          return {
            ...course,
            progress: null, // make progress possibly null
            isVerified: false,
          };
        }

        // check for payment verification

        const isVerified = await isCoursePaymentVerified(course.id, userId);
    
        const progressPercentage = await getProgress(userId, course.id);
    
        return {
          ...course,
          progress: progressPercentage,
          isVerified,
        };
      })
    );

    return coursesWithProgress;
  } catch{
    return [];
  }
}


export const getCoursesMini = async () => {
try{

  const courses = await db.course.findMany({
    where: {
      isPublished: true,
    },
    select: {
      id: true,
      title: true,
      description: true,
      imageUrl: true,
    }
  })
  return courses
}catch(error){
  console.log(error)
  return []
}
  
}
export const getCourse = cache(async (courseId: string)=> {
  return await db.course.findUnique({
    where: { id: courseId, isPublished: true },
    include: { chapters: true },
  });
})