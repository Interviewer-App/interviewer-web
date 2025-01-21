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

import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { getSession, useSession } from "next-auth/react";
import { useEffect,useState } from "react";
import { usePathname,useRouter } from "next/navigation";
import { getInterviewById } from "@/lib/api/interview";
import socket from "@/lib/utils/socket";
import { createInterviewSession } from "@/lib/api/interview-session";
export const TimelineLayout = ({interviews}) => {
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


    const joinInterviewSession = async (interview) => {
        debugger
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
    
    return (
        <Timeline className="mt-8">
            {interviews.map((interview) => (
                <TimelineItem key={interview.scheduleID}>
                    <TimelineHeader>
                        <TimelineTime>{new Date(interview.startTime).toLocaleString()}</TimelineTime>
                        <TimelineTitle>Interview ID: {interview.interviewId}</TimelineTitle>
                    </TimelineHeader>
                    <TimelineDescription>
                        {/* <AlertDialog>
                            <AlertDialogTrigger>Open</AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your account
                                        and remove your data from our servers.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction>Join</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog> */}
                            <button onClick={()=>{joinInterviewSession(interview)}}>Join</button>
                    </TimelineDescription>
                </TimelineItem>
            ))}
        </Timeline>
    );
};
