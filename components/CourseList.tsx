'use client'
import Image from "next/image"
import { Card } from "./ui/card"
import { CourseMinimized } from "@/types"
import axios from "axios";
import { Skeleton } from "./ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Button } from "./ui/button";
import Link from "next/link";



export default function CourseList({ className}: {className: string}) {
  // revalidate in 2 hours, there wont be many course creations after all
  const { data, isLoading, error } = useQuery<CourseMinimized[], Error, CourseMinimized[]>({
    queryKey: ['courses'],
    queryFn: ()=> axios.get('http://localhost:3000/api/courses').then(res => res.data),
    staleTime: 60 * 60 * 2 * 1000,
  });
  

  if (error) return <p>Error loading courses</p>;

 
  return (
          <div className={className}>
        <div className="course-list py-8 md:py-12 space-y-6 md:space-y-8 px-4 md:px-10">
        <p className="text-center text-2xl md:text-3xl lg:text-4xl font-semibold">
          Our Popular Courses
        </p>
        <div className="courses grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 justify-items-center">

        {isLoading ? 
        Array.from({length: 4}).map((_, index) => (
          <CourseCardSkeleton key={index} />
        )): 
        data?.map((course: CourseMinimized) => (
          <CourseCard key={course.id} course={course} />
        ))
      
      }
          </div>
      </div>
        </div>
  )
}


 function CourseCard({course}: {course: CourseMinimized}){
return (
<Card className="p-4 border-2 border-gray-200 w-full max-w-[280px] transition-all duration-300 hover:shadow-lg hover:border-gray-300 hover:-translate-y-1">
<div className="wrapper rounded-md overflow-hidden w-full h-[220px] object-cover">
  <Image
    src={course.imageUrl}
    alt={course.description}
    width={500}
    height={500}
    className="w-full h-full"
  />
</div>
<div className="description space-y-4">
  <h3 className="font-semibold">{course.title}</h3>
  <p className="text-gray-500">
    {course.description}
  </p>
  <Button className="enroll-in px-4 py-2 font-semibold bg-primary-500 hover:bg-primary-600 rounded-md text-white">
<Link href={`/courses/${course.id}`}>
Enroll
</Link>
  </Button>
</div>
</Card>
)
};

export function CourseCardSkeleton(){
return (
<Card className="p-4 border-2 border-gray-200 w-full max-w-[280px] transition-all duration-300 hover:shadow-lg hover:border-gray-300 hover:-translate-y-1">
<div className="wrapper rounded-md overflow-hidden w-full">
  <Skeleton
    className="w-[280px] h-[220px]"
  />
</div>
<div className="description space-y-4">
  <Skeleton className="font-semibold"/>
  <Skeleton className="text-gray-500"/>
  <Skeleton className="enroll-in px-4 py-2 font-semibold w-20 h-10 rounded-md text-white"/>
</div>
</Card>
)
};