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
import {
  getOverviewOfCandidateInterviews,
  getScheduledInterview,
} from "@/lib/api/interview";
import { TimelineLayout } from "@/components/ui/timeline-layout";
import { useToast } from "@/hooks/use-toast";
import {
  AlertCircle,
  AlertCircleIcon,
  ArrowRight,
  Bell,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock,
  ListTodo,
  Mic,
  UserCircle2,
  Video,
  VideoIcon,
  Wifi,
  X,
  XCircle,
} from "lucide-react";

import { ToastAction } from "@/components/ui/toast";
import {
  getInterviewById,
  updateInterviewInvitaionStatus,
} from "@/lib/api/interview";
import socket from "@/lib/utils/socket";
import { createInterviewSession } from "@/lib/api/interview-session";
import Lottie from "lottie-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { Atom, BadgeCheck } from "lucide-react";
import { getCandidateById } from "@/lib/api/users";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { LuCircleCheck } from "react-icons/lu";

const MyInterviews = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [candidateId, setCandidateId] = useState(null);
  const [scheduleInterviews, setScheduleInterviews] = useState([]); // Store scheduled interviews
  const [sortedScheduleInterviews, setSortedScheduleInterviews] = useState([]);
  const [overview, setOverview] = useState({});
  // const [loading, setLoading] = useState(false); // Loading state
  const [page, setPage] = useState(1); // Page number
  const [limit, setLimit] = useState(10); // Limit of items per page
  const [showPastInterviews, setShowPastInterviews] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const [scheduleData, setScheduleData] = useState({});
  const [isAccepted, setIsAccepted] = useState(false);

  const [isAnyInterviews, setIsAnyInterviews] = useState(false);
  const [sordBy, setSortBy] = useState("");
  const [datePosted, setDatePosted] = useState("");
  const [interviewCategory, setInterviewCategory] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [keyWords, setKeyWords] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const router = useRouter();
  const [interviewId, setInterviewId] = useState(null);
  const [interviewDetail, setInterviewDetail] = useState("");
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [expandedInterviewId, setExpandedInterviewId] = useState(null);
  const [copiedInterviewIds, setCopiedInterviewIds] = useState({});
  // const totalInterviews = interviews.length;
  const [candidateDetails, setCandidateDetails] = useState();
  const [interviewFilter, setInterviewFilter] = useState("upcoming");
  const [expandedInterviewIds, setExpandedInterviewIds] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const requirements = [
    {
      icon: <UserCircle2 className="h-5 w-5" />,
      text: "Complete your profile information",
      subtext: "Ensure your profile details are up-to-date",
    },
    {
      icon: <Wifi className="h-5 w-5" />,
      text: "Stable internet connection",
      subtext: "Minimum 1Mbps upload and download speed",
    },
    {
      icon: <Video className="h-5 w-5" />,
      text: "Camera is ready",
      subtext: "Find a well-lit, professional background",
    },
    {
      icon: <Mic className="h-5 w-5" />,
      text: "Microphone is working",
      subtext: "Test your audio in a quiet environment",
    },
  ];
  useEffect(() => {
    const fetchCandidateId = async () => {
      try {
        const session = await getSession();
        const candidateId = session?.user?.candidateID;

        setCandidateId(candidateId);
      } catch (error) {
        console.error("Error fetching candidate ID:", error);
      }
    };
    fetchCandidateId();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const fetchUserJoinedInterviews = async () => {
      try {
        const response = await getScheduledInterview(candidateId);
        setScheduleData(response.data);
        setScheduleInterviews(response.data.schedules);
        setIsProfileComplete(response.data.isProfileCompleted);
      } catch (error) {
        console.error("Error fetching interviews:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (candidateId) fetchUserJoinedInterviews();

    socket.on("updateMyInterviews", (data) => {
      if(data.candidateEmail === session?.user?.email) {
        fetchUserJoinedInterviews();
      }
    })
  }, [candidateId, isAccepted]);

  useEffect(() => {
    setIsLoading(true);
    const fetchCandidateOverview = async () => {
      try {
        const response = await getOverviewOfCandidateInterviews(candidateId);
        if (response) {
          setOverview(response.data);
        }
      } catch (error) {
        console.log("Error fetching interviews:", error);
      } finally {
        setIsLoading(false);
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
        const isPast =
          interviewDate < currentDate ||
          (isToday && new Date(interview.startTime) < new Date());

        return !isPast;
      })
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

    setSortedScheduleInterviews(filteredAndSortedArray);
  }, [scheduleInterviews, showPastInterviews, isAccepted]);

  const formatDate = (date) => {
    const options = { month: "short" };
    return new Date(date).toLocaleDateString("en-US", options);
  };
  const formatDay = (date) => {
    const options = { day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };
  const formatDateMoreDetailsSection = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  // Function to format the time
  const formatTime = (date) => {
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return new Date(date).toLocaleTimeString("en-US", options); // e.g., '4:45 PM'
  };

  const handleInterviewStatus = async (interview, status) => {
    const session = await getSession();
    const candidateId = session?.user?.candidateID;
    try {
      const response = await updateInterviewInvitaionStatus(
        interview.interview.interviewID,
        candidateId,
        {
          status: status,
          scheduledDate: interview.startTime,
          scheduledAt: interview.startTime,
        }
      );
      if (response) {
        setIsAccepted(true);

        socket.emit("InvitationStuatusUpdate", {
          interviewId: interviewId,
        });

        // toast({
        //   title: `Interview ${status === "ACTIVE" ? "published" : "unpublished"
        //     } Successfully!`,
        //   description: `The interview has been ${status === "ACTIVE" ? "published" : "unpublished"
        //     } and is now ${status === "ACTIVE" ? "available" : "not available"}.`,
        //   action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
        // });
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Interview update failed: ${data.message}`,
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

  const handleCopy = (interviewId) => {
    navigator.clipboard
      .writeText(interviewId)
      .then(() => {
        // Set the copied state for the specific interview
        setCopiedInterviewIds((prevState) => ({
          ...prevState,
          [interviewId]: true,
        }));

        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setCopiedInterviewIds((prevState) => ({
            ...prevState,
            [interviewId]: false,
          }));
        }, 2000); // Reset after 2 seconds
      })
      .catch((err) => console.log("Failed to copy text: ", err));
  };

  const joinInterviewSession = async (interview) => {
    // e.preventDefault();
    try {
      const session = await getSession();
      const candidateID = session?.user?.candidateID;
      const interviewSessionData = {
        candidateId: candidateID,
        interviewId: interview.interviewId,
        scheduledDate: interview.startTime,
        scheduledAt: interview.startTime,
        interviewStatus: "toBeConducted",
      };

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
        // socket.emit('joinInterviewSession', data);
        if (
          interview.interview.interviewMedium === "PHYSICAL" &&
          interview.interview.isWithDevice === false
        ) {
          router.push(
            `physical-interview/interview-room/${sessionId}?candidateId=${userId}&sessionID=${sessionId}`
          );
        } else if (
          interview.interview.interviewMedium === "VIRTUAL" &&
          interview.interview.isAutomated == true
        ) {
          const socketData = {
            sessionId: sessionId,
            candidateId: session.user.candidateID,
          };
          socket.emit("startAutomatedInterview", socketData);
          router.push(
            `virtual-interview/interview-room/${sessionId}?candidateId=${userId}&sessionID=${sessionId}`
          );
        } else {
          router.push(
            `interview-room/${sessionId}?candidateId=${userId}&sessionID=${sessionId}`
          );
        }
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
  // function getPlainTextFromHtml(html) {
  //   const div = document.createElement("div");
  //   div.innerHTML = html;
  //   return div.textContent || div.innerText || "";
  // }

  const getTimeDifferenceInMinutes = (startTime) => {
    const now = new Date();
    const interviewTime = new Date(startTime);
    const timeDifference = (interviewTime - now) / 1000 / 60; // Difference in minutes
    return timeDifference;
  };

  const toggleDescription = (interviewId) => {
    setExpandedInterviewId((prevId) =>
      prevId === interviewId ? null : interviewId
    ); // Toggle expanded state
  };

  const profileNavigate = () => {
    router.push("/user-profile");
  };

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        const session = await getSession();
        const candidateId = session?.user?.candidateID;
        const response = await getCandidateById(candidateId);
        // console.log('candidate Details:', response.data)
        if (response.data) {
          setCandidateDetails(response.data);
        }
      } catch (err) {
        if (err.response) {
          const { data } = err.response;

          if (data && data.message) {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: `Candidate Details Fetching Faild: ${data.message}`,
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

    fetchCandidateDetails();
  }, []);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleOpen = (interviewId) => {
    setExpandedInterviewIds((prevIds) => {
      const newIds = new Set(prevIds);
      if (newIds.has(interviewId)) {
        newIds.delete(interviewId);
      } else {
        newIds.add(interviewId);
      }
      return newIds;
    });
  };

  if (status === "loading") {
    return <Loading />;
  }

  if (session.user.role !== "CANDIDATE") {
    const loginURL = `/login?redirect=${encodeURIComponent(pathname)}`;
    redirect(loginURL);
  }

  // if (isLoading) {
  //   return <Loading />;
  // }

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
        {/* <TimelineLayout
          interviews={sortedScheduleInterviews}
          overview={overview}
          showPastInterviews={showPastInterviews}
          setShowPastInterviews={setShowPastInterviews}
          isProfileCompleted={isProfileComplete} 
          setIsAccepted={setIsAccepted}
        /> */}
        <div className="mt-4">
          <Card className="border-none shadow-sm bg-gradient-to-br from-gray-950 to-gray-900 mb-5">
            <CardContent className="p-6">
              <h1 className="text-2xl md:text-3xl font-bold">
                {getTimeOfDay()},{" "}
                {session?.user?.firstName || session?.user?.name}
              </h1>
              <p className="text-muted-foreground mt-1">
                Welcome back to your interview dashboard
              </p>
            </CardContent>
          </Card>

          {!isProfileComplete && (
            <Alert className="mb-6 border-none shadow-md bg-amber-50 dark:border-l-4 border-l-warning dark:bg-[#2b2410] mt-5 animate-scale-in ">
              {/* <AlertCircle className="h-5 w-5 text-warning" /> */}
              <AlertDescription className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertCircleIcon className="h-5 w-5 text-warning" />
                  <div>
                    <p className="text-sm font-medium">Profile Incomplete</p>
                    <p className="text-xs text-muted-foreground">
                      Please update your experience, skills, and social
                      profiles.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={profileNavigate}
                  variant="outline"
                  size="sm"
                  className="border-amber-200 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/30"
                >
                  View Profile
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            {sortedScheduleInterviews.length > 0 ? (
              sortedScheduleInterviews.map((interview) => {
                const timeDifference = getTimeDifferenceInMinutes(
                  interview.startTime
                );
                const isExpanded = expandedInterviewIds.has(
                  interview.interview.interviewID
                );
                const isCopied = copiedInterviewIds[interview.interviewId];

                const isClose = timeDifference <= 30 && timeDifference > 0;
                const isFar = timeDifference > 180;
                const isMedium = timeDifference <= 60 && timeDifference > 0;

                const timeBgColor = isClose
                  ? "bg-[#F4BB50]"
                  : isFar
                  ? "bg-[#7DDA6A]"
                  : isMedium
                  ? "bg-[#F4BB50]"
                  : "bg-gray-900";

                return (
                  <Card
                    key={interview.scheduleID}
                    className={cn(
                      "p-6 transition-all hover:shadow-lg bg-card",
                      "group relative overflow-hidden"
                    )}
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0 w-16 h-16 bg-muted rounded-lg flex flex-col items-center justify-center">
                        <span className="text-sm font-medium">
                          {formatDate(interview.startTime)}
                        </span>
                        <span className="text-xl font-bold">
                          {formatDay(interview.startTime)}
                        </span>
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-semibold">
                                {interview.interview.jobTitle} -{" "}
                                {interview.interview.company.companyName}
                              </h3>
                              <Badge
                                variant="secondary"
                                className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                              >
                                Active
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {formatTime(interview.startTime)}
                            </p>
                          </div>
                          {interview.interviewSession?.interviewStatus !==
                            "completed" &&
                            new Date(interview.startTime) > new Date() && (
                              <>
                                {interview.interview.interviewMedium ===
                                  "PHYSICAL" &&
                                interview.interview.isWithDevice === false ? (
                                  <>
                                    {interview.invitation?.status ===
                                      "APPROVED" ||
                                    interview.invitation === null ? (
                                      <>
                                        <Badge
                                          variant="secondary"
                                          className="bg-cyan-900 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400"
                                        >
                                          {interview.interview.interviewMedium}{" "}
                                          INTERVIEW
                                        </Badge>
                                      </>
                                    ) : (
                                      <div className="flex justify-start gap-3 items-center">
                                        <Button
                                          onClick={() =>
                                            handleInterviewStatus(
                                              interview,
                                              "REJECTED"
                                            )
                                          }
                                          variant="outline"
                                          size="sm"
                                          className="text-destructive border-destructive/50"
                                        >
                                          <XCircle className="h-4 w-4 mr-2" />
                                          Reject
                                        </Button>
                                        <Button
                                          onClick={() =>
                                            handleInterviewStatus(
                                              interview,
                                              "APPROVED"
                                            )
                                          }
                                          variant="outline"
                                          size="sm"
                                          className="dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:text-white"
                                        >
                                          <LuCircleCheck className="h-4 w-4 mr-2" />
                                          Accept
                                        </Button>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    {interview.invitation?.status ===
                                      "APPROVED" ||
                                    interview.invitation === null ? (
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            className="dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:text-white"
                                            size="sm"
                                          >
                                            <VideoIcon className="h-4 w-4 mr-2" />
                                            Join Interview
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="max-w-md bg-gray-900 border-gray-800">
                                          <AlertDialogHeader>
                                            <AlertDialogTitle className="text-xl text-gray-100">
                                              Ready to Join the Interview?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription className="text-gray-400">
                                              Please ensure you meet all
                                              requirements before joining the
                                              live interview session.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>

                                          <div className="space-y-4 my-4">
                                            {requirements.map((req, index) => (
                                              <div
                                                key={index}
                                                className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700"
                                              >
                                                <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
                                                  {req.icon}
                                                </div>
                                                <div className="flex-1">
                                                  <h4 className="text-sm font-medium text-gray-200">
                                                    {req.text}
                                                  </h4>
                                                  <p className="text-xs text-gray-400 mt-0.5">
                                                    {req.subtext}
                                                  </p>
                                                </div>
                                                <Check className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                                              </div>
                                            ))}
                                          </div>

                                          <AlertDialogFooter className="sm:space-x-2 justify-between">
                                            <AlertDialogCancel className="bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:text-gray-100">
                                              <X className="h-4 w-4 mr-2" />
                                              Not Ready Yet
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                              onClick={() => {
                                                joinInterviewSession(interview);
                                              }}
                                              className="bg-emerald-600 text-white hover:bg-emerald-500"
                                            >
                                              <Check className="h-4 w-4 mr-2" />
                                              Join Interview
                                            </AlertDialogAction>
                                          </AlertDialogFooter>

                                          <div className="mt-4 text-center">
                                            <p className="text-xs text-gray-500">
                                              By joining, you agree to our
                                              interview guidelines and code of
                                              conduct. Your session may be
                                              recorded for quality assurance.
                                            </p>
                                          </div>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    ) : interview.invitation?.status ===
                                        "REJECTED" ||
                                      interview.invitation === null ? (
                                      <>
                                        <Badge
                                          variant="secondary"
                                          className="!bg-red-900/40 !border-red-900 !text-red-700"
                                        >
                                          Invitation Rejected
                                        </Badge>
                                      </>
                                    ) : (
                                      <div className="flex justify-start gap-3 items-center">
                                        <Button
                                          onClick={() =>
                                            handleInterviewStatus(
                                              interview,
                                              "REJECTED"
                                            )
                                          }
                                          variant="outline"
                                          size="sm"
                                          className="text-destructive border-destructive/50"
                                        >
                                          <XCircle className="h-4 w-4 mr-2" />
                                          Reject
                                        </Button>
                                        <Button
                                          onClick={() =>
                                            handleInterviewStatus(
                                              interview,
                                              "APPROVED"
                                            )
                                          }
                                          variant="outline"
                                          size="sm"
                                          className="dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:text-white"
                                        >
                                          <LuCircleCheck className="h-4 w-4 mr-2" />
                                          Accept
                                        </Button>
                                      </div>
                                    )}
                                  </>
                                )}
                              </>
                            )}
                        </div>
                        <Collapsible
                          open={isExpanded}
                          onOpenChange={() =>
                            handleOpen(interview.interview.interviewID)
                          }
                        >
                          <div className="space-y-2">
                            <p
                              className={`
                                    text-sm text-muted-foreground leading-7 
                                    ${
                                      !isExpanded
                                        ? "line-clamp-2"
                                        : "description"
                                    }
                                  `}
                              dangerouslySetInnerHTML={{
                                __html: interview.interview.jobDescription,
                              }}
                            ></p>
                          </div>
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              className="mt-4 p-0 h-auto text-sm text-primary hover:text-primary/80"
                            >
                              {isExpanded ? "Show Less" : "More Details"}
                              <ChevronDown
                                className={cn(
                                  "h-4 w-4 ml-1 transition-transform duration-200",
                                  isExpanded && "transform rotate-180"
                                )}
                              />
                            </Button>
                          </CollapsibleTrigger>
                        </Collapsible>
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <Card className="border-none shadow-md overflow-hidden bg-gray-900 border-l-4 border-l-gray-700">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="mb-4 p-3 rounded-full bg-gray-800">
                    <Calendar className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">
                    No Upcoming Interviews
                  </h3>
                  <p className="text-sm text-gray-400 mb-6 max-w-md">
                    Ready to take the next step in your career? Explore
                    available interview opportunities and find your perfect
                    match.
                  </p>
                  <Button
                    size="lg"
                    className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-medium"
                    onClick={() => {
                      router.push("/interview-schedules");
                    }}
                  >
                    Explore Interviews <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      {isLoading && (
        <div className="fixed top-0 left-0 h-full w-full flex items-center justify-center bg-black/50">
          <Loading />
        </div>
      )}
    </SidebarInset>
  );
};

export default MyInterviews;
