import { auth } from "@clerk/nextjs/server";;
import { redirect } from "next/navigation";
import { File} from "lucide-react";

import { getChapter } from "@/actions/get-chapter";
import { Preview } from "@/components/preview";
import Banner from "@/components/banner";
import { Separator } from "@radix-ui/react-dropdown-menu";
import CourseEnrollButton from "./components/course-enroll-button";
import { CourseProgressButton } from "./components/course-progress-button";
import { VideoPlayer } from "./components/video-player";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const ChapterIdPage = async ({
  params
}: {
  params: Promise<{ courseId: string; chapterId: string }>
}) => {
  const { userId } = await auth();
  const {courseId, chapterId} = await params

  if (!userId) {
    return redirect("/");
  }

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    chapterId,
    courseId,
  });

  if (!chapter || !course) {
    return redirect("/")
  }

  console.log('purchase', purchase)
 const isLocked = !chapter.isFree && (!purchase || purchase?.approved === false)
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner
          variant="success"
          label="You already completed this chapter."
        />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapterId}
            title={chapter.title}
            courseId={courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}

          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">
              {chapter.title}
            </h2>
            {purchase && purchase.approved ? (
              <div className="flex flex-wrap items-center gap-2">
              {chapter.exams.map((exam, index) => (
                <Button key={exam.id} className="mr-2 bg-sky-500 text-white hover:bg-sky-600 transition-colors duration-200">
                  <Link href={`/courses/${courseId}/chapters/${chapterId}/exams/${exam.id}`}>
                    take exam  {chapter.exams.length > 1 ? index + 1 : ""}
                  </Link>
                </Button>
              ))}
                <CourseProgressButton
                chapterId={chapterId}
                courseId={courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
                />
              </div>
            ) : (
                <CourseEnrollButton
                  courseId={courseId}
                  price={course.price!}
                />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description!} />
          </div>
          {purchase?.approved && !!attachments.length && (
            <>
              <Separator />
              <div className="p-4 space-y-2 ">
                {attachments.map((attachment) => (
                  <Link
                    href={`/courses/${courseId}/chapters/${chapterId}/resources/${attachment.id}`}
                    target="_blank"
                    key={attachment.id}
                    className='flex items-center p-3 rounded-sm w-full bg-sky-200 text-sky-700 hover:underline'
                  >
                    <File />
                    <p className="line-clamp-1">
                      {attachment.name}
                    </p>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChapterIdPage;