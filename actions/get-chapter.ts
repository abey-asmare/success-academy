import { db } from "@/lib/db";

import { Attachment, Chapter } from "@/prisma/app/generated/prisma/client";
import { cache } from "react";
import { TZDate } from "react-day-picker";


interface getChapterProps {
    userId: string;
    courseId: string;
    chapterId: string;
};

function todayInUserZone(timeZone: string) {
    const now = new TZDate(TZDate.now(), timeZone)
    return new Date(now.toISOString())
}  


export const getCourse = cache(async (courseId: string)=> {
    const course = await db.course.findUnique({
        where: {
            isPublished: true,
            id: courseId,
        },
        select: {
            price: true,
            imageUrl: true,
            title: true,
            description: true, 
            exams: {
                select: {
                    id: true,
                    name: true, 
                    description: true  
                }, 
                orderBy: {
                    createdAt: "desc",
                }

            }
        }, 
    });
    return course
})

export const getSingleChapter = cache(async (chapterId: string)=> {
    const chapter = await db.chapter.findUnique({
        where: {
            id: chapterId,
            isPublished: true,
        },
        include: {
            exams: {
                include: {
                    questions: {    
                        include: {
                            answers: true,
                        },
                    },
                }
            }
        }
    });
    return chapter
})



export const getChapter = cache(async ({ 
    userId, 
    courseId, 
    chapterId 
}: getChapterProps) => {
    try {

        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: { 
                    userId,
                    courseId,
                },
            }
        });

        const course = await getCourse(courseId)

        const today = todayInUserZone("Africa/Addis_Ababa");
        console.log("date in get chapt", today)
        

        const promocodes = await db.coursePromocode.findMany({
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
        console.log(promocodes, 'promos')

        const chapter = await getSingleChapter(chapterId)

        if (!chapter || !course) {
            throw new Error("Chapter or course not found");
        } 

        let muxData = null;
        let attachments: Attachment[] = [];
        let nextChapter: Chapter | null = null;

        if (purchase) {
            attachments = await db.attachment.findMany({
                where: {
                    courseId: courseId,
                },
            });
        }

        if (chapter.isFree || purchase) {
            muxData = await db.muxData.findUnique({
                where: {
                    chapterId: chapterId,
                },
            });

            nextChapter = await db.chapter.findFirst({
                where: {
                    courseId: courseId,
                    isPublished: true,
                    position: {
                        gt: chapter?.position,
                    },
                },
                orderBy: {
                    position: "asc",
                },
            });
        }

        const userProgress = await db.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId,
                },
            },
        });

        return {
            chapter,
            course,
            muxData,
            attachments,
            nextChapter,
            userProgress,
            purchase,
            promocodes
        };

    } catch (error) {
        console.log('error', error)
        return {
            chapter: null,
            course: null,
            muxData: null,
            attachments: null,
            nextChapter: null,
            userProgress: null,
            purchase: null,
            promocodes: null,
        }
    }
})