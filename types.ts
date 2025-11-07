import { Category, Course, Prisma, Purchase } from "./prisma/app/generated/prisma/client";

export type ExamMinimized = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  courseId: string;
};

export type CourseMinimized = {
  id: string;
  title: string;
  imageUrl: string;
  description: string | "";
  price: number;
  createdAt: Date;
  exams?: ExamMinimized[];
};

export type CourseWithProgressWithCategory = Course & {
  chapters: { id: string }[];
  progress: number | null;   // 0–100 or null
  purchase: Purchase | null
};


export type CourseType = Prisma.CourseGetPayload<{
  include: {
    chapters: {
      include: {
        category: true;
        exams: true;
        userProgress: true;
      };
    };
  };
}>;

export type CourseExamPreview = Prisma.CourseGetPayload<{
  include: {
    chapters: true;
    exams: {
      select: {
        id: true;
        name: true;
        description: true;
        courseId: true;
      };
    };
  };
}>;


export type CourseGenericViewType = Prisma.CourseGetPayload<{
  include: {
    chapters: true;
    exams: true;
  };
}>;

export type ChaptersGenericViewType = Prisma.ChapterGetPayload<{
  include: {
    exams: true;
    category: true;
  };
}>;