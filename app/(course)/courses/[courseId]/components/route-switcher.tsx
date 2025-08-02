"use client"

import * as React from "react"
import { ChevronsUpDown } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import useRole from "@/utils/useRole"

export function RouteSwither({
  data,
}: {
  data: {
    title: string
    icon: React.ElementType
    url: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const role = useRole()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden">
                <Image
                  className="h-full w-full object-cover"
                  src="/images/success_academy-logo.png"
                  alt="Logo"
                  width={30}
                  height={30}
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Success Academy</span>
                <span className="truncate text-xs">/</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Routes
            </DropdownMenuLabel>
            {role === 'admin' && data.map((route) => (
              <DropdownMenuItem
                key={route.title}
                className="gap-2 p-2"
                asChild
              >
                <Link href={route.url}>
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    <route.icon className="size-3.5 shrink-0" />
                  </div>
                  {route.title}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
