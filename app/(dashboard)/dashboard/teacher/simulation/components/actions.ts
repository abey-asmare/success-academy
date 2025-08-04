"use server";

import { checkRole } from "@/utils/roles";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteSimulation(id: string) {
    const isAdmin = checkRole("admin");
    if (!isAdmin) {
        return { message: "Not Authorized" };
    }
  try {
     await db.exam.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard/teacher/simulations");
    return { message: "Simulation deleted successfully", status: 200 };
  } catch {
    return { message: "Something went wrong", status: 500 };
  }
}
