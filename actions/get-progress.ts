import { db } from "@/lib/db";

export const getProgress = async (
  userId: string,
  courseId: string,
  chapters: { id: string }[]
): Promise<number | null> => {
  try {
    if (chapters.length === 0) return null;

    const chapterIds = chapters.map((chapter) => chapter.id);

    const completedCount = await db.userProgress.count({
      where: {
        userId,
        chapterId: { in: chapterIds },
        isCompleted: true,
      },
    });

    const progressPercentage = (completedCount / chapters.length) * 100;

    return progressPercentage;
  } catch (error) {
    console.error("Error calculating progress:", error);
    return 0;
  }
};
