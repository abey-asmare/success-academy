import Banner from "@/components/banner";
import { Button } from "@/components/ui/button";
import { getChapterForAdmin } from "@/optimizedQueries/chapterQueries";
import { getAllChapterCategories } from "@/optimizedQueries/otherOptimizedQueries";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ChapterAccessForm from "./components/chapter-access-form";
import ChapterActions from "./components/chapter-actions";
import ChapterCategoryForm from "./components/chapter-category-form";
import ChapterDescriptionForm from "./components/chapter-description-form";
import ChapterTitleForm from "./components/chapter-title-form";
import ChapterVideoFormCustom from "./components/chapter-video-form-custom";
import DeleteExamButton from "./exam/components/DeleteExamButton";
export default async function ChapterDetails({
  params,
}: {
  params: Promise<{ chapterId: string; courseId: string }>;
}) {
  const { chapterId, courseId } = await params;
  const chapter = await getChapterForAdmin(chapterId)
  // const muxData = await getMuxData(chapterId)
  
  if (!chapter) {
    return notFound()
  }
  const chapterCategories = await getAllChapterCategories()

  // description should be optional as requested
  const requiredFields = [
    chapter.title, 
    // chapter.description, 
    chapter.videoUrl
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  const isCompleted = requiredFields.every(Boolean);

  return (
    <>
      {!chapter.isPublished && (
        <Banner
          variant="warning"
          label="Please publish your chapter. It's unavilable for the students now."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/dashboard/teacher/courses/${courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to course
            </Link>
            <div className="flex itms-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Chapter setup</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              <ChapterActions
                disabled={!isCompleted}
                courseId={courseId}
                chapterId={chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
           <div className="flex flex-col">
           <ChapterTitleForm
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />

               <ChapterCategoryForm
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
              options={chapterCategories.map(category => ({ label: category.name, value: category.id }))}
            
            /> 
            
           </div>
            
            <ChapterDescriptionForm
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
            <ChapterAccessForm
              initialData={chapter}
              courseId={courseId}
              chapterId={chapterId}
            />
            
            <div>
              <ChapterVideoFormCustom
                initialData={{
                  ...chapter,
                  // muxData: muxData ?? undefined,
                }}
                courseId={courseId}
                chapterId={chapterId}
              />
            </div>
        </div>
        {chapter.exams.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Exams</h2>
            <div className="space-y-3">
              {chapter.exams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-3 bg-white rounded border">
                  <span className="font-medium">{exam.name}</span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/teacher/courses/${courseId}/chapters/${chapterId}/exam/${exam.id}`}
                      className="text-blue-500 hover:underline text-sm"
                    >
                      View Exam
                    </Link>
                    <Link
                      href={`/dashboard/teacher/courses/${courseId}/chapters/${chapterId}/exam/${exam.id}/update`}
                      className="text-blue-500 hover:underline text-sm"
                    >
                      Edit Exam
                    </Link>
                    <DeleteExamButton
                      courseId={courseId}
                      chapterId={chapterId}
                      examId={exam.id}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-6">
          <Button variant="outline">
            <Link
              href={`/dashboard/teacher/courses/${courseId}/chapters/${chapterId}/exam/`}
            >
              Create an Exam
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}


// export const revalidate = 10800 // 3 hours;
