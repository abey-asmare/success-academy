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
import { Referrer,Stream } from "@/prisma/app/generated/prisma/client";

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


export type ProfileType = {
  id: string, 
  userId: string;
  firstName: string;
  email: string, 
  lastName: string;
  phone_number: string | null;
  stream: Stream | null;
  university: string | null;
  referrer: Referrer | null;
  role: "Admin" | "User" | "Moderator" | null ;
}

export const columns: ColumnDef<ProfileType>[] = [
  {
    accessorKey: "userId",
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
    cell: ({ row }) => (
      <div className="max-w-xs truncate">{row.getValue("email")}</div>
    ),
    enableSorting: true,
  },
  {
    id: "fullName",
    accessorFn: (row: ProfileType) => row.firstName + " " + row.lastName,
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Full Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="max-w-xs truncate">
        {row.original.firstName + " " + row.original.lastName}
      </div>
    ),
    enableSorting: true,
  },
  {
    id: "phone_number",
    accessorFn: (row: ProfileType) => row.phone_number || "N/A",
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
      return <div className="max-w-xs truncate">{phone}</div>;
    },
    enableSorting: true,
    enableColumnFilter: true,
  },

  {
    accessorKey: "university",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        University
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="max-w-xs truncate hidden md:inline-block">
        {row.original.university} {" "} {row.original.stream === 'NATURAL_SCIENCE' ? "(N)" : "(S)"}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "referrer",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Referrer
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="max-w-xs truncate">{row.original.referrer || "N/A"}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Role
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const role = row.getValue("role");
      return (
        <div className="flex items-center">
          {role === "Admin" ? (
            <Badge
              variant="default"
              className="bg-sky-600 text-white hover:bg-sky-700 w-[7ch] max-w-[10ch]"
            >
              Admin
            </Badge>
          ) : role === "Moderator" ? (
            <Badge
              variant="outline"
              className="bg-amber-600 text-white hover:bg-amber-700 w-[7ch] max-w-[10ch]"
            >
              Moderator
            </Badge>
          ) : (
            <Badge variant="outline" className="w-[7ch] max-w-[10ch]">
              User
            </Badge>
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
            {row.getValue("role") === "Admin" ? (
              <DropdownMenuItem>
                <form action={() => removeRole_(row.getValue("userId"))}>
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
                <form action={() => setRole_(row.getValue("userId"))}>
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

