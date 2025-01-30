import { createInterviewSession } from "@/lib/api/interview-session";
import { getSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import  socket  from '../../lib/utils/socket';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useRouter } from "next/navigation";


export default function InterviewScheduleCard({ index, interview,showButton=true}) {
    const { toast } = useToast();

   const router = useRouter();

    const handleClick = () => {
      router.push(`/interview-schedules/${encodeURIComponent(interview.interviewID)}`);
    };

    const joinInterviewSession = async (e) => {
      e.preventDefault();
      try {
        const session = await getSession();
        const candidateID = session?.user?.candidateID;
        const interviewSessionData = {
          candidateId: candidateID,
          interviewId: interview.interviewID,
          interviewCategory: interview.interviewCategory,
          scheduledDate: interview.scheduledDate,
          scheduledAt: interview.scheduledAt,
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
    <div className=" relative w-full h-full flex flex-col items-center justify-center rounded-xl p-6 bg-gray-800/80 hover:bg-gray-800/90 transition-all duration-300"
    onClick={handleClick} >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <p className="text-3xl font-semibold pb-6 text-center text-ellipsis overflow-hidden whitespace-nowrap max-w-[300px]">
              {interview.jobTitle}
            </p>
          </TooltipTrigger>
          <TooltipContent>{interview.jobTitle || ""}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <h3 className=" text-sm md:text-base">Start Date: {new Date(interview.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</h3>
      <h3 className=" text-sm md:text-base">end Date: {new Date(interview.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</h3>
      {showButton && (
      <button
        type="button"
        className=" h-12 min-w-[150px] w-full md:w-[40%] mt-8 cursor-pointer bg-white rounded-lg text-center text-base text-black font-semibold"
        onClick={joinInterviewSession}
      >
        Join Now
      </button>
      )}
    </div>
  );
}
