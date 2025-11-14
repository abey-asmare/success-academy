"use server";

import { db } from "@/lib/db";
import * as Sentry from "@sentry/nextjs";
import axios from "axios";
import { utapi } from "@/lib/uploadthing-server";
import { revalidatePath, updateTag } from "next/cache";
import { getChapterForAdmin } from "@/optimizedQueries/chapterQueries";
import { deleteFile } from "@/lib/s3/query";

export async function deleteChapter(id: string) {
  try {
    // get the chapter
    const chapter= await getChapterForAdmin(id)
    // const muxData = await getMuxData(id)
    if (!chapter ) {
      return { message: "chapter not found", status: 404 };
    }
    // delete the mux video
    // axios
    //   .delete(
    //     `https://api.mux.com/video/v1/assets/${muxData.assetId}`,
    //     {
    //       auth: {
    //         username: process.env.MUX_TOKEN_ID!,
    //         password: process.env.MUX_TOKEN_SECRET!,
    //       },
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   )
    //   .catch((err) => {
    //     Sentry.captureException(err);
    //   });

    // const deletedFile = chapter.videoUrl?.split("/")?.pop();
    // delete the uploadthing using utApi
    // const deletedFileResponse = await utapi.deleteFiles(deletedFile!);
    if(chapter.videoUrl)
      await deleteFile(chapter.videoUrl)
    // delete the chapter using prisma(no need to delete the related tables since they are cascaded)
    await db.chapter.delete({
      where: {
        id,
      },
    });

    revalidatePath(`/dashboard/teacher/courses/${id}`)
    updateTag(`courses/${chapter.courseId}`)
    // updateTag(`muxData/${chapter.id}`)
    return { message: "chapter deleted successfully", status: 200};
  } catch (error) {
    Sentry.captureException(error);
    return { message: "error deleting the chapter", status: 500};
  }
}