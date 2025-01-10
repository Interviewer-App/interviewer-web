'use client'
import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import { fetchJoinedInterviews } from '@/lib/api/interview-session';
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { DataTable } from '@/components/ui/Interview-DataTable/Datatable';
import { columns } from '../../../components/ui/Interview-DataTable/column';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

const JoinedInterviews = () => {
    const [payments, setPayments] = useState([]);  // Store interviews data
    const [loading, setLoading] = useState(false);  // Loading state
    const [page, setPage] = useState(1);  // Page number
    const [limit, setLimit] = useState(10);  // Limit of items per page
    const [totalUsers, setTotalUsers] = useState(0);  // Total users count for pagination

    useEffect(() => {
        const fetchUserJoinedInterviews = async () => {
            try {
                setLoading(true);  // Start loading
                const session = await getSession();
                const candidateId = session?.user?.candidateID;
                
                if (!candidateId) {
                    console.log('No candidateId found');
                    setLoading(false);
                    return;
                }

                // Fetch interviews data
                const data = await fetchJoinedInterviews(candidateId, page, limit);
                console.log('Fetched interviews:', data);  
                if (data && Array.isArray(data.interviewSessions)) {
                    setPayments(data.interviewSessions);  // Set interviews
                    setTotalUsers(data.total);  // Set total for pagination
                } else {
                    console.log('No interview data or incorrect response format');
                }
            } catch (error) {
                console.error('Error fetching interviews:', error);
            } finally {
                setLoading(false);  // Stop loading
            }
        };

        fetchUserJoinedInterviews();  // Trigger data fetching when page or limit changes
    }, [page, limit]);  // Re-fetch when page or limit changes

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

    return (
        <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-3">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">Candidate</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Interview Session</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>

            <div className='px-20'>
                {loading ? (
                    <div>Loading interviews...</div>
                ) : (
                    <DataTable columns={columns} data={payments} />
                )}
            </div>

            {/* Pagination Section */}
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious onClick={handlePreviousPage} disabled={page <= 1} />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink onClick={() => setPage(page)}>{page}</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink onClick={() => setPage(page + 1)}>{page + 1}</PaginationLink>
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
    );
};

export default JoinedInterviews;
