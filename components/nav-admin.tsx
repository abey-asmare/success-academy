"use client";

import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavAdmin({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: Icon | LucideIcon;
  }[];
}) {
  const { isMobile, toggleSidebar } = useSidebar();
  const pathname = usePathname();

  const isActive = (href: string) =>
    (pathname === "/dashboard" && href === "/dashboard") ||
    pathname === href ||
    pathname?.startsWith(`${href}/dashbaord`);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Admin</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              onClick={() => isMobile && toggleSidebar()}
            >
              <Link
                href={item.url}
                className={cn(
                  "",
                  isActive(item.url) && "bg-black/10 rounded-md"
                )}
              >
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
