'use client'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { Trash } from 'lucide-react'
import { toast } from 'react-hot-toast'
import DeleteAlert from '../../../../../components/DeleteAlert'
import { useRouter } from 'next/navigation'


const data = {
  title: "Are you sure you want to delete this exam?",
  description:
    "This action cannot be undone. This will permanently delete this Exam, you will not be able to recover it.",
  dialogCancelTitle: "Cancel",
  dialogContinueTitle: "Continue",
}


export default async  function DeleteExamButton({
    courseId,
    chapterId,
    examId,
}: {
    courseId: string;
        chapterId: string;
    examId: string;
}) {
  const router = useRouter()
  return <DeleteAlert
            onContinue={() =>
              toast.promise(
                  async ()=> {
                    await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}/exams/${examId}`)
              router.refresh()

                },
                {
                  loading: "Deleting exam...",
                  success: "Exam deleted successfully",
                  error: "Failed to delete exam. try again later.",
                }
              )
            }
            {...data}>
            <Button size="sm" variant="destructive">
              <Trash className="h-4 w-4" />
            </Button>
          </DeleteAlert>
}
