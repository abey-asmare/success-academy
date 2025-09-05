import React from 'react'
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import InteractiveExam from './InteractiveExam';

export default async function ExamDetailPage({params}: {params: Promise<{examId: string, courseId: string}>}) {
    const {examId, courseId} = await params;
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

    return <InteractiveExam exam={exam} courseId={courseId} />
}
