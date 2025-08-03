"use client"

import {
  IconUsers
} from "@tabler/icons-react"
import * as React from "react"

import { NavAdmin } from "@/components/nav-admin"
import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"
import { BookOpen, Compass, Layout, List, WalletCards } from "lucide-react"
import Link from "next/link"

import useRole from "@/utils/useRole"
import Image from "next/image"

const data = {
  guestRoutes: [
    {
        icon: Layout,
        title: 'Dashboard',
        url: '/dashboard',
    }, 
    {
        icon: Compass,
        title: 'Browse',
        url: '/dashboard/search',
    }, 
], 
teacherRotues: [ 
    {
        icon: List,
        title: 'Courses',
        url: '/dashboard/teacher/courses',
    }, 
    {
      icon: IconUsers,
      title: 'Users',
      url: '/dashboard/teacher/users',
    },
    {
      icon: WalletCards,
      title: 'Payments',
      url: '/dashboard/teacher/payment',
    },
    {
      icon: BookOpen,
      title: 'Simulations',
      url: '/dashboard/teacher/simulation',
      contextOpen: 'Create Simulation',
      href: '/dashboard/teacher/simulation/create'
    },
    // {
    //     icon: IconChartBar,
    //     title: 'Analytics',
    //     url: '/dashboard/teacher/analytics',
    // }, 

]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const role = useRole()
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="#">
                <Image src="/images/success_academy-logo.png" alt="Logo" width={30} height={30} />
                <span className="text-base font-semibold">Success Academy</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.guestRoutes} />
        {
          role === 'admin' && (
            <NavAdmin items={data.teacherRotues} />
          )
        }
      </SidebarContent>
    </Sidebar>
  )
}
