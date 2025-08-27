import { Metadata } from 'next'
import Nav from './components/Nav'


export const metadata: Metadata = {
  title: "Home page",
}

export default function MainLayout({children}: {children: React.ReactNode}) {
  return (
    <div className=''>
      <Nav />
      <main>{children}</main>
    </div>
  )
}


