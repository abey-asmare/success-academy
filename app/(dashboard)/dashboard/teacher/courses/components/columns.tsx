"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil, Trash } from "lucide-react"
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Course } from "@/prisma/app/generated/prisma/client";
import DeleteAlert from "./DeleteAlert";
import toast from "react-hot-toast";
import axios from "axios";
import { Sentry } from "@/lib/sentryLogger";


export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price") || "0");
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "ETB"
      }).format(price);

      return <div>{formatted}</div>
    }
  },
  {
    accessorKey: "isPublished",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Published
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") || false;

      return (
        <Badge className={cn(
          "bg-slate-500",
          isPublished && "bg-sky-700"
        )}>
          {isPublished ? "Published" : "Draft"}
        </Badge>
      )
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;
      const deleteCourse = async () => {
        try {
          await axios.delete(`/api/courses/${id}`)
        } catch (error) {
          Sentry.captureException(error)
        }
      }

      return (
        (<DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/dashboard/teacher/courses/${id}`}>
              <DropdownMenuItem>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </Link>
          <DeleteAlert 
          title="Are you sure you want to delete this course?"
          onContinue={()=> 
            toast.promise(deleteCourse(), {
              loading: "Deleting course...",
              success: "Course deleted successfully",
              error: "Failed to delete course. try again later.",
            })
          }
          >
          <Button variant="destructive" className="!px-2 flex items-center justify-start gap-x-2 w-full h-full bg-transparent text-red-500 hover:text-red-600 hover:bg-red-100">
          <span className="sr-only">Delete</span>
          <Trash className="w-4 h-4 hover:text-gray-700" />
          Delete
      </Button>
          </DeleteAlert>
          </DropdownMenuContent>
        </DropdownMenu>)
      );
    },
  },
]