'use client'

import Image from "next/image"
import { Card } from "./ui/card"
import { CourseMinimized, ExamMinimized } from "@/types"
import axios from "axios"
import { Skeleton } from "./ui/skeleton"
import { useQuery } from "@tanstack/react-query"
import { Button } from "./ui/button"
import Link from "next/link"
import { placeholderCourseImage } from "@/app/constants"

export default function CourseList({ className }: { className: string }) {
  const { data, isLoading, error } = useQuery<CourseMinimized[], Error>({
    queryKey: ['courses'],
    queryFn: () => axios.get('http://localhost:3000/api/courses').then(res => res.data),
    staleTime: 60 * 60 * 2 * 1000, // 2 hours
  })

  const examsMinimized: ExamMinimized[] = (data ?? [])
    .flatMap((course) =>
      (course.exams ?? []).map((exam) => ({
        ...exam,
        imageUrl: course.imageUrl || placeholderCourseImage,
      }))
    )

  if (error) return <p>Error loading courses. Refresh the page.</p>

  return (
    <div className={className}>
      <div className="course-list py-8 md:py-12 space-y-4 md:space-y-6 px-4 md:px-10">
        <p className="text-center text-2xl md:text-3xl lg:text-4xl font-semibold">
          Our Popular Courses
        </p>

        <div className="courses grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 justify-items-center">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <CourseCardSkeleton key={index} />
            ))
          ) : (
            <>
              {data?.map((course) => (
                <CourseCard key={course.id} data={course} />
              ))}
              {examsMinimized.map((exam) => (
                <ExamCard key={exam.id} data={exam} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export function CourseCard({ data }: { data: CourseMinimized }) {
  return (
    <Card className="p-4 border-2 border-gray-200 w-full min-w-[260px] max-w-[280px] transition-all duration-300 hover:shadow-lg hover:border-gray-300 hover:-translate-y-1">
      <div className="wrapper rounded-md overflow-hidden w-full h-[180px] object-cover">
        <Image
          src={data.imageUrl}
          alt={data.description}
          width={500}
          height={500}
          className="w-full h-full object-cover"
          priority
        />
      </div>
      <div className="description">
        <h3 className="font-semibold">{data.title}</h3>
        <Button className="enroll-in px-4 py-1 font-semibold bg-primary-500 hover:bg-primary-600 rounded-md mt-2">
          <Link href={`/courses/${data.id}`}>Enroll</Link>
        </Button>
      </div>
    </Card>
  )
}

export function ExamCard({ data }: { data: ExamMinimized }) {
  return (
    <Card className="p-4 border-2 border-gray-200 w-full min-w-[260px] max-w-[280px] transition-all duration-300 hover:shadow-lg hover:border-gray-300 hover:-translate-y-1">
      <div className="wrapper rounded-md overflow-hidden w-full h-[180px] object-cover">
        <Image
          src={data.imageUrl}
          alt={data.description}
          width={500}
          height={500}
          className="w-full h-full object-cover"
          priority
        />
      </div>
      <div className="description">
       <h3 className="font-semibold">{data.name}</h3>
        <Button className="enroll-in px-4 py-1 font-semibold bg-primary-500 hover:bg-primary-600 rounded-md mt-2">
          <Link href={`/courses/${data.id}`}>Take Simulation</Link>
        </Button>
      </div>
    </Card>
  )
}

export function CourseCardSkeleton() {
  return (
    <Card className="p-4 border-2 border-gray-200 w-full max-w-[280px] transition-all duration-300 hover:shadow-lg hover:border-gray-300 hover:-translate-y-1">
      <div className="wrapper rounded-md overflow-hidden w-full">
        <Skeleton className="w-[280px] h-[220px]" />
      </div>
      <div className="description space-y-2">
        <Skeleton className="w-3/4 h-6" />
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-20 h-10 rounded-md" />
      </div>
    </Card>
  )
}
