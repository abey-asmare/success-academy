'use server'

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { profileFormSchema } from "@/schemas/validationSchemas";
import z from "zod";
import { Stream } from "@/prisma/app/generated/prisma/client";
import { redirect } from "next/navigation";


export async function enrollInCourse(data: z.infer<typeof profileFormSchema>, courseId: string) {
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
        if(!profile){
            return {
                message: "Profile not found", 
                status: 404
            }
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
        // if(profile){
        //     await db.profile.update({
        //         where: {
        //             userId
        //         }, 
        //         data: {
        //          firstName: data.firstName,
        //          lastName: data.lastName,
        //          phone_number: data.phoneNumber,
        //          stream: data.stream == 'Natural science' ? Stream.NATURAL_SCIENCE : Stream.SOCIAL_SCIENCE   ,
        //          referrer: data.referrer,
        //          university: data.university    
        //         }
        //     })
        //     return {
        //         message: "Profile updated successfully",
        //         status: 200
        //     }
        // }

        // await db.profile.create({
        //     data: {
        //         userId,
        //         firstName: data.firstName,
        //         lastName: data.lastName,
        //         phone_number: data.phoneNumber,
        //         email: data.email,
        //         stream: data.stream == 'Natural science' ? Stream.NATURAL_SCIENCE : Stream.SOCIAL_SCIENCE   ,
        //         referrer: data.referrer,
        //         university: data.university    
        //     }
        // })
        return {
            message: "Profile created successfully", 
            status: 200
        }
    } catch (error) {
        console.log(error)
        return {
            message: "Something went wrong",
            status: 500,
        }
    }     
}