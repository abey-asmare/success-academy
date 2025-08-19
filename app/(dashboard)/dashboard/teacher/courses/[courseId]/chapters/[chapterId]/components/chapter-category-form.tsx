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
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Chapter } from "@/prisma/app/generated/prisma/client";
import { Plus } from "lucide-react";
import { ChapterCategoryAdd } from "./ChapterCategoryAdd";

const formSchema = z.object({
  categoryId: z.string().min(1, { message: "category is required" }),
});

interface ChapterCategoryFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
  options: {label: string, value: string}[]
}

export default function ChapterCategoryForm({
  initialData,
  courseId,
  chapterId,
  options,
}: ChapterCategoryFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { categoryId: initialData.categoryId || "" },
  });

  const { isSubmitting, isValid } = form.formState;

  return (
    <div className="mt-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(()=> {})} className="space-y-8 mt-8">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Chapter category </FormLabel>
                <FormControl>
                  <Combobox
                    options={options}
                    onChange={field.onChange}
                    value={field.value}
                  >
                    <ChapterCategoryAdd chapterId={chapterId} courseId={courseId}>
                      <Button
                        size="icon"
                        variant="outline"
                        className="bg-transparent border-none shadow-none absolute right-0 top-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </ChapterCategoryAdd>
                  </Combobox>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-x-2">
            <Button type="submit" disabled={!isValid || isSubmitting}>
              Save
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
