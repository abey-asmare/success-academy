import type { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://successacademy.et',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
      images: ['https://successacademy.et/images/success_academy-logo.png'],
    },

  ]
}