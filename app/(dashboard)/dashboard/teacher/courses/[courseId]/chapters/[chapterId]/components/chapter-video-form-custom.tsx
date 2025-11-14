"use client";
import { Button } from "@/components/ui/button";
import { Chapter, MuxData } from "@/prisma/app/generated/prisma/client";
import axios from "axios";
import { Pencil, PlusCircle, VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { UploadDropzoneProgress } from "@/components/upload-dropzone-progress";
import { useUploadFiles } from "@better-upload/client";
import { getChapter } from "@/optimizedQueries/chapterQueries";

import Player from 'next-video/player';
import YT from 'player.style/yt/react';


interface ChapterVideoFormProps {
  initialData: Chapter
  courseId: string;
  chapterId: string;
}
type formSchemaType = { videoUrl: string };

export default function ChapterVideoFormCustom({
  initialData,
  courseId,
  chapterId,
}: ChapterVideoFormProps) {
  const { control} = useUploadFiles({
    route: "chapterVideo",
    onUploadComplete: (data)=> {
      onSubmit({videoUrl: data.files[0].objectInfo.key})
    }
  });

  const [chapter, setChapter] = useState<Chapter | null>(null)
  useEffect(()=> {
     getChapter(chapterId).then((data)=> {
      setChapter(data)
     })
  }, [chapterId])
  console.log(chapter)
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const onSubmit = async (values: formSchemaType) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("Chapter video updated successfully");
      setIsEditing(!isEditing);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };
            {console.log(initialData.videoUrl, process.env.PUBLIC_R2_EXPOSE_CONTENT_THROUGH)}

  return (
    <div className="mt-6">
      <div className="font-medium text-base flex items-center justify-between">
        Chapter Video
        <Button variant="ghost" onClick={() => setIsEditing((prev) => !prev)}>
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <VideoIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            {/* <MuxPlayer
              playbackId={initialData.muxData?.playbackId || ""}
              className="rounded-md"
            /> */}
            <Player src={`${process.env.NEXT_PUBLIC_R2_EXPOSE_CONTENT_THROUGH}/${initialData.videoUrl}`} theme={YT} className="h-full"/>
          </div>
        ))}
      {isEditing && (
        <div>

          <UploadDropzoneProgress control={control} accept="video/*" />
          {/* <FileUpload
            endpoint="chapterVideo"
            onChange={(url)=> {
                if(url)
                      onSubmit({videoUrl: url})
                  } }/>
                  <div className="text-sm text-muted-foreground mt-4">Chapter videos</div> */}
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos can take a few minutes to process. Refresh the page
        </div>
      )}
    </div>
  );
}
