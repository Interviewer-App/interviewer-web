'use client'

import React, { useState, useEffect } from "react";
import { columns } from "../../../components/ui/DataTable/column";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { DataTable } from "../../../components/ui/DataTable/Datatable";
import { fetchUsers } from "@/lib/api/users";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const UsersSearchPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchPaymentsData = async () => {
      setLoading(true);
      // Fetch users data and total user count
      await fetchUsers(page, limit, setLoading, setPayments, setTotalUsers);
    };

    fetchPaymentsData();
  }, [page, limit]);

  // Handle pagination navigation
  const handleNextPage = () => {
    if (page * limit < totalUsers) {
      setPage(page + 1);
    }
  };

  const handlePage = (newPage) => {
    if (newPage <= Math.ceil(totalUsers / limit)) {
      setPage(newPage);
    }
  }

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

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
                  <BreadcrumbLink href="#">Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Users</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="px-9 py-4 w-full max-w-[1500px] mx-auto h-full text-white">
        <h1 className="text-3xl font-semibold">Users</h1>
        <div className=" bg-[#1b1d22] w-full h-fit  p-6 rounded-lg mt-7">
          <div>
          <div className="mb-3">
              <h2 className="text-xl font-bold flex items-center gap-2">
                All Users
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
                <DataTable columns={columns} data={payments} />
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

        {/* <div className="px-20">
          {loading ? (
            <div>Loading payments...</div>
          ) : (
            <DataTable columns={columns} data={payments} />
          )}
        </div> */}

        {/* Pagination Controls */}
        {/* <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={handlePreviousPage} disabled={page <= 1} />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink onClick={() => handlePage(page)}>{page}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink onClick={() => handlePage(page + 1)}>{page + 1}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext onClick={handleNextPage} disabled={page * limit >= totalUsers} />
            </PaginationItem>
          </PaginationContent>
        </Pagination> */}
      </SidebarInset>
    </>
  );
};

export default UsersSearchPage;
