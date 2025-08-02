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
        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
          {chapters.map((chapter, index) => (
            <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
              {(provided, snapshot) => (
                <div
                  className={cn(
                    "flex items-center gap-x-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm shadow-sm hover:shadow-md transition-shadow duration-200",
                    chapter.isPublished && "bg-blue-50 border-blue-200",
                    snapshot.isDragging && "shadow-lg",
                  )}
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                >
                  <div
                    className={cn(
                      "px-3 py-4 border-r border-gray-200 hover:bg-gray-50 rounded-l-lg transition-colors cursor-grab active:cursor-grabbing",
                      chapter.isPublished && "border-blue-200 hover:bg-blue-100",
                    )}
                    {...provided.dragHandleProps}
                  >
                    <Grip className="h-4 w-4 text-gray-400" />
                  </div>

                  <div className="flex-1 py-4 font-medium">{chapter.title}</div>

                  <div className="pr-4 flex items-center gap-x-2">
                    {chapter.isFree && (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-200">
                        Free
                      </Badge>
                    )}
                    <Badge
                      className={cn(
                        "bg-gray-600 hover:bg-gray-700 text-white",
                        chapter.isPublished && "bg-blue-600 hover:bg-blue-700",
                      )}
                    >
                      {chapter.isPublished ? "Published" : "Draft"}
                    </Badge>
                    <button
                      onClick={() => onEdit(chapter.id)}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                    </button>
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
