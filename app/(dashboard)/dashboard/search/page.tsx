import { getCoursesForUser } from "@/actions/get-courses";
import { CoursesList } from "@/components/courses-list";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Our Courses",
};

const SearchPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  return <SearchPageCoursesContent userId={userId} />;
};

async function SearchPageCoursesContent({
  userId,
}: {
  userId: string;
}) {
 "use cache";
  cacheTag(`page/${userId}/search`);
  cacheLife({ stale: 60 * 10 });
    const courses = await getCoursesForUser(userId);
  return (
    <div className="p-6 space-y-4">
      <div className="font-bold text-4xl text-black/90">Courses</div>
      <CoursesList items={courses} />
    </div>
  );
};

export default SearchPage;
