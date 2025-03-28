"use client";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/InterviewInvitaionDataTable/Datatable";
import { columns } from "@/components/ui/InterviewInvitaionDataTable/column";
import { getSession } from "next-auth/react";
import { fetchSendInterviewInvitations } from "@/lib/api/interview-invitation";

export default function InvitedCandidates({ interviewId, inviteModalOpen }) {
  const [loading, setLoading] = useState(false);
  const [sendInterviewsDataSort, setSendInterviewsDataSort] = useState([]);
  const [page, setPage] = useState(1); // Page number
  const [limit, setLimit] = useState(10); // Limit of items per page
  const [totalInvitations, setTotalInvitations] = useState(0); // Total users count for pagination
  const [sendInterviewsData, setSendInterviewsData] = useState([]);

  useEffect(() => {
    const fetchSendInterviews = async () => {
      try {
        setLoading(true); // Start loading
        // const session = await getSession();
        // const candidateId = session?.user?.candidateID;
        // console.log('candidate ID:', candidateId);

        // Fetch interviews data
        await fetchSendInterviewInvitations(
          interviewId,
          page,
          limit,
          setLoading,
          setSendInterviewsData,
          setTotalInvitations
        );
      } catch (error) {
        console.error("Error fetching interviews:", error);
      }
    };

    fetchSendInterviews();
  }, [inviteModalOpen, page, limit]); // Fetch new interviews when page or limit change

  // Log the fetched interviews when payments state changes
  useEffect(() => {
    console.log("Fetched interviews:", sendInterviewsData);
  }, [sendInterviewsData]); // This effect runs whenever payments state changes

  // Pagination handlijgs
  const handleNextPage = () => {
    if (page < Math.ceil(totalInvitations / limit)) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handlePage = (newPage) => {
    if (newPage <= Math.ceil(totalInvitations / limit)) {
      setPage(newPage);
    }
  };

  return (
    <div className="w-full h-fit rounded-lg mt-5">
      <div>
        <h1 className=" text-2xl font-semibold">Interview invitations</h1>
        <div>
          {loading ? (
            <div>Loading interview invitations...</div>
          ) : (
            <DataTable columns={columns} data={sendInterviewsData} />
          )}
        </div>
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => handlePreviousPage()} />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink onClick={() => handlePage(page)}>
              {page + 1}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink onClick={() => handlePage(page + 1)}>
              {page + 2}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext onClick={() => handleNextPage()} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
