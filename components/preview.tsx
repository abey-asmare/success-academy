'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'


interface PreviewProps {
  value: string
}

export const Preview = ({ value }: PreviewProps) => {
  return (
    <div className="bg-white p-4 rounded shadow prose max-w-none">
      <ReactMarkdown>{value}</ReactMarkdown>
    </div>
  )
}