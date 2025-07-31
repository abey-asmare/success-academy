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
import { Input } from '@/components/ui/input';
import { Course } from "@/prisma/app/generated/prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const formSchema = z.object({
    price: z.number().min(1, {message: "price is required"})
})


interface PriceFormProps {
    initialData: Course
    courseId: string
}


export default function PriceForm({initialData, courseId}: PriceFormProps) {
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {price: initialData.price || 0}
    })

    const {isSubmitting, isValid} = form.formState;

    const onSubmit= async (values: z.infer<typeof formSchema>) => {
        try{
            await axios.patch(`/api/courses/${courseId}`, values)
            toast.success("Course price updated successfully")
            setIsEditing(!isEditing)
            router.refresh()
        }   catch{
            toast.error("Something went wrong")
        }
    }



  return (      
    <div className="mt-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
                    <FormField
                        control={form.control}
                        name='price'
                        render={({field}) => (
                            <FormItem
                            
                            >
                                <FormLabel>Course price</FormLabel>
                                <FormControl>
                            <Input type="number" {...field} step={0.01}/>
                                    
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
