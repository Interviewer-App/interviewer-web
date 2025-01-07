"use client";
import InterviewScheduleCard from "@/components/interview-schedules/interview-schedule-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getPublishedInterview } from "@/lib/api/interview";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";

const InterviewSchedulePage = () => {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const fetchPublishedInterviews = async () => {
      try {
        const response = await getPublishedInterview();
        setInterviews(response.data);
      } catch (error) {
        console.log("Error fetching interviews:", error);
      }
    };
    fetchPublishedInterviews();
  }, []);

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
                            <BreadcrumbLink href="#">
                              Candidate
                            </BreadcrumbLink>
                          </BreadcrumbItem>
                          <BreadcrumbSeparator className="hidden md:block" />
                          <BreadcrumbItem>
                            <BreadcrumbPage>Interview Session</BreadcrumbPage>
                          </BreadcrumbItem>
                        </BreadcrumbList>
                      </Breadcrumb>
                    </div>
                  </header>

        <div className=" w-full p-9 h-full">
          <h1 className=" text-4xl font-semibold">Scheduled Interviews</h1>
          <div className=" grid grid-cols-1 gap-9 mt-6 md:grid-cols-2 lg:grid-cols-3">
            {interviews.map((interview, index) => (
              <InterviewScheduleCard
                key={index}
                index={index+1}
                interview={interview}
              />
            ))}
          </div>
        </div>
      </SidebarInset>
    </>
  );
};

export default InterviewSchedulePage;
