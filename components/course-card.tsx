import Image from "next/image";
import Link from "next/link";
import { BookOpen, LoaderCircle } from "lucide-react";

import { formatPrice } from "@/lib/format";
import IconBadge from "@/components/icon-badge";
import { CourseProgress } from "@/components/course-progress";
import { Button } from "@/components/ui/button";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;
  progress: number | null;
  isVerified: boolean;
}

export const CourseCard = async ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  progress,
  isVerified,
}: CourseCardProps) => {
  const hasProgress = progress !== null;

  return (
    <Link href={`/courses/${id}`} className="block">
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-2xl p-3 h-full">
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
          <Image
            fill
            className="object-cover"
            alt={title}
            src={imageUrl}
            priority
          />
        </div>

        <div className="flex flex-col pt-2">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition dark:group-hover:text-sky-500 line-clamp-2">
            {title}
          </div>

          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {chaptersLength}{" "}
                {chaptersLength === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>

          {/* Render logic */}
          {hasProgress ? (
            isVerified ? (
              <CourseProgress
                variant={progress === 100 ? "success" : "default"}
                size="sm"
                value={progress}
              />
            ) : (
              <>
                <p className="text-md md:text-sm h-4 font-medium text-slate-700"></p>
                <Button
                  disabled
                  className="w-full mt-2 bg-sky-600 hover:bg-sky-700"
                  size="sm"
                >
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Processing Payment
                </Button>
              </>
            )
          ) : (
            <>
              <p className="text-md md:text-sm font-medium text-slate-700">
                {formatPrice(price)}
              </p>
              <Button
                className="w-full mt-2 bg-sky-600 hover:bg-sky-700"
                size="sm"
              >
                Enroll
              </Button>
            </>
          )}
        </div>
      </div>
    </Link>
  );
};
