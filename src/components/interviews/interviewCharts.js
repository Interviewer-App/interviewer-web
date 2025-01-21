"use client";
import { useRouter } from "next/navigation";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/InterviewInvitaionDataTable/Datatable";
import { columns } from "@/components/ui/InterviewInvitaionDataTable/column";
import { getSession } from "next-auth/react";
import { fetchSendInterviewInvitations } from "@/lib/api/interview-invitation";

import { Bar, BarChart } from "recharts"
import { ChartConfig, ChartContainer } from "@/components/ui/chart"

const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#2563eb",
    },
    mobile: {
        label: "Mobile",
        color: "#60a5fa",
    },
}

export default function InterviewCharts({ interviewId }) {
    const [loading, setLoading] = useState(false);
    const [sendInterviewsDataSort, setSendInterviewsDataSort] = useState([]);
    const [page, setPage] = useState(1);  // Page number
    const [limit, setLimit] = useState(10);  // Limit of items per page
    const [totalInvitations, setTotalInvitations] = useState(0);  // Total users count for pagination
    const [sendInterviewsData, setSendInterviewsData] = useState([]);

    useEffect(() => {
        const fetchSendInterviews = async () => {
            debugger
            try {
                setLoading(true); // Start loading
                // const session = await getSession();
                // const candidateId = session?.user?.candidateID;
                // console.log('candidate ID:', candidateId);

                // Fetch interviews data
                await fetchSendInterviewInvitations(interviewId, page, limit, setLoading, setSendInterviewsData, setTotalInvitations);
            } catch (error) {
                console.error('Error fetching interviews:', error);
            }
        };

        // fetchSendInterviews();
    }, [page, limit]); // Fetch new interviews when page or limit change





    return (
        <div className=" bg-slate-600/10 p-9 rounded-lg mt-5">
            <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart accessibilityLayer data={chartData}>
                    <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                    <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                </BarChart>
            </ChartContainer>
        </div>
    );
}
