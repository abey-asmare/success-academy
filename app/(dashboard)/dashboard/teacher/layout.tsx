import { isAdmin } from '@/utils/roles'
import { redirect } from 'next/navigation'

export default async function Layout({children}: {children: React.ReactNode}) {
    if(!await isAdmin()) return redirect('/')
  return (
    <div>
      {children}
    </div>
  )
}
