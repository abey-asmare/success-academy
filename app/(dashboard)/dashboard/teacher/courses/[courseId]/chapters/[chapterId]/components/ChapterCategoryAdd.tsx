'use client'
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import SubmitButton from "./SubmitButton";

export function ChapterCategoryAdd({
  children,
  courseId,
  chapterId,
}: {
  children: React.ReactNode;
  courseId: string;
  chapterId: string;
}) {
  const [category, setCategory]= useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const dialogCloseRef = useRef<HTMLButtonElement>(null)

  const router = useRouter()



  const addCategory = async () => {
    setIsLoading(true)
    try{
   await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/categories`, {category})
        router.refresh()
        dialogCloseRef.current?.click()
   } catch(error: unknown){
      if(axios.isAxiosError(error )){
        const err = error as AxiosError<{error: string}>
        setError(err.response?.data.error || 'Something went wrong.' )
      }else{
        setError("Unexpected Error occured")
      }
   }
   finally {
    setIsLoading(false)
   }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new Category</DialogTitle>
            <DialogDescription>
            Add a new category to the list, that will be used to categorize
            chapters
          </DialogDescription>
        </DialogHeader>
            <div className="space-y-2 my-3">
                  <Label>category</Label>
                    <Input id="category" variant='custom' value={category} onChange={(e)=> setCategory(e.target.value)}   minLength={3} required />
        {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" ref={dialogCloseRef}>Cancel</Button>
          </DialogClose>
        <SubmitButton onClick={addCategory} isLoading={isLoading}  />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
