import { notFound, redirect } from "next/navigation";
import { VideoPlayer } from "./components/video-player";
import AdditionalResources from "./components/AdditionalResources";
import UserStatusBanner from "./components/UserStatusBanner";
import { getChapter, getMuxData, getNextChapter } from "@/optimizedQueries/chapterQueries";
import { getAttachments, getCourse, getPromoCodes } from "@/optimizedQueries/CourseQueries";
import { Metadata } from "next";

type ChapterIdProps = Promise<{
  courseId: string;
  chapterId: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: ChapterIdProps;
}): Promise<Metadata> {
  const { chapterId } = await params;
  const chapter = await getChapter(chapterId)
  const course = await getCourse(chapter!.courseId);

  if (!chapter || !course) {
    return {
      title: "Resourse not found",
    };
  }

  return {
    title: chapter.title,
    description: chapter.description ? chapter.description : course.description,
    openGraph: {
      images: [course.imageUrl!],
    },
  };
}

const ChapterIdPage = async ({ params }: { params: ChapterIdProps }) => {
  const { courseId, chapterId } = await params;

  const chapter = await getChapter(chapterId);
  
  
    if (!chapter) {
      return notFound()
    }
  const [course, muxData, promocodes, attachments, nextChapter] = await Promise.all([
    getCourse(courseId),
    getMuxData(chapterId),
    getPromoCodes(courseId),
    getAttachments(courseId),
    getNextChapter(courseId, chapter!.position),
  ])


  if (!course || !course.isPublished) {
    return redirect("/");
  }
  return (
    <div>
    <UserStatusBanner isChapterFree={chapter.isFree} />
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapterId}
            title={chapter.title}
            courseId={courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId}
            isChapterFree={chapter.isFree}
          />
        </div>
       <AdditionalResources course={course!}  chapter={chapter} nextChapter={nextChapter} promocodes={promocodes} attachments={attachments}/>
      </div>
    </div>
  );
};

export default ChapterIdPage;
