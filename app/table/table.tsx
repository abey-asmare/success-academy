"use client";

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  ColumnFiltersState,
  getSortedRowModel, 
} from "@tanstack/react-table";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Person = {
  id: number;
  name: string;
  age: number;
  email: string;
};

const defaultData: Person[] = [
  { id: 1, name: "Alice", age: 24, email: "alice@example.com" },
  { id: 2, name: "Bob", age: 30, email: "bob@example.com" },
  { id: 3, name: "Charlie", age: 29, email: "charlie@example.com" },
  { id: 4, name: "David", age: 25, email: "david@example.com" },
  { id: 5, name: "Eve", age: 28, email: "eve@example.com" },
  { id: 6, name: "Frank", age: 26, email: "frank@example.com" },
  { id: 7, name: "Grace", age: 27, email: "grace@example.com" },
  { id: 8, name: "Hank", age: 22, email: "hank@example.com" },
  { id: 9, name: "Ivy", age: 23, email: "ivy@example.com" },
  { id: 10, name: "Jack", age: 24, email: "jack@example.com" },
  { id: 11, name: "Jill", age: 25, email: "jill@example.com" },
  { id: 12, name: "John", age: 26, email: "john@example.com" },
  { id: 13, name: "Julia", age: 27, email: "julia@example.com" },
];
const defaultColumns: ColumnDef<Person>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <button
          className="flex items-center gap-1"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === 'asc')
          }
        >
          Name
          {column.getIsSorted() === 'asc' && <span>▲</span>}
          {column.getIsSorted() === 'desc' && <span>▼</span>}
        </button>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'age',
      header: ({ column }) => (
        <button
          className="flex items-center gap-1"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === 'asc')
          }
        >
          Age
          {column.getIsSorted() === 'asc' && <span>▲</span>}
          {column.getIsSorted() === 'desc' && <span>▼</span>}
        </button>
      ),
      enableSorting: true,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <button
          className="flex items-center gap-1"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === 'asc')
          }
        >
          Email
          {column.getIsSorted() === 'asc' && <span>▲</span>}
          {column.getIsSorted() === 'desc' && <span>▼</span>}
        </button>
      ),
      enableSorting: true,
    },
  ]
  

export function MyTable() {
    const [globalFilter, setGlobalFilter] = useState("")
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data: defaultData,
    columns: defaultColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 4,
      },
    },
    state: {
        globalFilter, 
        columnFilters,
    },  
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
  });

  return (
    <div className="rounded-md border p-4">

<div className="mb-4">
  <Input
    placeholder="Search..."
    value={globalFilter}
    onChange={(e) => setGlobalFilter(e.target.value)}
    className="max-w-sm"
  />
</div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={defaultColumns.length}
                className="text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
