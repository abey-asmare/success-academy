import Nav from './components/Nav'
export default function MainLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
      <Nav />
      <main>{children}</main>
    </div>
  )
}



export const metadata = {
  title: "Success Academy",
  description: "Your Shortcut to success.",
  openGraph: {
    title: "Success Academy",
    description: "Your Shortcut to success.",
    images: [
      {
        url: "images/success_academy-logo.png",
        width: 1200,
        height: 630,
        alt: "Success Academy Banner",
      },
    ],
  },
}