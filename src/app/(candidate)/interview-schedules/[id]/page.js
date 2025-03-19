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
import { usePathname, useRouter, redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { CalendarClock, CheckCircle, Filter } from "lucide-react";
import { getInterviewById } from "@/lib/api/interview";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { getSession } from "next-auth/react";
import { createInterviewSession } from "@/lib/api/interview-session";
import ScheduleDesplayModal from "@/components/candidate/schedule-display-modal";
import { set } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { bookSchedule } from "@/lib/api/interview-schedules";

const InterviewScheduleDetailsPage = ({ params }) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [interviews, setInterviews] = useState([]);
  const [isAnyInterviews, setIsAnyInterviews] = useState(false);
  const [sordBy, setSortBy] = useState("");
  const [datePosted, setDatePosted] = useState("");
  const [interviewCategory, setInterviewCategory] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [keyWords, setKeyWords] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const router = useRouter();
  const [interviewId, setInterviewId] = useState(null);
  const [interviewDetail, setInterviewDetail] = useState({});
  const handleOpen = () => setIsSheetOpen(true);
  const handleClose = () => setIsSheetOpen(false);
  const { toast } = useToast();
  const [slotModalOpen, setSlotModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

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
        console.log("fetched Interview:", response);
      } catch (error) {
        console.log("Error fetching interviews:", error);
      }
    };
    if (interviewId) fetchInterview();
  }, [interviewId, status]);

  useEffect(() => {
    console.log("Interview Detail:", interviewDetail.scheduling);
  }, [interviewDetail]);

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
          role: role,
        };
        socket.emit("joinInterviewSession", data);
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
    if (session.user.role !== "CANDIDATE") {
      const loginURL = `/login?redirect=${encodeURIComponent(pathname)}`;
      redirect(loginURL);
    }
  }

  const handleBookSlot = async () => {
    try {
      const session = await getSession();
      const candidateID = session?.user?.candidateID;
      const booking = {
        interviewId: interviewId,
        scheduleId: selectedSlot,
        candidateId: candidateID,
      };
      const response = await bookSchedule(booking);
      if (response) {
        toast({
          title: "Success!",
          description: `Your slot has been booked successfully.`,
        });
        setSlotModalOpen(false);
      }
    } catch (err) {
      if (err.response) {
        const { data } = err.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Schedule Booking failed: ${data.message}`,
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
                  <BreadcrumbLink href="/interview-schedules">
                    Interview Schedules
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="hidden md:block">
                    Interview Details
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="px-9 py-4 w-full max-w-[1500px] mx-auto h-full text-white">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Interview ID: {interviewId}</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-t-4 dark:!border-t-white !bg-[#1b1d22]">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold">
                        Company: {interviewDetail.companyName}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <h3 className="text-sm text-[#b3b3b3]">Job Title:</h3>
                          <p className="font-semibold text-lg">
                            {interviewDetail.jobTitle}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm text-[#b3b3b3]">
                            Interview Category:
                          </h3>
                          <p className="font-semibold text-lg">Technical</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="!bg-[#1b1d22]">
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: interviewDetail.jobDescription,
                      }}
                      className="text-[#b3b3b3] text-justify leading-relaxed description"
                    ></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-t-4 dark:!border-t-white !bg-[#1b1d22]">
                <CardHeader>
                  <CardTitle>Schedule Details</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#b3b3b3]">
                        Total Interview Dates:
                      </span>
                      <span className="font-medium">1</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-[#b3b3b3]">
                        Total Schedule Slots:
                      </span>
                      <span className="font-medium">14</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-[#b3b3b3]">Booked Slots:</span>
                      <span className="font-medium">1</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-[#b3b3b3]">Available Slots:</span>
                      <span className="font-medium">13</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Book Slot Card */}
              <Card className="!bg-[#1b1d22]">
                <CardHeader>
                  <CardTitle>Book Your Slot</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-scroll ">
                      {interviewDetail?.scheduling
                        ?.sort((a, b) => {
                          return new Date(a.startTime) - new Date(b.startTime);
                        })
                        .map((slot, index) => (
                          <div
                            key={index}
                            className={`border max-h-12 rounded-md p-3 cursor-pointer transition-all ${
                              selectedSlot === slot.scheduleID
                                ? "border-[#b3b3b3] bg-[#b3b3b31a]"
                                : "border !border-[#b3b3b35a] hover:border-[#b3b3b3aa]"
                            } ${
                              slot.isBooked
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() =>
                              !slot.isBooked && setSelectedSlot(slot.scheduleID)
                            }
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <CalendarClock className="h-4 w-4 text-[#b3b3b3]" />
                                <span className="font-medium">
                                  {new Date(slot.startTime).toLocaleString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    }
                                  )}
                                </span>
                                <span className="text-sm text-[#b3b3b3]">
                                  at
                                </span>
                                <span className="font-medium">
                                  {new Date(slot.startTime)
                                    .toLocaleString("en-US", {
                                      hour: "numeric",
                                      minute: "2-digit",
                                      hour12: true,
                                    })
                                    .replace(" ", "")}
                                </span>
                              </div>
                              {slot.isBooked && (
                                <Badge
                                  variant="outline"
                                  className="!bg-red-500/10 !text-red-600 !border-red-500/50"
                                >
                                  Booked
                                </Badge>
                              )}
                              {selectedSlot === slot.scheduleID && (
                                <CheckCircle className="h-4 w-4 text-primary" />
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger
                        className={`w-full ${
                          selectedSlot === null ? "bg-[#ffffff5a]" : "bg-white"
                        } text-black rounded-lg py-2 h-11 text-sm font-semibold`}
                        disabled={selectedSlot === null}
                      >
                        Book Your Slot
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to Book this time slot?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            If you book this time slot, it will be marked as
                            Booked.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleBookSlot()}
                            className="h-[40px] font-medium"
                          >
                            Book now
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* <div className="px-9 py-4 w-full max-w-[1500px] mx-auto h-full text-white">
          <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center">
            <h1 className="text-4xl font-semibold">
              Interview ID: {interviewId}
            </h1>
            <button
              type="button"
              className="h-11 min-w-[150px] mt-5 md:mt-0 w-[200px] md:w-[10%] cursor-pointer bg-white rounded-lg text-center text-sm text-black font-semibold"
              onClick={() => setSlotModalOpen(true)}
            >
              Book Your Slot
            </button>
          </div>

          {interviewDetail ? (
            <div className="mt-6 flex flex-col md:flex-row justify-between items-start">
              <div className=" w-full md:w-[70%]">
                <div className="bg-gray-500/20 p-8 rounded-lg shadow-md">
                  <h2 className="text-3xl font-semibold text-primary mb-2">
                    Company: {interviewDetail.companyName}
                  </h2>
                  <p className="text-lg text-gray-300">
                    Job Title:{" "}
                    <span className="font-medium text-white">
                      {interviewDetail.jobTitle}
                    </span>
                  </p>
                  <p className="text-lg text-gray-300">
                    Interview Category:{" "}
                    <span className="font-medium text-white">
                      {interviewDetail.interviewCategory}
                    </span>
                  </p>
                </div>

                <div className="bg-gray-500/20 p-8 mt-5 rounded-lg shadow-md">
                  <h3 className="text-2xl font-semibold text-primary mb-4">
                    Job Description
                  </h3>
                  <div
                    className="ttext-gray-300 text-justify text-gray-300 text-lg leading-relaxed description"
                    dangerouslySetInnerHTML={{
                      __html: interviewDetail.jobDescription,
                    }}
                  />
                </div>
              </div>
              <div className=" w-full md:w-[30%] md:ml-5 mt-5 md:mt-0 bg-gray-500/20 p-8 h-full rounded-lg shadow-md">
                <h2 className="text-3xl font-semibold text-primary mb-2">
                  Schedule Details
                </h2>
                <p className="text-lg text-gray-400">
                  Total Interview Dates:{" "}
                  <span className=" font-semibold text-white">
                    {Math.ceil(
                      (new Date(interviewDetail.endDate) -
                        new Date(interviewDetail.startDate)) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </span>
                </p>
                <p className="text-lg text-gray-400">
                  Total Schedule Slots:{" "}
                  <span className=" font-semibold text-white">
                    {interviewDetail?.scheduling?.length}
                  </span>
                </p>
                <p className="text-lg text-gray-400">
                  Booked Slots:{" "}
                  <span className=" font-semibold text-white">
                    {
                      interviewDetail?.scheduling?.filter(
                        (schedule) => schedule.isBooked === true
                      ).length
                    }
                  </span>
                </p>
                <p className="text-lg text-gray-400">
                  Available Slots:{" "}
                  <span className=" font-semibold text-white">
                    {
                      interviewDetail?.scheduling?.filter(
                        (schedule) => schedule.isBooked === false
                      ).length
                    }
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-6 text-center">
              <p className="text-lg text-gray-400">
                No interview details available.
              </p>
            </div>
          )}
        </div> */}
      </SidebarInset>
      {/* {slotModalOpen && (
        <ScheduleDesplayModal
          setSlotModalOpen={setSlotModalOpen}
          interviewId={interviewId}
          startDate={interviewDetail.startDate}
          endDate={interviewDetail.endDate}
        />
      )} */}
    </>
  );
};

export default InterviewScheduleDetailsPage;
