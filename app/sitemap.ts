import { getCoursesMini } from '@/actions/get-courses'
import type { MetadataRoute } from 'next'
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const courses = await getCoursesMini()
  const coursesSitemap = courses.map((course) => {
    return {
      url: `https://successacademy.et/courses/${course.id}`,
      changeFrequency: 'weekly' as const,
      priority: 1,
      images: [course.imageUrl as string],
    }
  })
  return [
    {
      url: 'https://successacademy.et',
      changeFrequency: 'monthly',
      priority: 1,
      images: ['https://successacademy.et/images/success_academy-logo.png'],
    },
    ...coursesSitemap

  ]
}