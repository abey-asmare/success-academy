import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

import * as Sentry from "@sentry/nextjs"

const { logger } = Sentry;

const f = createUploadthing();

const handleAuth = async () => {
    const {userId} = await auth()
    if(!userId) throw new Error("Unauthorized")
    return {userId}
} 

const handleAdmin = async () => { 
  const {userId, sessionClaims} = await auth()
  if(sessionClaims?.metadata.role !== 'admin') throw new Error("Unauthorized")
  return {userId}
}

export const ourFileRouter = {
    courseImage: f({image: {maxFileSize: '4MB', maxFileCount: 1}})
        .middleware(handleAdmin)
        .onUploadComplete(async ({ metadata, file }) => {
      logger.info(`[UPLOADTHING_COURSE_IMAGE]: OK: File uploaded successfully for user ${metadata.userId} file ${file.ufsUrl}`)
      return { uploadedBy: metadata.userId };
    }),
    examImage: f({image: {maxFileSize: '4MB', maxFileCount: 1}})
        .middleware(handleAdmin)
        .onUploadComplete(async ({ metadata, file }) => {
      logger.info(`[UPLOADTHING_EXAM_IMAGE]: OK: File uploaded successfully for user ${metadata.userId} file ${file.ufsUrl}`)
      return { uploadedBy: metadata.userId };
    }),
    purchaseImage: f({image: {maxFileSize: '4MB', maxFileCount: 1}})
        .middleware(handleAuth)
        .onUploadComplete(async ({ metadata, file }) => {
      logger.info(`[UPLOADTHING_PURCHASE_IMAGE]: OK: File uploaded successfully for user ${metadata?.userId} file ${file.ufsUrl}`)
      return { uploadedBy: metadata?.userId };
    }),
    purchaseImageTelegram: f({image: {maxFileSize: '8MB', maxFileCount: 1}})
        .onUploadComplete(async ({ file }) => {
      logger.info(`[UPLOADTHING_PURCHASE_IMAGE_TELEGRAM]: OK: File uploaded successfully file ${file.ufsUrl}`)
      return { };
    }),
    courseAttachment: f({
      text: { maxFileCount: 10 },
      image: { maxFileCount: 10, maxFileSize: '8MB' },
      video: { maxFileCount: 10, maxFileSize: '1GB' },
      audio: { maxFileCount: 10 , maxFileSize: '16MB'},
    })
    .middleware(handleAdmin)
    .onUploadComplete(async ({ metadata, file }) => {
      logger.info(`[UPLOADTHING_COURSE_ATTACHMENT]: OK: File uploaded successfully for user ${metadata.userId} file ${file.ufsUrl}`)
      return { uploadedBy: metadata.userId};
    }), 
    chapterVideo: f({video: {maxFileSize: '1GB', maxFileCount: 1}})
    .middleware(handleAdmin)
    .onUploadComplete(async ({ metadata, file }) => {
      logger.info(`[UPLOADTHING_CHAPTER_VIDEO]: OK: File uploaded successfully for user ${metadata.userId} file ${file.ufsUrl}`)
      return { uploadedBy: metadata.userId };
    }) 
} satisfies FileRouter;
export type OurFileRouter = typeof ourFileRouter;
