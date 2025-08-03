"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Course, Exam } from "@/prisma/app/generated/prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";

export type ExamCourse = {
  id: string;
  name: string, 
  course: string, 
  updatedAt: string, 
}


export const columns: ColumnDef<ExamCourse>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Id
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Simulation
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "course",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Course
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-4 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           {row.getValue("role") === "admin" ? (
  //             <DropdownMenuItem>
  //              <form action={()=> removeRole_(row.getValue("id"))}>
  //              <Button
  //                 className="text-red-700 w-fit h-fit bg-transparent hover:bg-transparent hover:text-red-700 h-4"
  //                 type="submit"
  //               >
  //                 revoke Admin
  //               </Button>
  //              </form>
  //             </DropdownMenuItem>
  //           ) : (
  //             <DropdownMenuItem>
  //              <form action={()=> setRole_(row.getValue("id"))}>
  //               <Button
  //                 className="text-sky-700 w-fit h-fit bg-transparent hover:bg-transparent hover:text-sky-700 h-4"
  //                 type="submit"
  //               >
  //                 make Admin
  //               </Button>
  //              </form>
  //             </DropdownMenuItem>
  //           )}
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];
