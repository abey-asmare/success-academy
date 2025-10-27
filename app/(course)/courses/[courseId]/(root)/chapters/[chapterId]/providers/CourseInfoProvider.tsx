"use client";
import { Purchase, UserProgress } from "@/prisma/app/generated/prisma/client";
import { ChaptersGenericViewType, CourseGenericViewType } from "@/types";
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
  return <CourseInfoContext.Provider value={value}> {children}</CourseInfoContext.Provider>;
}

export default CourseInfoProvider;
