"use client";
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
import socket from "../../../../lib/utils/socket";
import NoData from "@/assets/nodata.png";
import Image from "next/image";
import Loading from "@/app/loading";
import { usePathname , useRouter, redirect } from 'next/navigation';
import { useSession } from "next-auth/react"
import { Filter   } from "lucide-react";
const InterviewScheduleDetailsPage = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [interviews, setInterviews] = useState([]);
  const [isAnyInterviews, setIsAnyInterviews] = useState(false);
  const [sordBy, setSortBy] = useState('');
  const [datePosted, setDatePosted] = useState('');
  const [interviewCategory, setInterviewCategory] = useState('');
  const [jobTitle, setJobTitle] = useState("");
  const [keyWords, setKeyWords] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleOpen = () => setIsSheetOpen(true);
  const handleClose = () => setIsSheetOpen(false);

  useEffect(() => {
    socket.on("published", (data) => {
      fetchPublishedInterviews();
    });

    fetchPublishedInterviews();

    return () => {
      socket.off("published");
    };
  }, []);

  const fetchPublishedInterviews = async () => {
    try {
      console.log("interviewCategory", interviewCategory);
      const response = await getPublishedInterview(
        sordBy,
        datePosted,
        interviewCategory,
        jobTitle,
        keyWords
      );
      setInterviews(response.data);
      setIsAnyInterviews(response.data.length > 0);
    } catch (error) {
      console.log("Error fetching interviews:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchPublishedInterviews();
    setIsSheetOpen(false);
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
                  <BreadcrumbPage>Interview ID : </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="px-9 py-4 w-full max-w-[1500px] mx-auto  h-full text-white">
          <div className=" w-full flex justify-between items-center">
            <h1 className=" text-4xl font-semibold">Interview ID : </h1>
          </div>
          
        </div>
      </SidebarInset>
    </>
  );
};

export default InterviewScheduleDetailsPage;
