import { db } from "@/lib/db";
import { bulkDeleteFiles, deleteFile } from "@/lib/s3/query";
// import { utapi } from "@/lib/uploadthing-server";
import { getAdminInfo, isAdmin } from "@/utils/roles";
import { auth } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

type Props = { params: Promise<{ courseId: string }> };

/**
 *
 * @returns course with associated chapters and exams
 */
export async function GET(req: NextRequest, { params }: Props) {
  const { courseId } = await params;
  try {
    const course = await db.course.findUnique({
      where: {
        id: courseId,
      },
      include: {
        exams: true,
        chapters: {
          where: {
            isPublished: true,
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });
    if (!course) {
      return NextResponse.json({error: "Not found"}, { status: 404 });
    }
    return NextResponse.json(course);
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({error: "Internal server error"}, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Props) {
  const { courseId } = await params;
  const { title, description, imageUrl, bgImageUrl, price, categoryId } =
    await req.json();
  try {
    //  admin users can update the course even if they didn't create it..
    const { userId } = await auth();
    const admin = await isAdmin();
    if (!userId || !admin) {
      return NextResponse.json({error: "Unauthorized"}, { status: 401 });
    }

    const course = await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        title,
        description,
        imageUrl,
        bgImageUrl,
        price,
        categoryId,
      },
    });
    revalidatePath(`/courses/${courseId}`);
    revalidatePath(`/dashboard/teacher/courses`);
    revalidateTag("courses", "max");
    revalidateTag(`courses/${courseId}`, "max");
    revalidateTag("courses/telegram-registration", "max");

    return NextResponse.json(course);
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({error: "Internal server error"}, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  const { courseId } = await params;
  try {
    const { isAdmin } = await getAdminInfo();
    if (!isAdmin) {
      return NextResponse.json({error: "Unauthorized"}, { status: 401 });
    }

    // find unique and including mux data
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        // userId
      },
      include: {
        chapters: true
        //  {
        //   include: {
        //     muxData: true,
        //   },
        // },
      },
    });

    // if no course found
    if (!course) {
      return NextResponse.json({error: "Not found"}, { status: 404 });
    }

    // delete mux data
    // for (const chapter of course.chapters) {
    //   await fetch(
    //     `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${courseId}/chapters/${chapter.id}`,
    //     {
    //       method: "DELETE",
    //     }
    //   );
    // }

    // delete all chapter video assets first
    const chapterVideoKeys = course.chapters.map((chapter) => chapter.videoUrl).filter((url) => url !== null);
    if(chapterVideoKeys.length > 0){
      await bulkDeleteFiles(chapterVideoKeys);
    }
    
    if (course.imageUrl) {
      // delete the course image from uploadthing
      // const deletedFile = course.imageUrl?.split("/")?.pop();
      // delete the uploadthing using utApi
      // await utapi.deleteFiles(deletedFile!);

      await deleteFile(course.imageUrl)
    }
      // delete course
      const deletedCourse = await db.course.delete({
        where: {
          id: courseId,
          // userId
        },
      });
      revalidatePath(`/dashboard/teacher/courses`);
      revalidatePath(`/courses/${courseId}`);
      revalidateTag("courses", "max");
      revalidateTag(`courses/${courseId}`, "max");
      revalidateTag("courses/telegram-registration", "max");

      return NextResponse.json(deletedCourse);
    } catch (error) {
      Sentry.captureException(error);
      return NextResponse.json({error: "Internal server error"}, { status: 500 });
    }
}
