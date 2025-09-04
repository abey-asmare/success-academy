
"use client";

import axios from "axios";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Course } from "@/prisma/app/generated/prisma/client";

interface ImageFormProps {
  initialData: Course
  courseId: string;
  type?: 'image' | 'bg';
};

type formSchemaType = {imageUrl: string}

export const ImageForm = ({
  initialData,
  courseId,
  type
}: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const router = useRouter();

  const onSubmit = async (values: formSchemaType) => {
    const payload = type === 'bg' ? {bgImageUrl: values.imageUrl} : {imageUrl: values.imageUrl}
      try {
        await axios.patch(`/api/courses/${courseId}`, payload);
        toast.success("Course updated");
        toggleEdit();
        router.refresh();
      } catch {
        toast.error("Something went wrong");
      }
    }

    const imageUrl = type === 'bg' ? initialData.bgImageUrl : initialData.imageUrl;

  return (
    <div className="mt-6 ">
      <div className="font-medium flex items-center justify-between">
        Course {type === 'bg' ? 'background image' : 'image'}
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && (
            <>Cancel</>
          )}
          {!isEditing && !imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add an image
            </>
          )}
          {!isEditing && imageUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit image
            </>
          )}
        </Button>
    </div>
      {!isEditing && (
        !imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              alt="Upload"
              fill
              className="object-cover rounded-md"
              src={imageUrl}
            />
          </div>
        )
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            16:9 aspect ratio recommended
          </div>
        </div>
      )}
    </div>
  )
}