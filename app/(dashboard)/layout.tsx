import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


export default async function Layout({ children }: {children: React.ReactNode;}) {
  const {userId} = await auth()
  if(!userId)
    return redirect('/sign-in')
  return (
    <SidebarProvider
    style={
      {
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties
    }
  >
    <AppSidebar variant="inset" />
    <SidebarInset>
      <SiteHeader />
          {children}
    </SidebarInset>
  </SidebarProvider>
  )
}
  