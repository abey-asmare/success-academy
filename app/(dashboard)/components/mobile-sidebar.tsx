import React from 'react'
import { Menu } from 'lucide-react'
import Sidebar from './sidebar'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'


import {
    Sheet, 
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export default function MobileSidebar() {
  return (
    <Sheet>

        <SheetTrigger className='md:hidden pr-4 hover:opacity-75'>
        <Menu/> 
        </SheetTrigger>

        <SheetContent side='left' className='p-0 bg-white' >
          <VisuallyHidden>
            <SheetTitle >Courses</SheetTitle>
          </VisuallyHidden>
          <Sidebar/>
        </SheetContent>
    </Sheet>
  )
}
