import { db } from "@/lib/db";
import { getAdminInfo } from "@/utils/roles";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs"
import { utapi } from "@/lib/uploadthing-server";
import { revalidatePath, revalidateTag } from "next/cache";

const mux = new Mux(
{
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!
  }
);
const Video = mux.video


export async function GET(
  req: Request,
  { params }: { params: Promise<{chapterId: string }> }
){

  const {chapterId} = await params
  try{
     const chapter = await db.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true,
            },
            include: {
                exams: true,
            }
        });

        return NextResponse.json(chapter)
  } catch (error) {
    console.log("error", error)
    return NextResponse.json({error: "Internal Error"}, { status: 500 });
  }
    
}


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  
  const { userId, isAdmin } = await getAdminInfo()
  const { logger } = Sentry
    const {courseId, chapterId} = await params
  try {

    if (!isAdmin) {
      logger.warn(`[COURSE_ID_CHAPTER_ID_DELETE]: Unauthorized: User ${userId} is not an admin to delete chapter ${chapterId}`)
      return  NextResponse.json({error: "Unauthorized"}, { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      },
    });

    if (!chapter) {
      logger.info(`[COURSE_ID_CHAPTER_ID_DELETE]: Not Found: Chapter ${chapterId} not found for course ${courseId}`)
      return  NextResponse.json({error: "Not Found"}, { status: 404 });
    }
    // if video delete the asset in the mux
    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: chapterId,
        },
      });

      if (existingMuxData) {
        await Video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }

    // delete the asset in uploadthing
     const deletedFile = chapter.videoUrl.split("/")?.pop();
        // delete the uploadthing using utApi
        const deletedFileResponse = await utapi.deleteFiles(deletedFile!);
        if (deletedFileResponse.success) {
          logger.info(
            `[CHAPTER_DELETE_SERVER_ACTION]: Uploadthing file deleted successfully for chapter ${chapterId}`
          );
        }
    }

    
    const deletedChapter = await db.chapter.delete({
      where: {
        id: chapterId,
      },
    });

    revalidatePath(`/courses/${courseId}/chapters/${chapterId}`)
    revalidateTag(`courses/${courseId}`, 'max')
    revalidateTag(`chapters/${chapterId}`, 'max')
    revalidateTag(`muxData/${chapterId}`, 'max')

    // const publishedChaptersInCourse = await db.chapter.findMany({
    //   where: {
    //     courseId: courseId,
    //     isPublished: true,
    //   },
    // });

    // if (!publishedChaptersInCourse.length) {
    //   await db.course.update({
    //     where: {
    //       id: courseId,
    //     },
    //     data: {
    //       isPublished: false,
    //     },
    //   });
    // }

    logger.info(`[COURSE_ID_CHAPTER_ID_DELETE]: OK: Chapter ${chapterId} deleted successfully`)
    revalidatePath(`/dashboard/teacher/courses/${courseId}`)  
    return NextResponse.json(deletedChapter);
    
  } catch (error) {
    logger.error(`[COURSE_ID_CHAPTER_ID_DELETE]: Internal Error: Failed to delete chapter ${chapterId}`)
    Sentry.captureException(error)
    return  NextResponse.json({error: "Internal Error"}, { status: 500 });
  }
}


export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {

  const { userId, isAdmin } = await getAdminInfo()

  const {courseId, chapterId} = await params
  const { logger } = Sentry 
  try {
    const {...values } = await req.json();

    if (!isAdmin) {
      logger.warn(`[COURSE_ID_CHAPTER_ID_PATCH]: Unauthorized: User ${userId} is not an admin to update chapter ${chapterId}`)
      return NextResponse.json({error: "Unauthorized"}, { status: 401 });
    }

    const chapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId: courseId,
      },
      data: {
        ...values,
      },
    });

    if (values.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: chapterId,
        },
      });

      if (existingMuxData) {
        try {
          await Video.assets.delete(existingMuxData.assetId);
        } catch(error) {
          Sentry.captureException(error)
          logger.error(`[COURSE_ID_CHAPTER_ID_PATCH]: Internal Error: Failed to delete Mux asset for chapter ${chapterId} ${error}`)
        }
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          },
        });
      }

      try {
        const asset = await Video.assets.create({
          inputs: [{ url: values.videoUrl }],
          playback_policies: ["public"],
          test: false,
        });
        if (asset) {
          await db.muxData.create({
            data: {
              chapterId: chapterId,
              assetId: asset.id,
              playbackId: asset.playback_ids?.[0]?.id,
            },
          });
        }
      } catch(error) {
        logger.info(`[COURSE_ID_CHAPTER_ID_PATCH]: Internal Error: Failed to create Mux asset for chapter ${chapterId} ${error}`)
        Sentry.captureException(error)
        return NextResponse.json({error: "Internal Error"}, {status: 500})
      }
    }
    logger.info(`[COURSE_ID_CHAPTER_ID_PATCH]: OK: Chapter ${chapterId} updated successfully`)

    revalidatePath(`/courses/${courseId}/chapters/${chapterId}`)
    revalidateTag(`courses/${courseId}`, 'max')
    revalidateTag(`chapters/${chapterId}`, 'max')
    revalidateTag(`muxData/${chapterId}`, 'max')

    return NextResponse.json(chapter);
  } catch (error) {
    logger.error(`[COURSE_ID_CHAPTER_ID_PATCH]: Internal Error: Failed to update chapter ${chapterId} ${error}`)
    Sentry.captureException(error)
    return NextResponse.json({error: "Internal Error"}, {status: 500});
  }
}