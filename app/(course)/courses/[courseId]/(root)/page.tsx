import Nav from "@/app/(main)/components/Nav";
import Footer from "@/components/Footer";
import { Preview } from "@/components/preview";
import { db } from "@/lib/db";
import Image from "next/image";
import { notFound } from "next/navigation";
import CourseBuyButton from "./chapters/components/CourseBuyButton";
import { cache } from "react";
import { Metadata } from "next";

type Props = { params: Promise<{ courseId: string }> };

const getCourses = cache(async (courseId: string)=> {
  return await db.course.findUnique({
    where: { id: courseId, isPublished: true },
    include: { chapters: true },
  });
})


export async function generateStaticParams() {
  return []
}


export async function generateMetadata({ params }: Props): Promise<Metadata>{
  const {courseId} = await params;
  const course = await getCourses(courseId)
  return {
    title: course?.title || "Success Academy", 
    description: course?.description || "Success Academy",
    openGraph: {
      title: course?.title || "Success Academy",
      description: course?.description || "Success Academy",
      images: [
        {
          url: course?.bgImageUrl || "/bg/defaultbackground.webp",
          width: 1200,
          height: 630,
          alt: course?.title,
        },
      ],
    },
  }

}
export const dynamic = 'force-static'
export const revalidate = 2592000 // REVALIDATE_MONTHLY



export default async function CourseDetail({ params }: Props) {
  const { courseId } = await params;
  if (!courseId) return notFound();

  const course = await getCourses(courseId);

  if (!course) return notFound();

  return (
    <div>
      <Nav classname="bg-white text-black" />
      <main className="mt-16">
        <div className="relative">
          <div className="w-full h-60 overflow-hidden relative">
            <div className="w-full h-full absolute top-0 left-0 z-10">
              <Image
                className="w-full h-full"
                src={course.bgImageUrl || "/bg/defaultbackground.webp"}
                alt={course.title}
                fill
                objectFit="cover"
                priority
              />
            </div>
          </div>
          <div className="m-auto mb-10">
            <Preview value={course.description || "Course description not set"} />
              {course.chapters.length > 0 && (
              <CourseBuyButton
                courseId={course.id}
                redirectChapterId={course.chapters[0].id}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
