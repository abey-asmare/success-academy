import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

const { logger } = Sentry;

export async function GET() {
  // Get the currently signed-in user's ID
 try{
    const { userId } = await auth();
    if (!userId) {
      logger.warn(`[PROFILE_GET]: Unauthorized: User is not signed in`)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    // Get the full user object from Clerk
    const user = await currentUser();
    if (!user) {
      logger.warn(`[PROFILE_GET]: User not found`)
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }
  
    // check if the profile exists
    const isExist = await db.profile.findUnique({
        where: {
            userId
        }
    })
    if(isExist){
        return NextResponse.json({message: "Profile already exists"})
    }
    // Create or update the Profile in Prisma
    await db.profile.upsert({
      where: { userId },
      update: {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.emailAddresses[0]?.emailAddress || "",
      },
      create: {
        userId,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.emailAddresses[0]?.emailAddress || "",
      },
    });
  
    logger.info(`[PROFILE_GET]: OK: Profile updated/created successfully for user ${userId}`)
    return NextResponse.json({message: "Profile created successfully"})
 }catch(error){
    logger.error(`[PROFILE_GET]: Internal Error: Failed to update/create profile ${error}`)
    Sentry.captureException(error)
    return NextResponse.json({message: "Something went wrong"})
 }
}
