"use cache";

import { db } from "@/lib/db";
import { Chapter, MuxData } from "@/prisma/app/generated/prisma/client";
import { Prisma } from "@/prisma/app/generated/prisma/client/client";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { cache } from "react";

export type ChaptersGenericViewType = Prisma.ChapterGetPayload<{
  include: {
    exams: true;
    category: true;
  };
}>;

export const getChapters = cache(
  async (courseId: string): Promise<ChaptersGenericViewType[]> => {
    cacheLife("weeks");
    cacheTag(`chapters`, `courses/${courseId}`);

    return await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true
      },
      include: {
        exams: true,
        category: true,
      },
      orderBy: {
        position: "asc",
      },
    });
  }
);
export const getChaptersForAdmin = cache(
  async (courseId: string): Promise<ChaptersGenericViewType[]> => {
    cacheLife("weeks");
    cacheTag(`chapters`, `courses/${courseId}`);

    return await db.chapter.findMany({
      where: {
        courseId,
      },
      include: {
        exams: true,
        category: true,
      },
      orderBy: {
        position: "asc",
      },
    });
  }
);


export const getChapter = cache(
  async (
    chapterId: string
  ): Promise<ChaptersGenericViewType | null> => {
    cacheLife("weeks");
   
    const chapter = await db.chapter.findFirst({
      where: {
        id: chapterId,
        isPublished: true
      },
      include: {
        exams: true,
        category: true,
      },
    });

    if(!chapter ) return null;
     cacheTag(
      `courses/${chapter.courseId}`,
      `chapters/${chapterId}`);

      return chapter;
  }
);
export const getChapterForAdmin = cache(
  async (
    chapterId: string
  ): Promise<ChaptersGenericViewType | null> => {
    cacheLife("weeks");
   
    const chapter = await db.chapter.findFirst({
      where: {
        id: chapterId,
      },
      include: {
        exams: true,
        category: true,
      },
    });

    if(!chapter ) return null;
     cacheTag(
      `courses/${chapter.courseId}`,
      `chapters/${chapterId}`);

      return chapter;
  }
);
export const getNextChapter = cache(
  async (
    courseId: string,
    chapterPosition: number
  ): Promise<Chapter | null> => {
    cacheLife("weeks");
    return await db.chapter.findFirst({
      where: {
        courseId: courseId,
        isPublished: true,
        position: {
          gt: chapterPosition,
        },
      },
      orderBy: {
        position: "asc",
      },
    });
  }
);

export const getMuxData = cache(
  async (chapterId: string): Promise<MuxData | null> => {
    cacheLife("weeks");
    cacheTag(`muxData/${chapterId}`);
    return await db.muxData.findUnique({
      where: {
        chapterId: chapterId,
      },
    });
  }
);
