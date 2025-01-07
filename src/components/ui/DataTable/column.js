"use client";

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button"; 

export const columns = [
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
  },
  {
    accessorKey: "role", 
    header: "Role",
  },
  {
    accessorKey: "userID",  
    header: "User ID",
  },
  {
    accessorKey: "createdAt", 
    header: "Created At",
  },
  {
    accessorKey: "updatedAt", 
    header: "Updated At",
  },
];
