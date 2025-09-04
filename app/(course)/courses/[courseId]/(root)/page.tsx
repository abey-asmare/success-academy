import Nav from "@/app/(main)/components/Nav";
import Footer from "@/components/Footer";
import { Preview } from "@/components/preview";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Loader2 } from "lucide-react";
import { telegramLink } from "@/app/constants";

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

  const {userId} = await auth()
  let isPendingPurchase = false
  if(userId){
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        }
      }
    })
    if(purchase?.approved){
      return redirect(`/courses/${courseId}/chapters/${course.chapters[0].id}`)
    }
    isPendingPurchase = !!purchase && !purchase.approved
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
                src={course.bgImageUrl || "/bg/defaultbackground.webp"}
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
            
            {
              isPendingPurchase ? (
                <div className="ml-[12%] md:ml-[20%] space-y-2">
                <div className="bg-sky-500/70 hover:bg-sky-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 text-base w-fit flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />Pending
                </div>
                <p className="text-sm  w-[60ch] text-gray-600">Your payment is being processed, The request usually takes a only a few minutes, if the request took longer than expected, please contact us through <Link  className="text-sky-600 hover:underline" href={telegramLink}>Telegram</Link></p>
                </div>
              ) : (
                <Link
                href={`/courses/${course.id}/chapters/${course.chapters[0].id}`}
                  className="ml-[12%] md:ml-[20%] bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 text-base"
              >
                 Enroll Now
              </Link>
              )
            }
          </div>
        </div>
      </main>
      <Footer />  
    </div>
  );
}
