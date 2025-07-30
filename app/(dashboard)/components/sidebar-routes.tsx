'use client'
 import React from 'react'
import { BarChart, Compass, DollarSign, Layout, List, User, WalletCards } from 'lucide-react'
import SidebarItem from './sidebar-item';
import { usePathname } from 'next/navigation';

const guestRoutes = [
    {
        icon: Layout,
        label: 'Dashboard',
        href: '/dashboard',
    }, 
    {
        icon: Compass,
        label: 'Browse',
        href: '/dashboard/search',
    }, 
]
const teacherRotues = [ 
    {
        icon: List,
        label: 'Courses',
        href: '/dashboard/teacher/courses',
    }, 
    {
        icon: BarChart,
        label: 'Analytics',
        href: '/dashboard/teacher/analytics',
    }, 
    {
        icon: User,
        label: 'Users',
        href: '/dashboard/teacher/users',
    },
    {
        icon: WalletCards,
        label: 'Payments',
        href: '/dashboard/teacher/payment',
    },

]

export default function SideBarRoutes() {
    let routes = guestRoutes;
    const isTeacher = usePathname().startsWith('/dashboard/teacher');
    if(isTeacher) {
        routes = teacherRotues;
    }
  return (
    <div>
      {routes.map(route => <SidebarItem key={route.href} icon={route.icon} label={route.label} href={route.href} />)}
    </div>
  )
}
