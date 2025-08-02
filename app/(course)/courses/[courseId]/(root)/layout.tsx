import { auth } from "@clerk/nextjs/server";;
import { redirect } from "next/navigation";

import { db } from "@/lib/db";

import { getProgress } from "@/actions/get-progress";

import { CourseSideBar } from "../components/course-sidebar";
import { CourseNavbar } from "../components/course-navbar";
import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "../components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";


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
}

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

  const course = await db.course.findUnique({
    where: {
      id:courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          exams: true,
          userProgress: {
            where: {
              userId,
            }, 

          }, 
        },  
        orderBy: {
          position: "asc"
        }
      },
    },
  });

  if (!course) {
    return redirect("/");
  }

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id,
        }
      }
    });

  const progressCount = await getProgress(userId, course.id);

  return (

    // <div className="h-full">
    //   <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
    //     <CourseNavbar
    //       course={course}
    //       progressCount={progressCount!}
    //     />
    //   </div>
    //   <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">    
    //     <CourseSideBar
    //       course={course}
    //       progressCount={progressCount!}
    //     />
    //   </div>
    //   <main className="md:pl-80 pt-[80px] h-full">
    //     {children}
    //   </main>
    // </div>
    <SidebarProvider
    style={
      {
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      } as React.CSSProperties
    }
  >
    <AppSidebar variant="inset" course={course as unknown as CourseType}     
    isLocked={!purchase || !purchase.approved} />
    <SidebarInset>
      <SiteHeader />
          {children}
    </SidebarInset>
  </SidebarProvider>
  )
}

export default CourseLayout