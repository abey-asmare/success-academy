"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Prisma } from "@/prisma/app/generated/prisma/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ChaptersList from "./chapters-list";

const formSchema = z.object({
  title: z.string().min(1),
});


type ChapterWithRelations = Prisma.ChapterGetPayload<{
      include: {
        category: true;
  };
}>;


interface ChaptersFormProps {
  initialData: ChapterWithRelations[];
  courseId: string;
}

export default function ChaptersForm({
  initialData,
  courseId,
}: ChaptersFormProps) {

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(
        `/api/courses/${courseId}/chapters`,
        values
      );
      toast.success("chapter updated successfully");
      // setIsCreating((current) => !current);
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onReorder = async(updateData: {id: string, position: number}[]) => {
    try {
       await axios.put(`/api/courses/${courseId}/chapters/reorder`, {list: updateData})
      toast.success("chapters reordered successfully")
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    }finally{
      // setIsUpdating(false)
    }
  }

  const onEdit = (id: string) => {
    router.push(`/dashboard/teacher/courses/${courseId}/chapters/${id}`)
  }

  return (
    <div className="mt-6">
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
                    <FormLabel>Course chapters</FormLabel>
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
       <div className={cn('text-sm mt-2', !initialData.length && 'text-slate-500 italic' )}>
        {!initialData.length && "No chapters"}
        <ChaptersList
        onEdit ={onEdit}
        onReorder = {onReorder}
        items = {initialData}
        />
        </div>

    </div>
  );
}
