"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DataTable } from "@/components/ui/InterviewCategory-DataTable/Datatable";
import InterviewCategoryModal from "../../../components/interviews/interviewCategoryModal";
import { fetchInterCategories } from "@/lib/api/interview-category";
import { columns } from "@/components/ui/InterviewCategory-DataTable/column";
import Loading from "@/app/loading";
import { usePathname, useRouter, redirect } from 'next/navigation';
import { useSession, getSession } from "next-auth/react"
import { Calendar, Home, Inbox, Activity, Atom, Timer, UserPlus, MonitorCheck, SquarePen, plus, Plus } from "lucide-react";
import { Info } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
const InterviewCategoryPage = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [totalsessions, setTotalSessions] = useState(0);
  const [loading, setLoading] = useState(false);
  const [interviewSessionsSort, setInterviewSessionsSort] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isDelete, SetIsDelete] = useState(false);

  const handleNextPage = () => {
    if (page * limit < totalsessions) {
      setPage(page + 1);
    }
  };

  const handlePage = (page) => {
    if (page > 0 && page <= Math.ceil(totalsessions / limit)) {
      setPage(page);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const session = await getSession();
        const companyId = session?.user?.companyID;
        // console.log('compnayID',companyId);
        const response = await fetchInterCategories(companyId, page, limit)
        setCategories(response.data.categories);
        setTotalSessions(response.data.total);
      } catch (error) {
        console.log(error);
      }
    }

    fetchCategories();
  }, [page, limit, modalOpen])


  if (status === "loading") {
    return (
      <>
        <Loading />
      </>
    );
  } else {
    if (session.user.role !== 'COMPANY') {
      const loginURL = `/login?redirect=${encodeURIComponent(pathname)}`;
      redirect(loginURL);
    }
  }


  return (
    <>
      <SidebarInset>
        <header className="flex h-16 bg-black  shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Interview Insights</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="px-9 py-4 w-full max-w-[1500px] bg-black mx-auto h-full">
          <div className="flex flex-row items-center space-x-2">
            <h1 className="text-3xl font-semibold">Insights</h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-white hover:text-gray-200 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent className="bg-gray-800 text-white p-2 rounded-md text-sm max-w-[200px] text-center">
                  Explore the categories you&apos;re tested on during interviews and how each is evaluated.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="bg-[#1b1d22] w-full h-fit p-9 rounded-lg mt-5">
            <div className="flex items-center justify-between mb-5">
              <h1 className="text-2xl font-semibold">Interview Insights</h1>
              {/* Add Category Button */}
              <button
                onClick={() => setModalOpen(true)}
                className="rounded-full bg-white text-black font-bold px-2 py-2"
              >
                <Plus />
              </button>
            </div>

            <div>
              {loading ? (
                <div>Loading interview sessions...</div>
              ) : (
                <DataTable
                  columns={columns}
                  data={categories}
                />
              )}
            </div>

            {modalOpen && <InterviewCategoryModal setModalOpen={setModalOpen} isUpdated={false} />}

            {/* Pagination handle section start */}
            <Pagination>
              <PaginationContent className="cursor-pointer">
                <PaginationItem>
                  <PaginationPrevious onClick={() => handlePreviousPage()} />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink onClick={() => handlePage(page + 1)}>
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink onClick={() => handlePage(page + 2)}>
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
        </div>


      </SidebarInset>
    </>
  );
};

export default InterviewCategoryPage;
