
import { getProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";
import { getPurchase } from "@/optimizedQueries/personalizedQueries";
import { REVALIDATE_INSTANT } from "@/server-constants";
import { CourseWithProgressWithCategory } from "@/types";

export const getCoursesForUser = async (
  userId: string
): Promise<CourseWithProgressWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: { isPublished: true },
      include: {
        chapters: {
          where: { isPublished: true },
          select: { id: true },
        },
        purchases: {
          where: { userId },
          select: { id: true, approved: true },
        },
      },
      orderBy: { createdAt: "desc" },
    
      cacheStrategy: {
        swr: REVALIDATE_INSTANT, 
        ttl: REVALIDATE_INSTANT, 

      }
    } );
    
    const coursesWithStatus = await Promise.all(
      courses.map(async (course) => {
        const purchase = await getPurchase(userId, course.id);
        console.log("purchase from get-c", purchase)
        const progress =
        purchase?.approved && course.chapters.length > 0
        ? await getProgress(userId, course.id, course.chapters)
        : null;


        return {
          ...course,
          progress,
          purchase
        };
      })
    );

    return coursesWithStatus;
  } catch (error) {
    console.error("Error fetching courses for user:", error);
    return [];
  }
};


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