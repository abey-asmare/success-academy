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
import { User } from "../page";

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
    header: () => null,
    cell: () => null,
    enableSorting: false,
    enableColumnFilter: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.email.toLowerCase();
      const b = rowB.original.email.toLowerCase();
      return a.localeCompare(b);
    },
  },
  {
    id: "fullName",
    accessorFn: (row: User) => row.profile?.firstName + " " + row.profile?.lastName || row.firstName + " " + row.lastName,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const profile = row.original.profile;
      return (
        <div className="flex items-center">
            {
              profile ? `${profile.firstName} ${profile.lastName}` : row.original.firstName + " " + row.original.lastName 
            }
        </div>
      );
    },
    enableSorting: true, 
  },
  {
    id: "phone_number",
    accessorFn: (row: User) => row.profile?.phone_number || "N/A",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Phone Number
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const phone = row.getValue("phone_number") as string;
      return <div className="flex items-center">{phone}</div>;
    },
    enableSorting: true,
    enableColumnFilter: true,
  }, 
  {
    id: "stream",
    accessorFn: (row: User) => row.profile?.stream || "N/A", 
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stream
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const profile = row.original.profile;
      return (
        <div className="flex items-center">
          {profile?.stream}
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.profile?.stream || "";
      const b = rowB.original.profile?.stream || "";
      return a.localeCompare(b);
    },
  }, 
  {
    id: "university",
    accessorFn: (row: User) => row.profile?.university || 'N/A',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          University
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const profile = row.original.profile;
      return (
        <div className="flex items-center">
          {profile?.university}
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.profile?.university || "";
      const b = rowB.original.profile?.university || "";
      return a.localeCompare(b);
    },
  }, 
  {
    id: "referrer", 
    accessorFn: (row: User) => row.profile?.referrer || "N/A",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Referrer
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const profile = row.original.profile;
      return (
        <div className="flex items-center">
          {profile?.referrer || "N/A"}
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const a = rowA.original.profile?.referrer || "";
      const b = rowB.original.profile?.referrer || "";
      return a.localeCompare(b);
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
    enableColumnFilter: true,
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
