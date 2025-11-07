import { telegramLink } from "@/app/constants";
import { getPurchase } from "@/optimizedQueries/personalizedQueries";
import { auth } from "@clerk/nextjs/server";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";

async function CourseBuyButton({
  courseId,
  redirectChapterId,
}: {
  courseId: string;
  redirectChapterId: string;
}) {
  await connection();
  const {userId} = await auth()
  if(!userId) return redirect('/sign-in')
const purchase = await getPurchase(userId, courseId)

    if (purchase?.approved) {
    return redirect(`/courses/${courseId}/chapters/${redirectChapterId}`);
  }
  return (
    <div>
      {purchase ? (
        <div className="mx-[8%] md:mx-[20%] space-y-2">
          <div className="bg-sky-500/70 hover:bg-sky-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 text-base w-fit flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Pending
          </div>
          <p className="text-sm  max-w-[60ch] text-gray-600">
            Your payment is being processed, The request usually takes only a
            few minutes, if it took longer than expected, please
            contact us through{" "}
            <Link className="text-sky-600 hover:underline" href={telegramLink}>
              Telegram
            </Link>
          </p>
        </div>
      ) : (
        <Link
          href={`/courses/${courseId}/chapters/${redirectChapterId}`}
          className="m-[8%] md:ml-[20%] bg-sky-600 hover:bg-sky-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 text-base"
        >
          Enroll Now
        </Link>
      )}
    </div>
  );
}

export default CourseBuyButton;
