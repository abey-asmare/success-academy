import { notFound } from "next/navigation";
import InteractiveExam from "./InteractiveExam";

export default async function ExamDetailPage({
  params,
}: {
  params: Promise<{ examId: string; courseId: string; chapterId: string }>;
}) {
  const { examId, courseId, chapterId } = await params;
  // const exam = await db.exam.findUnique({
  //     where: {
  //         id: examId,
  //     },
  //     include: {
  //         questions: {
  //             include: {
  //                 answers: true,
  //             },
  //         },
  //     },
  // })
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${courseId}/chapters/${chapterId}/exams/${examId}`,
    { next: { revalidate: 86400 } } // REVALIDATE_RARELY
  );
  if (!response.ok) {
    return notFound();
  }
  const exam = await response.json();

  return <InteractiveExam exam={exam} courseId={courseId} />;
}

