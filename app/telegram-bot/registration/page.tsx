'use cache'
import { cacheLife, cacheTag } from "next/cache";
import RegistrationForm from "./components/RegistrationForm";
import { db } from "@/lib/db";

export default async function BotRegisterationPage() {
  cacheTag('courses/telegram-registration')
  cacheLife('days')
  const courses = await db.course.findMany({
    where: {
    isPublished: true 
    },
    include: {
      promocodes: true
    }

  });

  return (
    <div className="py-10">
      <RegistrationForm courses={courses}/>
    </div>
  );
}


// export const dynamic = 'force-dynamic';
