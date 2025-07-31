"use client"

import {
  IconChartBar,
  IconUsers
} from "@tabler/icons-react"
import * as React from "react"

import { NavAdmin } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Compass, Layout, List, WalletCards } from "lucide-react"
import Link from "next/link"

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
        icon: IconChartBar,
        title: 'Analytics',
        url: '/dashboard/teacher/analytics',
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

]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavAdmin items={data.teacherRotues} />
        {/* <NavSecondary items={data.teacherRotues} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
    </Sidebar>
  )
}
