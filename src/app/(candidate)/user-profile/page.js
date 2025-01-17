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
import { interviewSessionTableColumns } from "@/components/ui/InterviewDataTable/column";
import InterviewCategoryModal from "../../../components/interviews/interviewCategoryModal";
import { fetchInterCategories } from "@/lib/api/interview-category";
import { columns } from "@/components/ui/InterviewCategory-DataTable/column";
import Loading from "@/app/loading";
import { usePathname, useRouter, redirect } from 'next/navigation';
import { useSession, getSession } from "next-auth/react";
import ContactFormPreview from "@/components/ui/userDetailsForm";

const UserProfile = () => {
  const [Tab, setTab] = useState("CV");
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [totalsessions, setTotalSessions] = useState(0);
  const [loading, setLoading] = useState(false);
  const [interviewSessionsSort, setInterviewSessionsSort] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  
  return (
    <>
    <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">candidate</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Profile</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Toggle Buttons between 'Teams' and 'Details' */}
        
        {/* <div className="flex space-x-4 mb-4 mx-auto">
          <button
            onClick={() => setTab("Team")}
            className={`px-4 py-2 rounded-lg ${Tab === "Team" ? "bg-gradient-to-tr from-lightred to-darkred text-white" : "bg-gray-200 text-black"}`}
          >
            Teams
          </button>
          <button
            onClick={() => setTab("Details")}
            className={`px-4 py-2 rounded-lg ${Tab === "Details" ? "bg-gradient-to-tr from-lightred to-darkred text-white" : "bg-gray-200 text-black"}`}
          >
            Details
          </button>
        </div> */}


        <div className="px-9 py-4 w-full max-w-[1500px] mx-auto h-full">
        <h1 className="text-3xl font-semibold">User Profile</h1>
        <div className=" w-full mt-5 ml-md mb-12">
            <div className="flex space-x-4 bg-slate-600/20 w-fit p-1 md:p-2 rounded-lg">
              <button
                onClick={() => setTab("CV")}
                className={` text-xs md:text-sm py-2 px-4 md:px-6 rounded-lg ${
                  Tab === "CV" ? "bg-gray-800" : ""
                } `}
              >
                CV
              </button>
              <button
                onClick={() => setTab("Details")}
                className={` text-xs md:text-sm py-2 px-4 md:px-6 rounded-lg ${
                  Tab === "Details" ? "bg-gray-800" : ""
                } `}
              >
                Details
              </button>
            </div>
          </div>
          {/* Title */}
          <h1 className="text-3xl font-semibold">{Tab === "CV" ? "CV" : "Details"}</h1>
          
          <div className="bg-slate-600/10 w-full h-fit p-9 rounded-lg mt-5">
            {/* Content based on Tab */}
            {Tab === "CV" ? (
              <>
                <div className="flex items-center justify-between mb-5">
                  <h1 className="text-2xl font-semibold">CVs</h1>

                  {/* Add Category Button */}
                  <button
                    onClick={() => setModalOpen(true)}
                    className="rounded-lg bg-gradient-to-tr from-lightred to-darkred px-5 py-2"
                  >
                    +Add CV
                  </button>
                </div>

                {/* Data Table for Team */}
                <div>
                  {loading ? (
                    <div>Loading interview sessions...</div>
                  ) : (
                    <DataTable columns={columns} data={categories} />
                  )}
                </div>

                {modalOpen && <InterviewCategoryModal setModalOpen={setModalOpen} isUpdated={false} />}

                {/* Pagination */}
                <Pagination>
                  <PaginationContent>
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
              </>
            ) : (
              // Sample content for Details Tab
              <div className="text-white">
              <h2 className="text-xl font-semibold">Details Form</h2>
              <div className="w-full"> {/* Added max-width and full width to left-align */}
                <ContactFormPreview />
              </div>
            </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </>
  )
}

export default UserProfile