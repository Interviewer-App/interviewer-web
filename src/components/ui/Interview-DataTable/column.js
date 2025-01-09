"use client";

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button"; 

export const columns = [
  {
    accessorKey: "candidateId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          candidateId
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "candidate.status", 
    header: "status",
  },
  {
    accessorKey: "candidate.updatedAt",  
    header: "updatedAt",
  },
  {
    accessorKey: "interviewCategory",  
    header: "interviewCategory",
  },
  
];
