import { db } from '@/lib/db';
import UpdateSimulationForm from '../components/UpdateSimulationForm';
import { notFound } from 'next/navigation';

export default async function UpdateSimulationPage({params}: {params: Promise<{simulationId: string }>}) {
  const {simulationId} = await params
  const exam = await db.exam.findUnique({
    where: {
      id: simulationId, 
    },
    include: {
      questions: {
        include: {
            answers: true
          }
        }
      }
  })
  const courses = await db.course.findMany();
  if(!exam) {
    return notFound()
  }
  const initialData = {
    courseId: exam.courseId!,
    name: exam.name,
    description: exam.description!,
    questions: exam.questions.map((question) => ({
      question: question.question,
      imageUrl: question.imageUrl ?? "",
      answers: question.answers.map((answer) => ({
        text: answer.text,
        isCorrect: answer.isCorrect,
      })),
    })),
  }

  return (
     <div className="max-w-4xl mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Update Exam</h1>
            <p className="text-gray-600 mt-2">
              Update a simulation exam with questions and multiple choice answers for your course.
            </p>
          </div>
    
          <UpdateSimulationForm courses={courses.map(course => ({id: course.id, name: course.title}))} initialData={initialData} simulationId={simulationId}/>
        </div>
  )
}


