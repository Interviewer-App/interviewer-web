'use client'
import React, { useEffect } from 'react'
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { fetchJoinedInterviews } from '@/lib/api/interview-session';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const joinedInterviews = () => {

    // useEffect(() => {
    //     const fetchuserJoinedInterviews = async () => {

    //         const candidateId = session?.user?.companyID;
    //         await fetchJoinedInterviews(candidateId);
    //         fetchuserJoinedInterviews();
    //     }
    // },[])





    return (
        <div>
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-3">
                        <SidebarTrigger />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <BreadcrumbLink href="#">Company</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Joined Interviews</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
{/* 
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
                </div> */}
            </SidebarInset>
        </div>
    )
}

export default joinedInterviews