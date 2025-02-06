"use client";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import { getInterviewOverviewById } from "@/lib/api/interview-session";
export default function InterviewDisplayCard({ index, interview,hoveredId }) {
  const router = useRouter();
  const [interviewOverview, setInterviewOverview] = useState({});


  const navigationClickHandler = () => {
    router.push(`/interviews/${encodeURIComponent(interview.interviewID)}`);
  };

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const response = await getInterviewOverviewById(interview.interviewID);
        // console.log(response.data);
        if (response.data) {
          setInterviewOverview(response.data);
        }
      } catch (error) {
        console.log("Error fetching interview overview:", error);
      }
    };

    if (interview.interviewID == hoveredId) {
      fetchOverviewData();
    }
  }, [hoveredId]);


  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="!w-full">
          <div
            onClick={navigationClickHandler}
            className=" group relative w-full h-full flex flex-col items-center justify-center rounded-xl py-8 px-6 bg-gray-800/80 cursor-pointer hover:bg-gray-800/90 transition-all duration-300"
          >

            <p className="text-lg font-semibold pb-6 text-center text-ellipsis overflow-hidden whitespace-nowrap lg:max-w-[250px] md:max-w-[220px] sm:max-w-[100px] md:text-2xl sm:text-xl">
              {interview.jobTitle}
            </p>


            <h3 className=" text-base md:text-xl">
              start:{" "}
              {new Date(interview.startDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </h3>
            <h3 className=" text-base md:text-xl p-1">
              End:{" "}
              {new Date(interview.endDate).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </h3>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-[400px] bg-gray-800 text-white border-gray-700">
          <div className="p-2">
            <h3 className="text-sm mb-2">Job Title:{interview.jobTitle || ""}</h3>
            <div className="text-sm text-gray-300">Max Score:{interviewOverview.maxScore || "0"}</div>
            <div className="text-sm text-gray-300">Total Sessions:{interviewOverview?.total || 0}</div>
            <div className="text-sm text-gray-300">Completed Sessions:{interviewOverview?.totalCompletedInterviews || 0}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
