"use client";
import { Badge } from "@/components/ui/badge";

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

const getStatusBadge = (status) => {
  switch (status) {
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="!text-orange-500 bg-amber-500/20  hover:bg-amber-500/30"
        >
          {status}
        </Badge>
      );
    case "APPROVED":
      return (
        <Badge
          variant="outline"
          className="bg-green-300/20 text-green-500 hover:bg-green-500/30"
        >
          APPROVED
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-700 text-yellow-500 hover:bg-yellow-500/30"
        >
          REJECTED
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="bg-black tetx-white hover:bg-gray-800/30"
        >
          {status}
        </Badge>
      );
  }
};

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
    accessorKey: "invitationID",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        invitationID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  // {
  //   accessorKey: "interviewCategory",  
  //   header: "interview Category",
  // },
  {
    accessorKey: "sentAt", 
    header: "sent At",
    cell: ({ row }) => {
      const createdAt = new Date(row.original.sentAt); // Parse the date string
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return createdAt.toLocaleDateString('en-US', options); // Formats it to "January 16, 2025"
    },
  },
  
  {
    accessorKey: "Scheduling",  
    header: "Schedule At",
    cell: ({ row }) => {
      const createdAt = new Date(row.original.Scheduling.startTime); // Parse the date string
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return createdAt.toLocaleDateString('en-US', options); // Formats it to "January 16, 2025"
    },
  },
  {
    accessorKey: "SchedulingstartTime",  
    header: "Start Time",
    cell: ({ row }) => {
      const startTime = new Date(row.original.Scheduling.startTime);
      return startTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }); // Formats to "4:00 PM"
    },
  },
  {
    accessorKey: "SchedulingendTime",  
    header: "End Time",
    cell: ({ row }) => {
      const endTime = new Date(row.original.Scheduling.endTime);
      return endTime.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }); // Formats to "4:30 PM"
    },
  },

  {
    accessorKey: "status",  
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return getStatusBadge(status);
    },
  },
  // {
  //   accessorKey: "interviewCategory",  
  //   header: "interviewCategory",
  // },
  // Add the "Actions" column
//   {
//     id: "actions",
//     cell: ({ row }) => {
//       const payment = row.original;

//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <span className="sr-only">Open menu</span>
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             {/* <DropdownMenuItem
//               onClick={() => navigator.clipboard.writeText(payment.id)}
//             >
//               Copy payment ID
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>View customer</DropdownMenuItem>
//             <DropdownMenuItem>View payment details</DropdownMenuItem> */}
//           </DropdownMenuContent>
//         </DropdownMenu>
//       );
//     },
//   },
];