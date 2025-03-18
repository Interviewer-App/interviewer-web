"use client";

import { useEffect, useState, useRef, use } from "react";
import { fetchJoinedInterviews } from "@/lib/api/interview-session";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Loading from "@/app/loading";
import { usePathname, useRouter, redirect } from "next/navigation";
import { useSession, getSession } from "next-auth/react";
import { getOverviewOfCandidateInterviews, getScheduledInterview } from "@/lib/api/interview";
import { TimelineLayout } from "@/components/ui/timeline-layout";

const MyInterviews = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [candidateId, setCandidateId] = useState(null);
  const [scheduleInterviews, setScheduleInterviews] = useState([]); // Store scheduled interviews
  const [sortedScheduleInterviews, setSortedScheduleInterviews] = useState([]);
  const [overview, setOverview] = useState({});
  const [loading, setLoading] = useState(false); // Loading state
  const [page, setPage] = useState(1); // Page number
  const [limit, setLimit] = useState(10); // Limit of items per page
  const [showPastInterviews, setShowPastInterviews] = useState(false);
  const [isProfileComplete,setIsProfileComplete]=useState(true);
  const [scheduleData,setScheduleData]=useState({});
  const [isAccepted, setIsAccepted] = useState(false);
  useEffect(() => {
    const fetchCandidateId = async () => {
      try {
        const session = await getSession();
        const candidateId = session?.user?.candidateID;

        setCandidateId(candidateId);

      } catch (error) {
        console.error('Error fetching candidate ID:', error);
      }
    }
    fetchCandidateId();
  }, []);


  useEffect(() => {
    const fetchUserJoinedInterviews = async () => {
      try {
        setLoading(true);
        const response = await getScheduledInterview(candidateId);
        setScheduleData(response.data);
        setScheduleInterviews(response.data.schedules);
        setIsProfileComplete(response.data.isProfileCompleted);

      } catch (error) {
        console.error("Error fetching interviews:", error);
      } finally {
        setLoading(false);
      }
    };

    if (candidateId) fetchUserJoinedInterviews();
  }, [candidateId, isAccepted]);

  useEffect(() => {
    const fetchCandidateOverview = async () => {
      try {
        const response = await getOverviewOfCandidateInterviews(candidateId);
        if (response) {
          setOverview(response.data);
        }
      } catch (error) {
        console.log("Error fetching interviews:", error);
      } finally {
        setLoading(false);
      }
    };

    if (candidateId) fetchCandidateOverview();
  }, [candidateId]);

  useEffect(() => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to the start of the day
  
    const filteredAndSortedArray = [...scheduleInterviews]
      .filter((interview) => {
        const interviewDate = new Date(interview.startTime);
        interviewDate.setHours(0, 0, 0, 0); // Set to the start of the day
  
        // If showPastInterviews is true, include all interviews
        if (showPastInterviews) return true;
  
        // Otherwise, filter out interviews that are in the past (both today and previous days)
        const isToday = interviewDate.getTime() === currentDate.getTime();
        const isPast = interviewDate < currentDate || (isToday && new Date(interview.startTime) < new Date());
  
        return !isPast;
      })
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  
    setSortedScheduleInterviews(filteredAndSortedArray);
  }, [scheduleInterviews, showPastInterviews, isAccepted]);

  if (status === "loading") {
    return <Loading />;
  }

  if (session.user.role !== "CANDIDATE") {
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
              <BreadcrumbItem className="hidden md:block cursor-pointer">
                <BreadcrumbPage>My Interviews</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="px-9 py-4 w-full max-w-[1500px] mx-auto  h-full text-white">
        <h1 className="text-3xl font-semibold">My Interviews</h1>
        <TimelineLayout
          interviews={sortedScheduleInterviews}
          overview={overview}
          showPastInterviews={showPastInterviews}
          setShowPastInterviews={setShowPastInterviews}
          isProfileCompleted={isProfileComplete} 
          setIsAccepted={setIsAccepted}
        />
      </div>
    </SidebarInset>
  );
};

export default MyInterviews;
