import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

import { isAdmin } from "@/utils/roles";

const f = createUploadthing();

const handleAuth = async () => {
    const {userId} = await auth()
    const isAuthorized = isAdmin()
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
    examImage: f({image: {maxFileSize: '4MB', maxFileCount: 1}})
        .middleware(handleAuth)
        .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("exam url", file.ufsUrl);
      return { uploadedBy: metadata.userId };
    }),
    purchaseImage: f({image: {maxFileSize: '4MB', maxFileCount: 1}})
        .middleware(handleAuth)
        .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId };
    }),
    courseAttachment: f({
      text: { maxFileCount: 10 },
      image: { maxFileCount: 10 },
      video: { maxFileCount: 10, maxFileSize: '1GB' },
      audio: { maxFileCount: 10 },
    })
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId};
    }), 
    chapterVideo: f({video: {maxFileSize: '1GB', maxFileCount: 1}})
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("file url", file.ufsUrl);
      return { uploadedBy: metadata.userId };
    }) 
} satisfies FileRouter;
export type OurFileRouter = typeof ourFileRouter;
