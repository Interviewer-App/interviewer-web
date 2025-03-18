"use client";
import { useEffect, useState } from "react";
import { fetchJoinedInterviews } from "@/lib/api/interview-session";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DataTable } from "@/components/ui/InterviewSessionDataTable/Datatable";
import { columns } from "../../../components/ui/InterviewSessionDataTable/column";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Loading from "@/app/loading";
import { usePathname, useRouter, redirect } from "next/navigation";
import { useSession, getSession } from "next-auth/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from 'lucide-react';
const JoinedInterviews = () => {
  // const hardcodedInterviewData = [
  //   {
  //     id: 1,
  //     interviewStatus: "Completed",
  //     interviewCategory: "Technical",
  //     scheduledDate: '2025-03-14', // Valid ISO date string
  //     score: 85,
  //   },
  //   {
  //     id: 2,
  //     interviewStatus: "Completed",
  //     interviewCategory: "Behavioural",
  //     scheduledDate: '2025-03-14', // Valid ISO date string
  //     score: 78,
  //   },
  //   {
  //     id: 3,
  //     interviewStatus: "Completed",
  //     interviewCategory: "Technical",
  //     scheduledDate: '2025-03-14', // Valid ISO date string
  //     score: 21,
  //   },
  // ];

  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [interviewData, setInterviewData] = useState([]); // Store interviews data
  const [loading, setLoading] = useState(false); // Loading state
  const [page, setPage] = useState(1); // Page number
  const [limit, setLimit] = useState(10); // Limit of items per page
  const [totalUsers, setTotalUsers] = useState(0); // Total users count for pagination

  useEffect(() => {
    const fetchUserJoinedInterviews = async () => {
      try {
        setLoading(true); // Start loading
        const session = await getSession();
        const candidateId = session?.user?.candidateID;
        // console.log("candidate ID:", candidateId);

        // Fetch interviews data
        await fetchJoinedInterviews(
          candidateId,
          page,
          limit,
          setLoading,
          setInterviewData,
          setTotalUsers
        );
      } catch (error) {
        console.error("Error fetching interviews:", error);
      }
    };

    fetchUserJoinedInterviews();
  }, [page, limit]); // Fetch new interviews when page or limit change

  // Log the fetched interviews when payments state changes
  // useEffect(() => {
  //   console.log("Fetched interviews:", interviewData);
  // }, [interviewData]); // This effect runs whenever payments state changes

  // Pagination handlijgs
  const handleNextPage = () => {
    if (page < Math.ceil(totalUsers / limit)) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  if (status === "loading") {
    return (
      <>
        <Loading />
      </>
    );
  } else {
    if (session.user.role !== "CANDIDATE") {
      const loginURL = `/login?redirect=${encodeURIComponent(pathname)}`;
      redirect(loginURL);
    }
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block cursor-pointer">
                <BreadcrumbPage>Joined Interviews</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="px-9 py-4 w-full max-w-[1500px] mx-auto h-full text-white">
        <h1 className="text-3xl font-semibold">Interviews</h1>
        <div className=" bg-[#1b1d22] w-full h-fit  p-6 rounded-lg mt-7">
          <div>
          <div className="mb-3">
              <h2 className="text-xl font-bold flex items-center gap-2">
                My Interview
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="w-4 h-4  rounded-full border flex items-center justify-center text-xs">?</span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-800 text-white p-2 rounded-md text-sm max-w-[200px] text-center">
                      View the interviews you&apos;ve attended, along with your performance and scores.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

              </h2>
            </div>
        
            <div>
              {loading ? (
                <div>Loading interviews...</div>
              ) : (
                <DataTable columns={columns} data={interviewData} />
              )}
            </div>
          </div>

          {/* Pagination Section */}
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={handlePreviousPage}
                    disabled={page <= 1}
                  />
                </PaginationItem>

                {/* Page Numbers */}
                {[...Array(Math.ceil(totalUsers / limit)).keys()].map((pageNumber) => (
                  <PaginationItem key={pageNumber + 1}>
                    <PaginationLink
                      onClick={() => setPage(pageNumber + 1)}
                      className={
                        page === pageNumber + 1
                          ? "bg-[#000000] text-white" // Highlight current page
                          : "text-gray-700 hover:bg-gray-100" // Default style
                      }
                    >
                      {pageNumber + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>

                <PaginationItem>
                  <PaginationNext
                    onClick={handleNextPage}
                    disabled={page * limit >= totalUsers}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
};

export default JoinedInterviews;
