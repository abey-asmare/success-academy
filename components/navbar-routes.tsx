"use client";

import { Button } from "@/components/ui/button";
import useRole from "@/utils/useRole";
import { useAuth, UserButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// interface NavbarRoutesProps  {
//   currentProfile?: SafeProfile | null
// }

export default function NavbarRoutes() {
  const pathname = usePathname();
  const isTeacherPage = pathname?.startsWith("/dashboard/teacher");
  const isPlayerPage = pathname?.includes("/dashboard/courses");
  const isSearchPage = pathname === "/dashboard/search";

  // check the user if he is the teacher / admin
  const {userId} = useAuth()
  console.log(userId)
  const isAdmin = useRole() === 'admin'

  console.log('chcking if it is admin', useRole(), isAdmin)

  return (<>
    <div className="flex gap-x-2 ml-auto">  
      {isTeacherPage || isPlayerPage ? (
        <Link href="/dashboard" >
          <Button size="sm" variant="ghost">
            <LogOut className="h-4 w-4 mr-2" />
            Exit
          </Button>
        </Link>
      ) : isAdmin ?   (
        <Link href="/dashboard/teacher/courses" >
          <Button size="sm" variant="ghost">
            Admin Site
          </Button>
        </Link>
      ) : null}

     <UserButton/>
    </div>
  </>);
};