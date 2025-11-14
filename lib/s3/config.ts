import {
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";


export const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.CLOUDFLARE_S3_API!,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_KEY!,
  },
});



