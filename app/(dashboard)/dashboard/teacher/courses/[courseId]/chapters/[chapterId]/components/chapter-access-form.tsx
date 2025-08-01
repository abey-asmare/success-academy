'use client';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Chapter } from "@/prisma/app/generated/prisma/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

const formSchema = z.object({
    isFree: z.boolean(), 

})


interface ChapterAccessFormProps {
    initialData: Chapter
    courseId: string, 
    chapterId: string
}

export default function ChapterAccessForm({initialData, courseId, chapterId}: ChapterAccessFormProps) {
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {isFree: initialData.isFree ?? false}
    })

    const {isSubmitting, isValid, isDirty} = form.formState;

    useEffect(() => {
        form.reset({isFree: initialData.isFree ?? false});
    }, [initialData, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Chapter access updated successfully");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        }
    }

  return (      
    <div className="mt-6">

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
                    <FormField
                        control={form.control}
                        name='isFree'
                        render={({field}) => (
                            <FormItem
                             className="flex flex-col items-start space-x-3 space-y-0 rounded-md"   
                             >
                                <FormLabel>Chapter Access</FormLabel>
                                <FormControl className="border p-2">
                                   <Checkbox checked = {field.value} onCheckedChange={field.onChange} />
                                    
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormDescription>
                                        Check to make this chapter free
                                    </FormDescription>
                                    <FormMessage/>
                                </div>
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center gap-x-2">
                        <Button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                        >
                            Save
                        </Button>
                    </div>
                </form> 
            </Form>
    <div className="mt-6 border bg-slate-50 rounded-md p-4">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="isFree"
                    render={({field}) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 rounded-md border bg-white">
                            <FormControl>
                                <Checkbox 
                                    checked={field.value} 
                                    onCheckedChange={field.onChange}
                                    className="mt-1"
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel className="text-base font-medium">
                                    Free Preview
                                </FormLabel>
                                <FormDescription className="text-sm">
                                    Check this box if you want to make this chapter available for free preview.
                                    Students will be able to view this chapter without purchasing the course.
                                </FormDescription>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end">
                    <Button 
                        type="submit" 
                        disabled={isSubmitting || !isDirty}
                        size="sm"
                    >
                        Update Access
                    </Button>
                </div>
            </form>
        </Form>
    </div>
  )
}
