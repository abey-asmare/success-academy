import { route, type Router } from '@better-upload/server';
import { toRouteHandler } from '@better-upload/server/adapters/next';
import { cloudflare } from '@better-upload/server/clients';

const router: Router = {
  client: cloudflare(),
  bucketName: 'my-first-bucket', 
  routes: {
    chapterVideo: route({
      fileTypes: ['video/*'],
      multipleFiles: false,
      maxFileSize: 1024 * 1024 * 1024, // 1GB
    }),
    coursePurchase: route({
      fileTypes: ['image/*'],
      multipleFiles: false,
      maxFileSize: 1024 * 1024 * 5, // 5MB
    }),
    coursePurchaseTelegram: route({
      fileTypes: ['image/*'],
      multipleFiles: false,
      maxFileSize: 1024 * 1024 * 5, // 5MB
    }),
  },
};
export const { POST } = toRouteHandler(router);