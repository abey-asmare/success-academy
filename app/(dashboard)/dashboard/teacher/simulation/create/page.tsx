"use cache";
import { getCourses, getCoursesForAdmin } from "@/optimizedQueries/CourseQueries";
import CreateSimulationForm from "../components/CreateSimulationForm";
import { cacheLife, cacheTag } from "next/cache";

export default async function CreateSimulationPage() {
  cacheTag("teacher/simulations/create");
  cacheLife("weeks");
  const courses = await getCoursesForAdmin();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create Exam</h1>
        <p className="text-gray-600 mt-2">
          Create a simulation exam with questions and multiple choice answers
          for your course.
        </p>
      </div>

      <CreateSimulationForm
        courses={courses.map((course) => ({
          id: course.id,
          name: course.title,
        }))}
      />
    </div>
  );
}
