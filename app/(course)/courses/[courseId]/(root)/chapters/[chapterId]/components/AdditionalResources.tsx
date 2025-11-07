"use client";
import { Preview } from "@/components/preview";
import { Card } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { File, Loader2 } from "lucide-react";
import CourseEnrollButton from "./course-enroll-button";
import { CourseProgressButton } from "./course-progress-button";

import { Button } from "@/components/ui/button";
import {
  Attachment,
  Chapter,
  CoursePromocode,
} from "@/prisma/app/generated/prisma/client";
import { ChaptersGenericViewType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useCourseInfo } from "../providers/CourseInfoProvider";
import { CourseGenericViewType } from "@/optimizedQueries/CourseQueries";

function AdditionalResources({
  course,
  chapter,
  nextChapter,
  promocodes,
  attachments,
}: {
  course: CourseGenericViewType;
  chapter: ChaptersGenericViewType;
  nextChapter: Chapter | null;
  promocodes: CoursePromocode[];
  attachments: Attachment[];
}) {
  const { purchase, progress: userProgress } = useCourseInfo();
  
  return (
    <div>
      <div className="p-4 flex flex-col md:flex-row items-center justify-between">
        <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
        {!purchase ? (
          <CourseEnrollButton
            courseId={course.id}
            price={course.price!}
            promoCodes={promocodes.map((promo) => ({
              code: promo.code,
              discount: promo.discount,
            }))}
          />
        ) : purchase.approved ? (
          <div className="flex flex-wrap items-center gap-2">
            {chapter.exams?.map((exam, index) => (
              <Button
                key={exam.id}
                className="mr-2 bg-sky-500 text-white hover:bg-sky-600 transition-colors duration-200"
              >
                <Link
                  href={`/courses/${course.id}/chapters/${chapter.id}/exams/${exam.id}`}
                >
                  take exam {chapter.exams?.length > 1 ? index + 1 : ""}
                </Link>
              </Button>
            ))}
            <CourseProgressButton
              chapterId={chapter.id}
              courseId={course.id}
              nextChapterId={nextChapter?.id}
              isCompleted={!!userProgress?.isCompleted}
            />
          </div>
        ) : (
          <div className="bg-sky-500/70 hover:bg-sky-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 text-base w-fit flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Pending
          </div>
        )}
      </div>
      <Separator />
      <div>
        <Preview value={chapter.description!} />
      </div>
      {purchase?.approved && (
        <>
          <Separator />
          <div className="p-4 space-y-2 ">
            {attachments.map((attachment) => (
              <Link
                href={`/courses/${course.id}/chapters/${chapter.id}/resources/${attachment.id}`}
                target="_blank"
                key={attachment.id}
                className="flex items-center p-3 rounded-sm w-full bg-sky-200 text-sky-700 hover:underline"
              >
                <File />
                <p className="line-clamp-1">{attachment.name}</p>
              </Link>
            ))}
          </div>
          <div className="space-y-6 px-4">
            <h1 className="text-xl md:text-3xl font-semibold text-[#181818]">
              Simulations
            </h1>
            {/* card simulation */}
            <div
              id="simulations"
              className="flex gap-6 items-center flex-wrap w-full "
            >
              {course.exams?.length === 0 && (
                <p className="text-center text-gray-400 font-semibold">
                  No Simulations yet. Keep tuned.
                </p>
              )}
              {course.exams?.map((exam) => (
                <Card
                  key={exam.id}
                  className="p-4 border-2 border-gray-200 w-full max-w-[220px] transition-all duration-300 hover:shadow-lg hover:border-gray-300 hover:-translate-y-1"
                >
                  <div className="wrapper rounded-md overflow-hidden w-full h-[160px] object-cover overflow-hidden">
                    <Image
                      src={course.imageUrl!}
                      alt={exam.name}
                      width={220}
                      height={160}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </div>
                  <div className="description">
                    <h3 className="font-semibold">{exam.name}</h3>
                    <p className="text-gray-500 line-clamp-3">
                      {exam.description}
                    </p>
                    <Button
                      size="sm"
                      className="enroll-in px-4 py-1 font-semibold bg-primary-500 hover:bg-primary-600 rounded-md mt-2"
                    >
                      <Link
                        href={`/courses/${course.id}/simulations/${exam.id}`}
                      >
                        take simulation
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdditionalResources;
