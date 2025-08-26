import { db } from "@/lib/db";

import { Attachment, Chapter } from "@/prisma/app/generated/prisma/client";


interface getChapterProps {
    userId: string;
    courseId: string;
    chapterId: string;
};

function toUTCMidnight(date: Date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

export const getChapter = async ({ 
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

        const course = await db.course.findUnique({
            where: {
                isPublished: true,
                id: courseId,
            },
            select: {
                price: true,
                imageUrl: true,
                title: true,
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
        const today = toUTCMidnight(new Date());
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
                    },
                }
            }
        });

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
}