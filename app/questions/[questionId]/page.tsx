import React from 'react'

export default function QuestionDetailPage({ params }: { params: { questionId: string } }) {
  return (
    <div>
      {params.questionId}
    </div>
  )
}
