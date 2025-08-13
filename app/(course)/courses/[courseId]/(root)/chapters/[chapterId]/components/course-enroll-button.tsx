'use client'
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import ProfileDialogDrawerForm from "./ProfileForm";
import { useProfileEnroll } from "@/store";

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
}

export default function CourseEnrollButton({
  price,
  courseId,
}: CourseEnrollButtonProps) {
  const {setOpen} = useProfileEnroll()
  
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