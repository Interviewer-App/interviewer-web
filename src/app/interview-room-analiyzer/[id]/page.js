"use client";

//MUI
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { getSession } from "next-auth/react";
import socket from "../../../lib/utils/socket";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import CirculerProgress from "@/components/interview-room-analiyzer/circuler-progress";
import { analiyzeQuestion } from "@/lib/api/ai";

const InterviewRoomAnalizerPage = () => {
  // const { socket } = useSocket();
  const [candidateAnswers, setCandidateAnswers] = useState({
    question: "What is polymorphism in object-oriented programming?",
    answer:
      ' Polymorphism allows objects to be treated as instances of their parent class. For example, in Java, a parent class can have a method "draw" that is overridden in subclasses like Circle or Square. It improves flexibility and reusability.',
  });
  const [analiyzeResponse, setAnaliyzeResponse] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    socket.on("interviewStarted", ({ firstQuestion }) => {
      router.push(`/interview/${sessionId}/question`);
    });

    return () => {
      socket.off("interviewStarted");
    };
  }, []);

  useEffect(() => {
    if (candidateAnswers) {
      handleQuestionAnaliyze();
    }
  }, [candidateAnswers]);

  const handleQuestionAnaliyze = async () => {
    try {
      const response = await analiyzeQuestion(
        candidateAnswers
        // {question: "What is polymorphism in object-oriented programming?",
        // answer:'i dont know',}
      );

      if (response) {
        setAnaliyzeResponse(response.data);
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Question Analiysis failed: ${data.message}`,
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "An unexpected error occurred. Please try again.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An unexpected error occurred. Please check your network and try again.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    }
  };

  return (
    <div className=" h-full">
      <ResizablePanelGroup
        direction="horizontal"
        className=" rounded-lg md:min-w-full h-full"
      >
        <ResizablePanel defaultSize={150}>
          <div className=" h-full p-6">
            <h1 className=" text-3xl font-semibold">Live Analysis Result</h1>
            <div className=" w-full mt-2">
              <h1 className=" py-3 font-semibold text-lg">Question</h1>
              <p className=" text-sm text-gray-400">
                {candidateAnswers.question}
              </p>
            </div>
            <div className=" w-full mt-2">
              <h1 className=" py-3 font-semibold text-lg">
                Candidate's Answer
              </h1>
              <p className=" text-sm text-gray-400">
                {candidateAnswers.answer}
              </p>
            </div>
            <div className=" w-full rounded-lg bg-gray-600/30 py-4 px-7 mt-5">
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
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={150}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={65}>
              <div className=" w-full h-full p-6">
                <h1 className=" text-3xl font-semibold">Marks Overview</h1>
                <div className="flex flex-col md:flex-row h-full items-center justify-start md:justify-center w-full">
                  <div className="flex flex-col items-center justify-center w-[50%] mt-7 md:mt-0">
                    <h1 className=" text-2xl font-semibold text-center">
                      Total Score
                    </h1>
                    <h2 className=" text-base text-gray-500 text-center">
                      {" "}
                      8/10 Questions
                    </h2>
                    <CirculerProgress marks={76} catorgory="Total score" />
                    <p className=" text-gray-300 text-center">
                      76% Accurate with expected answers
                    </p>
                    <p className=" text-sm text-gray-500 text-center">
                      Showing Total Score for 8 out of 10 question
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center w-[50%] mt-7 md:mt-0">
                    <h1 className=" text-2xl font-semibold text-center">
                      Relevance Score
                    </h1>
                    <h2 className=" text-base text-gray-500 text-center">
                      Question 01
                    </h2>
                    <CirculerProgress
                      marks={analiyzeResponse.relevanceScore}
                      catorgory="Question 01"
                    />
                    <p className=" text-gray-300 text-center">
                      {analiyzeResponse.relevanceScore}% Accurate with expected
                      answer
                    </p>
                    <p className=" text-sm text-gray-500 text-center">
                      Showing Relevance Score for current question
                    </p>
                  </div>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={35}>
              <div className="h-full p-6">
                <div>
                  <h1 className=" text-3xl font-semibold">
                    Follow Up Questions
                  </h1>
                  <div className=" mt-3 rounded-lg py-2">
                    <ol className="list-decimal list-outside pl-7 ">
                      {analiyzeResponse.followUpQuestions?.map(
                        (question, index) => (
                          <li key={index} className=" py-2 text-gray-400">
                            {question}
                          </li>
                        )
                      ) || "No follow up questions found"}
                    </ol>
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default InterviewRoomAnalizerPage;
