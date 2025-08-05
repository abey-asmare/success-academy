import { Category, Course } from "./prisma/app/generated/prisma/client";



export type ExamMinimized = {
    id: string;
    name: string;
    description: string;
    imageUrl: string
    courseId: string
}

export type CourseMinimized = {
    id: string;
    title: string;
    imageUrl: string;
    description: string | ""
    price: number;
    createdAt: Date;
    exams?: ExamMinimized[]
};



export type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
};