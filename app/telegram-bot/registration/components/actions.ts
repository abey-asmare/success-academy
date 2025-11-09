"use server";

import { db } from "@/lib/db";
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
  await connection()
  const isSuccessFul = formSchema.safeParse(data);
  if (!isSuccessFul) return { message: "Validation Error", status: 400 };

  let userId;
  try {
    const client = await clerkClient();

    // check if the user exists

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
    // create a profile
    await db.profile.upsert({
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
      //  fetch for telegram
      sendPurchaseRequestToTelegram(
        userId,
        data.courseId,
        data.imageUrl,
        newPurchase.id
      );
    }
    revalidateTag("page/teacher/purchases", "max");

    return { message: "Registration successful", status: 200, imageUrl: purchase?.imageUrl };
  } catch (error) {
    Sentry.captureException(error);
    return { message: "Registration failed", status: 500, imageUrl: '' };
  }
}
