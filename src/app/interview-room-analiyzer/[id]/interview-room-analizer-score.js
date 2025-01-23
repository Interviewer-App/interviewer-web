"use client";
import React, { useState } from "react";
import CirculerProgress from "@/components/interview-room-analiyzer/circuler-progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// React Icons
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { RiInformation2Line } from "react-icons/ri";
import { MdExpandMore } from "react-icons/md";
import { MdExpandLess } from "react-icons/md";

function InterviewRoomAnalizerScore({
  numberOfAnswers,
  numOfQuestions,
  totalScore,
  questionList,
}) {
  const [expandedQuestions, setExpandedQuestions] = useState({});

  const toggleExpand = (index) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  return (
    <div className=" w-[90%] max-w-[1500px] mx-auto h-full p-6">
      <h1 className=" text-3xl font-semibold">Marks Overview</h1>
      <div className=" w-full flex flex-col-reverse md:flex-row justify-between items-start mt-9">
        <div className=" w-full md:w-[65%] mt-10 md:mt-0 md:mb-10">
          <h1 className=" text-2xl font-semibold">Question List</h1>
          {questionList.map((question, index) => (
            <div
              key={index}
              className=" bg-gray-700/20 mt-5 text-gray-400 border-2 border-gray-700 py-2 px-4 rounded-lg"
            >
              <div className=" flex items-center justify-between">
                <div className="w-[90%]">
                  <div className=" flex justify-start items-center">
                    <h1 className="text-md text-gray-400 font-semibold">
                      Qestion {index + 1} :
                    </h1>
                    <h1 className="text-md text-gray-400 font-semibold pl-1">
                      {question.estimatedTimeMinutes} min
                    </h1>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <RiInformation2Line className="text-orange-400 text-[18px] ml-2 inline-block cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent className="!bg-black p-4 rounded-lg !border-2 !border-gray-700">
                          <p className=" w-[500px] text-gray-300">
                            {question.explanation}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className=" mr-9 text-justify text-sm pt-3">
                    {question.questionText}
                  </div>
                </div>
                <div className="w-[10%] flex flex-col items-center justify-center">
                  {question.isAnswered && (
                    <IoMdCheckmarkCircleOutline className="text-green-500 text-[25px]" />
                  )}
                  {question.isAnswered && (
                    <p className=" text-sm py-1">
                      Marks: {question.interviewResponses.score.score}
                    </p>
                  )}
                </div>
              </div>
              <h1
                onClick={() => toggleExpand(index)}
                className=" text-xs bg-indigo-900/50 text-indigo-500 w-fit px-4 py-1 rounded-full my-2 cursor-pointer"
              >
                {expandedQuestions[index]
                  ? "Hide Candidate Answer"
                  : "Show Candidate Answer"}
                {expandedQuestions[index] ? (
                  <MdExpandLess className="inline-block ml-1" />
                ) : (
                  <MdExpandMore className="inline-block ml-1" />
                )}
              </h1>
              {expandedQuestions[index] && (
                <p className=" text-sm text-gray-500 px-5 mx-auto">
                  {question.interviewResponses.responseText ||
                    "No Answer Given"}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className=" w-full md:w-[35%] p-8 flex flex-col h-full items-center justify-start md:justify-center">
          <div className="  bg-gray-700/20 text-gray-400 border-2 py-8 border-gray-700 flex flex-col items-center justify-center w-full mt-7 md:mt-5 rounded-lg">
            <h1 className=" text-2xl font-semibold text-center">Total Score</h1>
            <h2 className=" text-base text-gray-500 text-center">
              {" "}
              {numberOfAnswers}/{numOfQuestions} Questions
            </h2>
            <CirculerProgress
              marks={totalScore}
              catorgory="Total score"
              titleSize="text-4xl"
              subTitleSize="text-sm"
            />
            <p className=" text-gray-300 text-center">
              {totalScore}% Accurate with expected answers
            </p>
            <p className=" text-sm text-gray-500 text-center">
              Showing Total Score for {numberOfAnswers} out of {numOfQuestions} question
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewRoomAnalizerScore;
