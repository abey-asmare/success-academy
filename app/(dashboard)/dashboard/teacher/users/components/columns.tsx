"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { removeRole, setRole } from "../_actions";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'moderator' | 'User';
};

async function setRole_(id: string){
  try{
    await setRole(id)
    toast.success("Role updated successfully")
  }catch{
    toast.error("Failed to update role")
  }
}

async function removeRole_(id: string){
  try{
    await removeRole(id)
    toast.success("Role removed successfully")
  }catch{
    toast.error("Failed to remove role")
  }
}
export const columns: ColumnDef<User>[] = [
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
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          {
          row.getValue("role") === "admin" ? (
            <Badge variant="default" className="bg-sky-600 text-white hover:bg-sky-700 w-[7ch] max-w-[10ch]" >Admin</Badge>
          ) : row.getValue('role') === "moderator" ? (
            <Badge variant="outline" className="bg-amber-600 text-white hover:bg-amber-700 w-[7ch] max-w-[10ch]" >Moderator</Badge>
          ) : (
            <Badge variant="outline" className="w-[7ch] max-w-[10ch]" >User</Badge>
          )}
        </div>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {row.getValue("role") === "admin" ? (
              <DropdownMenuItem>
               <form action={()=> removeRole_(row.getValue("id"))}>
               <Button
                  className="text-red-700 w-fit h-fit bg-transparent hover:bg-transparent hover:text-red-700 h-4"
                  type="submit"
                >
                  revoke Admin
                </Button>
               </form>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem>
               <form action={()=> setRole_(row.getValue("id"))}>
                <Button
                  className="text-sky-700 w-fit h-fit bg-transparent hover:bg-transparent hover:text-sky-700 h-4"
                  type="submit"
                >
                  make Admin
                </Button>
               </form>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
