'use client';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Course } from "@/prisma/app/generated/prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const formSchema = z.object({
    description: z.string().min(1, {message: "description is required"})
})


interface DescriptionForm {
    initialData: Course
    courseId: string
}


export default function DescriptionForm({initialData, courseId}: DescriptionForm) {
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {description: initialData.description || ''}
    })

    const {isSubmitting, isValid} = form.formState;

    const onSubmit=  async (values: z.infer<typeof formSchema>) => {
        try{
            await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Course created successfully")
            setIsEditing(!isEditing)
            router.refresh()
        }   catch{
            toast.error("Something went wrong")
        }
    }



  return (      
    <div className="mt-6 ">
            <Form {...form}>
                <FormLabel>Course Description</FormLabel>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-2">
                    <FormField
                        control={form.control}
                        name='description'
                        render={({field}) => (
                            <FormItem
                                
                            >
                                <FormControl>
                                    <Textarea  {...field}/>
                                    
                                </FormControl>
                                <FormMessage/>
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
    </div>
  )
}
