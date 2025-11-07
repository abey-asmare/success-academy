import { getCoursesForUser } from "./get-courses";
import { CourseWithProgressWithCategory } from "@/types";


type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  coursesInProgress: CourseWithProgressWithCategory[];
};

export const getDashboardCourses = async (
  userId: string
): Promise<DashboardCourses> => {
  const completedCourses :CourseWithProgressWithCategory[] =[]
  const coursesInProgress :CourseWithProgressWithCategory[] =[]
  try {
    const purchasedCourses = await getCoursesForUser(userId)

    for (const course of purchasedCourses){
      if (course.progress === null || !course.purchase?.approved)
        continue

      if(course.progress === 100){
        completedCourses.push(course)
      }
      
      if(course.progress < 100){
        coursesInProgress.push(course)
      }
    }

    return {
      completedCourses,
      coursesInProgress,
    };
  } catch {
    return {
      completedCourses,
      coursesInProgress,
    };
  }
};
