'use client'
import { CourseMinimized } from '@/types';
import axios from 'axios';
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query';

export default function OurCourses() {
    const { data } = useQuery<CourseMinimized[], Error, CourseMinimized[]>({
        queryKey: ['courses'],
        queryFn: ()=> axios.get('/api/courses').then(res => res.data),
        staleTime: 60 * 60 * 2 * 1000,
      });
  return (
    <ul className="space-y-2">
              {
                data?.map((course: CourseMinimized) => (
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
