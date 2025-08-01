
import { db } from "@/lib/db";
import UpdateExamForm from "./updateExamForm";
import { Exam, Question, Answer } from "@/prisma/app/generated/prisma/client";
interface CreateExamPageProps {
  params:Promise<
  {
    courseId: string;
    chapterId: string;
    examId: string;
  }>;
}

export default async function CreateExamPage({params}: CreateExamPageProps) {
  const {courseId, chapterId, examId} = await params

  const exam = await db.exam.findUnique({
    where: {
      id: examId,
    },
    include: {
      questions: {
        include: {
          answers: true,
        },
      },
    },
  })


  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create Exam</h1>
        <p className="text-gray-600 mt-2">
          update the exam
        </p>
      </div>

      <UpdateExamForm courseId={courseId} chapterId={chapterId} exam = {exam} />
    </div>
  );
}
