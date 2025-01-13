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
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation"; 

const ActionCell = ({ session }) => {
  const router = useRouter();

  const handleStartSession = () => {
    if (router && session?.sessionId) {
      router.push(`/company-interview-session/${encodeURIComponent(session.sessionId)}`);
    }
  };

  const handleViewSessionHostory = () => {
    if (router && session?.sessionId) {
      router.push(`/session-history/${encodeURIComponent(session.sessionId)}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <div className="bg-black bg-opacity-100 shadow-lg">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(session.sessionId)}
          >
            Copy session ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleStartSession}>Start Session</DropdownMenuItem>
          <DropdownMenuItem onClick={handleViewSessionHostory}>View Session History</DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Table Columns
export const interviewSessionTableColumns = [
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
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Candidate Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "candidateName",
    header: "Candidate Name",
  },
  {
    accessorKey: "startAt",
    header: "Start At",
  },
  {
    accessorKey: "endAt",
    header: "End At",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "score",
    header: "Score",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const session = row.original; 
      return <ActionCell session={session} />;
    },
  },
];
