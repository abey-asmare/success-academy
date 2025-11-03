"use cache";
import { db } from "@/lib/db";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { cacheLife, cacheTag } from "next/cache";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "moderator" | "User";
};
const SimulationPage = async () => {
  cacheTag("teacher/simulations");
  cacheLife("weeks");
  const exams = await db.exam.findMany({
    where: {
      isSimulation: true,
    },
    include: {
      course: true,
    },
  });
  const examCourses = exams.map((item) => ({
    id: item.id,
    name: item.name,
    course: item.course?.title ?? "Unknown Course",
    updatedAt: item.updatedAt.toDateString(),
    courseId: (item.course && item.course.id) || "not exist",
  }));
  return (
    <div className="p-6">
      <DataTable
        columns={columns}
        data={examCourses}
        totalCount={examCourses.length}
      />
    </div>
  );
};

export default SimulationPage;
