'use server'

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { profileFormSchema } from "@/schemas/validationSchemas";
import z from "zod";
import { Stream } from "@/prisma/app/generated/prisma/client";



export async function enrollInCourse(data: z.infer<typeof profileFormSchema>) {
    try {
        const {userId} = await auth()
        if (!userId) {
            throw new Error("Unauthorized")
        }

        const profile =await  db.profile.findUnique({
            where: {
                userId: userId
            }
        })
        if(profile){
            await db.profile.update({
                where: {
                    userId
                }, 
                data: {
                 firstName: data.firstName,
                 lastName: data.lastName,
                 phone_number: data.phoneNumber,
                 stream: data.stream == 'Natural science' ? Stream.NATURAL_SCIENCE : Stream.SOCIAL_SCIENCE   ,
                 referrer: data.referrer,
                 university: data.university    
                }
            })
            return {
                message: "Profile updated successfully"
            }
        }

        await db.profile.create({
            data: {
                userId,
                firstName: data.firstName,
                lastName: data.lastName,
                phone_number: data.phoneNumber,
                stream: data.stream == 'Natural science' ? Stream.NATURAL_SCIENCE : Stream.SOCIAL_SCIENCE   ,
                referrer: data.referrer,
                university: data.university    
            }
        })
        return {
            message: "Profile created successfully"
        }
    } catch (error) {
        console.log(error)
        return {
            message: "Something went wrong"
        }
    }     
}