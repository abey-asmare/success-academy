"use cache";

import { db } from "@/lib/db";
import { Chapter, MuxData } from "@/prisma/app/generated/prisma/client";
import { Prisma } from "@/prisma/app/generated/prisma/client/client";
import { cacheLife } from "next/dist/server/use-cache/cache-life";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export type ChaptersGenericViewType = Prisma.ChapterGetPayload<{
  include: {
    exams: true;
    category: true;
  };
}>;

export const getChapters = async (
  courseId: string
): Promise<ChaptersGenericViewType[]> => {
  cacheLife("weeks");
  cacheTag(`chapters`);
  return await db.chapter.findMany({
    where: {
      courseId,
      isPublished: true,
    },
    include: {
      exams: true,
      category: true,
    },
    orderBy: {
      position: "asc",
    },
  });
};

export const getChapter = async (
  courseId: string,
  chapterId: string
): Promise<ChaptersGenericViewType | null> => {
  cacheLife("weeks");
  cacheTag(`chapters/${chapterId}`);
  return await db.chapter.findUnique({
    where: {
      id: chapterId,
      isPublished: true,
    },
    include: {
      exams: true,
      category: true, 
    },
  });
};

export const getNextChapter = async (
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
};

export const getMuxData = async (
  chapterId: string
): Promise<MuxData | null> => {
  cacheLife("weeks");
  cacheTag(`muxData/${chapterId}`);
  return await db.muxData.findUnique({
    where: {
      chapterId: chapterId,
    },
  });
};
