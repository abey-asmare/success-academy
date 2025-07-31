// import Navbar from "./components/navbar";
// import Sidebar from "./components/sidebar";



import { AppSidebar } from "@/components/app-sidebar"
// import { ChartAreaInteractive } from "@/components/chart-area-interactive"
// import { DataTable } from "@/components/data-table"
// import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"



export default function Layout({ children }: {children: React.ReactNode;}) {
  return (
    // <div className="h-full">
    //   <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
    //     <Navbar/>
    //   </div>
    //   <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
    //     <Sidebar/>
    //   </div>
    //     <main className="md:pl-56 pt-[80px] h-full">{children}</main>
    // </div>
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
  