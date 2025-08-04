import React from 'react'
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import InteractiveSimulation from '../InteractiveSimulation';

export default async function SimulationDetailPage({params}: {params: Promise<{simulationId: string}>}) {
    const {simulationId: examId} = await params;
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
        return notFound()   
    }

    return <InteractiveSimulation exam={exam} />
}
