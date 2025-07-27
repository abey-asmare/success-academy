
'use client';
import axios from "axios";
import { z } from "zod";
import { FileUpload } from "@/components/file-upload";
import { Button } from '@/components/ui/button';
import { Chapter, MuxData } from "@/prisma/app/generated/prisma/client";
import { Pencil, PlusCircle, VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import MuxPlayer from '@mux/mux-player-react'

const formSchema = z.object({
    videoUrl: z.string()
})


interface ChapterVideoFormProps {
    initialData: Chapter & {muxData?: MuxData},
    courseId: string, 
    chapterId: string
}


export default function ChapterVideoForm({initialData, courseId, chapterId}: ChapterVideoFormProps) {
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter()  
    const onSubmit=  async (values: z.infer<typeof formSchema>) => {
        try{
             await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
            toast.success("Chapter video updated successfully")
            setIsEditing(!isEditing)
            router.refresh()
        }   catch{
            toast.error("Something went wrong")
        }
    }

 

  return (          
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
        <div className="font-medium flex items-center justify-between">
            Chapter Video
            <Button variant='ghost' onClick={()=> setIsEditing((prev)=> !prev)}>
                {isEditing && (
                    <>Cancel</>
                )}
                {!isEditing && !initialData.videoUrl && (
                    <>  
                    <PlusCircle className="h-4 w-4 mr-2"/>
                        Add a video
                    </>
                )}
                {!isEditing && initialData.videoUrl && (
                    <>
                        <Pencil className="h-4 w-4 mr-2"/>
                        Edit video
                    </>
                )}
    
            </Button>
            
        </div>
        {
            !isEditing && (!initialData.videoUrl ? (
                <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md"><VideoIcon className="h-10 w-10 text-slate-500"/></div>
            ) : (
                <div className="relative aspect-video mt-2">
                    {/* <Image alt="upload" fill className='object-cover rounded-md' src={initialData.videoUrl}/> */}
                    <MuxPlayer playbackId={initialData.muxData?.playbackId || ''} className="rounded-md"/>
                    {/* video uploaded */}
                </div>
            ) )
        }
        {isEditing && (
           <div>
            <FileUpload
            endpoint="chapterVideo"
            onChange={(url)=> {
                if(url)
                      onSubmit({videoUrl: url})
                  } }/>
                  <div className="text-xs text-muted-foreground mt-4">Chapter videos</div>
            </div>
        )} 
        {initialData.videoUrl && !isEditing && 
        <div className="text-xs text-muted-foreground mt-2">
           Videos can take a few minutes to process. Refresh the page
        </div>}
    </div>
  )
}
