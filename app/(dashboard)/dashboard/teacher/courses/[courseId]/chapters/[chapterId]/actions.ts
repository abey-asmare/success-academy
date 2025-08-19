"use server";

import { db } from "@/lib/db";
import * as Sentry from "@sentry/nextjs";
import axios from "axios";
import { utapi } from "@/lib/uploadthing-server";
import { revalidatePath } from "next/cache";

const { logger } = Sentry;
export async function deleteChapter(id: string) {
  try {
    // get the chapter
    const chapter = await db.chapter.findUnique({
      where: {
        id,
      },
      include: {
        muxData: true,
      },
    });
    if (!chapter) {
      return { message: "chapter not found", status: 404 };
    }
    // delete the mux video
    axios
      .delete(
        `https://api.mux.com/video/v1/assets/${chapter.muxData?.assetId}`,
        {
          auth: {
            username: process.env.MUX_TOKEN_ID!,
            password: process.env.MUX_TOKEN_SECRET!,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res, "mux response");
        console.log(res.data, "mux data");
        logger.info(
          `[CHAPTER_DELETE_SERVER_ACTION]: Mux video deleted successfully for chapter ${id}`
        );
      })
      .catch((err) => {
        console.log(err, "mux error");
        logger.error(
          `[CHAPTER_DELETE_SERVER_ACTION]: Internal Error: Failed to delete mux video for chapter ${id}`
        );
        Sentry.captureException(err);
      });

    const deletedFile = chapter.videoUrl?.split("/")?.pop();
    // delete the uploadthing using utApi
    const deletedFileResponse = await utapi.deleteFiles(deletedFile!);
    console.log(deletedFileResponse, "deleted file response");
    if (deletedFileResponse.success) {
      logger.info(
        `[CHAPTER_DELETE_SERVER_ACTION]: Uploadthing file deleted successfully for chapter ${id}`
      );
    }
    // delete the chapter using prisma(no need to delete the related tables since they are cascaded)
    await db.chapter.delete({
      where: {
        id,
      },
    });

    logger.info(
      `[CHAPTER_DELETE_SERVER_ACTION]: Chapter deleted successfully ${id}`
    );
    revalidatePath(`/dashboard/teacher/courses/${id}`)
    return { message: "chapter deleted successfully", status: 200};
  } catch (error) {
    console.log("error deleting the chapter", error);
    logger.error(
      `[CHAPTER_DELETE_SERVER_ACTION]: Internal Error: Failed to delete chapter ${error}`
    );
    Sentry.captureException(error);
    return { message: "error deleting the chapter", status: 500};
  }
}