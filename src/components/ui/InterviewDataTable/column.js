"use client";

import { ArrowUpDown, MousePointer2, RefreshCcw } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

const ActionCell = ({ session }) => {
  const router = useRouter();

  const handleStartSession = () => {
    if (router && session?.sessionId) {
      router.push(
        `/company-interview-session/${encodeURIComponent(session.sessionId)}`
      );
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
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => navigator.clipboard.writeText(session.sessionId)}
          >
            Copy session ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {session?.status != "completed" && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleStartSession}
            >
              Start Session
            </DropdownMenuItem>
          )}
          {session?.status === "completed" && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleViewSessionHostory}
            >
              View Session History
            </DropdownMenuItem>
          )}
          {session?.status != "completed" && (
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleCompleteInterviewSession}
            >
              Complete Session
            </DropdownMenuItem>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const getStatusBadge = (status) => {
  switch (status) {
    case "toBeConducted":
      return (
        <Badge
          variant="outline"
          className=" !text-orange-400 !border-orange-400/30 py-1 px-4 bg-orange-400/10"
        >
          To Be Conducted
        </Badge>
      );
    case "ongoing":
      return (
        <Badge
          variant="outline"
          className="!text-emerald-400 py-1 px-4 !border-emerald-400/30 !bg-emerald-400/10"
        >
          Ongoing
        </Badge>
      );
    case "completed":
      return (
        <Badge
          variant="outline"
          className="!text-green-600 !border-green-600/30 bg-green-600/10 py-1 px-4"
        >
          Completed
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="!text-gray-500 !border-gray-500/30 bg-gray-500/10 py-1 px-4"
        >
          {status}
        </Badge>
      );
  }
};

const GetStarted = ({ session }) => {
  const router = useRouter();

  const handleStartSession = () => {
    if (router && session?.sessionId) {
      router.push(
        `/company-interview-session/${encodeURIComponent(session.sessionId)}`
      );
    }
  };

  return (
    <div className="flex items-center justify-center">
      {session?.status !== "completed" ? (
        <div
          onClick={handleStartSession}
          className={` flex cursor-pointer items-center gap-1 h-9 rounded-md text-sm px-3 bg-green-500 text-neutral-50 hover:bg-green-500/90 dark:bg-green-700 dark:text-neutral-50 dark:hover:bg-green-700/90`}
        >
          {session?.status === "ongoing" ? (
            <>
              <RefreshCcw className="h-4 w-4" />
              Resume Meeting
            </>
          ) : (
            <>
              <MousePointer2 className="h-4 w-4" /> Get Started
            </>
          )}
        </div>
      ) : (
        <></>
      )}
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
    header: "Date",
    cell: ({ row }) => {
      const startAt = row.getValue("startAt");
      return new Date(startAt).toLocaleDateString("en-US", {
        year: "numeric",
        day: "numeric",
        month: "long",
      });
    },
  },
  {
    accessorKey: "endAt",
    header: "Time",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return getStatusBadge(status);
    },
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ row }) => {
      const score = row.getValue("score");
      // Format the score (0 becomes "0%", null/undefined becomes "N/A")
      const formattedScore = typeof score === 'number' ? `${score}%` : "N/A";
      return formattedScore;
    },
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
