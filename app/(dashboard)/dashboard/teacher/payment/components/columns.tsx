"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { approvePayment, cancelPayment } from "../actions";
import { cn } from "@/lib/utils";

// 6:47:00 in Build a Course & LMS Platform:
// https://youtu.be/Big_aFLmekI?t=24446
export const columns: ColumnDef<{
  id: string;
  email: string;
  course: string;
  imageUrl: string;
  approved: boolean;
  date: string;
}>[] = [
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
    cell: ({row}) => {
      return (
        <div className="max-w-[20ch] break-words whitespace-normal ">
          {row.getValue("id")}
        </div>
      )
    }
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
  {
    accessorKey: "imageUrl",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Image
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Link
            href={row.getValue("imageUrl")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={row.getValue("imageUrl")}
              alt={row.getValue("course")}
              width={50}
              height={50}
            />
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "approved",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Approved
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Badge
            variant={row.getValue("approved") ? "default" : "destructive"}
            className={cn('', 
              row.getValue("approved") ? "bg-sky-500" : ""
            )}
            >
            {row.getValue("approved") ? "Approved" : "Not Approved"}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          
          </Badge>
        </div>
      );
    },
  },

  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
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
            {row.getValue("approved") ? (
              <DropdownMenuItem>
                <Button
                  className="text-red-700 w-fit h-fit bg-transparent hover:bg-transparent hover:text-red-700 h-4"
                  type="submit"
                  onClick={async() => {
                    const res = await cancelPayment(row.original.id)
                    if(res.status !== 200) return toast.error('error while canceling payment')
                    toast.success("successfully cancel payment.")
                  }}
                >
                  cancel payment
                </Button>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem>
                <Button
                  className="text-sky-700 w-fit h-fit bg-transparent hover:bg-transparent hover:text-sky-700 h-4"
                  type="submit"
                  onClick={async() => {
                    const res = await approvePayment(row.original.id)
                    if(res.status !== 200) return toast.error('error while approving payment')
                    toast.success("successfully approved payment.")
                  }}
                >
                  approve payment
                </Button>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
