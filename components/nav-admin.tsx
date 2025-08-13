"use client";

import {
  IconDots,
  type Icon,
} from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { LucideIcon, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function NavAdmin({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: Icon | LucideIcon;
    contextOpen?: string;
    href?: string;
  }[];
}) {
  const { isMobile, toggleSidebar } = useSidebar();
  const pathname = usePathname();

  const isActive = (href: string) =>
    (pathname === "/dashboard" && href === "/dashboard") ||
    pathname === href ||
    pathname?.includes(`${href}/`);

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
              <Link href={item.url} className={cn(
                  "",
                  isActive(item.url) && "bg-black/10 rounded-md"
                )}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>

            {item.contextOpen && item.href && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction
                    showOnHover
                    className="data-[state=open]:bg-accent rounded-sm"
                  >
                    <IconDots />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-24 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem>
                    <Plus />
                    <Link href={item.href}>{item.contextOpen}</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
