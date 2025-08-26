import Banner from "@/components/banner";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import AttachmentForm from "./attachment-form";
import ChaptersForm from "./chapters-form";
import Actions from "./chapters/actions";
import DescriptionForm from "./description-form";
import { ImageForm } from "./image-form";
import PriceForm from "./price-form";
import { PromocodeForm } from "./PromocodeForm";
import PromoCodes from "./PromoCodes";
import TitleForm from "./title-form";

const CourseIdPage = async ({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) => {
  const { courseId } = await params;
  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
    include: {
      promocodes: true,
      chapters: {
        include: {
          category: true,
        },
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

  if (!course) {
    return redirect("/");
  }

  // description should be optional as requested
  const requiredFields = [
    course.title,
    // course.description,
    course.imageUrl,
    course.price,
    course.chapters.some((chapter) => chapter.isPublished),
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields} / ${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner label="This course is unpublished. It will not be visible to the students." />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="flex flex-col">
            <TitleForm initialData={course} courseId={course.id} />
          </div>

          <div className="flex flex-col">
            <PriceForm initialData={course} courseId={course.id} />
          </div>

          <div className="flex flex-col">
            <ChaptersForm initialData={course} courseId={course.id} />
          </div>

          <div className="flex flex-col mt-6">
            <DescriptionForm initialData={course} courseId={course.id} />
          </div>

          <div className="flex flex-col">
            <ImageForm initialData={course} courseId={course.id} />
          </div>
          <div className="flex flex-col">
            <AttachmentForm initialData={course} courseId={course.id} />
          </div>
          <div className="flex flex-col">
            <PromocodeForm
              // initialData={course}
              courseId={course.id}
              coursePrice={course.price || 0}
            />
            <h3 className="text-lg font-medium text-[#181818]">Promocodes</h3>
            <PromoCodes courseId={course.id} promocodes = {course.promocodes}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
