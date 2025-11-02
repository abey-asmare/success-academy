import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../../../components/app-sidebar";
import CourseInfoServerProvider from "./providers/CourseInfoServerProvider";

const CourseLayout = async ({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ courseId: string }>;
}) => {
  const { userId } = await auth();
  const {courseId}= await params
  if (!userId) {
    return redirect("/")
  }
  
  return (
    <CourseInfoServerProvider  userId={userId} courseId={courseId}>
      <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
        >
      <AppSidebar variant="inset"  />
      <SidebarInset>
        <SiteHeader />
            {children}
      </SidebarInset>
        </SidebarProvider>
    </CourseInfoServerProvider>
  )
}

export default CourseLayout