import { auth } from "@clerk/nextjs/server";;
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { AppSidebar } from "../../../components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { CourseType } from "@/types";

// export type CourseType = {
//   id: string;
//   chapters: {
//     id: string;
//     title: string;
//     isPublished: boolean;
//     isFree: boolean;
//     position: number;
//     exams: {
//       id: string;
//       title: string;
//       isPublished: boolean;
//       questions: {
//         id: string;
//         title: string;
//         isPublished: boolean;
//       }[];
//     }[];
//     userProgress: {
//       id: string;
//       isCompleted: boolean;
//     }[];
//     category: {
//       id: string;
//       name: string;
//     };
//   }[];
// }

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
          category: true,
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


  return (
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