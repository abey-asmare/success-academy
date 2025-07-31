'use client'
import { Chapter } from '@/prisma/app/generated/prisma/client'
import { useEffect, useState } from 'react'
import {DragDropContext, DropResult, Droppable, Draggable} from '@hello-pangea/dnd'
import { cn } from '@/lib/utils'
import {Badge} from '@/components/ui/badge'
import { Grip, Pencil } from 'lucide-react'

interface ChaptersListProps {
    items: Chapter[]        
    onEdit: (id: string) => void
    onReorder: (updateData: {id: string, position: number}[]) => void
}

export default function ChaptersList({items, onEdit, onReorder}: ChaptersListProps) {

    const [isMounted, setIsMounted] = useState(false)
    const [chapters, setChapters] = useState(items)
    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if(isMounted){
            setChapters(items)
        }
    }, [items, isMounted]) 


    const onDragEnd = (result: DropResult) => {
        if(!result.destination) return;
        const items  = Array.from(chapters)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        const StartIndex = Math.min(result.source.index, result.destination.index)
        const EndIndex = Math.max(result.source.index, result.destination.index)


        const updatedChapters = items.slice(StartIndex, EndIndex + 1)
        setChapters(items)

        const bulkUpdateData = updatedChapters.map((chapter) => ({
            id: chapter.id,
            position: items.findIndex(item => item.id === chapter.id)
        }))

        onReorder(bulkUpdateData)
    }
  return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="chapters">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
               {chapters.map((chapter, index) => (
                <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                  {(provided) => (
                    <div
                    className={cn('flex itesms-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm',
                    chapter.isPublished && 'bg-sky-100 border-sky-100',
                         index !== chapters.length - 1 && 'mb-2')}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    >
                        <div className={cn('px-2 py-3 border-4 border-r-slate-200 hover:bg-slate-300 rounded-l-md transition', chapter.isPublished && 'border-r-sky-200 hover:bg-sky-200')} {...provided.dragHandleProps}>
                            <Grip className='h-5 w-5 '/>
                        </div>
                       {chapter.title} 
                       <div className="ml-auto pr-2 flex items-center gap-x-2">
                        {chapter.isFree &&(
                            <Badge>Free</Badge>
                        )}
                        <Badge className={cn('bg-slate-500', chapter.isPublished && "bg-sky-700")}>
                            {chapter.isPublished ? 'Published' : 'Draft'}
                        </Badge>
                        <Pencil onClick={()=> onEdit(chapter.id)} className="cursor-pointer w-4 h-4 hover:opacity-75 transition" />
                       </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
  )
}
