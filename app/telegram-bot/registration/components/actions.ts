"use server";

import { db } from "@/lib/db";
import { profileFormSchema } from "@/schemas/validationSchemas";
import z from "zod";
import { Stream } from "@/prisma/app/generated/prisma/client";
import { clerkClient } from "@clerk/nextjs/server";
// create a user first
//  a profile
//  purchase

const formSchema = profileFormSchema.extend({
  courseId: z.string().min(1, { message: "Course is required" }),
  imageUrl: z.url({ message: "Image URL is required" }),
  password: z.string().min(8, { message: "Password is required" }),
});
type formType = z.infer<typeof formSchema>;

export async function handleTelegramRegistration(data: formType) {
  const isSuccessFul = formSchema.safeParse(data);
  if (!isSuccessFul)
    return { message: "Validation Error", status: 400 };

  let userId;
  try {
    const client = await clerkClient();

    // check if the user exists

    const user = await client.users.getUserList({emailAddress: [data.email]});

    if (user.data.length > 0) {
      userId = user.data[0].id;
    } else {
      const newUser = await client.users.createUser({
        emailAddress: [data.email],
        password: data.password,
      });
      userId = newUser.id;
    }
    console.log(userId);

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

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: data.courseId,
        },
      },
    });
    if (!purchase || !purchase.approved) {
    // create a purchase
    await db.purchase.create({
      data: {
        userId,
        courseId: data.courseId,
        imageUrl: data.imageUrl,
      },
    });
  }
    return { message: "Registration successful", status: 200 };
  } catch (error) {
    console.log(error);
    return { message: "Registration failed", status: 500 };
  }
}
