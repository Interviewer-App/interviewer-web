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
import socket from "../../../lib/utils/socket";
import NoData from "@/assets/nodata.png";
import Image from "next/image";

const InterviewSchedulePage = () => {
  const [interviews, setInterviews] = useState([]);
  const [isAnyInterviews, setIsAnyInterviews] = useState(false);

  useEffect(() => {
    const fetchPublishedInterviews = async () => {
      try {
        const response = await getPublishedInterview();
        setInterviews(response.data);
        setIsAnyInterviews(response.data.length > 0);
      } catch (error) {
        console.log("Error fetching interviews:", error);
      }
    };

    socket.on("published", (data) => {
      fetchPublishedInterviews();
    });

    fetchPublishedInterviews();

    return () => {
      socket.off("published");
    };

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

        <div className=" px-9 py-4 w-full max-w-[1500px] mx-auto h-full text-white">
          <h1 className=" text-4xl font-semibold">Scheduled Interviews</h1>
          {isAnyInterviews ? (
            <div className=" grid grid-cols-1 gap-9 mt-6 md:grid-cols-2 lg:grid-cols-3">
              {interviews.map((interview, index) => (
                <InterviewScheduleCard
                  key={index}
                  index={index + 1}
                  interview={interview}
                  showButton={true}
                />
              ))}
            </div>
          ) : (
            <div className=" relative flex justify-center items-center h-full w-full">
              <div className=" w-full">
                <Image
                  src={NoData}
                  alt="No data"
                  className=" mx-auto h-[150px] w-[200px]"
                />
                <h1 className="text-3xl py-2 text-gray-500 w-full text-center">
                  No interviews found
                </h1>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </>
  );
};

export default InterviewSchedulePage;
