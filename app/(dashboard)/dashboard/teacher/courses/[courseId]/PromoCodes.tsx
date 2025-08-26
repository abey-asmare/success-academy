"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CoursePromocode } from "@/prisma/app/generated/prisma/client";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { deletePromoCode } from "../actions";

export default function PromoCodes({
  promocodes,
  courseId,
}: {
  promocodes: CoursePromocode[];
  courseId: string;
}) {
  const router = useRouter();
  const hanleAction = async (id: string) => {};
  return (
    <div className="flex gap-3 flex-wrap">
      {promocodes.map((promocode) => (
        <Badge key={promocode.id} variant={"outline"}>
          <div className="flex flex-col gap-1">
            <p>{promocode.code}</p>

            <div className="text-xs flex flex-col">
              <span>{promocode.discount}% </span>
              <span>
                {promocode.startDate && promocode.startDate.toDateString()} -{" "}
                {promocode.expiresIn && promocode.expiresIn.toDateString()}
              </span>
            </div>
          </div>

          <form action={hanleAction.bind(null, promocode.id)}>
            <Button
              variant="ghost"
              size="icon"
              type="submit"
              className="w-fit h-fit"
              asChild
              onClick={async () => {
                toast.promise(deletePromoCode(promocode.id, courseId), {
                  loading: "Deleting promocode...",
                  success: "Promocode deleted successfully",
                  error: "Failed to delete promocode",
                });
                router.refresh();
              }}
            >
              <X width={20} height={20} />
            </Button>
          </form>
        </Badge>
      ))}
    </div>
  );
}
