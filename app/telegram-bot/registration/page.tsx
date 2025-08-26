import RegistrationForm from "./components/RegistrationForm";
import { db } from "@/lib/db";

export default async function BotRegisterationPage() {

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

export const dynamic = 'force-dynamic';
