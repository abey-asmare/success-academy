"use server";

import { db } from "@/lib/db";
import { checkRole } from "@/utils/roles";
import { revalidatePath, updateTag } from "next/cache";

export async function deleteSimulation(id: string) {
  const isAdmin = checkRole("admin");
  if (!isAdmin) {
    return { message: "Not Authorized" };
  }
  try {
    const exam = await db.exam.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard/teacher/simulations");
    updateTag(`exams/${id}`);
    updateTag(`courses/${exam.courseId}`);
    return { message: "Simulation deleted successfully", status: 200 };
  } catch {
    return { message: "Something went wrong", status: 500 };
  }
}
