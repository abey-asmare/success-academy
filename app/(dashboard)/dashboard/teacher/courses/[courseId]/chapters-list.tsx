"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Chapter } from "@/prisma/app/generated/prisma/client";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { Grip, MoreVertical, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DeleteAlert  from "../components/DeleteAlert";


interface ChaptersListProps {
  items: Chapter[];
  onEdit: (id: string) => void;
  onReorder: (updateData: { id: string; position: number }[]) => void;
}

export default function ChaptersList({
  items,
  onEdit,
  onReorder,
}: ChaptersListProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [chapters, setChapters] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      setChapters(items);
    }
  }, [items, isMounted]);

  const router = useRouter()

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(chapters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const StartIndex = Math.min(result.source.index, result.destination.index);
    const EndIndex = Math.max(result.source.index, result.destination.index);

    const updatedChapters = items.slice(StartIndex, EndIndex + 1);
    setChapters(items);

    const bulkUpdateData = updatedChapters.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id),
    }));

    onReorder(bulkUpdateData);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-col gap-2"
          >
            {chapters.map((chapter, index) => (
              <Draggable
                key={chapter.id}
                draggableId={chapter.id}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm shadow-sm hover:shadow-md transition-shadow duration-200",
                      chapter.isPublished && "bg-blue-50 border-blue-200",
                      snapshot.isDragging && "shadow-lg"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-3 py-4 border-r border-gray-200 hover:bg-gray-50 rounded-l-lg transition-colors cursor-grab active:cursor-grabbing",
                        chapter.isPublished &&
                          "border-blue-200 hover:bg-blue-100"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-4 w-4 text-gray-400" />
                    </div>

                    <div className="flex-1 py-4 font-medium">
                      <Link href={`/dashboard/teacher/courses/${chapter.courseId}/chapters/${chapter.id}`}>
                      {chapter.title}
                      </Link>
                    </div>

                    <div className="pr-4 flex items-center gap-x-2">
                      {chapter.isFree && (
                        <Badge
                          variant="secondary"
                          className="bg-gray-100 text-gray-600 hover:bg-gray-200"
                        >
                          Free
                        </Badge>
                      )}
                      <Badge
                        className={cn(
                          "bg-gray-600 hover:bg-gray-700 text-white",
                          chapter.isPublished && "bg-blue-600 hover:bg-blue-700"
                        )}
                      >
                        {chapter.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-4 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(chapter.id)}>
                        
                                <span className="flex items-center gap-x-2 ">
                                  <span className="sr-only">Edit</span>
                                  <Pencil className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                                  Edit
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              asChild
                            >
                              <DeleteAlert onContinue={async () => {
                                toast.success(`Chapter ${chapter.title} is queued for deletion`)
                                await axios.delete(`/api/courses/${chapter.courseId}/chapters/${chapter.id}`)
                                router.refresh()
                              }}>
                              <Button 
                                  variant='destructive' 
                                  className="!px-2 flex items-center justify-start gap-x-2 w-full h-full bg-transparent text-red-500 hover:text-red-600 hover:bg-red-100">
                                  <span className="sr-only">Delete</span>
                                  <Trash className="w-4 h-4 hover:text-gray-700" />
                                  Delete
                              </Button>
                              </DeleteAlert>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>

            )
            
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
