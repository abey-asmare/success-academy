import { auth } from "@clerk/nextjs/server";;
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Banner from "@/components/banner";
import AttachmentForm from "./attachment-form";
import CategoryForm from "./category-form";
import ChaptersForm from "./chapters-form";
import Actions from "./chapters/actions";
import DescriptionForm from "./description-form";
import PriceForm from "./price-form";
import TitleForm from "./title-form";
import { ImageForm } from "./image-form";
import Link  from "next/link";
import { Button } from "@/components/ui/button";


const CourseIdPage = async ({
  params
}: {
  params: { courseId: string }
}) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,  
      userId
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.chapters.some(chapter => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields} / ${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner
          label="This course is unpublished. It will not be visible to the students."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">
              Course setup
            </h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={params.courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
            <TitleForm
              initialData={course}
              courseId={course.id}
            />


            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
            <div>
              <ChaptersForm
                initialData={course}
                courseId={course.id}
              />
            </div>
            <div>

              <PriceForm
                initialData={course}
                courseId={course.id}
              />
            </div>
            <DescriptionForm
              initialData={course}
              courseId={course.id}
            />
            <div>
              
            </div>
            <div>
              <ImageForm
                initialData={course}
                courseId={course.id}
              />
            </div>
            <div>
              <AttachmentForm
                initialData={course}
                courseId={course.id}
              />
            </div>
           
          </div>
      </div>
    </>
  );
}

export default CourseIdPage;