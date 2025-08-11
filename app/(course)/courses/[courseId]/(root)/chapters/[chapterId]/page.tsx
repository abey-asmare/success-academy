import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { File } from "lucide-react";
import Image from "next/image";
import { getChapter } from "@/actions/get-chapter";
import { Preview } from "@/components/preview";
import Banner from "@/components/banner";
import { Separator } from "@radix-ui/react-dropdown-menu";
import CourseEnrollButton from "./components/course-enroll-button";
import { CourseProgressButton } from "./components/course-progress-button";
import { VideoPlayer } from "./components/video-player";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
} from "@/components/ui/card";

const ChapterIdPage = async ({
  params,
}: {
  params: Promise<{ courseId: string; chapterId: string }>;
}) => {
  const { userId } = await auth();
  const { courseId, chapterId } = await params;

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
    return redirect("/");
  }

  console.log("purchase", purchase);
  const isLocked =
    !chapter.isFree && (!purchase || purchase?.approved === false);
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter." />
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
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            {purchase && purchase.approved ? (
              <div className="flex flex-wrap items-center gap-2">
                {chapter.exams.map((exam, index) => (
                  <Button
                    key={exam.id}
                    className="mr-2 bg-sky-500 text-white hover:bg-sky-600 transition-colors duration-200"
                  >
                    <Link
                      href={`/courses/${courseId}/chapters/${chapterId}/exams/${exam.id}`}
                    >
                      take exam {chapter.exams.length > 1 ? index + 1 : ""}
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
              <CourseEnrollButton courseId={courseId} price={course.price!} />
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
                    className="flex items-center p-3 rounded-sm w-full bg-sky-200 text-sky-700 hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </Link>
                ))}
              </div>
              <div className="space-y-6">
                <h1 className="text-xl md:text-3xl font-semibold text-[#181818]">
                  Simulations
                </h1>
                {/* card simulation */}
                <div
                id="simulations"
                className="flex gap-6 items-center flex-wrap w-full"
                  >
                    {course.exams.length === 0 && (
                      <p className="text-center text-gray-400 font-semibold">No Simulations yet. Keep tuned.</p>
                    )}
                {course.exams.map((exam) => (
                    <Card key={exam.id} className="p-4 border-2 border-gray-200 w-full max-w-[220px] transition-all duration-300 hover:shadow-lg hover:border-gray-300 hover:-translate-y-1">
                      <div className="wrapper rounded-md overflow-hidden w-full h-[160px] object-cover overflow-hidden">
                        <Image
                          src={course.imageUrl!}
                          alt={exam.name}
                          width={220}
                          height={160}
                          className="w-full h-full object-cover"
                          priority
                        />
                      </div>
                      <div className="description">
                        <h3 className="font-semibold">{exam.name}</h3>
                        <p className="text-gray-500 line-clamp-3">{exam.description}</p>
                        <Button size='sm' className="enroll-in px-4 py-1 font-semibold bg-primary-500 hover:bg-primary-600 rounded-md mt-2">
                          <Link href={`/courses/${courseId}/simulations/${exam.id}`}>take simulation</Link>
                        </Button>
                      </div>
                    </Card>
                ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
