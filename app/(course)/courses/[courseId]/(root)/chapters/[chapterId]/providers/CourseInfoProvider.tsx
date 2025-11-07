"use client";
import { ChaptersGenericViewType } from "@/optimizedQueries/chapterQueries";
import { CourseGenericViewType } from "@/optimizedQueries/CourseQueries";
import { Purchase, UserProgress } from "@/prisma/app/generated/prisma/client";
import { notFound } from "next/navigation";
import React, { createContext, useContext } from "react";

const CourseInfoContext = createContext<
{
    course: CourseGenericViewType,
    chapters: ChaptersGenericViewType[], 
    purchase: Purchase | null, 
    progress: UserProgress | null
    isLocked: boolean
} | null>(null);

export function useCourseInfo(){
  const context = useContext(CourseInfoContext);
  if(!context){
    throw new Error("useCourseInfo must be used within a CourseInfoProvider")
  }
  return context
}

function CourseInfoProvider({ children, course, chapters, purchase, progress, isLocked }: { children: React.ReactNode, course: CourseGenericViewType, chapters: ChaptersGenericViewType[], purchase: Purchase | null, progress: UserProgress | null, isLocked: boolean }) {
    const value = {
        course, 
        chapters,
        purchase,
        progress,
        isLocked
    }
    if(!course){
      return notFound()
    }
  return <CourseInfoContext.Provider value={value}> {children}</CourseInfoContext.Provider>;
}

export default CourseInfoProvider;
