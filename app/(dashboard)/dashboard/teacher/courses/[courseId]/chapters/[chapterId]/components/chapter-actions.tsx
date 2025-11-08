"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import DeleteAlert from "../../../../components/DeleteAlert";
import { Sentry } from "@/lib/sentryLogger";

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

export default function ChapterActions({
  disabled,
  courseId,
  isPublished,
  chapterId,
}: ChapterActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onClickPublish = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/unpublish`
        );
        toast.success("Chapter unpublished");
      } else {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/publish`
        );
        toast.success("Chapter published");
      }
      router.refresh();
    } catch (error){
      Sentry.captureException(error)
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClickPublish}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <DeleteAlert
        onContinue={() =>
          toast.promise(
            async () =>
              {
                await axios.delete(
                `/api/courses/${courseId}/chapters/${chapterId}`
              )
              router.refresh()
            },
            {
              loading: "Deleting chapter...",
              success: "Chapter deleted successfully",
              error: "Failed to delete chapter. try again later.",
            }
          )
        }
      >
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </DeleteAlert>
    </div>
  );
}
