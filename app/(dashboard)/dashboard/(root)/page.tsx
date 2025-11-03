import { auth } from "@clerk/nextjs/server";
import { CheckCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";

import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/courses-list";
import InfoCard from "./components/info-card";
import { cacheLife, cacheTag } from "next/cache";

export default async function Dashboard() {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
return <DashboardCourses userId={userId}/>
}


async function DashboardCourses({userId}: {userId: string}){
   "use cache";
    cacheTag(`page/${userId}/dashboard`);
    cacheLife({ stale: 60 * 10 });
  const {
    completedCourses,
    coursesInProgress,
    isVerified
  } = await getDashboardCourses(userId);
  const allCourses = [
    ...coursesInProgress.map(course => ({ ...course, isVerified })),
    ...completedCourses.map(course => ({ ...course, isVerified }))
  ];

  return (
    <div className="p-6 space-y-4"> 
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={completedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList
        items={allCourses}
      />
    </div>
  )
}