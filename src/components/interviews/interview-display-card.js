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
    <div
      onClick={navigationClickHandler}
      className=" group relative w-full h-full flex flex-col items-center justify-center rounded-xl py-8 px-6 bg-gray-800/80 cursor-pointer hover:bg-gray-800/90 transition-all duration-300"
    >
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

      <h3 className=" text-base md:text-xl">
        Satrt:{" "}
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
  );
}
