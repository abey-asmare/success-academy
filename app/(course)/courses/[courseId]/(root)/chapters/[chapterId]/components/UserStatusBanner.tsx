'use client'

import React from 'react'
import Banner from "@/components/banner";
import { useCourseInfo } from "../providers/CourseInfoProvider";

function UserStatusBanner({
    isChapterFree, 

}: {isChapterFree: boolean}) {

    const { progress:userProgress, purchase } = useCourseInfo();
    const isLocked =
    !isChapterFree && (!purchase || purchase?.approved === false);
  return (
    <>
     {userProgress?.isCompleted && (
            <Banner variant="success" label="You already completed this chapter." />
          )}
          {isLocked && (
            <Banner
              variant="warning"
              label="You need to purchase this course to watch this chapter."
            />
          )}</>
  )
}

export default UserStatusBanner
