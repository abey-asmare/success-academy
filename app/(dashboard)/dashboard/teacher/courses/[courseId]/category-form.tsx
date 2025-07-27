'use client';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from '@/components/ui/button';
import { Combobox } from "@/components/ui/combobox";
import { Course } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const formSchema = z.object({
    categoryId: z.string().min(1, {message: "category is required"})
})


interface CategoryFormProps {
    initialData: Course
    courseId: string; 
    options: {label: string, value: string}[]
}


export default function CategoryForm({initialData, courseId, options}: CategoryFormProps) {
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {categoryId: initialData.categoryId || ''}
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


    const selectedOption = options.find(option => option.value === initialData.categoryId  )


  return (      
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
            Course category 
            <Button variant='ghost' onClick={()=> setIsEditing((prev)=> !prev)}>
                {
                    isEditing ? 'cancel': 
                    <>
                <Pencil className="h-4 w-4 mr-2"/>
                Edit category
                </>
            }
            </Button>
            
        </div>
        {
            !isEditing && (
                <p className={cn("text-sm mt-2", !initialData.categoryId && "italic")}>{selectedOption?.label || 'No category'}</p>
            )
        }
        {isEditing && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
                    <FormField
                        control={form.control}
                        name='categoryId'
                        render={({field}) => (
                            <FormItem
                                
                            >
                                <FormControl>
                                    <Combobox  options={options} onChange={field.onChange} value={field.value} />
                                    
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
        )}
    </div>
  )
}
