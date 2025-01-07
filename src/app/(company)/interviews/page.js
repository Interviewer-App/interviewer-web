"use client";
import CreateInterviewModal from "@/components/interviews/create-interview-modal";
import InterviewDisplayCard from "@/components/interviews/interview-display-card";
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
import { use, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { getInterviews } from "@/lib/api/interview";

const InterviewsPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await getInterviews("cm5f3mptx0001u77ka8iv6sss");
        setInterviews(response.data);
      } catch (error) {
        console.log("Error fetching interviews:", error);
      }
    };
    fetchInterviews();
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
                  <BreadcrumbLink href="#">Company</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Interviews</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className=" w-full p-9 h-full">
          <h1 className=" text-4xl font-semibold">Interviews</h1>
          <div className=" grid grid-cols-1 gap-9 mt-6 md:grid-cols-2 lg:grid-cols-3">
            <div onClick={() => setModalOpen(true)} className=" w-full h-full cursor-pointer border-4 border-dashed border-gray-700 flex flex-col items-center justify-center rounded-xl">
              <div className=" bg-slate-500 rounded-full p-6 m-14 md:m-0">
                <FaPlus className=" text-white text-3xl " />
              </div>
            </div>
            {interviews.map((interview, index) => (
              <InterviewDisplayCard
                key={index}
                index={index+1}
                interview={interview}
                // title={interview.jobTitle}
                // date={interview.scheduledDate}
                // time={interview.scheduledAt}
              />
            ))}
          </div>
        </div>
        {modalOpen && (<CreateInterviewModal setModalOpen={setModalOpen}/>)}
      </SidebarInset>
    </>
  );
};

export default InterviewsPage;
