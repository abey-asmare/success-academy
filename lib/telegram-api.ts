'use server'
import { NextResponse } from "next/server";
import pRetry, { AbortError } from 'p-retry';
import { db } from "./db";
import { logger, Sentry } from "./sentryLogger";


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
    const profile = await getProfileOr404(userId);

    const telegramPayload = {
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      email: profile?.email,
      phone_number: profile?.phone_number,
      imageUrl,
      courseName: course?.title,
      purchaseId,
      date: new Date().toLocaleString("en-US", {
        timeZone: "Africa/Addis_Ababa",
      }),
    };

    const sendRequest = async () => {
      logger.info(`[TELEGRAM_SEND]: Attempting to send purchaseId ${purchaseId}...`);

      const response = await fetch(process.env.API_APPROVE_REQUEST_ENDPOINT!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(telegramPayload),
      });

      // If the request fails with a client error (4xx), we should not retry.
      if (response.status >= 400 && response.status < 500) {
        // Throwing AbortError tells p-retry to stop and not try again.
        throw new AbortError(`Request failed with client error ${response.status}. Aborting.`);
      }

      // For any other non-successful response, throw a regular error to trigger a retry.
      if (!response.ok) {
        throw new Error(`Telegram API responded with status ${response.status}`);
      }
      
      // If successful, return the result (or true)
      return true;
    };

    await pRetry(sendRequest, {
      retries: 3, // retries
      factor: 2,  //  exponential backoff factor
      minTimeout: 1000, // minimum timeout 1s
      onFailedAttempt: (error) => {
        // executed on each failed attempt
        logger.warn(
          `[TELEGRAM_SEND]: Attempt ${error.attemptNumber} failed for purchaseId ${purchaseId}. There are ${error.retriesLeft} retries left. Reason: ${error}`
        );
      },
    });

    logger.info(`[TELEGRAM_SEND]: Successfully sent purchaseId ${purchaseId} after retries.`);

  } catch (error) {
    logger.error(`[COURSE_ID_PURCHASE_POST]: Final Error: Failed to send purchase request to telegram for ${purchaseId}. ${error}`);
    Sentry.captureException(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

