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
import socket from "@/lib/utils/socket";
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

  const handleCompleteInterviewSession = () => {
    if (router && session?.sessionId) {
      const userId = session?.userId;
      const data = {
        sessionId: session?.sessionId,
        userId,
      };
      socket.emit("endInterviewSession", data);
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
          <DropdownMenuItem className="cursor-pointer"
            onClick={() => navigator.clipboard.writeText(session.sessionId)}
          >
            Copy session ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {session?.status != 'completed' && (<DropdownMenuItem className="cursor-pointer" onClick={handleStartSession}>Start Session</DropdownMenuItem>)}
          {session?.status === 'completed' && (<DropdownMenuItem className="cursor-pointer" onClick={handleViewSessionHostory}>View Session History</DropdownMenuItem>)}
          {session?.status != 'completed' && (<DropdownMenuItem className="cursor-pointer" onClick={handleCompleteInterviewSession}>Complete Session</DropdownMenuItem>)}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const GetStarted = ({ session }) => {
  const router = useRouter();

  const handleStartSession = () => {
    if (router && session?.sessionId) {
      router.push(`/company-interview-session/${encodeURIComponent(session.sessionId)}`);
    }
  };


  return (
    <div className="flex items-center justify-center">
      {session?.status != 'completed' && (
         <button
         onClick={handleStartSession}
         className="
     mx-auto md:mx-0 
     text-xs
     rounded-full 
     bg-blue-500/50 
     border-2 border-blue-700 
     text-blue-300 
     py-1 px-4 w-fit 
     transition-all
     duration-300
     hover:scale-105
     hover:bg-blue-500/70
     hover:border-blue-600
     hover:text-blue-200
     active:scale-95
     active:bg-blue-600/50
     focus:outline-none
     focus:ring-2
     focus:ring-blue-300
     focus:ring-opacity-50
     animate-pulse-once
     shadow-lg
     shadow-blue-900/20
     hover:shadow-blue-900/30
   "
       >
         Get Started
       </button>
      ) }

      

      {session?.status === 'completed' ? 
      (<>
          <p className=" mx-auto md:mx-0 text-xs mt-3 rounded-full bg-green-500/50 boeder-2 border-green-700 text-green-300 py-1 px-4 w-fit cursor-pointer">
        Completed
      </p>
      </>) : 
      
      (<>
  
     
      </>)}
      

      
    </div>

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
    id: "startBtn",
    cell: ({ row }) => {
      const session = row.original;
      return <GetStarted session={session} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const session = row.original;
      return <ActionCell session={session} />;
    },
  },
];
