'use client'

import { useEffect, useState, useRef } from 'react';
import { fetchJoinedInterviews } from '@/lib/api/interview-session';
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Loading from "@/app/loading";
import { usePathname, useRouter, redirect } from 'next/navigation';
import { useSession, getSession } from "next-auth/react";
import { getScheduledInterview } from '@/lib/api/interview';
import { TimelineLayout } from '@/components/ui/timeline-layout';

const MyInterviews = () => {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [scheduleInterviews, setScheduleInterviews] = useState([]);  // Store scheduled interviews
    const [loading, setLoading] = useState(false);  // Loading state
    const [page, setPage] = useState(1);  // Page number
    const [limit, setLimit] = useState(10);  // Limit of items per page

    useEffect(() => {
      const fetchUserJoinedInterviews = async () => {
        // debugger
        try {
          setLoading(true);
          const session = await getSession();
          const candidateId = session?.user?.candidateID;
          console.log('candidate ID:', candidateId);

          // Fetch scheduled interviews
          const response = await getScheduledInterview(candidateId);
          setScheduleInterviews(response.data.schedules);
          console.log('Fetched scheduled interviews:', response.data.schedules);
        } catch (error) {
          console.error('Error fetching interviews:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserJoinedInterviews();
    }, [page, limit]);

    if (status === "loading") {
      return <Loading />;
    }

    if (session.user.role !== 'CANDIDATE') {
      const loginURL = `/login?redirect=${encodeURIComponent(pathname)}`;
      redirect(loginURL);
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
        <div className="px-4 py-4 w-full max-w-[1500px] mx-auto h-full text-white">
            <h1 className="text-3xl font-semibold">My Interviews</h1>
            <TimelineLayout interviews={scheduleInterviews} />
        </div>
      </SidebarInset>
    );
  };

  export default MyInterviews;
