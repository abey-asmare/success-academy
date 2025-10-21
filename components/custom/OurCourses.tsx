import { getCoursesForHomePage } from '@/actions/get-courses';
import { CourseMinimized } from '@/types';
import Link from 'next/link';

export default async function OurCourses() {
  const courses = await getCoursesForHomePage()
  return (
    <ul className="space-y-2">
              {
                courses?.map((course: CourseMinimized) => (
                    <li key={course.id}>
                        <Link href={`/courses/${course.id}`} className="text-gray-300 hover:text-white transition-colors">
                            {course.title}
                        </Link>
                    </li>
                ))
              }
            </ul>
  )
}
