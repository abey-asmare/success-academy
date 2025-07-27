'use client';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
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
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const formSchema = z.object({
    isFree: z.boolean().default(false), 

})


interface ChapterAccessFormProps {
    initialData: Chapter
    courseId: string, 
    chapterId: string
}


export default function ChapterAccessForm({initialData, courseId, chapterId}: ChapterAccessFormProps) {
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {isFree: initialData.isFree ?? false}
    })

    const {isSubmitting, isValid} = form.formState;

    const onSubmit=  async (values: z.infer<typeof formSchema>) => {
        try{
            const response = await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
            toast.success("Chapter updated successfully")
            setIsEditing(!isEditing)
            router.refresh()
        }   catch{
            toast.error("Something went wrong")
        }
    }



  return (      
    <div className="mt-6 border bg  -slate-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
            Chapter Access  
            <Button variant='ghost' onClick={()=> setIsEditing((prev)=> !prev)}>
                {   
                    isEditing ? 'cancel': 
                    <>
                <Pencil className="h-4 w-4 mr-2"/>
                Edit Access
                </>
            }
            </Button>
            
        </div>
        {
            !isEditing && (
                <div className={cn("text-sm mt-2", !initialData.description && "italic")}>{initialData.isFree ? <>Free for Preview</> : <>chapter is locked</>}
                </div>
            )
        }

        {isEditing && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
                    <FormField
                        control={form.control}
                        name='isFree'
                        render={({field}) => (
                            <FormItem
                             className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"   
                            >
                                <FormControl>
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
        )}
    </div>
  )
}
