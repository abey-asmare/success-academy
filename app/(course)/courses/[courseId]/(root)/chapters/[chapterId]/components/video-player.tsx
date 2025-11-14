"use client";

import axios from "axios";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { cn } from "@/lib/utils";
import Player from 'next-video/player';
import YT from 'player.style/yt/react';
import { useCourseInfo } from "../providers/CourseInfoProvider";
// import MuxPlayer from "@mux/mux-player-react";



interface VideoPlayerProps {
    playbackId?: string | null;
    courseId: string;
    chapterId: string;
    nextChapterId?: string;
    title: string;
    isChapterFree: boolean;
    url: string;
  }

export const VideoPlayer = ({
    playbackId,
    courseId,
    chapterId,
    nextChapterId,
    title,
    isChapterFree,
    url
}: VideoPlayerProps) => {
    const [isReady, setIsReady] = useState(false);
    const router = useRouter();

    const {purchase, progress: userProgress } = useCourseInfo()
    const isLocked =
    !isChapterFree && (!purchase || purchase?.approved === false);
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

    console.log(url)

    const onEnd = async () => {
        try {
            if (completeOnEnd) {
                await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
                    isCompleted: true,
                });

                toast.success("Progress updated");
                router.refresh();

                if (nextChapterId) {
                    router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
                }
            }
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="relative aspect-video min-w-full min-h-full mt-2">
            {!isReady && !isLocked && (
                <div className="absolute w-full h-full flex items-center justify-center bg-slate-800  dark:bg-slate-200">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                </div>
            )}
            {isLocked && (
                <div className="w-full h-full flex items-center justify-center bg-slate-800  dark:bg-slate-200 flex-col gap-y-2 text-secondary">
                    <Lock className="h-8 w-8" />
                    <p className="text-sm">
                        This chapter is locked
                    </p>
                </div>
            )}
            {!isLocked && url &&(
                // <MuxPlayer
                //     title={title}
                //     className={cn(
                //         !isReady && "hidden",
                //         "w-full h-full"
                //     )}
                //     onCanPlay={() => setIsReady(true)}
                //     onEnded={onEnd}
                //     autoPlay
                //     playbackId={playbackId}
                // />
                <Player  onEnded={onEnd} onCanPlay={()=> setIsReady(true)} className={cn(
                    !isReady && "hidden"
                )} src={url} theme={YT} style={{width: "100%", height: "100%"}}>
                </Player>
                
            )}
        </div>
    )
}