import {
  Timeline,
  TimelineItem,
  TimelineTitle,
  TimelineDescription,
  TimelineTime,
  TimelineHeader
} from "@/components/ui/timeline"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { ClipboardList } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getInterviewById } from "@/lib/api/interview";
import socket from "@/lib/utils/socket";
import { createInterviewSession } from "@/lib/api/interview-session";
import Lottie from "lottie-react";
import interviewAnimation from '../../components/ui/animation/interviewAnimation'
export const TimelineLayout = ({ interviews, overview }) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  //   const [interviews, setInterviews] = useState([]);
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
  const [copied, setCopied] = useState(false);
  const [expandedInterviewId, setExpandedInterviewId] = useState(null);
  const [copiedInterviewIds, setCopiedInterviewIds] = useState({});
  const totalInterviews = interviews.length;

  const formatDate = (date) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };
  const formatDateMoreDetailsSection = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  // Function to format the time
  const formatTime = (date) => {
    const options = { hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(date).toLocaleTimeString('en-US', options); // e.g., '4:45 PM'
  };

  const handleCopy = (interviewId) => {
    navigator.clipboard.writeText(interviewId)
      .then(() => {
        // Set the copied state for the specific interview
        setCopiedInterviewIds(prevState => ({
          ...prevState,
          [interviewId]: true
        }));

        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setCopiedInterviewIds(prevState => ({
            ...prevState,
            [interviewId]: false
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
          role: role
        }
        // socket.emit('joinInterviewSession', data);
        router.push(`/interview-room/${sessionId}?candidateId=${userId}&sessionID=${sessionId}`);
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
  function getPlainTextFromHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }

  const getTimeDifferenceInMinutes = (startTime) => {
    const now = new Date();
    const interviewTime = new Date(startTime);
    const timeDifference = (interviewTime - now) / 1000 / 60; // Difference in minutes
    return timeDifference;
  };

  const toggleDescription = (interviewId) => {
    setExpandedInterviewId((prevId) => (prevId === interviewId ? null : interviewId)); // Toggle expanded state
  };

  return (
    <div>
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
              <div className="max-w-2xl rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 mx-auto flex gap-6 shadow-xl hover:shadow-2xl transition-shadow">
      {/* Left Content */}
      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-start">
          <div className="bg-[#18181E] py-4 px-6 rounded-xl">
            <h2 className="text-3xl font-bold text-white mb-1">Total Interviews</h2>
            <div className="text-4xl font-bold text-white text-center">{overview.total}</div>
          </div>
          <span className="text-xs font-medium bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full">
            Active
          </span>
        </div>

        {/* Stats Container */}
        <div className="space-y-4 p-4 bg-zinc-800/50 rounded-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-zinc-400">Completed</span>
            </div>
            <span className="text-sm font-medium text-white">{overview.completed}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-zinc-400">Pending</span>
            </div>
            <span className="text-sm font-medium text-white">{overview.pending}</span>
          </div>
        </div>
      </div>

      {/* Lottie Animation */}
      <div className="hidden md:flex w-48 aspect-square -mr-4 -my-4">
        <Lottie 
          animationData={interviewAnimation}
          className="hover:scale-105 transition-transform"
        />
      </div>
    </div>

      {/* <h2 className="text-2xl font-medium">Upcoming Interviews</h2> */}
      <Timeline className="mt-8">
        {interviews.map((interview) => {
          const timeDifference = getTimeDifferenceInMinutes(interview.startTime);
          const isExpanded = expandedInterviewId === interview.scheduleID;
          const isCopied = copiedInterviewIds[interview.interviewId];
          // Time differnce dynamic class definations
          const isClose = timeDifference <= 30 && timeDifference > 0; //adjust the time whatever values you prefer
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
            <TimelineItem key={interview.scheduleID} className=''>
              <TimelineHeader className="bg-[#18181E] py-4 px-8 rounded-t-xl" >

                <TimelineTime
                  date={formatDate(interview.startTime)}
                  time={formatTime(interview.startTime)}
                  timeBgColor={timeBgColor}
                  className={`transition-all duration-300 text-white py-2 rounded-lg  max-w-52 mx-auto text-center font-thin`}
                />

                <div className="flex justify-between items-center w-full ">
                  <TimelineTitle>{interview.interview.jobTitle}</TimelineTitle>
                  <button
                    onClick={() => { joinInterviewSession(interview) }}
                    className="ml-4 bg-[#6E6ADA] text-white px-4 py-2 rounded-md"
                  >
                    Join Now
                  </button>
                </div>
              </TimelineHeader>
              <div className="bg-[#18181E]">
                <TimelineDescription className='-mt-1  px-8 text-[#6F6F7B] '>
                  <div className="w-[90%] pb-3">
                    {isExpanded
                      ? getPlainTextFromHtml(interview.interview.jobDescription)
                      : `${getPlainTextFromHtml(interview.interview.jobDescription).slice(0, 200)}...`}
                  </div>
                  {/* <button onClick={() => { joinInterviewSession(interview) }} className="pl-64">Join</button> */}
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                      {/* <div className="flex justify-end">
                        <AccordionTrigger
                          onClick={() => toggleDescription(interview.scheduleID)} // Toggle description on button click
                          className="text-sm font-thin text-[#BBB9FF] hover:text-white px-4 py-1 bg-[#25252F] rounded-lg mb-6 mt-2 hover:no-underline"
                        >
                          {isExpanded ? "Show Less" : "More Details"}
                        </AccordionTrigger>
                      </div> */}
                      <AccordionContent className="bg-[#18181E] p-4 shadow-md ">
                        <div className="space-y-2 text-white mt-4 ">
                          <div className="flex items-center">
                            <span className="font-medium">ID:</span>
                            <span className="ml-2">{interview.interviewId}</span>
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
                            <span className="font-medium">Interview Category:</span>
                            <span className="ml-2">{interview.interview.interviewCategory}</span>
                          </div>
                          <div>
                            <span className="font-medium">End Date:</span>
                            <span className="ml-2">{formatDateMoreDetailsSection(interview?.interview?.endDate)}</span>
                          </div>
                          <div>
                            <span className="font-medium">Company Name:</span>
                            <span className="ml-2">{interview.interview.company.companyName}</span>
                          </div>
                        </div>
                      </AccordionContent>
                      {/* Move the button to the bottom of the AccordionContent */}
                      <div className="flex justify-end -mt-4">
                        <AccordionTrigger
                          onClick={() => toggleDescription(interview.scheduleID)} // Toggle description on button click
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
      </Timeline>
    </div>
  );
};
