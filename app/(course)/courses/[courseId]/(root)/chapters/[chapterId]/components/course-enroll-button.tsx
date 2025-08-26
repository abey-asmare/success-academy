"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";
import { useProfileEnroll } from "@/store";
import { useState } from "react";
import ProfileDialogDrawerForm from "./ProfileForm";

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
  promoCodes: { code: string; discount: number }[];
}

export default function CourseEnrollButton({
  price,
  courseId,
  promoCodes,
}: CourseEnrollButtonProps) {
  const { setOpen } = useProfileEnroll();
  const [promo, setPromo] = useState("");

  const promoCode = promoCodes.find(
    (p) => p.code.toUpperCase() === promo.toUpperCase()
  );

  const currentPrice = promoCode
    ? price - (price * promoCode.discount) / 100
    : price;

  return (
    <div className="flex justify-end items-center gap-2">
      <Input
        variant={promoCode ? "success" : "error"}
        placeholder="Do you have a promocode?"
        value={promo}
        onChange={(e) => setPromo(e.target.value)}
      />
      <Button
        className="font-semibold bg-sky-500 hover:bg-sky-600"
        onClick={() => setOpen()}
      >
        Enroll for {formatPrice(currentPrice)}
      </Button>
      <ProfileDialogDrawerForm />
    </div>
  );
}
