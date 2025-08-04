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
import Link from "next/link";
import { DeleteFormColumn } from "./DeleteformColumn";

export type ExamCourse = {
  id: string;
  name: string;
  course: string;
  updatedAt: string;
  courseId: string;
};

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
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Updated At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "courseId",
    header: () => null,
    cell: () => null,
    enableSorting: false,
    enableColumnFilter: false,
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
            <DropdownMenuItem>
              <Button
                variant="link"
                className="text-sky-600 hover:text-sky-700 bg-transparent hover:bg-transparent w-full h-full"
                size='sm'
              >
                <Link
                  href={`/courses/${row.getValue("courseId")}`}
                >
                  View
                </Link>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Button
                variant="link"
                className="text-sky-600 hover:text-sky-700 bg-transparent hover:bg-transparent w-full h-full"
                size='sm'
              >
                <Link
                  href={`/dashboard/teacher/simulation/${row.getValue("id")}`}
                >
                  Update
                </Link>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <DeleteFormColumn
                examId={row.getValue("id")}
              />
              </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
