import type { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://success-academy.et',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      images: ['https://success-academy.et/images/success_academy-logo.png'],
    },

  ]
}