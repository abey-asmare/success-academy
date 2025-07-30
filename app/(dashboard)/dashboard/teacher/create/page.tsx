'use client'
import z from 'zod'
import axios from 'axios'
import {zodResolver} from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
    Form, 
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from '@/components/ui/input'
import {Button} from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from "react-hot-toast";


const formSchema = z.object({
    title: z.string().min(1, {message: "Title is required"})
})
type formSchemaType = z.infer<typeof formSchema> 

export default function Page() {
    const router = useRouter()
    const form = useForm<formSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ''
        }
    })

    const {isSubmitting, isValid} = form.formState;

    const onSubmit=  async (values: formSchemaType) => {
        try{
            const response = await axios.post('/api/courses', values)
            router.push(`/dashboard/teacher/courses/${response.data.id}`)
            toast.success("Course created successfully")
        }   catch{
            toast.error("Something went wrong")
        }
    }


  return (
    <div className='max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6'>
        <div>
            <h1 className='text-2xl'>
                name your course    
            </h1>
            <p>What will your students learn?</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mt-8'>
                    <FormField
                        control={form.control}
                        name='title'
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder='e.g. "The Complete React Course"' {...field}/>
                                </FormControl>
                                <FormDescription>
                                    What will your students learn?
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                  <div className="flex items-center gap-x-2">
                  <Link href='/dashboard'>
                        <Button
                            type='button'
                            variant='ghost'
                        >
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        type='submit'
                        disabled={!isValid || isSubmitting}>
                            
                        Continue
                    </Button>
                  </div>
                </form>
            </Form>
        </div>
    </div>
  )
}
