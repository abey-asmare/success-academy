import { DeleteObjectCommand, DeleteObjectsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./config";
import { Sentry } from "../sentryLogger";


export const deleteFile = async (fileId: string) => {
  try {
    const deleteObjectCommand = new DeleteObjectCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET!,
      Key: fileId
    });
    return await s3Client.send(deleteObjectCommand);
  } catch (error) {
    Sentry.captureException(error);
  }

};


export const bulkDeleteFiles = async(fileIds: string[])  => {
  try{
    const deleteObjectsCommand = new DeleteObjectsCommand({
      Bucket: process.env.CLOUDFLARE_BUCKET!,
        Delete: {
          Objects: fileIds.map(id => ({Key: id}))
        }
      
    })
    return await s3Client.send(deleteObjectsCommand)
  }catch(error){
    Sentry.captureException(error)
  }
  
}