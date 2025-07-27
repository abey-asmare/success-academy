'use client';
import axios from "axios";
import { z } from "zod";

import { FileUpload } from "@/components/file-upload";
import { Button } from '@/components/ui/button';
import { Attachment, Course } from "@/lib/generated/prisma";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const formSchema = z.object({
    url: z.string().min(1, {message: "URL is required"})
})


interface AttachmentFormProps {
    initialData: Course & {attachments: Attachment[]},
    courseId: string
}


export default function AttachmentForm({initialData, courseId}: AttachmentFormProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const router = useRouter()  
    const onSubmit=  async (values: z.infer<typeof formSchema>) => {
        try{
             await axios.post(`/api/courses/${courseId}/attachments`, values)
            toast.success("Course created successfully")
            setIsEditing(!isEditing)
            router.refresh()
        }   catch{
            toast.error("Something went wrong")
        }
    }

    const ondelete = async (id: string) => {
        try{
            setDeleteId(id)
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`)
            toast.success("attachment deleted")
            router.refresh()
        }catch{
            toast.error("something went wrong")
        }finally{
            setDeleteId(null)
        }
    }

 

  return (      
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
            Course attachments 
            <Button variant='ghost' onClick={()=> setIsEditing((prev)=> !prev)}>
                {isEditing&& (
                    <>Cancel</>
                )}
                {!isEditing &&(
                    <>  
                    <PlusCircle className="h-4 w-4 mr-2"/>
                        Add a file
                    </>
                )}
    
            </Button>
            
        </div>
        {
            !isEditing && (
                <>
                    {initialData.attachments.length ===0 && 
                    <p className="text-sm mt-2 text-slate-500 italic">No attachments yet</p>
                    }
                    {initialData.attachments.length > 0 && (
                        <div className="space-y-2">

                        {initialData.attachments.map((attachment) => (
                            <div key={attachment.id} className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 rounded-sm">
                                <File className="h-4 w-4 mr-2 flex-shrink-0"/>
                                <p className="text-xs line-clamp-1">{attachment.name}</p>
                                {deleteId === attachment.id ? 
                                <div>
                                    <Loader2 className="h-4 w-4 animate-spin"/>
                                </div>: 
                                <button className="ml-auto hover:opacity-75 transition" onClick={() => ondelete(attachment.id)}>
                                    <X className="h-4 w-4"/>
                                </button>

                                }
                            </div>
                        ))}
                    </div>
                )}
                </>
            )
        }
        {isEditing && (
           <div>
            <FileUpload
            endpoint="courseAttachment"
            onChange={(url)=> {
                if(url)
                      onSubmit({url})
                  } }/>
                  <div className="text-xs text-muted-foreground mt-4">Add Resources</div>
            </div>
        )} 
    </div>
  )
}
