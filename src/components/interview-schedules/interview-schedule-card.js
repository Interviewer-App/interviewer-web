import { createInterviewSession } from "@/lib/api/interview-session";
import { getSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import socket from "../../lib/utils/socket";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useRouter } from "next/navigation";
import { Building, CalendarIcon, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export default function InterviewScheduleCard({
  index,
  interview,
  showButton = true,
}) {
  const { toast } = useToast();

  const router = useRouter();

  const handleClick = () => {
    router.push(
      `/interview-schedules/${encodeURIComponent(interview.interviewID)}`
    );
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

  return (
    // <TooltipProvider>
    //   <Tooltip>
    //     <TooltipTrigger>
    //       <div className=" relative w-full h-full flex flex-col items-center justify-center rounded-xl p-6 bg-gray-800/80 hover:bg-gray-800/90 transition-all duration-300 cursor-pointer"
    //         onClick={handleClick} >
    //         <p className="text-3xl font-semibold pb-6 text-center text-ellipsis overflow-hidden whitespace-nowrap max-w-[300px]">
    //           {interview.jobTitle}
    //         </p>
    //         <h3 className=" text-sm md:text-base">Start Date: {new Date(interview.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</h3>
    //         <h3 className=" text-sm md:text-base">end Date: {new Date(interview.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</h3>
    //         {
    //           showButton && (
    //             <button
    //               type="button"
    //               className=" h-12 min-w-[150px] w-full md:w-[40%] mt-8 cursor-pointer bg-white rounded-lg text-center text-base text-black font-semibold"
    //               onClick={joinInterviewSession}
    //             >
    //               Join Now
    //             </button>
    //           )
    //         }
    //       </div >
    //     </TooltipTrigger>
    //     <TooltipContent className="max-w-[400px] bg-gray-800 text-white border-gray-700">
    //       <div className="p-2">
    //         <h3 className="font-bold text-lg mb-2">Comapany:{interview.companyName}</h3>
    //         <h3 className="font-bold text-lg mb-2">Interview Category:{interview.interviewCategory}</h3>
    //         {/* <div
    //           className="text-sm text-gray-300"
    //           dangerouslySetInnerHTML={{ __html: interview.jobDescription }}
    //         /> */}
    //       </div>
    //     </TooltipContent>
    //   </Tooltip>
    // </TooltipProvider>
    <Card key={interview.id} className="overflow-hidden relative">
       <div className="absolute top-4 right-4 bg-slate-800 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
      {interview.interviewMedium}
    </div>
      <CardContent className="p-0">
        {/* <div className={cn(
                        "py-2 px-4",
                        interview.status === 'active' ? "bg-emerald-500" :
                        interview.status === 'pending' ? "bg-amber-500" :
                        interview.status === 'completed' ? "bg-blue-500" : "bg-red-500",
                        "text-white"
                      )}>
                        <span className="text-sm font-medium capitalize">{interview.status}</span>
                      </div> */}
        <div className="p-4">
          <h3 className="font-semibold text-lg">{interview.jobTitle}</h3>
          <div className="flex items-center mt-1 text-[#b3b3b3]">
            <Building className="h-4 w-4 mr-1" />
            <span className="text-sm">{interview.companyName}</span>
          </div>
          <p
            className="mt-3 text-sm line-clamp-2"
            dangerouslySetInnerHTML={{
              __html: interview.jobDescription,
            }}
          ></p>
          <div className="flex flex-wrap gap-2 mt-4 ">
            <span className="flex items-center text-xs ">Starts on: </span>
            <div className="flex items-center text-xs bg-white/10 px-3 py-1 rounded-full">
            
              <CalendarIcon className="h-3 w-3 mr-1" />
              <span> {new Date(interview.startDate).toLocaleDateString()}</span>
            </div>
            <span className="flex items-center text-xs ">at </span>
            <div className="flex items-center text-xs bg-white/10 px-3 py-1 rounded-full">
              <Clock className="h-3 w-3 mr-1" />
              <span>
                {new Date(interview.scheduling[0].startTime).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={handleClick} size="sm" className="w-full">
              Apply Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
