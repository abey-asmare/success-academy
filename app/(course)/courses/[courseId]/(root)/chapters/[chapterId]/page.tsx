import { getAttachments, getChapter, getCourse, getMuxData, getNextChapter, getPromoCodes } from "@/actions/optimizedQueries";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./components/video-player";
import AdditionalResources from "./components/AdditionalResources";
import UserStatusBanner from "./components/UserStatusBanner";

type ChapterIdProps = Promise<{
  courseId: string;
  chapterId: string;
}>;

export async function generateMetadata({
  params,
}: {
  params: ChapterIdProps;
}): Promise<Metadata> {
  const { chapterId, courseId } = await params;
  const chapter = await getChapter(courseId, chapterId)
  const course = await getCourse(courseId);

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

  const course = await getCourse(courseId)
  const chapter = await getChapter(courseId, chapterId)
  const muxData = await getMuxData(courseId, chapterId)
  const promocodes = await getPromoCodes(courseId)
  const attachments = await getAttachments(courseId)
  const nextChapter = await getNextChapter(courseId, chapterId, chapter.position)  

  if (!chapter || !course) {
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
       <AdditionalResources chapter={chapter} nextChapter={nextChapter} promocodes={promocodes} attachments={attachments}/>
      </div>
    </div>
  );
};

export default ChapterIdPage;
