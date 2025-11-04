
import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { REVALIDATE_INSTANT } from "@/server-constants";
import { CourseWithProgressWithCategory } from "@/types";
import { cache } from "react";
import { isCoursePaymentVerified } from "./is-course-payment-verified";

export const getCoursesForUser = cache(async (userId: string): Promise<CourseWithProgressWithCategory[]> => {
    
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
      },
      include: {
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
    
    const coursesWithProgress = await Promise.all(
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
    
        const progressPercentage = await getProgress(userId, course.id, course.chapters);
    
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
})


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