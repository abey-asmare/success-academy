import { getExamById } from "@/optimizedQueries/otherOptimizedQueries";
import InteractiveExam from "./InteractiveExam";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";


export async function generateStaticParams(){
  const exams = await db.exam.findMany()
   return exams.length > 0  ?  exams.map((exam) => ({
    examId: exam.id,
    courseId: exam.courseId,
  })) : [ {
        examId: "__placeholder__",
        courseId: "__placeholder__",
      }]
}

export default async function ExamDetailPage({
  params,
}: {
  params: Promise<{ examId: string; courseId: string }>;
}) {
  const { examId, courseId } = await params;
  const exam = await getExamById(examId)
  if(examId === '__placeholder__'){
    return notFound()
  }
  if(!exam){
    return notFound()
  }

  return <InteractiveExam exam={exam} courseId={courseId} />;
}

