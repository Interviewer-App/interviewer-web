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
import { usePathname, useRouter, redirect } from 'next/navigation';
import { useSession } from "next-auth/react"
import { Filter } from "lucide-react";
import { getInterviewById } from "@/lib/api/interview";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { getSession } from "next-auth/react";
import { createInterviewSession } from "@/lib/api/interview-session";

const InterviewScheduleDetailsPage = ({ params }) => {
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
  const router = useRouter();
  const [interviewId, setInterviewId] = useState(null);
  const [interviewDetail, setInterviewDetail] = useState("");
  const handleOpen = () => setIsSheetOpen(true);
  const handleClose = () => setIsSheetOpen(false);
  const { toast } = useToast();




  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setInterviewId(resolvedParams.id);
    };
    unwrapParams();
  }, [params]);



  // useEffect(() => {
  //   socket.on("published", (data) => {
  //     fetchPublishedInterviews();
  //   });

  //   fetchPublishedInterviews();

  //   return () => {
  //     socket.off("published");
  //   };
  // }, []);

  // const fetchPublishedInterviews = async () => {
  //   try {
  //     console.log("interviewCategory", interviewCategory);
  //     const response = await getPublishedInterview(
  //       sordBy,
  //       datePosted,
  //       interviewCategory,
  //       jobTitle,
  //       keyWords
  //     );
  //     setInterviews(response.data);
  //     console.log('Testing categories',response);
  //     setIsAnyInterviews(response.data.length > 0);
  //   } catch (error) {
  //     console.log("Error fetching interviews:", error);
  //   }
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   fetchPublishedInterviews();
  //   setIsSheetOpen(false);
  // };

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await getInterviewById(interviewId);
        setInterviewDetail(response.data);
        console.log('fetched Interview:', response);
      } catch (error) {
        console.log("Error fetching interviews:", error);
      }
    };
    if (interviewId) fetchInterview();
  }, [interviewId, status]);


  const joinInterviewSession = async (e) => {
    e.preventDefault();
    try {
      const session = await getSession();
      const candidateID = session?.user?.candidateID;
      const interviewSessionData = {
        candidateId: candidateID,
        interviewId: interviewDetail.interviewID,
        interviewCategory: interviewDetail.interviewCategory,
        scheduledDate: interviewDetail.scheduledDate,
        scheduledAt: interviewDetail.scheduledAt,
        interviewStatus: "toBeConducted",
      };
      console.log("Interview Data:", interviewDetail);
      console.log("Session ID:", session?.user?.candidateID);

      const response = await createInterviewSession(interviewSessionData);

      if (response) {
        const sessionId = response.data.interviewSession.sessionId;
        const role = session?.user?.role;
        const userId = session?.user?.id;
        const data = {
          sessionId: sessionId,
          userId: userId,
          role: role
        }
        socket.emit('joinInterviewSession', data);
        router.push(`/interview-room/${sessionId}`);
      }
    } catch (err) {
      if (err.response) {
        const { data } = err.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Interview create failed: ${data.message}`,
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "An unexpected error occurred. Please try again.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An unexpected error occurred. Please check your network and try again.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
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
                <BreadcrumbSeparator className="hidden md:block" />

                <BreadcrumbItem>
                  <BreadcrumbPage>Interview Details </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="px-9 py-4 w-full max-w-[1500px] mx-auto  h-full text-white">
          <div className="w-full flex justify-between items-center">
            <h1 className="text-4xl font-semibold">Interview ID: {interviewId}</h1>
            <button
              type="button"
              className="h-12 min-w-[150px] w-full md:w-[10%] cursor-pointer bg-white from-lightred to-darkred rounded-lg text-center text-base text-black font-semibold"
              onClick={joinInterviewSession}
            >
              Join Now
            </button>
          </div>


          {interviewDetail ? (
            <div className="mt-6 space-y-8 max-w-4xl">
              {/* Company Info Section */}
              <div className="bg-stone-900 p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-semibold text-primary mb-2">Company: {interviewDetail.companyName}</h2>
                <p className="text-lg text-gray-300">Job Title: <span className="font-medium text-white">{interviewDetail.jobTitle}</span></p>
                <p className="text-lg text-gray-300">Interview Category: <span className="font-medium text-white">{interviewDetail.interviewCategory}</span></p>
                <p className="text-lg text-gray-300">
                  Scheduled At: <span className="font-medium text-white">{new Date(interviewDetail.scheduledAt).toLocaleString()}</span>
                </p>
              </div>

              {/* Job Description Section */}
              <div className="bg-stone-900 p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-primary mb-4">Job Description</h3>
                <p className="text-gray-300 text-lg leading-relaxed">{interviewDetail.jobDescription || "No description provided."}</p>
              </div>


            </div>

          ) : (
            <div className="mt-6 text-center">
              <p className="text-lg text-gray-400">No interview details available.</p>
            </div>
          )}

        </div>

      </SidebarInset>
    </>
  );
};

export default InterviewScheduleDetailsPage;
