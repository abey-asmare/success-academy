'use client'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useState } from 'react'

export default function DeleteExamButton({
    courseId,
    chapterId,
    examId,
}: {
    courseId: string;
        chapterId: string;
    examId: string;
}) {
    const [isLoading, setIsLoading] = useState(false)
    const deleteExam = async () => {
        try {
         setIsLoading(true)
         await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}/exams/${examId}`)
         toast.success("Exam deleted")
        } catch {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }   
  return (
    <Button variant="destructive" onClick={deleteExam} disabled={isLoading}>
        {isLoading ? "Deleting..." : "Delete Exam"}
    </Button>
  )
}
