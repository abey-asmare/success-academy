import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "../../../components/app-sidebar";
import CourseInfoServerProvider from "./providers/CourseInfoServerProvider";

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

  // const course = await db.course.findUnique({
  //   where: {
  //     id:courseId,
  //   },
  //   include: {
  //     chapters: {
  //       where: {
  //         isPublished: true,
  //       },
  //       include: {
  //         exams: true,
  //         category: true,
  //         userProgress: {
  //           where: {
  //             userId,
  //           }, 

  //         }, 
  //       },  
  //       orderBy: {
  //         position: "asc"
  //       }
  //     },
  //   },
  // });
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