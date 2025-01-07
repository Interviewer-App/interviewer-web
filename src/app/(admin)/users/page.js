'use client'

import React, { useState, useEffect } from "react";
import { columns } from "../../../components/ui/DataTable/column";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { DataTable } from "../../../components/ui/DataTable/Datatable";
import { fetchUsers } from "@/lib/api/users";

const UsersPage = () => {
  const [payments, setPayments] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchPaymentsData = async () => {
      setLoading(true);
      // Make sure to pass the correct page and limit to the API
      await fetchUsers(page, limit, setLoading, setPayments, setTotalUsers); 
    };

    fetchPaymentsData(); 
  }, [page, limit]); // Ensure that when page or limit changes, data is fetched

  // Pagination logic
  const handleNextPage = () => {
    if (page * limit < totalUsers) {
      setPage(page + 1);
    }
  };

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

        <div>
          {loading ? (
            <div>Loading payments...</div> 
          ) : (
            <DataTable columns={columns} data={payments} />
          )}
        </div>

        <div className="flex items-center justify-end space-x-2 py-4">
          <button
            className="btn btn-outline"
            onClick={handlePreviousPage}
            disabled={page <= 1}
          >
            Previous
          </button>
          <button
            className="btn btn-outline px-6"
            onClick={handleNextPage}
            disabled={page * limit >= totalUsers}
          >
            Next
          </button>
        </div>
      </SidebarInset>
    </>
  );
};

export default UsersPage;
