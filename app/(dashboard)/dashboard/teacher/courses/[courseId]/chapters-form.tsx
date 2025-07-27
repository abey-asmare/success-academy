"use client";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Course, Chapter } from "@/prisma/app/generated/prisma/client";
import { Loader2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import ChaptersList from "./chapters-list";

const formSchema = z.object({
  title: z.string().min(1),
});

interface ChaptersFormProps {
  initialData: Course & {chapters: Chapter[]};
  courseId: string;
}

export default function ChaptersForm({
  initialData,
  courseId,
}: ChaptersFormProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        `/api/courses/${courseId}/chapters`,
        values
      );
      toast.success("chapter created successfully");
      setIsCreating((current) => !current);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onReorder = async(updateData: {id: string, position: number}[]) => {
    try {
      const response = await axios.put(`/api/courses/${courseId}/chapters/reorder`, {list: updateData})
      toast.success("chapters reordered successfully")
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    }finally{
      setIsUpdating(false)
    }
  }

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`)
  }

  return (
    <div className="relative mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Course chapters
        <Button variant="ghost" onClick={() => setIsCreating((prev) => !prev)}>
          {isCreating ? (
            "cancel"
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a chapters
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} placeholder="Introduction to a course" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={!isValid || isSubmitting}>
              Create
            </Button>
          </form>
        </Form>
      )}

      {!isCreating && <div className={cn('text-sm mt-2', !initialData.chapters.length && 'text-slate-500 italic' )}>
        {!initialData.chapters.length && "No chapters"}
        {/* add a list of chapters */}
        <ChaptersList
        onEdit ={onEdit}
        onReorder = {onReorder}
        items = {initialData.chapters}
        />
        </div>}

      {!isCreating && <p className="text-xs text-muted-foreground mt-4">No chapters</p>}
    </div>
  );
}
