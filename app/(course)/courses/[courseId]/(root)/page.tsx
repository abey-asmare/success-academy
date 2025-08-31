import Nav from "@/app/(main)/components/Nav";
import Footer from "@/components/Footer";
import { Preview } from "@/components/preview";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

type Props = {
  params: Promise<{ courseId: string }>;
}

// make this page statically generated
export async function generateStaticParams() {
 const courses = await db.course.findMany({
   where: {
     isPublished: true,
   },
   select: {
     id: true,
   }
 })
 console.log("courses", courses)
 return courses  
}

export const generateMetadata = async ({ params }: Props) => {
  const { courseId } = await params;
  const course = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${courseId}`
  ).then((res) => res.json());

  return {
    title: course.title,
    description: course.description,
    openGraph: {
      title: course.title,
      images: [{ url: course.imageUrl }],
    },
  };
};

export default async function CourseDetail({
  params,
}: Props) {
  // fetch unique course
  const { courseId } = await params;
  if (!courseId) {
    return notFound();
  }

  let course;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/courses/${courseId}`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      course = null;
    } else {
      course = await res.json();
    }
  } catch (error) {
    console.error("Network or JSON error", error);
    course = null;
  }
  return (
    <div>
      <div>
      <Nav classname="bg-white text-black" />
      </div>
      <main className="mt-16">
        <div className="relative">
          <div className="w-full h-60 overflow-hidden relative">
            <div className="w-full h-full absolute top-0 left-0 z-10">
              <Image
                className="w-full h-full"
                src={course.imageUrl!}
                alt={course.title}
                fill
                objectFit="cover"
                priority
              />
            </div>
          </div>
          <div className="m-auto mb-10">
            <Preview
              value={
                course.description
                  ? course.description
                  : "Course description not set"
              }
            />  
            <Link
            href={`/courses/${course.id}/chapters/${course.chapters[0].id}`}
              className="ml-[12%] md:ml-[20%] bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 text-base"
          >
            Enroll Now
          </Link>
          </div>
        </div>
      </main>
      <Footer />  
    </div>
  );
}
