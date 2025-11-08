import { getCourses } from '@/optimizedQueries/CourseQueries';
import Link from 'next/link';

export default async function OurCourses() {
  const allCourses = await getCourses()
  const courses = allCourses.filter((course) => course.isPublished)

  return (
    <ul className="space-y-2">
              {
                courses.map((course) => (
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
