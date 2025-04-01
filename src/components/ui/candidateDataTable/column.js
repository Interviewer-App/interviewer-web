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
import { Badge } from "@/components/ui/badge";
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


const getStatusBadge = (status) => {
  debugger
  switch (status) {
    case "toBeConducted":
      return (
        <Badge
          variant="outline"
          className=" !text-orange-400 !border-orange-400/30 py-1 px-4 bg-orange-400/10"
        >
          toBeConducted
        </Badge>
      );
    case "completed":
      return (
        <Badge
          variant="outline"
          className=" !text-green-400 !border-green-400/30 py-1 px-4 bg-green-400/10"
        >
          completed
        </Badge>
      );
    case "ongoing":
      return (
        <Badge
          variant="ongoing"
          className=" !text-yellow-400 !border-yellow-400/30 py-1 px-4 bg-yellow-400/10"
        >
          ongoing
        </Badge>
      );
  }
};

// Table Columns
export const candidatesTableColumns = [
  // {
  //   id: "candidateId",
  //   accessorFn: (row) => row.candidate.candidateId,
  //   header: "Candidate ID",
  //   cell: ({ row }) => {
  //     const id = row.original.candidate.candidateId;
  //     return id;
  //   },
  //   enableColumnFilter: true,
  // },
  {
    id: "email", // Changed from accessorKey to id with accessorFn
    accessorFn: (row) => row.candidate.email, // Access nested email
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Candidate Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    enableColumnFilter: true,
    cell: ({ row }) => {
      const candidateEmail = row.original.candidate.email;
      return candidateEmail;
    },
  },
  {
    accessorKey: "candidateName",
    header: "Candidate Name",
    cell: ({ row }) => {
      const candidateName = row.original.candidate.fullName;
      return candidateName;
    },
  },
  {
    accessorKey: "startDate",
    header: "Interview Date",
    cell: ({ row }) => {
      const startDate = new Date(row.original.startTime);
      const options = { year: "numeric", month: "long", day: "numeric" };
      return startDate.toLocaleDateString("en-US", options);
    },
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
    cell: ({ row }) => {
      const startTime = new Date(row.original.startTime);
      return startTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    },
  },
  {
    accessorKey: "EndTime",
    header: "End Time",
    cell: ({ row }) => {
      const startTime = new Date(row.original.endTime);
      return startTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    },
  },
  {
    accessorKey: "status",
    header: "Session Status",
    // cell: ({ row }) => {
    //   const interviewStatus = row.original.invitationStatus.status;
    //   return interviewStatus;
    // },
    cell: ({ row }) => {
      const status = row.original.interviewSession?.interviewStatus;
      return getStatusBadge(status);
    },
  },
];