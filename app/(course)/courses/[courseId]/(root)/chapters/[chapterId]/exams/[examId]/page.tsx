import { getExamById } from "@/optimizedQueries/otherOptimizedQueries";
import InteractiveExam from "./InteractiveExam";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";


export async function generateStaticParams(){
  const exams = await db.exam.findMany()
  return exams.map((exam) => ({
    examId: exam.id,
    courseId: exam.courseId,
  }))
}

export default async function ExamDetailPage({
  params,
}: {
  params: Promise<{ examId: string; courseId: string }>;
}) {
  const { examId, courseId } = await params;
  const exam = await getExamById(examId)
  
  if(!exam){
    return notFound()
  }

  return <InteractiveExam exam={exam} courseId={courseId} />;
}

