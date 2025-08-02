import { Metadata } from 'next'
import Nav from './components/Nav'

export const metadata: Metadata = {
  title: "Success Academy",
}

export default function MainLayout({children}: {children: React.ReactNode}) {
  return (
    <div>
      <Nav />
      <main>{children}</main>
    </div>
  )
}


