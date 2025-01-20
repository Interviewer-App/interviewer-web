'use client'
import { useEffect, useState, useRef } from 'react';
import { fetchJoinedInterviews } from '@/lib/api/interview-session';
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { DataTable } from '@/components/ui/InterviewSessionDataTable/Datatable';
import { columns } from '../../../components/ui/InterviewSessionDataTable/column';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import Loading from "@/app/loading";
import { usePathname, useRouter, redirect } from 'next/navigation';
import { useSession, getSession } from "next-auth/react"


const MyInterviews = () => {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [interviewData, setInterviewData] = useState([]);  // Store interviews data
    const [loading, setLoading] = useState(false);  // Loading state
    const [page, setPage] = useState(1);  // Page number
    const [limit, setLimit] = useState(10);  // Limit of items per page
    const [totalUsers, setTotalUsers] = useState(0);  // Total users count for pagination

    const myVideoRef = useRef < HTMLVideoElement > (null);
    const callingVideoRef = useRef < HTMLVideoElement > (null);

    useEffect(() => {
        const fetchUserJoinedInterviews = async () => {
            try {
                setLoading(true); // Start loading
                const session = await getSession();
                const candidateId = session?.user?.candidateID;
                console.log('candidate ID:', candidateId);

                // Fetch interviews data
                await fetchJoinedInterviews(candidateId, page, limit, setLoading, setInterviewData, setTotalUsers);
            } catch (error) {
                console.error('Error fetching interviews:', error);
            }
        };

        fetchUserJoinedInterviews();
    }, [page, limit]); // Fetch new interviews when page or limit change

    // Log the fetched interviews when payments state changes
    useEffect(() => {
        console.log('Fetched interviews:', interviewData);
    }, [interviewData]); // This effect runs whenever payments state changes

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
        if (session.user.role !== 'CANDIDATE') {
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
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">Candidate</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>My Interviews</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>

            <div className="px-9 py-4 w-full max-w-[1500px] mx-auto h-full text-white">
                <h1 className="text-3xl font-semibold">My Interviews</h1>
                <div className=" bg-slate-600/10 w-full h-fit  p-9 rounded-lg mt-5">
                    <div>
                        <h1 className=" text-2xl font-semibold">My Interview</h1>

                  
                    </div>



                </div>
            </div>
        </SidebarInset>
    );
};

export default MyInterviews;
