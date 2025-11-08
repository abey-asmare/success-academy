import { getChapters } from '@/optimizedQueries/chapterQueries';
import { getCourse } from '@/optimizedQueries/CourseQueries';
import { getPurchase, getUserProgress } from '@/optimizedQueries/personalizedQueries';
import { notFound } from 'next/navigation';
import React from 'react';
import CourseInfoProvider from './CourseInfoProvider';

async function CourseInfoServerProvider({children,userId, courseId}: {children: React.ReactNode, userId: string, courseId: string}) {

  const [course, chapters] = await Promise.all([
    getCourse(courseId),
    getChapters(courseId)
  ])

      if (!course || !course.isPublished) {
        return notFound()
      }
    
    const purchase = await getPurchase(userId, courseId)
    let progress = null
    if(purchase && purchase.approved){
        progress = await getUserProgress(userId, courseId)
    }

    const isLocked = !purchase || !purchase.approved

  return (
    <CourseInfoProvider chapters={chapters!} course={course!} purchase={purchase} isLocked={isLocked} progress={progress}>
        {children}
    </CourseInfoProvider>
  )
}   

export default CourseInfoServerProvider
