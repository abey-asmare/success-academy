"use client";

import axios from "axios";
import MuxPlayer from "@mux/mux-player-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCourseInfo } from "../providers/CourseInfoProvider";

interface VideoPlayerProps {
    playbackId?: string | null;
    courseId: string;
    chapterId: string;
    nextChapterId?: string;
    title: string;
    isChapterFree: boolean;
  }

export const VideoPlayer = ({
    playbackId,
    courseId,
    chapterId,
    nextChapterId,
    title,
    isChapterFree
}: VideoPlayerProps) => {
    const [isReady, setIsReady] = useState(false);
    const router = useRouter();

    const {purchase, progress: userProgress } = useCourseInfo()
    const isLocked =
    !isChapterFree && (!purchase || purchase?.approved === false);
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;



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
        <div className="relative aspect-video">
            {!isReady && !isLocked && (
                <div className="absolute w-full h-full flex items-center justify-center bg-slate-800  dark:bg-slate-200">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                </div>
            )}
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800  dark:bg-slate-200 flex-col gap-y-2 text-secondary">
                    <Lock className="h-8 w-8" />
                    <p className="text-sm">
                        This chapter is locked
                    </p>
                </div>
            )}
            {!isLocked && playbackId && (
                <MuxPlayer
                    title={title}
                    className={cn(
                        !isReady && "hidden",
                        "w-full h-full"
                    )}
                    onCanPlay={() => setIsReady(true)}
                    onEnded={onEnd}
                    autoPlay
                    playbackId={playbackId}
                />
            )}
        </div>
    )
}