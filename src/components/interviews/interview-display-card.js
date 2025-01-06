import React from "react";

export default function InterviewDisplayCard({ index, candidate, date, time }) {
  return (
    <div className=" group relative w-full h-full flex flex-col items-center justify-center rounded-xl p-6 bg-gray-800/80">
        <div className=" group-hover:w-full group-hover:h-full absolute top-0 left-0 rounded-lg w-0 h-0 bg-gradient-to-bl from-[#785DFB]/10 to-[#65aaa6]/30 "></div>
      <h1 className=" text-2xl">Interview {index}</h1>
      <h3 className=" text-3xl lg:text-4xl font-semibold py-3 text-center">
        {candidate}
      </h3>
      <h3 className=" text-base md:text-lg">Date: {date}</h3>
      <h3 className=" text-base md:text-lg">Time: {time}</h3>
    
    </div>
  );
}
