import {
  Timeline,
  TimelineItem,
  TimelineTitle,
  TimelineDescription,
  TimelineTime,
  TimelineHeader,
} from "@/components/ui/timeline";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getInterviewById, updateInterviewInvitaionStatus } from "@/lib/api/interview";
import socket from "@/lib/utils/socket";
import { createInterviewSession } from "@/lib/api/interview-session";
import Lottie from "lottie-react";
import interviewAnimation from "../../components/ui/animation/interviewAnimation";
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
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "./alert";
import { Badge } from "./badge";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import { LuCircleCheck } from "react-icons/lu";
import Link from "next/link";
export const TimelineLayout = ({
  interviews,
  overview,
  showPastInterviews,
  setShowPastInterviews,
  isProfileCompleted,
  setIsAccepted
}) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  //   const [interviews, setInterviews] = useState([]);
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
  // const handleOpen = () => setIsSheetOpen(true);
  // const handleClose = () => setIsSheetOpen(false);
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [expandedInterviewId, setExpandedInterviewId] = useState(null);
  const [copiedInterviewIds, setCopiedInterviewIds] = useState({});
  const totalInterviews = interviews.length;
  const [candidateId, setCandidateId] = useState();
  const [candidateDetails, setCandidateDetails] = useState();
  const [interviewFilter, setInterviewFilter] = useState("upcoming");
  const [expanedInterview, setExpandedInterview] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const requirements = [
    {
      icon: <UserCircle2 className="h-5 w-5" />,
      text: "Complete your profile information",
      subtext: "Ensure your profile details are up-to-date"
    },
    {
      icon: <Wifi className="h-5 w-5" />,
      text: "Stable internet connection",
      subtext: "Minimum 1Mbps upload and download speed"
    },
    {
      icon: <Video className="h-5 w-5" />,
      text: "Camera is ready",
      subtext: "Find a well-lit, professional background"
    },
    {
      icon: <Mic className="h-5 w-5" />,
      text: "Microphone is working",
      subtext: "Test your audio in a quiet environment"
    }
  ];


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

  const handleInterviewStatus = async (interviewId, status) => {
    const session = await getSession();
    const candidateId = session?.user?.candidateID;
    try {
      const response = await updateInterviewInvitaionStatus(interviewId, candidateId, {
        status: status,
      });
      if (response) {
        setIsAccepted(true)
        // socket.emit("InterviewStatus", {
        //   interviewId: interviewId,
        //   status: status,
        // });

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
        router.push(
          `/interview-room/${sessionId}?candidateId=${userId}&sessionID=${sessionId}`
        );
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

    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleOpen = (interviewId) => {
    setExpandedInterviewId(prevId => 
      prevId === interviewId ? null : interviewId
    );
  };

  return (
    <div className="mt-4">
      {/* Greeting Card */}
      <Card className="border-none shadow-sm bg-gradient-to-br from-gray-950 to-gray-900 mb-5">
        <CardContent className="p-6">
          <h1 className="text-2xl md:text-3xl font-bold">
            {getTimeOfDay()}, {session?.user?.firstName || 'Candidate'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back to your interview dashboard
          </p>
        </CardContent>
      </Card>

      {/* <Card
        className={cn(
          "border-none shadow-md overflow-hidden bg-[#2b2410] border-l-4 border-l-warning",
          "animate-scale-in")}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircleIcon className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm font-medium">Profile Incomplete</p>
                <p className="text-xs text-muted-foreground">Please update your experience, skills, and social profiles.</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="border-warning text-warning hover:bg-warning/10 hover:text-warning"
            >
              View Profile
            </Button>
          </div>
        </CardContent>
      </Card> */}

      {!isProfileCompleted && (
        <Alert className="mb-6 border-none shadow-md bg-amber-50 dark:border-l-4 border-l-warning dark:bg-[#2b2410] mt-5 animate-scale-in ">
          {/* <AlertCircle className="h-5 w-5 text-warning" /> */}
          <AlertDescription className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertCircleIcon className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm font-medium">Profile Incomplete</p>
                <p className="text-xs text-muted-foreground">Please update your experience, skills, and social profiles.</p>
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


        // <div className="w-full h-fit bg-red-900/10 py-5 px-7 rounded-lg mt-5 border-2 border-orange-400">
        //   <div className="w-full flex items-center justify-between">
        //     <div>
        //       <h1 className="text-2xl font-semibold">Profile Incomplete</h1>
        //       <p className="text-sm text-gray-500 py-3">
        //         It looks like your profile is missing some important details. Please update your experience, skills, and social profiles.
        //       </p>
        //     </div>
        //     <div className="h-11 min-w-[130px] w-[140px] mt-5 md:mt-0 cursor-pointer bg-yellow-500 rounded-lg text-center text-sm text-white font-semibold flex items-center justify-center">
        //       <button onClick={profileNavigate}>View Profile</button>
        //     </div>
        //   </div>
        // </div>
      )}


      {/* <div className="bg-zinc-900 text-white pt-6 rounded-lg mb-6 mt-12 max-w-full text-left ">

        <div className="flex justify-between px-3">
          <div className="flex-col ml-8 mt-12">
            <div className="text-2xl font-medium text-start ">
              <h1>Total Interviews</h1>
              <div className="text-6xl font-medium mt-2">{totalInterviews}</div>
            </div>
          </div>
          <div className="flex-col">
              <div className="flex justify-end w-60 aspect-square ml-auto -mt-8">
                <Lottie animationData={interviewAnimation} />
              </div>
          </div>
        </div>

      </div> */}

      {/* <main className="p-6 max-w-6xl mx-auto"> */}
      {/* Stats Cards */}
      {/* <div className="mb-6">
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-6 bg-card relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Total Interviews</p>
                <p className="text-3xl font-bold">{overview.total || 0}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ListTodo className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-500/20" />
          </Card>
          <Card className="p-6 bg-card relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Completed</p>
                <p className="text-3xl font-bold">{overview.completed || 0}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500/20" />
          </Card>
          <Card className="p-6 bg-card relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Pending</p>
                <p className="text-3xl font-bold">{overview.pending || 0}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500/20" />
          </Card>
        </div>
      </div> */}

      {/* Interview Filter */}
      {/* <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Interview List</h3>
        <Select value={interviewFilter} onValueChange={setInterviewFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter interviews" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upcoming">Upcoming Interviews</SelectItem>
            <SelectItem value="completed">Completed Interviews</SelectItem>
            <SelectItem value="missed">Missed Interviews</SelectItem>
            <SelectItem value="all">All Interviews</SelectItem>
          </SelectContent>
        </Select>
      </div> */}

      {/* <div className="max-w-2xl rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 mx-auto flex gap-6 shadow-xl hover:shadow-2xl transition-shadow">
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-start">
            <div className="bg-[#18181E] py-4 px-6 rounded-xl">
              <h2 className="text-3xl font-bold text-white mb-1">
                Total Interviews
              </h2>
              <div className="text-4xl font-bold text-white text-center">
                {overview.total || 0}
              </div>
            </div>
            <span className="text-xs font-medium bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">
              Active
            </span>
          </div>

          <div className="space-y-4 p-4 bg-zinc-800/50 rounded-lg">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm text-zinc-400">Completed</span>
              </div>
              <span className="text-sm font-medium text-white">
                {overview.completed || 0}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-zinc-400">Pending</span>
              </div>
              <span className="text-sm font-medium text-white">
                {overview.pending || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex w-48 aspect-square -mr-4 -my-4">
          <Lottie
            animationData={interviewAnimation}
            className="hover:scale-105 transition-transform"
          />
        </div>
      </div> */}

      {/* <div className="flex justify-end items-center space-x-2 md:mt-4">
        <Switch
          id="show-past-interviews"
          checked={showPastInterviews}
          onCheckedChange={setShowPastInterviews}
        />
        <div className="flex items-center space-x-1">
          <Label className="text-lg font-light">Show past Interviews</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-4 h-4 text-white hover:text-gray-200 cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                align="center"
                className="bg-gray-800 text-white p-2 rounded-md text-sm max-w-[200px] text-center"
              >
                Toggle to view your booked interviews from previous months
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div> */}

      {/* Interview Cards */}
      <div className="space-y-4">
        {interviews.length > 0 ? (
          interviews.map((interview) => {
            const timeDifference = getTimeDifferenceInMinutes(interview.startTime);
            const isExpanded = expandedInterviewId === interview.interview.interviewID;
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
                      {interview.interviewSession?.interviewStatus !== "completed" &&
                        new Date(interview.startTime) > new Date() && (
                          <>
                            {interview.invitation?.status === "APPROVED" ||
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
                                      Please ensure you meet all requirements before
                                      joining the live interview session.
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
                                      By joining, you agree to our interview
                                      guidelines and code of conduct. Your session may
                                      be recorded for quality assurance.
                                    </p>
                                  </div>
                                </AlertDialogContent>
                              </AlertDialog>
                            ) : (
                              <div className="flex justify-start gap-3 items-center">
                                <Button
                                  onClick={() =>
                                    handleInterviewStatus(
                                      interview.interview.interviewID,
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
                                      interview.interview.interviewID,
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
                    </div>
                    <Collapsible open={isExpanded} onOpenChange={() => handleOpen(interview.interview.interviewID)}>
                      <div className="space-y-2">
                        <p
                          className={cn(
                            "text-sm text-muted-foreground description leading-7",
                            !isExpanded && "line-clamp-2"
                          )}
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
                Ready to take the next step in your career? Explore available
                interview opportunities and find your perfect match.
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
      {/* 
      <Card className={cn(
              "p-6 transition-all bg-card/50",
              "group relative overflow-hidden mt-3"
            )}>
              <div className="absolute top-0 left-0 w-1 h-full dark:bg-red-500/50" />
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-muted/50 rounded-lg flex flex-col items-center justify-center">
                  <span className="text-sm font-medium">MAR</span>
                  <span className="text-xl font-bold">28</span>
                </div>
                <div className="flex-grow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-muted-foreground">Frontend Developer</h3>
                        <Badge variant="secondary" className="bg-destructive/10 text-destructive">
                          Missed
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">2:00 PM</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive border-destructive/50"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reschedule
                    </Button>
                  </div>
                </div>
              </div>
            </Card> */}
      {/* <h2 className="text-2xl font-medium">Upcoming Interviews</h2> */}
      {/* <Timeline className="mt-8">
        {interviews.map((interview) => {
          const timeDifference = getTimeDifferenceInMinutes(
            interview.startTime
          );
          const isExpanded = expandedInterviewId === interview.scheduleID;
          const isCopied = copiedInterviewIds[interview.interviewId];
          const isClose = timeDifference <= 30 && timeDifference > 0; 
          const isFar = timeDifference > 180;
          const ismedium = timeDifference <= 60 && timeDifference > 0;

          const timeBgColor = isClose
            ? "bg-[#F4BB50]"
            : isFar
              ? "bg-[#7DDA6A]"
              : ismedium
                ? "bg-[#F4BB50]"
                : "bg-gray-900";

          return (
            <TimelineItem key={interview.scheduleID} className="">
              <TimelineHeader className="bg-[#18181E] py-4 px-8 rounded-t-xl">
                <TimelineTime
                  date={formatDate(interview.startTime)}
                  time={formatTime(interview.startTime)}
                  timeBgColor={timeBgColor}
                  className={`transition-all duration-300 text-white py-2 rounded-lg  max-w-52 mx-auto text-center font-thin`}
                />

                <div className="flex justify-between items-center w-full ">
                  <TimelineTitle>{interview.interview.jobTitle}</TimelineTitle>
                  {interview.interviewSession?.interviewStatus !== "completed" &&
                    new Date(interview.startTime) > new Date() && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button

                            className="ml-4 bg-[#6E6ADA] text-white px-4 py-2 rounded-md"
                          >
                            Join Now
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Ready to Join the Interview?</AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600">
                              By continuing, you&apos;ll enter the live interview session immediately. Please ensure:
                              <span className="flex justify-start gap-3 pl-7"><BadgeCheck size={15} className="mt-1" />  Make sure your profile is completed</span>

                              <span className="flex justify-start gap-3 pl-7"><BadgeCheck size={15}
                                className="mt-1" />  You&apos;re in a quiet environment</span>
                              <span className="flex justify-start gap-3 pl-7"><BadgeCheck size={15} className="mt-1" />  Your camera and microphone are ready</span>
                              <span className="flex justify-start gap-3 pl-7"><BadgeCheck size={15} className="mt-1" />  You have stable internet connection</span>

                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Not Ready Yet</AlertDialogCancel>
                            <AlertDialogAction className="bg-[#6E6ADA] hover:bg-[#5B57B3]" onClick={() => {
                              joinInterviewSession(interview);
                            }}>Confirm Join</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                    )}
                </div>
              </TimelineHeader>
              <div className="bg-[#18181E]">
                <TimelineDescription className="-mt-1  px-8 text-[#6F6F7B] ">
                  <div
                    className={`w-[90%] pb-3 text-justify bg-transparent rounded-lg description`}
                    dangerouslySetInnerHTML={{
                      __html: isExpanded
                        ? interview.interview.jobDescription
                        : `${interview.interview.jobDescription.slice(0, 200)}...`,
                    }}
                  />

                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      <AccordionContent className="bg-[#18181E] p-4 shadow-md ">
                        <div className="space-y-2 text-white mt-4 ">
                          <div className="flex items-center">
                            <span className="font-medium">ID:</span>
                            <span className="ml-2">
                              {interview.interviewId}
                            </span>
                            <button
                              onClick={() => handleCopy(interview.interviewId)}
                              className="ml-4 text-blue-500 hover:text-blue-700"
                              title="Copy Interview ID"
                            >
                              <ClipboardList className="w-5 h-5 inline" />
                              <span className="hidden sm:inline ml-2">
                                {isCopied ? "Copied!" : "Copy"}
                              </span>
                            </button>
                          </div>
                          <div>
                            <span className="font-medium">
                              Interview Category:
                            </span>
                            <span className="ml-2">
                              {interview.interview.interviewCategory}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">End Date:</span>
                            <span className="ml-2">
                              {formatDateMoreDetailsSection(
                                interview?.interview?.endDate
                              )}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Company Name:</span>
                            <span className="ml-2">
                              {interview.interview.company.companyName}
                            </span>
                          </div>
                        </div>
                      </AccordionContent>
                      <div className="flex justify-end -mt-4">
                        <AccordionTrigger
                          onClick={() =>
                            toggleDescription(interview.scheduleID)
                          }
                          className="text-sm font-thin text-[#BBB9FF] hover:text-white px-4 py-1 bg-[#25252F] rounded-lg mb-6 mt-2 hover:no-underline"
                        >
                          {isExpanded ? "Show Less" : "More Details"}
                        </AccordionTrigger>
                      </div>
                    </AccordionItem>
                  </Accordion>
                </TimelineDescription>
              </div>
            </TimelineItem>
          );
        })}
      </Timeline> */}
    </div>
  );
};
