import Nav from '@/app/(main)/components/Nav'
import React from 'react'

export default function Layout({children}: {children: React.ReactNode}) {
  return (
    <div className="h-full">
        <Nav/>
    <main>
      {children}
    </main>
    </div>
  )
}
