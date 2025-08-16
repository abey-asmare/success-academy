import type { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://success-academy.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      images: ['https://success-academy.vercel.app/images/success_academy-logo.png'],
    },

  ]
}