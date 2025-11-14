import { db } from "@/lib/db";
import { getAdminInfo } from "@/utils/roles";
// import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";
import { Sentry } from "@/lib/sentryLogger"
import { utapi } from "@/lib/uploadthing-server";
import { revalidatePath, revalidateTag } from "next/cache";
import { deleteFile } from "@/lib/s3/query";

// const mux = new Mux(
// {
//     tokenId: process.env.MUX_TOKEN_ID!,
//     tokenSecret: process.env.MUX_TOKEN_SECRET!
//   }
// );
// const Video = mux.video


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
    Sentry.captureException(error)
    return NextResponse.json({error: "Internal Error"}, { status: 500 });
  }
    
}


export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {
  
  const { isAdmin } = await getAdminInfo()
    const {courseId, chapterId} = await params
  try {

    if (!isAdmin) {
      return  NextResponse.json({error: "Unauthorized"}, { status: 401 });
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      },
    });

    if (!chapter) {
      return  NextResponse.json({error: "Not Found"}, { status: 404 });
    }
    // if video delete the asset in the mux
    if (chapter.videoUrl) {
      // const existingMuxData = await db.muxData.findFirst({
      //   where: {
      //     chapterId: chapterId,
      //   },
      // });

      // if (existingMuxData) {
      //   await Video.assets.delete(existingMuxData.assetId);
      //   await db.muxData.delete({
      //     where: {
      //       id: existingMuxData.id,
      //     },
      //   });
      // }

    // delete the asset in uploadthing
    //  const deletedFile = chapter.videoUrl.split("/")?.pop();
        // delete the uploadthing using utApi
      // await utapi.deleteFiles(deletedFile!);
      await deleteFile(chapter.videoUrl)
    const deletedChapter = await db.chapter.delete({
      where: {
        id: chapterId,
      },
    });

    revalidatePath(`/courses/${courseId}/chapters/${chapterId}`)
    revalidateTag(`courses/${courseId}`, 'max')
    revalidateTag(`chapters/${chapterId}`, 'max')
    revalidateTag(`muxData/${chapterId}`, 'max')
    revalidatePath(`/dashboard/teacher/courses/${courseId}`)  
    return NextResponse.json(deletedChapter);
  }
  } catch (error) {

    Sentry.captureException(error)
    return  NextResponse.json({error: "Internal Error"}, { status: 500 });
  }
}


export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string }> }
) {

  const { isAdmin } = await getAdminInfo()

  const {courseId, chapterId} = await params 
  try {
    const {...values } = await req.json();

    if (!isAdmin) {
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

    // if (values.videoUrl) {
    //   const existingMuxData = await db.muxData.findFirst({
    //     where: {
    //       chapterId: chapterId,
    //     },
    //   });

    //   if (existingMuxData) {
    //     try {
    //       await Video.assets.delete(existingMuxData.assetId);
    //     } catch(error) {
    //       Sentry.captureException(error)
      
    //     }
    //     await db.muxData.delete({
    //       where: {
    //         id: existingMuxData.id,
    //       },
    //     });
    //   }

    //   try {
    //     const asset = await Video.assets.create({
    //       inputs: [{ url: values.videoUrl }],
    //       playback_policies: ["public"],
    //       test: false,
    //     });
    //     if (asset) {
    //       await db.muxData.create({
    //         data: {
    //           chapterId: chapterId,
    //           assetId: asset.id,
    //           playbackId: asset.playback_ids?.[0]?.id,
    //         },
    //       });
    //     }
    //   } catch(error) {
    //     Sentry.captureException(error)
    //     return NextResponse.json({error: "Internal Error"}, {status: 500})
    //   }
    // }




    revalidatePath(`/courses/${courseId}/chapters/${chapterId}`)
    revalidateTag(`courses/${courseId}`, 'max')
    revalidateTag(`chapters/${chapterId}`, 'max')
    // revalidateTag(`muxData/${chapterId}`, 'max')
    return NextResponse.json(chapter);
  } catch (error) {
    Sentry.captureException(error)
    return NextResponse.json({error: "Internal Error"}, {status: 500});
  }
}