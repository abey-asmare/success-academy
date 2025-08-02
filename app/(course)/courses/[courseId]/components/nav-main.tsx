"use client"


import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Lock, NotebookText, PlayCircle, CheckCircle } from "lucide-react"



export type CourseType = {
  id: string;
  chapters: {
    id: string;
    title: string;
    isPublished: boolean;
    isFree: boolean;
    position: number;
    exams: {
      id: string;
      title: string;
      isPublished: boolean;
      questions: {
        id: string;
        title: string;
        isPublished: boolean;
      }[];
    }[];
    userProgress: {
      id: string;
      isCompleted: boolean;
    }[];
  }[];
}


export function NavMain({
  course,
  isLocked,
}: {
  course: CourseType
  isLocked: boolean
}) {

  const pathname = usePathname();
  
  const isActive = (href: string)=> {
    return pathname === href

  }



  return (
    <SidebarGroup>
      <SidebarGroupLabel>Videos</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {course.chapters.map((chapter) => (
            <Link href={`/courses/${course.id}/chapters/${chapter.id}`} key={chapter.title}
            className={cn('', 
              isActive(`/courses/${course.id}/chapters/${chapter.id}`) && 'bg-black/5 rounded-md')}
            >
              <SidebarMenuItem className="relative">
                <SidebarMenuButton tooltip={chapter.title}
                className={cn(
                  "flex items-center gap-x-2",
                  isActive(`/courses/${course.id}/chapters/${chapter.id}`) && "bg-black/5 hover:bg-black/10",
                )}
                >
                  {!chapter.isFree && isLocked ? <Lock /> : (chapter.userProgress?.[0]?.isCompleted ? <CheckCircle /> : <PlayCircle />)}

                  {/* if chanpter has an exam */}
                  <p className="overflow-hidden text-overflow text-clip line-clamp-1 w-[90%]">{chapter.title}</p>
                  {chapter.exams.length > 0 && (
         <Badge variant="default" className="bg-sky-600 hover:bg-sky-700 absolute right-2 z-10">
          <NotebookText />
         </Badge>
        )}

                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
