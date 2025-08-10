import { Metadata } from 'next'
import Nav from './components/Nav'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "Home page",
  openGraph: {
    images: [
      {
        url: `${baseUrl}/opengraph-image.png`,
        width: 1024,
        height: 1024,
      },
    ],
  },
}

export default function MainLayout({children}: {children: React.ReactNode}) {
  return (
    <div className=''>
      <Nav />
      <main>{children}</main>
    </div>
  )
}


