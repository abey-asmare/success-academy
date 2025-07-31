import { Category, Course } from "./prisma/app/generated/prisma/client";

export type CourseMinimized = {
    id: string;
    title: string;
    imageUrl: string;
    description: string | ""
    price: number;
    createdAt: Date;
};



export type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
};