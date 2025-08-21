"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import DeleteAlert from "../../components/DeleteAlert";

interface ActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

export default function Actions({
  disabled,
  isPublished,
  courseId,
}: ActionsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onClickPublish = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/courses/${courseId}/unpublish`);
        toast.success("Chapter unpublished");
      } else {
        await axios.patch(`/api/courses/${courseId}/publish`);
        toast.success("Chapter published");
      }
      router.refresh();
    } catch {
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
            async () => {
              await axios.delete(`/api/courses/${courseId}/`);
              router.refresh();
            },
            {
              loading: "Deleting course...",
              success: "Course deleted successfully",
              error: "Failed to delete course. try again later.",
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
