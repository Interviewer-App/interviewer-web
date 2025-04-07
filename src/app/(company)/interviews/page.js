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
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { getInterviews } from "@/lib/api/interview";

//MUI
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import NoData from "@/assets/nodata.png";
import Image from "next/image";
import Loading from "@/app/loading";
import { usePathname, useRouter, redirect } from "next/navigation";
import { useSession, getSession } from "next-auth/react";
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Calendar,
  ChevronRight,
  Plus,
  Users,
} from "lucide-react";
import { getCompanyById } from "@/lib/api/users";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { StatCard } from "@/components/interviews/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const InterviewsPage = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [interviews, setInterviews] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAnyInterviews, setIsAnyInterviews] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({});
  const [companyId, setCompanyId] = useState("");
  const [hoveredId, setHoveredId] = useState();
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [pendingReviews, setPendingReviews] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchInterviews = async () => {
      setIsLoading(true);
      try {
        const session = await getSession();
        const companyId = session?.user?.companyID;
        const response = await getInterviews(companyId);

        if (response) {
          setInterviews(response.data);
          setIsAnyInterviews(response.data.length > 0);
        }
      } catch (error) {
        setIsLoading(false);
        // Check if the error is a 404 (no interviews found)
        if (error.response && error.response.status === 404) {
          // No interviews found, set state accordingly
          setInterviews([]);
          setIsAnyInterviews(false);
        } else {
          // Handle other errors
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Error fetching interviews: ${error}`,
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviews();
  }, [modalOpen]);

  useEffect(() => {
    const fetchCompanyId = async () => {
      try {
        const session = await getSession();
        const companyId = session?.user?.companyID;
        if (companyId) {
          setCompanyId(companyId);
        }
      } catch (err) {
        if (err.response) {
          const { data } = err.response;

          if (data && data.message) {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: `Company Details Fetching Faild: ${data.message}`,
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

    fetchCompanyId();
  }, []);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await getCompanyById(companyId);
        if (response.data) {
          setCompanyDetails(response.data);
        }
      } catch (err) {
        if (err.response) {
          const { data } = err.response;
          if (data && data.message) {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: `Company Details Fetching Failed: ${data.message}`,
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

    if (companyId) {
      fetchCompanyDetails();
    }
  }, [companyId]);

  useEffect(() => {
    if (interviews.length > 0) {
      let totalCandidates = 0;
      let pendingReviews = 0;

      interviews.forEach((interview) => {
        totalCandidates += interview.interviewSessions.length;
        interview.interviewSessions.forEach((session) => {
          if (session.feedbackId === null) {
            pendingReviews += 1;
          }
        });
      });
      setTotalCandidates(totalCandidates);
      setPendingReviews(pendingReviews);
    }
  }, [interviews]);

  if (status === "loading") {
    return (
      <>
        <Loading />
      </>
    );
  } else {
    if (session.user.role !== "COMPANY") {
      const loginURL = `/login?redirect=${encodeURIComponent(pathname)}`;
      redirect(loginURL);
    }
  }

  const getStatusBadge = (startTime, endTime) => {
    const currentDate = new Date();
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    let status = "upcoming";

    if (currentDate < startDate) {
      status = "upcoming";
    } else if (currentDate >= startDate && currentDate <= endDate) {
      status = "ongoing";
    } else if (currentDate > endDate) {
      status = "completed";
    }

    switch (status) {
      case "upcoming":
        return (
          <Badge
            variant="outline"
            className=" !text-orange-400 !border-orange-400/30 py-1 px-4 bg-orange-400/10"
          >
            Upcoming
          </Badge>
        );
      case "ongoing":
        return (
          <Badge
            variant="outline"
            className="!text-emerald-400 py-1 px-4 !border-emerald-400/30 !bg-emerald-400/10"
          >
            Ongoing
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="!text-green-600 !border-green-600/30 bg-green-600/10 py-1 px-4"
          >
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  const getInterviewStatus = (startTime, endTime) => {
    const currentDate = new Date();
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    let status = "upcoming";

    if (currentDate < startDate) {
      status = "upcoming";
    } else if (currentDate >= startDate && currentDate <= endDate) {
      status = "ongoing";
    } else if (currentDate > endDate) {
      status = "completed";
    }

    return status;
  };

  const navigationClickHandler = (interviewID) => {
    router.push(`/interviews/${encodeURIComponent(interviewID)}`);
  };

  return (
    <>
      <SidebarInset>
        <header className="flex h-16 shrink-0 bg-black items-center gap-2">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage
                    href="/interviews"
                    className=" hidden md:block cursor-pointer"
                  >
                    Interviews
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className=" px-9 py-4 w-full bg-black max-w-[1500px] mx-auto h-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StatCard
              title="Total Candidates"
              value={totalCandidates}
              variant="total"
              className="transform transition-transform duration-300 shadow-md border border-border/30 animate-scale-in [animation-delay:0ms] hover:border-primary/30"
            />

            <StatCard
              title="Scheduled Interviews"
              value={interviews.length}
              variant="pending"
              className="transform transition-transform duration-300 shadow-md border border-border/30 animate-scale-in [animation-delay:100ms] hover:border-warning/30"
            />

            <StatCard
              title="Pending Reviews"
              value={pendingReviews}
              variant="completed"
              className="transform transition-transform duration-300 shadow-md border border-border/30 animate-scale-in [animation-delay:200ms] hover:border-success/30"
            />
          </div>

          <div className=" mt-10 mb-5">
            <div className=" flex w-full items-center justify-between">
              <div className="flex items-center w-full justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">Interviews</h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-[#b3b3b3] cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-800 text-white p-2 rounded-md text-sm max-w-[200px] text-center">
                        View the interviews published by the company, including
                        available roles and details about each interview
                        process.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {interviews.length > 0 && (
                  <Button
                    onClick={() => {router.push('/interviews/createInterview')}}
                    className="flex items-center gap-2 transform hover:scale-105 transition-all animate-scale-in shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create Interview</span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {interviews.length > 0 ? (
              interviews.map((interview, index) => (
                <Card
                  key={interview.interviewID}
                  onClick={() => navigationClickHandler(interview.interviewID)}
                  className={`
                      relative !bg-[#1b1d23] overflow-hidden shadow-sm transition-all hover:shadow-md animate-scale-in cursor-pointer
                      ${
                        getInterviewStatus(
                          interview.scheduling[0].startTime,
                          interview.scheduling[interview.scheduling.length - 1]
                            .endTime
                        ) === "upcoming"
                          ? "!border-l-2 !border-l-orange-400"
                          : getInterviewStatus(
                              interview.scheduling[0].startTime,
                              interview.scheduling[
                                interview.scheduling.length - 1
                              ].endTime
                            ) === "ongoing"
                          ? "!border-l-2 !border-l-emerald-500"
                          : getInterviewStatus(
                              interview.scheduling[0].startTime,
                              interview.scheduling[
                                interview.scheduling.length - 1
                              ].endTime
                            ) === "completed"
                          ? "!border-l-2 !border-l-green-600"
                          : ""
                      }
                      ${
                        index === 0
                          ? "[animation-delay:100ms]"
                          : index === 1
                          ? "[animation-delay:200ms]"
                          : index === 2
                          ? "[animation-delay:300ms]"
                          : "[animation-delay:400ms]"
                      }
                    `}
                >
                  <div className="p-4 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center justify-start gap-2">
                          {interview.interviewSessions.filter(
                            (session) => session.interviewStatus === "ongoing"
                          ).length > 0 && (
                            <div className=" relative flex items-center justify-center h-full w-2.5 ">
                              <span className="absolute w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                              <span className="absolute w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                            </div>
                          )}
                          <h3 className="text-lg font-semibold">
                            {interview.jobTitle}
                          </h3>
                        </div>
                        {getStatusBadge(
                          interview.scheduling[0].startTime,
                          interview.scheduling[interview.scheduling.length - 1]
                            .endTime
                        )}
                      </div>

                      {/* <div className="flex items-center space-x-2 mb-3 text-sm text-[#b3b3b3]">
                    <Building2 className="h-4 w-4" />
                    <span>{interview.department}</span>
                  </div> */}

                      <div className="space-y-1 border-t border-gray-800 pt-3 pb-1">
                        <div className="flex items-center text-sm text-[#b3b3b3]">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>
                            {new Date(
                              interview.scheduling[0].startTime
                            ).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>

                        <div className="flex items-center text-sm text-[#b3b3b3]">
                          <Users className="h-4 w-4 mr-2" />
                          <span>
                            {interview.interviewSessions.length} candidates
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 text-xs text-[#b3b3b3] hover:text-primary"
                      >
                        Details
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="border-none shadow-md overflow-hidden col-span-3 bg-gray-900 border-l-4 border-l-gray-700">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="mb-4 p-3 rounded-full bg-gray-800">
                    <Calendar className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">
                    No Interviews Found
                  </h3>
                  <p className="text-sm text-gray-400 mb-6 max-w-md">
                    It looks like there are no interviews scheduled yet. Start
                    creating interviews to connect with top talent and fill your
                    open positions.
                  </p>
                  
                  <Button
                    size="lg"
                    className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium"
                    onClick={() => {router.push('/interviews/createInterview')}}
                  >
                    Create Interview <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        {/* <div className="flex flex-row items-center space-x-1">
              <h1 className=" text-4xl font-semibold mb-4">Interviews</h1>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-5 h-5 text-white hover:text-gray-200 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-800 text-white p-2 rounded-md text-sm max-w-[200px] text-center">
                    View the interviews published by the company, including
                    available roles and details about each interview process.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div> */}
        {/* {!isAnyInterviews && (
              <button
                onClick={() => setModalOpen(true)}
                className=" hidden md:block rounded-lg font-semibold bg-white text-black text-sm px-5 py-2"
              >
                + Create Interview
              </button>
            )} */}
        {/* </div> */}
        {/* {isAnyInterviews && (
            <div className=" grid grid-cols-1 gap-9 mt-6 md:grid-cols-2 lg:grid-cols-3">
              <div
                onClick={() => setModalOpen(true)}
                className=" w-full h-full cursor-pointer border-4 border-dashed border-gray-700 flex flex-col items-center justify-center rounded-xl"
              >
                <div className=" bg-slate-500 rounded-full p-6 m-14 md:m-0">
                  <FaPlus className=" text-white text-3xl " />
                </div>
              </div>
              {interviews.map((interview, index) => (
                <div
                  className="w-full"
                  key={interview.interviewID}
                  onMouseEnter={() => setHoveredId(interview.interviewID)}
                >
                  <InterviewDisplayCard
                    key={index}
                    index={index + 1}
                    interview={interview}
                    hoveredId={hoveredId}
                  />
                </div>
              ))}
            </div>
          )} */}
        {/* {!isAnyInterviews && (
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
                <button
                  onClick={() => setModalOpen(true)}
                  className=" mx-auto my-4 block md:hidden rounded-lg bg-white text-black px-5 py-2"
                >
                  + Create Interview
                </button>
              </div>
            </div>
          )} */}
        {/* </div> */}
        {modalOpen && <CreateInterviewModal setModalOpen={setModalOpen} />}
        {isLoading && (
          <div className=" fixed  top-0 left-0 h-full w-full flex items-center justify-center bg-black/50">
            <Loading />
          </div>
        )}
      </SidebarInset>
    </>
  );
};

export default InterviewsPage;
