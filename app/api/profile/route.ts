import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";


// ready to be depricated

export async function GET() {
  // Get the currently signed-in user's ID
 try{
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const user = await currentUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }
  
    // // check if the profile exists
    // const isExist = await db.profile.findUnique({
    //     where: {
    //         userId
    //     }
    // })
    // if(isExist){
    //     return NextResponse.json({message: "Profile already exists"})
    // }

    // using upsert as findOrCreate method 
    const profile = await db.profile.upsert({
      where: { userId },
      update: {
        // firstName: user.firstName || "",
        // lastName: user.lastName || "",
        // email: user.emailAddresses[0]?.emailAddress || "",
      },
      create: {
        userId,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.emailAddresses[0]?.emailAddress || "",
      },
    });
  
    return NextResponse.json(profile)
 }catch(error){
    Sentry.captureException(error)
    return NextResponse.json({error: "Something went wrong"})
 }
}
