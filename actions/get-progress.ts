import { db } from "@/lib/db";
import { REVALIDATE_INSTANT } from "@/server-constants";

export const getProgress = async (
  userId: string,
  courseId: string,
  chapters: {id: string}[]
): Promise<number | null> => {
  try {
    // create an array of chapter ids
    const publishedChapterIds = chapters.map((chapter) => chapter.id);

    const validCompletedChapters = await validCompletedChaptersForUser(
      userId,
      publishedChapterIds
    );
    const progressPercentage = (validCompletedChapters / chapters.length) * 100;

    return progressPercentage;
  } catch {
    return 0;
  }
};

async function validCompletedChaptersForUser(
  userId: string,
  publishedChapterIds: string[]
) {
  return await db.userProgress.count({
    where: {
      userId: userId,
      chapterId: {
        in: publishedChapterIds,
      },
      isCompleted: true,
    },
    cacheStrategy: {
      ttl: REVALIDATE_INSTANT,
      swr: REVALIDATE_INSTANT
    }
  });
}
