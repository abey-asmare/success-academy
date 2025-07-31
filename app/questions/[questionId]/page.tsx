import React from 'react'

export default async function QuestionDetailPage({ params }: { params: Promise<{ questionId: string }> }) {
    const {questionId} = await params
  return (
    <div>
      {questionId}
    </div>
  )
}
