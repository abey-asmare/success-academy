"use client";

import axios from "axios";

import { FileUpload } from "@/components/file-upload";
import { Attachment, Course } from "@/prisma/app/generated/prisma/client";
import { File, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

// Validation schema
type formSchemaType = {url: string}

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] };
  courseId: string;
}

export default function AttachmentForm({
  initialData,
  courseId,
}: AttachmentFormProps) {
  // const [isEditing, setIsEditing] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (values: formSchemaType) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Attachment added");
      // setIsEditing(false);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeleteId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Attachment deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="mt-6 p-4">
      {initialData.attachments.length === 0 && (
        <p className="text-sm mt-2 text-slate-500 italic">No attachments yet</p>
      )}

      <div className="my-4">
        <FileUpload
          endpoint="courseAttachment"
          onChange={(url) => {
            if (url) {
              onSubmit({ url });
            }
          }}
        />
      </div>

      {initialData.attachments.length > 0 && (
        <div className="space-y-2">
          {initialData.attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-sm"
            >
              <File className="h-4 w-4 mr-2 flex-shrink-0" />

              <a
                href={attachment.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs line-clamp-1 hover:underline"
              >
                {attachment.name}
              </a>

              {deleteId === attachment.id ? (
                <div className="ml-auto">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <button
                  className="ml-auto hover:opacity-75 transition"
                  onClick={() => onDelete(attachment.id)}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
