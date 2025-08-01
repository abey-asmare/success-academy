import { Metadata } from 'next'
import Nav from './components/Nav'
import image from "@/public/images/success_academy-logo.png"



export const metadata: Metadata = {
  title: "Success Academy",
  description: "Your Shortcut to success.",
  openGraph: {
    title: "Success Academy",
    description: "Your Shortcut to success.",
    images: [
      {
        url: image.src,
        width: 1200,
        height: 630,
        alt: "Success Academy Banner",
      },
    ],
  },
}



export default function MainLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
      <Nav />
      <main>{children}</main>
    </div>
  )
}


