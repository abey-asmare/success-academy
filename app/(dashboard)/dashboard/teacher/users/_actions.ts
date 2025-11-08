"use server";

import { db } from "@/lib/db";
import { checkRole } from "@/utils/roles";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function setRole(userId: string) {
  const client = await clerkClient();

  // Check that the user trying to set the role is an admin
  if (!checkRole("admin")) {
    return { message: "Not Authorized" };
  }

  try {
    const res = await client.users.updateUserMetadata(userId as string, {
      publicMetadata: { role: "admin" },
    });
    await db.profile.update({
      where: { userId },
      data: { role: "Admin" },
    });
    revalidatePath("/dashboard/teacher/users");
    revalidateTag("page/teacher/users", "max");

    return { message: res.publicMetadata, status: 200 };
  } catch (err) {
    return { message: err, status: 500 };
  }
}

export async function removeRole(userId: string) {
  const client = await clerkClient();

  try {
    const res = await client.users.updateUserMetadata(userId as string, {
      publicMetadata: { role: null },
    });
    await db.profile.update({
      where: { userId },
      data: { role: "User" },
    });
    revalidatePath("/dashboard/teacher/users");
    revalidateTag("page/teacher/users", "max");
    return { message: res.publicMetadata, status: 200 };
  } catch (err) {
    return { message: err, status: 500 };
  }
}
