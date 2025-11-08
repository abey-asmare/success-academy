"use cache";

import { db } from "@/lib/db";
import {
  Attachment,
  CoursePromocode,
  Prisma,
} from "@/prisma/app/generated/prisma/client/client";
import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";
import { cache } from "react";
import { TZDate } from "react-day-picker";

export type CourseGenericViewType = Omit<
  Prisma.CourseGetPayload<{
    include: {
      chapters: true;
      exams: true;
      category: true;
    };
  }>,
  "chapters" | "category"
> & {
  chapters?: Prisma.CourseGetPayload<{
    include: { chapters: true };
  }>["chapters"];
  category?: Prisma.CourseGetPayload<{
    include: { category: true };
  }>["category"]; 
};

// export const getCourses = cache(async (): Promise<CourseGenericViewType[]> => {
//   cacheLife("weeks");
//   cacheTag("courses");
//   return await db.course.findMany({
//     where: {
//       isPublished: true
//     },
//     include: {
//       exams: true,
//       category: true,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });
// });



export const getCourses = cache(async (): Promise<CourseGenericViewType[]> => {
  cacheTag("courses");
  cacheLife("weeks");
  return await db.course.findMany({
    include: {
      exams: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
});

// getting course with exam and published chapters
export const getCourse = cache(
  async (courseId: string): Promise<CourseGenericViewType | null> => {
    cacheLife("weeks");
    cacheTag(`courses/${courseId}`);
    return await db.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        exams: true,
        chapters: {
          where: {
            isPublished: true,
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });
  }
);


function todayInUserZone(timeZone: string) {
  const now = new TZDate(TZDate.now(), timeZone);
  return new Date(now.toISOString());
}

export const getPromoCodes = cache(
  async (courseId: string): Promise<CoursePromocode[]> => {
    cacheLife("days");
    cacheTag(`${courseId}/promocodes`, courseId);
  const today =  todayInUserZone("Africa/Addis_Ababa");

    return await db.coursePromocode.findMany({
      where: {
        courseId: courseId,
        startDate: {
          lte: today,
        },
        expiresIn: {
          gte: today,
        },
      },
    });
  }
);

export const getAttachments = cache(
  async (courseId: string): Promise<Attachment[]> => {
    cacheLife("max");
    cacheTag(`${courseId}/attachments`);
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${courseId}/attachments`);
    return await response.json();
  }
);

export const getAttachment = cache(
  async (attachmentId: string): Promise<Attachment | null> => {
    cacheLife("max");
    const course = await db.attachment.findUnique({
      where: {
        id: attachmentId,
      },
    });
    cacheTag(`attachments/${attachmentId}`, course!.courseId);
    return course;
  }
);
