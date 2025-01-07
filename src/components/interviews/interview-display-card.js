import Link from "next/link";
import React from "react";

export default function InterviewDisplayCard({ index, interview }) {
  const navigationClickHandler = () => {
    localStorage.setItem("interview",JSON.stringify(interview));
    window.location.href = "/interview-details";
  };



  return (
    // <Link href="/interview-details">
    <div onClick={navigationClickHandler} className=" group relative w-full h-full flex flex-col items-center justify-center rounded-xl p-6 bg-gray-800/80">
        <div className=" group-hover:w-full group-hover:h-full absolute top-0 left-0 rounded-lg w-0 h-0 bg-gradient-to-bl from-[#785DFB]/10 to-[#65aaa6]/30 "></div>
      <h1 className=" text-2xl">Interview {index}</h1>
      <h3 className=" text-3xl lg:text-4xl font-semibold py-3 text-center">
        {interview.jobTitle}
      </h3>
      <h3 className=" text-base md:text-lg">Date: {new Date(interview.scheduledDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</h3>
      <h3 className=" text-base md:text-lg">Time: {new Date(interview.scheduledAt).toLocaleTimeString()}</h3>
    </div>
    // </Link>
  );
}
