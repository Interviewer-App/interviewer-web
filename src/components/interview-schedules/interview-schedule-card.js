import React from "react";

export default function InterviewScheduleCard({ index, interview,showButton=true}) {
  return (
    <div className=" relative w-full h-full flex flex-col items-center justify-center rounded-xl p-6 bg-gray-800/80">
      <h1 className=" text-lg">Interview {index}</h1>
      <h3 className=" text-2xl lg:text-4xl font-semibold py-3 text-center">
        {interview.jobTitle}
      </h3>
      <h3 className=" text-sm md:text-base">Date: {new Date(interview.scheduledDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</h3>
      <h3 className=" text-sm md:text-base">Time: {new Date(interview.scheduledAt).toLocaleTimeString()}</h3>
      {showButton && (
      <button
        type="submit"
        className=" h-12 min-w-[150px] w-full md:w-[40%] mt-8 cursor-pointer bg-gradient-to-b from-lightred to-darkred rounded-lg text-center text-base text-white font-semibold"
      >
        Join Now
      </button>
      )}
    </div>
  );
}
