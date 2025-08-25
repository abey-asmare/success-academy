
import { logger, Sentry } from "./sentryLogger";
import { db } from "./db";
import { NextResponse } from "next/server";

const getCourseOr404 = async (id: string) => {
        // get the course 
            const course = await db.course.findUnique({
                where: {
                  id
                },
                select: {
                  title: true,
                },
            });
            return course
}

async function getProfileOr404(userId: string) {
    return await db.profile.findUnique({
        where: {
            userId,
        },
        select: {
            firstName: true,
            lastName: true,
            email: true,
            phone_number: true,
        }
    });
}




export async function sendPurchaseRequestToTelegram(userId: string, courseId: string, imageUrl: string, purchaseId: string) {
try {
    const course = await getCourseOr404(courseId);
    // get the course profile
    const profile = await getProfileOr404(userId);


    // send request
    fetch(process.env.API_APPROVE_REQUEST_ENDPOINT!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        email: profile?.email,
        phone_number: profile?.phone_number,
        imageUrl,
        courseName: course?.title,
        purchaseId,
      }),
    });
    logger.info(
      `[COURSE_ID_PURCHASE_POST]: OK: Course ${courseId} purchased sent to telegram successfully.`
    );
  } catch (error) {
    logger.error(
      `[COURSE_ID_PURCHASE_POST]: Internal Error: Failed while sending purchase request to telegram ${courseId} ${error}`
    );
    Sentry.captureException(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}   

