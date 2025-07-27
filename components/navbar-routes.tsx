"use client";

import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchInput } from "./search-input";
import { useAuth } from "@clerk/nextjs";
import { isTeacher } from "@/lib/teacher";

// interface NavbarRoutesProps  {
//   currentProfile?: SafeProfile | null
// }

export default function NavbarRoutes() {
  const pathname = usePathname();
  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.includes("/chapters");
  const isSearchPage = pathname === "/search";

  // check the user if he is the teacher / admin
  const {userId} = useAuth()
  console.log(userId)

  return (<>
    {isSearchPage && (
      <div className="hidden md:block">
        <SearchInput />
      </div>
    )}
    <div className="flex gap-x-2 ml-auto">
      {isTeacherPage || isPlayerPage ? (
        <Link href="/" >
          <Button size="sm" variant="ghost">
            <LogOut className="h-4 w-4 mr-2" />
            Exit
          </Button>
        </Link>
      ) : isTeacher(userId) ?   (
        <Link href="/teacher/courses" >
          <Button size="sm" variant="ghost">
            Teacher Mode
          </Button>
        </Link>
      ) : null}

     <UserButton/>
    </div>
  </>);
};