
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";
import Link from "next/link";

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
}

export default function CourseEnrollButton({
  price,
  courseId,
}: CourseEnrollButtonProps) {


  
  return (
    <Button className="font-semibold bg-sky-500 hover:bg-sky-600">
    <Link 
    href={`/courses/${courseId}/checkout`}
    className="md:w-auto"
    >
      Enroll for {formatPrice(price)}
    </Link  >
      </Button>
  )
}