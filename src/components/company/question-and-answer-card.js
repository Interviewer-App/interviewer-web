import React from "react";

function QuestionAndAnswerCard({ index, question }) {
  return (
    <div key={index} className="mt-5">
      <div className=" w-full bg-slate-500/40 py-2 px-4 rounded-t-lg relative">
        <span className=" text-xl font-semibold text-gray-400">
          Q{index + 1}
        </span>
        <span className=" text-md text-gray-400 px-5">
          score: {question.interviewResponses?.score?.score / 10 || 0}/10
        </span>
        <div className="flex gap-2 absolute right-4 top-0 h-full items-center justify-between">
          <span className=" text-sm text-gray-400">Type:</span>
          <span className=" text-sm w-full text-gray-400">
            {question.type === "CODING" ? "Coding" : "Open Ended"}
          </span>
        </div>
      </div>
      <div className="w-full bg-slate-500/20 py-3 text-gray-300 px-6 rounded-b-lg">
        <p className="text-base w-full rounded-md bg-transparent text-gray-400 font-semibold focus:outline-none">
          {question.questionText}
        </p>
        <p className="text-sm w-full rounded-md bg-transparent text-gray-500 focus:outline-none px-5 py-3">
          {question.interviewResponses?.responseText || "No answer given"}
        </p>
      </div>
    </div>
  );
}

export default QuestionAndAnswerCard;
