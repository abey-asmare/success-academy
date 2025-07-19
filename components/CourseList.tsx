'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import Image from "next/image"

interface Course {
  id: number
  title: string
  image: string
  chapters: number
  tests: number
  resources: number
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  enrolled: boolean
}

const coursesData: Course[] = [
  {
    id: 1,
    title: "Freshman",
    image: "/images/getting-started-1.jpg",
    chapters: 12,
    tests: 4,
    resources: 30,
    level: 'Beginner',
    enrolled: false
  },
  {
    id: 2,
    title: "Sophomore",
    image: "/images/getting-started-1.jpg",
    chapters: 15,
    tests: 6,
    resources: 45,
    level: 'Intermediate',
    enrolled: false
  },
  {
    id: 3,
    title: "Junior",
    image: "/images/getting-started-1.jpg",
    chapters: 18,
    tests: 8,
    resources: 60,
    level: 'Advanced',
    enrolled: false
  },
  {
    id: 4,
    title: "Senior",
    image: "/images/getting-started-1.jpg",
    chapters: 20,
    tests: 10,
    resources: 75,
    level: 'Advanced',
    enrolled: false
  }
]

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>(coursesData)
  const [filter, setFilter] = useState<'All' | 'Beginner' | 'Intermediate' | 'Advanced'>('All')
  const [hoveredCourse, setHoveredCourse] = useState<number | null>(null)

  const handleEnroll = (courseId: number) => {
    setCourses(prev => 
      prev.map(course => 
        course.id === courseId 
          ? { ...course, enrolled: !course.enrolled }
          : course
      )
    )
  }

  const filteredCourses = filter === 'All' 
    ? courses 
    : courses.filter(course => course.level === filter)

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="course-list py-6 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-semibold">Our Popular Courses</h2>
        
        {/* Filter Buttons */}
        <div className="flex justify-center gap-2 flex-wrap">
          {(['All', 'Beginner', 'Intermediate', 'Advanced'] as const).map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                filter === level
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="courses flex gap-4 flex-wrap justify-center">
        {filteredCourses.map((course) => (
          <Card 
            key={course.id}
            className={`p-4 border-2 w-fit transition-all duration-300 cursor-pointer ${
              hoveredCourse === course.id
                ? 'border-primary-500 shadow-lg transform scale-105'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onMouseEnter={() => setHoveredCourse(course.id)}
            onMouseLeave={() => setHoveredCourse(null)}
          >
            <div className="wrapper rounded-md overflow-hidden w-[260px] relative">
              <Image 
                src={course.image} 
                alt={`${course.title} Course`} 
                width={500} 
                height={300} 
                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110" 
              />
              
              {/* Level Badge */}
              <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                {course.level}
              </div>

              {/* Enrollment Status */}
              {course.enrolled && (
                <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Enrolled ✓
                </div>
              )}
            </div>
            
            <div className="description space-y-4 mt-4">
              <h3 className="font-semibold text-lg">{course.title}</h3>
              <p className="text-gray-500 text-sm">
                {course.chapters} Chapters • {course.tests} Tests • {course.resources}+ resources
              </p>
              
              <button 
                onClick={() => handleEnroll(course.id)}
                className={`w-full px-4 py-2 font-semibold rounded-md transition-all duration-200 ${
                  course.enrolled
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-primary-500 hover:bg-primary-600 text-white hover:shadow-md'
                }`}
              >
                {course.enrolled ? 'Enrolled' : 'Enroll Now'}
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Enrollment Summary */}
      {courses.some(course => course.enrolled) && (
        <div className="text-center mt-8 p-4 bg-green-50 rounded-lg">
          <p className="text-green-800 font-medium">
            🎉 You&apos;re enrolled in {courses.filter(course => course.enrolled).length} course(s)!
          </p>
        </div>
      )}
    </div>
  )
}
