import Image from "next/image"
import { Card } from "./ui/card"

export function CourseCard(){
return (
<Card className="p-4 border-2 border-gray-200 w-full max-w-[280px] transition-all duration-300 hover:shadow-lg hover:border-gray-300 hover:-translate-y-1">
<div className="wrapper rounded-md overflow-hidden w-full">
  <Image
    src="/images/getting-started-1.jpg"
    alt="Course 1"
    width={500}
    height={500}
    className="w-full h-full"
  />
</div>
<div className="description space-y-4">
  <h3 className="font-semibold">Freshman</h3>
  <p className="text-gray-500">
    12 Chapters. 4 Tests. 30+ resources
  </p>
  <button className="enroll-in px-4 py-2 font-semibold bg-primary-500 rounded-md text-white">
    Enroll
  </button>
</div>
</Card>
)
}

