import { isAdmin } from '@/utils/roles';
import { RejectUpload, route, type Router } from '@better-upload/server';
import { toRouteHandler } from '@better-upload/server/adapters/next';
import { cloudflare } from '@better-upload/server/clients';
import { auth } from '@clerk/nextjs/server';

const router: Router = {
  client: cloudflare(),
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
    coursePurchase: route({
      fileTypes: ['image/*'],
      multipleFiles: false,
      maxFileSize: 1024 * 1024 * 5, // 5MB
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
      maxFileSize: 1024 * 1024 * 5, // 5MB
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