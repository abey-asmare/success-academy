"use client";

import { IconChartBar, IconUsers } from "@tabler/icons-react";
import * as React from "react";

import { NavMain } from "./nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Compass, Home, Layout, List, WalletCards } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { RouteSwither } from "./route-switcher";

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
};

const data = {
  routes: [
    {
      icon: Home,
      title: "Success Academy",
      url: "/",
    },
    {
      icon: Layout,
      title: "Dashboard",
      url: "/dashboard",
    },
    {
      icon: Compass,
      title: "Browse",
      url: "/dashboard/search",
    },
    {
      icon: List,
      title: "Courses",
      url: "/dashboard/teacher/courses",
    },
    {
      icon: IconUsers,
      title: "Users",
      url: "/dashboard/teacher/users",
    },
    {
      icon: WalletCards,
      title: "Payments",
      url: "/dashboard/teacher/payment",
    },
    {
      icon: IconChartBar,
      title: "Analytics",
      url: "/dashboard/teacher/analytics",
    },
  ],
};

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  course: CourseType;
  isLocked: boolean;
}) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarHeader>
          <RouteSwither data={data.routes} /> 
        </SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <NavMain course={props.course} isLocked={props.isLocked}/>
      </SidebarContent>
    </Sidebar>
  );
}
