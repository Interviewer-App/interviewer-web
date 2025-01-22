import {
  Timeline,
  TimelineItem,
  TimelineTitle,
  TimelineDescription,
  TimelineTime,
  TimelineHeader
} from "@/components/ui/timeline"
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
} from "@/components/ui/alert-dialog"
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

  const totalInterviews = interviews.length;

  // useEffect(() => {

  //     const fetchInterview = async () => {
  //       try {
  //         const response = await getInterviewById(interviewId);
  //         setInterviewDetail(response.data);
  //         console.log('fetched Interview:', response);
  //       } catch (error) {
  //         console.log("Error fetching interviews:", error);
  //       }
  //     };
  //     if (interviewId) fetchInterview();
  //   }, [interviewId, status]);

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
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
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

  return (
    <div>
      <div className="bg-zinc-900 text-white py-8 rounded-lg mb-6 mt-12 max-w-full text-left hover:bg-blue-800">
        <h2 className="text-2xl font-semibold ml-8">Total Interviews</h2>
        <p className="text-xl font-bold mt-2 ml-8">{totalInterviews}</p>
      </div>


  <Timeline className="mt-8">
        {interviews.map((interview) => {
          const timeDifference = getTimeDifferenceInMinutes(interview.startTime);

          // Time differnce class definations
          const isClose = timeDifference <= 180 && timeDifference > 0; // Less than 240 minutess
          const isFar = timeDifference > 180; // More than 240 minutes

          const timeBgColor = isClose
            ? "bg-red-500 hover:bg-red-600"
            : isFar
            ? "bg-green-500 hover:bg-green-600"
            : "bg-gray-500 hover:bg-gray-600";

          return (
          <TimelineItem key={interview.scheduleID}>
            <TimelineHeader>
              <TimelineTime
                date={formatDate(interview.startTime)}
                time={formatTime(interview.startTime)}
                className={`transition-all duration-300 text-white py-2 rounded-lg  max-w-52 mx-auto text-center ${timeBgColor}`}
              />
              {/* <TimelineTitle>{interview.interview.jobTitle}</TimelineTitle> */}
              <div className="flex justify-between items-center w-full">
                <TimelineTitle>{interview.interview.jobTitle}</TimelineTitle>
                <button
                  onClick={() => { joinInterviewSession(interview) }}
                  className="ml-4 bg-[#6E6ADA] text-white px-4 py-2 rounded-md"
                >
                  Join Now
                </button>
              </div>
            </TimelineHeader>
            <TimelineDescription>
              <div>
                {getPlainTextFromHtml(interview.interview.jobDescription)}
              </div>
              {/* <button onClick={() => { joinInterviewSession(interview) }} className="pl-64">Join</button> */}
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-semibold text-blue-600 hover:text-blue-800">
                    More Details
                  </AccordionTrigger>
                  <AccordionContent className="bg-zinc-900 p-4 shadow-md">
                    <div className="space-y-4">
                      <div>
                        <span className="font-bold">Interview ID:</span>
                        <span className="ml-2">{interview.interviewId}</span>
                        <button
                          onClick={() => handleCopy(interview.interviewId)}
                          className="ml-4 text-blue-500 hover:text-blue-700"
                          title="Copy Interview ID"
                        >
                          <ClipboardList className="w-5 h-5 inline" />
                          {copied ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      <div>
                        <span className="font-bold">Interview Category:</span>
                        <span className="ml-2">{interview.interview.interviewCategory}</span>
                      </div>
                      <div>
                        <span className="font-bold">End Date:</span>
                        <span className="ml-2">{formatDateMoreDetailsSection(interview?.interview?.endDate)}</span>
                        </div>
                      <div>
                        <span className="font-bold">Company Name:</span>
                        <span className="ml-2">{interview.interview.company.companyName}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>


            </TimelineDescription>
          </TimelineItem>
          );
})}
      </Timeline>
    </div>
  );
};
