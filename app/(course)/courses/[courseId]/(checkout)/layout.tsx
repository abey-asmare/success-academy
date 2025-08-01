import Nav from '@/app/(main)/components/Nav'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function Layout({children}: {children: React.ReactNode}) {
  const {userId} = await auth()

  if(!userId)
    return redirect('/sign-in')
  return (
    <div className="h-full">
        <Nav/>
    <main>
      {children}
    </main>
    </div>
  )
}
