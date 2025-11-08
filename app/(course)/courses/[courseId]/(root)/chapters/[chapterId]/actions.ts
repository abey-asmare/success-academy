'use server'

import { db } from "@/lib/db";
import { Sentry } from "@/lib/sentryLogger";
import { Stream } from "@/prisma/app/generated/prisma/client";
import { profileFormSchema } from "@/schemas/validationSchemas";
import z from "zod";


export async function enrollInCourse(data: z.infer<typeof profileFormSchema>, courseId: string, userId: string) {
    try {
        if (!userId) {
            throw new Error("Unauthorized")
        }

        
        await db.profile.upsert({
            where: {
                userId
            }, 
            create: {
                userId,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email, 
                phone_number: data.phoneNumber,
                stream: data.stream == 'Natural science' ? Stream.NATURAL_SCIENCE : Stream.SOCIAL_SCIENCE   ,
                referrer: data.referrer,
                university: data.university
            }, 
            update: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email, 
                phone_number: data.phoneNumber,
                stream: data.stream == 'Natural science' ? Stream.NATURAL_SCIENCE : Stream.SOCIAL_SCIENCE   ,
                referrer: data.referrer,
                university: data.university    
               }
        })
        
        return {
            message: "Profile created successfully", 
            status: 200
        }

        
    } catch (error) {
        Sentry.captureException(error)
        return {
            message: "Something went wrong",
            status: 500,
        }
    }     
}