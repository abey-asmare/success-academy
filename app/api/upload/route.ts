import { isAdmin } from '@/utils/roles';
import { RejectUpload, route, type Router } from '@better-upload/server';
import { toRouteHandler } from '@better-upload/server/adapters/next';
import { cloudflare } from '@better-upload/server/clients';
import { auth } from '@clerk/nextjs/server';
import { error } from 'console';
import z from 'zod';


const router: Router = {
  client: cloudflare({
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_KEY!,
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!
  }),
  bucketName: process.env.CLOUDFLARE_BUCKET!, 
  routes: {
    chapterVideo: route({
      fileTypes: ['video/*'],
      multipleFiles: false,
      maxFileSize: 1024 * 1024 * 1024, // 1GB
      onBeforeUpload: ({file}) => {
        if(!isAdmin()){
          throw new RejectUpload('Not authorized')
        }

        return {
          objectInfo: {
            key: 'v/' + new Date().getTime() + file.name 
          }
        }
      }
    }),
    chapterVideoHLS: route({
      maxFiles: 1000,
      clientMetadataSchema: z.object({
        chapterId: z.string({error: "chapterId is requireed"})
      }),
     onBeforeUpload({clientMetadata}) {
      return {
        generateObjectInfo: ({file }) => ({
          key: `v/${clientMetadata.chapterId}/${file.name}`
        })
      }
       
     },
      fileTypes: ['text/*', 'video/*', 'application/*'],
      multipleFiles: true,
      maxFileSize: 1024 * 1024 * 1024, // 1GB
    }),
    coursePurchase: route({
      fileTypes: ['image/*'],
      multipleFiles: false,
      maxFileSize: 1024 * 1024 * 10, // 10MB
      onBeforeUpload: async ({ file }) => {
        const user = await auth();
        if (!user) {
          throw new RejectUpload('Not logged in!');
        }

        return {
          objectInfo: {
            key: 'p/w/' + new Date().getTime()+ file.name  
          }
        }
      },
    }),
    coursePurchaseTelegram: route({
      fileTypes: ['image/*'],
      multipleFiles: false,
      maxFileSize: 1024 * 1024 * 10, // 10MB
      onBeforeUpload: ({file})=> {
        return {
          objectInfo: {
            key: "p/t/" + new Date().getTime()+ file.name 
          }
        }
      }
    }),
}
};
export const { POST } = toRouteHandler(router);