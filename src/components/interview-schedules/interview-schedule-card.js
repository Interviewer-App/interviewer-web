import React from "react";

export default function InterviewScheduleCard({ index, company, date, time }) {
  return (
    <div className=" relative w-full h-full flex flex-col items-center justify-center rounded-xl p-6 bg-gray-800/80">
      <h1 className=" text-2xl">Interview {index}</h1>
      <h3 className=" text-3xl lg:text-4xl font-semibold py-3 text-center">
        {company}
      </h3>
      <h3 className=" text-base md:text-lg">Date: {date}</h3>
      <h3 className=" text-base md:text-lg">Time: {time}</h3>
      <button
        type="submit"
        className=" h-12 min-w-[150px] w-full md:w-[40%] mt-8 cursor-pointer bg-gradient-to-b from-lightred to-darkred rounded-lg text-center text-base text-white font-semibold"
      >
        Join Now
      </button>
    </div>
  );
}
