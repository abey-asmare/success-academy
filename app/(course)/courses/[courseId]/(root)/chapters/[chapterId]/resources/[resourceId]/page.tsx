import React from 'react'
import { db } from '@/lib/db'

export default async function ResourceDetailPage({params}: {params: Promise<{resourceId: string, chapterId: string, courseId: string}>}) {
    const {resourceId, chapterId, courseId} = await params 
    const resource = await db.attachment.findUnique({
        where: {
            id: resourceId,
        },
    })  
    console.log(resource)
  return (
    <div>
      {resourceId}
    </div>
  )
}
