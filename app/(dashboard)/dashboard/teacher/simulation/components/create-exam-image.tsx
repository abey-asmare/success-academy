"use client";

import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";

interface CreateExamImageFormProps {
  initialData: string;
  onChange: (url: string) => void;
}

export const CreateExamImageForm = ({
  initialData,
  onChange,
}: CreateExamImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6">
      <div className="font-medium flex items-center justify-between">
        Exam image
        <Button onClick={toggleEdit} variant="ghost" type="button">
          {isEditing ? "Cancel" : initialData ? (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit image
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an image
            </>
          )}
        </Button>
      </div>

      {!isEditing && !initialData && (
        <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
          <ImageIcon className="h-10 w-10 text-slate-500" />
        </div>
      )}

      {!isEditing && initialData && (
        <div className="relative aspect-video mt-2">
          <Image
            alt="Upload"
            fill
            className="object-cover rounded-md"
            src={initialData}
          />
        </div>
      )}

      {isEditing && (
        <div>
          <FileUpload
            endpoint="examImage"
            onChange={(url) => {
              if (url) {
                onChange(url); // just call the prop function
                toggleEdit();
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  );
};
