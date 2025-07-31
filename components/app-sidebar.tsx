"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { BarChart, Compass, Layout, List, User, WalletCards } from "lucide-react"
import Link from "next/link"

import Image from "next/image"

const data = {
  documents: [
    {
      title: "Data Library",
      url: "#",
      icon: IconDatabase,
    },
    {
      title: "Reports",
      url: "#",
      icon: IconReport,
    },
    {
      title: "Word Assistant",
      url: "#",
      icon: IconFileWord,
    },
  ],

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
        <NavDocuments items={data.teacherRotues} />
        {/* <NavSecondary items={data.teacherRotues} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
    </Sidebar>
  )
}
