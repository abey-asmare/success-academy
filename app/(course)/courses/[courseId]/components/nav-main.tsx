"use client"

import { ChevronRight } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { ChaptersGenericViewType } from "@/types"
import { CheckCircle, Lock, NotebookText, PlayCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCourseInfo } from "../(root)/chapters/[chapterId]/providers/CourseInfoProvider"

export function NavMain() {
  const pathname = usePathname()
  const isActive = (href: string) => pathname === href

  const {course, isLocked, chapters, progress } = useCourseInfo()

  // group chapters by category
  const grouped = chapters.reduce((acc, chapter) => {
    const cat = chapter.category?.name ?? "Uncategorized"
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(chapter)
    return acc
  }, {} as Record<string, ChaptersGenericViewType[]>)

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Videos</SidebarGroupLabel>
      <SidebarMenu>
        {Object.entries(grouped).map(([category, chapters]) => (
          <Collapsible
            key={category}
            asChild
            defaultOpen={true}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={category}>
                  <span>{category}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {chapters.map((chapter) => {
                    const href = `/courses/${course.id}/chapters/${chapter.id}`
                    return (
                      <SidebarMenuSubItem key={chapter.id}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            href={href}
                            className={cn(
                              "flex items-center gap-x-2",
                              isActive(href) &&
                                "bg-black/5 rounded-md hover:bg-black/10"
                            )}
                          >
                            {/* icon logic */}
                            {!chapter.isFree && isLocked ? (
                              <Lock />
                            ) : progress?.isCompleted ? (
                              <CheckCircle />
                            ) : (
                              <PlayCircle />
                            )}

                            <span className="truncate w-[90%]">
                              {chapter.title}
                            </span>

                            {chapter.exams.length > 0 && (
                              <Badge
                                variant="default"
                                className="bg-sky-600 hover:bg-sky-700 ml-auto"
                              >
                                <NotebookText className="h-4 w-4" />
                              </Badge>
                            )}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
