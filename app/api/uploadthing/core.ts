import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

import { isTeacher } from "@/lib/teacher";

const f = createUploadthing();

const handleAuth = async () => {
    const {userId} = await auth()
    const isAuthorized = isTeacher(userId)
    if(!userId || !isAuthorized) throw new Error("Unauthorized")
    return {userId}
} 

export const ourFileRouter = {
    courseImage: f({image: {maxFileSize: '4MB', maxFileCount: 1}})
        .middleware(handleAuth)
        .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId };
    }),
    courseAttachment: f(['text', 'image', 'video', 'audio', 'pdf'])
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId };
    }), 
    chapterVideo: f({video: {maxFileSize: '1GB', maxFileCount: 1}})
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId };
    }) 
} satisfies FileRouter;
export type OurFileRouter = typeof ourFileRouter;
