import Nav from "@/app/(main)/components/Nav";
import Footer from "@/components/Footer";
import { Preview } from "@/components/preview";
import { getCourse } from "@/optimizedQueries/CourseQueries";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import CourseBuyButton from "./chapters/components/CourseBuyButton";

type Props = { params: Promise<{ courseId: string }> };


export async function generateStaticParams() {
  return [{courseId: '__placeholder__'}]
}


// export async function generateMetadata({ params }: Props): Promise<Metadata>{
//   const {courseId} = await params;
//   const course = await getCourse(courseId)
//   return {
//     title: course?.title || "Success Academy", 
//     description: course?.description || "Success Academy",
//     openGraph: {
//       title: course?.title || "Success Academy",
//       description: course?.description || "Success Academy",
//       images: [
//         {
//           url: course?.bgImageUrl || "/bg/defaultbackground.webp",
//           width: 1200,
//           height: 630,
//           alt: course?.title,
//         },
//       ],
//     },
//   }

// }


export default async function CourseDetail({ params }: Props) {
  const { courseId } = await params;
  if (!courseId || courseId === '__placeholder__') return notFound();
  
  const course = await getCourse(courseId);

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
              {course.chapters!.length! > 0 && (
              <CourseBuyButton
                courseId={course.id}
                redirectChapterId={course.chapters![0].id}
              />  
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
