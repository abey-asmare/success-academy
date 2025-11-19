"use server";
import { NextResponse } from "next/server";
import pRetry, { AbortError } from "p-retry";
import { db } from "./db";
import { Sentry } from "./sentryLogger";
import { getCourse } from "@/optimizedQueries/CourseQueries";
import { Profile } from "@/prisma/app/generated/prisma/client";

const getCourseOr404 = async (id: string) => {
  // get the course
  const course = await getCourse(id);
  if (!course || course.isPublished === false) {
    throw new Error("Course not found");
  }
  return course;
};

async function getProfile(userId: string) {
  return await db.profile.findUnique({
    where: {
      userId,
    },
  });
}

export async function sendPurchaseRequestToTelegram(
  userId: string,
  courseId: string,
  imageUrl: string,
  purchaseId: string,
  profile?: Profile
) {
  try {
    const course = await getCourseOr404(courseId);

    let profile_ = profile || (await getProfile(userId));
    if (!profile_) {
      throw new Error("Profile doesn't exist");
    }

    const telegramPayload = {
      firstName: profile_.firstName,
      lastName: profile_.lastName,
      email: profile_.email,
      phone_number: profile_.phone_number,
      imageUrl,
      courseName: course.title,
      purchaseId,
      date: new Date().toLocaleString("en-US", {
        timeZone: "Africa/Addis_Ababa",
      }),
    };

    const sendRequest = async () => {
      const response = await fetch(process.env.API_APPROVE_REQUEST_ENDPOINT!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(telegramPayload),
      });

      // If the request fails with a client error (4xx), we should not retry.
      if (response.status >= 400 && response.status < 500) {
        Sentry.logger.error("[ERROR: TELEGRAM_SEND_PURCHASE_REQUEST]: error", {
          response,
          telegramPayload,
        });

        // Throwing AbortError tells p-retry to stop and not try again.
        throw new AbortError(
          `Request failed with client error ${response.status}. Aborting.`
        );
      }

      // For any other non-successful response, throw a regular error to trigger a retry.
      if (!response.ok) {
        Sentry.logger.error("[ERROR: TELEGRAM_SEND_PURCHASE_REQUEST]: error", {
          response,
          telegramPayload,
        });
        throw new Error(
          `Telegram API responded with status ${response.status}`
        );
      }

      // If successful, return the result (or true)
      Sentry.logger.info("[INFO: TELEGRAM_SEND_PURCHASE_REQUEST]: success", {
        response,
        telegramPayload,
      });
      return true;
    };

    await pRetry(sendRequest, {
      retries: 4, // retries
      factor: 2, //  exponential backoff factor
      minTimeout: 2000, // minimum timeout 2s
      onFailedAttempt: (error) => {
        Sentry.logger.error(
          "[ERROR: TELEGRAM_SEND_PURCHASE_REQUEST_FAILED_ATTEMPT]: error",
          { error }
        );
        Sentry.captureException(error);
      },
    });
  } catch (error) {
    Sentry.logger.info(
      "[INFO: TELEGRAM_SEND_PURCHASE_REQUEST]: unexpected thing happened",
      { error }
    );
    Sentry.captureException(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
