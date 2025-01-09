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

const UsersPage = () => {
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

        <div className="px-20">
          {loading ? (
            <div>Loading payments...</div>
          ) : (
            <DataTable columns={columns} data={payments} />
          )}
        </div>

        {/* Pagination Controls */}
        <Pagination>
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
        </Pagination>
      </SidebarInset>
    </>
  );
};

export default UsersPage;
