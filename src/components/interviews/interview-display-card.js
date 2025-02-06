"use client";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function InterviewDisplayCard({ index, interview }) {
  const router = useRouter();

  const navigationClickHandler = () => {
    router.push(`/interviews/${encodeURIComponent(interview.interviewID)}`);
  };
  

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            onClick={navigationClickHandler}
            className=" group relative w-full h-full flex flex-col items-center justify-center rounded-xl py-8 px-6 bg-gray-800/80 cursor-pointer hover:bg-gray-800/90 transition-all duration-300"
          >

            <p className="text-3xl font-semibold pb-6 text-center text-ellipsis overflow-hidden whitespace-nowrap max-w-[300px]">
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
            <h3 className="text-sm mb-2">{interview.jobTitle || ""}</h3>
            {/* <div className="text-sm text-gray-300">{interview.jobTitle || ""}</div> */}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
