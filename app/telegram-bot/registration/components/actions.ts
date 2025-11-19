"use server";

import { db } from "@/lib/db";
import { getResourceURL } from "@/lib/s3/getChapterVideoUrl";
import { Sentry } from "@/lib/sentryLogger";
import { sendPurchaseRequestToTelegram } from "@/lib/telegram-api";
import { getPurchase } from "@/optimizedQueries/personalizedQueries";
import { Stream } from "@/prisma/app/generated/prisma/client";
import { profileFormSchema } from "@/schemas/validationSchemas";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidateTag } from "next/cache";
import { connection } from "next/server";
import z from "zod";

const formSchema = profileFormSchema.extend({
  courseId: z.string().min(1, { message: "Course is required" }),
  imageUrl: z.url({ message: "Image URL is required" }),
});
type formType = z.infer<typeof formSchema>;

export async function handleTelegramRegistration(data: formType) {
  const isSuccessFul = formSchema.safeParse(data);
  if (!isSuccessFul) return { message: "Validation Error", status: 400 };

  let userId;
  try {
    const client = await clerkClient();

    const user = await client.users.getUserList({ emailAddress: [data.email] });

    if (user.data.length > 0) {
      userId = user.data[0].id;
    } else {
      const newUser = await client.users.createUser({
        emailAddress: [data.email],
        password: await crypto.randomUUID().toString(),
      });
      userId = newUser.id;
    }
    const profile = await db.profile.upsert({
      where: { userId },
      update: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone_number: data.phoneNumber,
        stream:
          data.stream === "Natural science"
            ? Stream.NATURAL_SCIENCE
            : Stream.SOCIAL_SCIENCE,
        university: data.university,
        referrer: data.referrer,
      },
      create: {
        userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone_number: data.phoneNumber,
        stream:
          data.stream === "Natural science"
            ? Stream.NATURAL_SCIENCE
            : Stream.SOCIAL_SCIENCE,
        university: data.university,
        referrer: data.referrer,
      },
    });
    
    Sentry.logger.info("[INFO: TELEGRAM_REGISTRATION_ACTION]: new profile has been made", profile)

    const purchase = await getPurchase(userId, data.courseId);
    if (!purchase || !purchase.approved) {
      // create a purchase
      const newPurchase = await db.purchase.upsert({
        where: {
          userId_courseId: {
            userId,
            courseId: data.courseId,
          },
        },
        update: {
          imageUrl: data.imageUrl,
        },
        create: {
          userId,
          courseId: data.courseId,
          imageUrl: data.imageUrl,
        },
      });
      if (!newPurchase) {
        return { message: "Registration failed", status: 500 };
      }

      Sentry.logger.info("[INFO: TELEGRAM_REGISTRATION_ACTION]: new purchase has been made", newPurchase)
      //  fetch for telegram
      await sendPurchaseRequestToTelegram(
        userId,
        data.courseId,
        getResourceURL(data.imageUrl),
        newPurchase.id,
        profile
      );
      
      revalidateTag("page/teacher/purchases", "max");
    }
    
    Sentry.logger.info("[INFO: TELEGRAM_REGISTRATION_ACTION]: registration successful", {userId, courseId: data.courseId})
    return { message: "Registration successful", status: 200, imageUrl: purchase?.imageUrl };
  } catch (error) {
    Sentry.captureException(error);
    Sentry.logger.error("[ERROR: TELEGRAM_REGISTRATION_ACTION]: registration failed", {userId, courseId: data.courseId})
    return { message: "Registration failed", status: 500, imageUrl: '' };
  }
}
