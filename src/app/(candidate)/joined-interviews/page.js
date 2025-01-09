'use client'
import { useEffect, useState } from 'react';
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { fetchJoinedInterviews } from '@/lib/api/interview-session';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { getSession } from 'next-auth/react';
import { DataTable } from '@/components/ui/Interview-DataTable/Datatable';
import { columns } from '../../../components/ui/Interview-DataTable/column';

const JoinedInterviews = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        const fetchUserJoinedInterviews = async () => {
            try {
                // Fetch session information
                const session = await getSession();
                const candidateId = session?.user?.candidateID;

                if (!candidateId) {
                    console.log('No candidateId found');
                    return;
                }

                // Make the API call to fetch interviews
                await fetchJoinedInterviews(candidateId, page, limit, setLoading, setLimit, setPayments);

            } catch (error) {
                console.log('Error fetching interviews:', error);
            }
        };

        fetchUserJoinedInterviews(); // Trigger the API call on component mount
    }, [page, limit]); // Depend on page and limit, so the effect reruns when these change.

    // Log the payments when it updates
    useEffect(() => {
        console.log('Updated payments:', payments);
    }, [payments]); // This will log whenever `payments` is updated.

    // Pagination
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
    );
};

export default JoinedInterviews;
