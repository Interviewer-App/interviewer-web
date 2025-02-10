"use client";

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button"; 
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "interviewStatus",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        interviewStatus
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "interviewCategory",  
    header: "interview Category",
  },
  {
    accessorKey: "scheduledDate", 
    header: "scheduledDate",
    cell: ({ row }) => {
      const createdAt = new Date(row.original.createdAt); // Parse the date string
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return createdAt.toLocaleDateString('en-US', options); // Formats it to "January 16, 2025"
    },
  },

  {
    accessorKey: "score",  
    header: "score",
    cell: ({ row }) => {
      const score = row.original.score; // Get the score value
      // If the score is a decimal (e.g., 0.85), multiply by 100 to get percentage
      return `${score.toFixed(2)}%`; // Show percentage with two decimal places
    },
  },
  
  // {
  //   accessorKey: "interviewCategory",  
  //   header: "interviewCategory",
  // },
  // Add the "Actions" column
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {/* <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];