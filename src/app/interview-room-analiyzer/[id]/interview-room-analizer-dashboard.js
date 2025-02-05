"use client";
import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import socket from "../../../lib/utils/socket";
import VideoCall from "@/components/video/video";
import { forwardRef, useRef, useImperativeHandle } from 'react';

// React Icons
import { ImCross } from "react-icons/im";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { RiInformation2Line } from "react-icons/ri";
import CirculerProgress from "@/components/interview-room-analiyzer/circuler-progress";
import { StreamVideoCall } from "@/components/video/StreamVideoCall";

const InterviewRoomAnalizerDashboard = forwardRef(({
  analiyzeResponse,
  candidateAnswers,
  sessionId,
  questionList,
  availableQuestion,
  setAnaliyzeResponse,
  typingAnswer,
  setTypingAnswer,
}, ref) =>{
  const videoCallRef = useRef();

  const handleExternalEndCall = () => {
    videoCallRef.current?.endCall();
  };
  // Expose the handleExternalEndCall function through the ref
  useImperativeHandle(ref, () => ({
    endCall: handleExternalEndCall
  }));
  const nextQuestion = () => {
    const data = {
      sessionId: sessionId,
    };
    socket.emit("nextQuestion", data);
    setAnaliyzeResponse({});
    setTypingAnswer("typing...");
  };

  const handleFollowUpQuestion = (question) => {
    socket.emit("nextQuestion", {
      sessionId: sessionId,
      followUpQuestion: question,
    });
    setTypingAnswer("typing...");
  };


  return (
    <div className=" h-[90vh] w-full bg-black">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={160}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={60}>
              <div className=" h-full w-full overflow-y-auto p-6 relative">
                <button
                  variant="secondary"
                  className=" absolute top-0 right-6 mt-6 bg-white rounded-lg text-center text-sm text-black font-semibold h-11 w-[130px]"
                  onClick={nextQuestion}
                >
                  Next Question
                </button>
                <h1 className=" text-3xl font-semibold">Question List</h1>
                <div
                  className=" bg-[#b378ff]/20 mt-5 text-gray-400 border-2 border-[#b378ff] py-2 px-4 rounded-lg flex items-center justify-between"
                >

                  <div className=" mr-9 text-justify text-sm pt-3">
                    {typingAnswer}
                  </div>
                </div>

                <div className=" mt-5 w-full">
                  {questionList.map((question, index) => (
                    <div
                      className=" bg-gray-700/20 mt-5 text-gray-400 border-2 border-gray-700 py-2 px-4 rounded-lg flex items-center justify-between"
                      key={index}
                    >
                      <div>
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
                      <div>
                        {question.isAnswered && (
                          <IoMdCheckmarkCircleOutline className="text-green-500 text-[22px]" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={40}>
              <VideoCall sessionId={sessionId} isCandidate={false} ref={videoCallRef}/>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={140}>
          <div className=" h-full overflow-y-auto p-6 overflow-x-hidden relative">
            <div className=" absolute top-4 right-4 w-[100px] h-[100px]">
              <CirculerProgress
                marks={analiyzeResponse.relevanceScore}
                catorgory="Score"
                titleSize="text-lg"
                subTitleSize="text-[10px]"
              />
            </div>
            <h1 className=" text-3xl font-semibold">Live Analysis Result</h1>
            <div className=" w-full mt-2">
              <h1 className=" py-3 font-semibold text-lg">Question</h1>
              <p className=" text-sm text-gray-400">
                {candidateAnswers?.question}
              </p>
            </div>
            <div className=" w-full bg-blue-700/20 mt-5 text-gray-400 border-2 border-blue-700 px-4 py-3 rounded-lg">
              <h1 className=" font-semibold text-lg">
                Candidate&apos;s Answer
              </h1>
              <p className=" text-sm text-gray-400">
                {candidateAnswers?.answer}
              </p>
            </div>
            <div className=" w-full bg-gray-700/20 mt-5 text-gray-400 border-2 border-gray-700 rounded-lg py-4 px-7">
              <h1 className=" text-2xl font-semibold">Analysis with AI</h1>
              <div className=" mt-2">
                <div className=" w-full">
                  <h1 className="py-3 font-semibold text-lg">keyStrengths</h1>
                  <ul className="list-disc list-inside text-sm text-gray-400">
                    {analiyzeResponse.keyStrengths?.map((key, index) => (
                      <li key={index}>{key}</li>
                    )) || "No key strengths found"}
                  </ul>
                </div>
                <div className=" w-full mt-2">
                  <h1 className="py-3 font-semibold text-lg">
                    Areas of Improvement
                  </h1>
                  <ul className="list-disc list-inside text-sm text-gray-400">
                    {analiyzeResponse.areasOfImprovement?.map((key, index) => (
                      <li key={index}>{key}</li>
                    )) || "No areas of improvement found"}
                  </ul>
                </div>
                <div className=" w-full mt-2">
                  <h1 className="py-3 font-semibold text-lg">Alignment</h1>
                  <p className=" text-sm text-gray-400">
                    {analiyzeResponse?.alignment || ""}
                  </p>
                </div>
              </div>
            </div>
            <div className=" w-full bg-gray-700/20 mt-5 text-gray-400 border-2 border-gray-700 rounded-lg py-4 px-7">
              <h1 className=" font-semibold text-lg">Available Question</h1>
              <p className=" text-sm text-gray-400">
                {availableQuestion?.questionText || ""}
              </p>
            </div>
            <div className="w-full bg-gray-700/20 mt-5 text-gray-400 border-2 border-gray-700 rounded-lg py-4 px-7">
              <div>
                <h1 className=" text-lg font-semibold">Follow Up Questions</h1>
                <div className=" mt-3 rounded-lg">
                  {analiyzeResponse.followUpQuestions?.map(
                    (question, index) => (
                      <div
                        key={index}
                        className=" py-3 text-sm bg-gray-700/20 mt-5 text-gray-400 border-2 border-gray-700 px-4 rounded-lg flex items-center justify-between"
                      >
                        <div className=" pr-2">{question}</div>
                        <div>
                          <AlertDialog>
                            <AlertDialogTrigger>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <IoMdAddCircleOutline className="text-blue-500 text-[22px] cursor-pointer" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Add as Next Question</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure you want to add as next question?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    handleFollowUpQuestion(question);
                                  }}
                                  className="h-[40px] font-medium"
                                >
                                  Add
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    )
                  ) || "No follow up questions found"}
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
});

export default InterviewRoomAnalizerDashboard;
