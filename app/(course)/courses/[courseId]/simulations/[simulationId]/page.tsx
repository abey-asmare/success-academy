import { getExamById } from '@/optimizedQueries/otherOptimizedQueries';
import { notFound } from 'next/navigation';
import InteractiveSimulation from '../InteractiveSimulation';
import { db } from '@/lib/db';

export async function generateStaticParams(){
  const exams = await db.exam.findMany()
  return exams.length > 0 ?  exams.map((exam) => ({
    examId: exam.id,
    courseId: exam.courseId,
  })) : [{
        examId: "__placeholder__",
        courseId: "__placeholder__",
      }]

}

export default async function SimulationDetailPage({params}: {params: Promise<{simulationId: string}>}) {
    const {simulationId: examId} = await params;
    const exam = await getExamById(examId)
    if(examId === '__placeholder__')
      return notFound()
    if(!exam){
        return notFound()   
    }

    return <InteractiveSimulation exam={exam} />
}
