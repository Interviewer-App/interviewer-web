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
export const TimelineLayout = ({ interviews }) => {
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
      console.log("Interview Data:", interview);
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
      <div className="bg-zinc-900 text-white py-10 rounded-lg mb-6 mt-12 max-w-full text-left ">
        <h2 className="text-2xl font-medium ml-8">Total Interviews</h2>
        <p className="text-4xl font-medium mt-2 ml-8">{totalInterviews}</p>
        
      </div>

      <h2 className="text-2xl font-medium">Upcoming Interviews</h2>
      <Timeline className="mt-8">
        {interviews.map((interview) => {
          const timeDifference = getTimeDifferenceInMinutes(interview.startTime);
          const isExpanded = expandedInterviewId === interview.scheduleID;
          const isCopied = copiedInterviewIds[interview.interviewId];
          // Time differnce dynamic class definations
          const isClose = timeDifference <= 30 && timeDifference > 0; //adjust the time whatever values you prefer
          const isFar = timeDifference > 180; 
          const ismedium=timeDifference <= 60 && timeDifference > 0;

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
       
                

                {/* <TimelineTitle>{interview.interview.jobTitle}</TimelineTitle> */}
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
              <TimelineDescription className='-mt-1  px-8 text-[#6F6F7B]'>
              <div className="w-[90%]">
                  {isExpanded
                    ? getPlainTextFromHtml(interview.interview.jobDescription)
                    : `${getPlainTextFromHtml(interview.interview.jobDescription).slice(0, 200)}...`}
                </div>
                {/* <button onClick={() => { joinInterviewSession(interview) }} className="pl-64">Join</button> */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="item-1">
                    <div className="flex justify-end">
                    <AccordionTrigger
                        onClick={() => toggleDescription(interview.scheduleID)} // Toggle description on button click
                        className="text-sm font-thin text-[#BBB9FF] hover:text-white px-4 py-1 bg-[#25252F] rounded-lg mb-6 mt-2"
                      >
                        {isExpanded ? "Show Less" : "More Details"}
                      </AccordionTrigger>
                    </div>
                    <AccordionContent className="bg-[#18181E] p-4 shadow-md">
                      <div className="space-y-2 text-white">
                        <div>
                          <span className="font-medium">Interview ID:</span>
                          <span className="ml-2">{interview.interviewId}</span>
                          <button
                          onClick={() => handleCopy(interview.interviewId)}
                          className="ml-4 text-blue-500 hover:text-blue-700"
                          title="Copy Interview ID"
                        >
                          <ClipboardList className="w-5 h-5 inline" />
                          {isCopied ? "Copied!" : "Copy"}
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
