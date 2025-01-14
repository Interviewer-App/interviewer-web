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
      {/* <div className=" group-hover:w-full group-hover:h-full absolute top-0 left-0 rounded-lg w-0 h-0 bg-gradient-to-bl from-[#785DFB]/10 to-[#65aaa6]/30 "></div> */}
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
        Date:{" "}
        {new Date(interview.scheduledDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </h3>
      <h3 className=" text-base md:text-xl p-1">
        Time: {new Date(interview.scheduledAt).toLocaleTimeString()}
      </h3>
    </div>
  );
}
