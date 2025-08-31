
import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { CourseWithProgressWithCategory } from "@/types";
import { isCoursePaymentVerified } from "./is-course-payment-verified";
import { Course } from "@/schemas/validationSchemas";

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


export const getCoursesInProduction = async () => {
   
  try{
    const courses = await fetch(
      `https://successacademy.et/api/courses`
    ).then((res) => res.json());
  
    return courses.map((course: Course) => ({ courseId: course.id }))
  }catch(error){
    console.log("there is error", error)
    return []
  }
}