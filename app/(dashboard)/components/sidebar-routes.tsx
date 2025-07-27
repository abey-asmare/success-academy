'use client'
 import React from 'react'
import { BarChart, Compass, Layout, List } from 'lucide-react'
import SidebarItem from './sidebar-item';
import { usePathname } from 'next/navigation';

const guestRoutes = [
    {
        icon: Layout,
        label: 'Dashboard',
        href: '/',
    }, 
    {
        icon: Compass,
        label: 'Browse',
        href: '/search',
    }, 
]
const teacherRotues = [
    {
        icon: List,
        label: 'Courses',
        href: '/teacher/courses',
    }, 
    {
        icon: BarChart,
        label: 'Analytics',
        href: '/teacher/analytics',
    }, 
]

export default function SideBarRoutes() {
    let routes = guestRoutes;
    const isTeacher = usePathname().startsWith('/teacher');
    if(isTeacher) {
        routes = teacherRotues;
    }
  return (
    <div>
      {routes.map(route => <SidebarItem key={route.href} icon={route.icon} label={route.label} href={route.href} />)}
    </div>
  )
}
