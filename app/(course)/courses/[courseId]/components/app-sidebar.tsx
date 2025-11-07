"use client";
import { IconUsers } from "@tabler/icons-react";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { BookOpen, Compass, Home, Layout, List, WalletCards } from "lucide-react";
import { NavMain } from "./nav-main";
import { RouteSwitcher } from "./route-switcher";

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
      icon: BookOpen,
      title: "Simulations",
      url: "/dashboard/teacher/simulation",
    },
  ],
};

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & {
}) {

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarHeader>
          <RouteSwitcher data={data.routes} /> 
        </SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <NavMain/>
      </SidebarContent>
    </Sidebar>
  );
}
