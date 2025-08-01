import React from 'react'
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { cn } from '@/lib/utils';


const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

export default async function ExamDeatilPage({params}: {params: Promise<{examId: string}>}) {
    const {examId} = await params;
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
    if(!exam){
        return redirect('/dashboard/teacher/courses')
    }
  return (  
    <div className='p-6'>
      <h1 className="text-2xl font-bold">{exam.name}</h1>
      <p className="text-gray-600">{exam.description}</p>

      <div className="mt-6">
        <div className="mt-4">
            {exam.questions.map((question, index) => (
                <div key={index} className="flex justify-between flex-col gap-3 w-full items-center">
                    <h1 className="font-medium text-lg text-start self-start w-1/2 m-auto">{index + 1}. {exam.questions[index].question}</h1>
                    {/* map the answers */}
                    <div className='flex justify-center w-full' >
                        <div className="space-y-2 w-full">
                        {question.answers.map((answer, answerIndex) => (
                            <div key={answerIndex} className={cn('text-gray-600 text-lg border p-1 rounded-sm mx-auto w-1/2', answer.isCorrect && 'border-green-600 border-3')}>
                                <p className="flex items-center gap-2">
                                    <span className={cn('font-bold bg-gray-200 p-2 px-4 mr-2 rounded-sm', answer.isCorrect && 'bg-green-100 text-green-600')}>{alphabets[answerIndex]}</span>
                                    {answer.text}
                                </p>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            ))} 
        </div>
      </div>
    </div>
  )
}
