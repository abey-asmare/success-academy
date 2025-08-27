import { auth } from "@clerk/nextjs/server";;
import { redirect } from "next/navigation";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses-list";
import {Metadata} from "next"

export const metadata : Metadata = {
   title: "Our Courses", 
}


interface SearchPageProps {
  searchParams: Promise<{
    title: string;
    categoryId: string;
  }>
};

const SearchPage = async ({
  searchParams
}: SearchPageProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const {title, categoryId} = await searchParams
  const courses = await getCourses({
    userId,
    title,
    categoryId,
  });

  return (
      <div className="p-6 space-y-4">
        <div className="font-bold text-4xl text-black/90">
          Courses
        </div>
        <CoursesList items={courses} />
      </div>
  );
}

export default SearchPage;