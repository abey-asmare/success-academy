import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function CourseDetail({params}: {params: {courseId: string}}) {
  // fetch unique course
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc"
        }
      },
    },
  });

    if(!course)
      return redirect('/')

    return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`)
}
  