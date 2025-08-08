'use client'
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import { useEffect, useState } from "react";
import ProfileDialogDrawerForm from "./ProfileForm";
import { useProfileEnroll } from "@/store";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
}

export default function CourseEnrollButton({
  price,
  courseId,
}: CourseEnrollButtonProps) {
  const {setOpen} = useProfileEnroll()
  const router = useRouter()
  const onSuccess = ()=> {
    router.push(`/courses/${courseId}/checkout`)
  }

  return (
    <>
    <Button className="font-semibold bg-sky-500 hover:bg-sky-600" onClick={() => setOpen()}>
    {/* <Link 
    href={`/courses/${courseId}/checkout`}
    className="md:w-auto"
    > */}
      Enroll for {formatPrice(price)}
      </Button>   
      <ProfileDialogDrawerForm/>
    </>
  )
}