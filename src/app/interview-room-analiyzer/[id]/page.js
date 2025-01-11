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

const InterviewRoomAnalizerPage = () => {
  // const { socket } = useSocket();
  const [candidateAnswers, setCandidateAnswers] = useState({
    question: "What is polymorphism in object-oriented programming?",
    answer:
      'Polymorphism allows objects to be treated as instances of their parent class. For example, in Java, a parent class can have a method "draw" that is overridden in subclasses like Circle or Square. It improves flexibility and reusability.',
  });

  const [response, setResponse] = useState({
    relevanceScore: 90,
    keyStrengths: [
      "Understands the core concept of polymorphism",
      "Provides a concrete example using Java",
      "Highlights the benefits of flexibility and reusability",
    ],
    areasOfImprovement: [
      "Could explain different types of polymorphism (e.g., compile-time vs. runtime)",
      "Could elaborate on the mechanism behind polymorphism (e.g., method overriding, virtual functions)",
    ],
    alignment:
      "Strongly aligns with the job requirement, which typically requires a solid understanding of OOP concepts.",
    followUpQuestions: [
      "Could you explain the difference between compile-time and runtime polymorphism with an example?",
      "How does polymorphism contribute to the open/closed principle in object-oriented design?",
      "Can you describe a real-world scenario where you have used polymorphism and how it solved a problem?",
    ],
  });

  const { toast } = useToast();

  useEffect(() => {
    socket.on("interviewStarted", ({ firstQuestion }) => {
      router.push(`/interview/${sessionId}/question`);
    });

    return () => {
      socket.off("interviewStarted");
    };
  }, []);

  return (
    <div className=" h-full">
      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-md rounded-lg md:min-w-full h-full"
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
                    {response.keyStrengths.map((key, index) => (
                      <li key={index}>{key}</li>
                    ))}
                  </ul>
                </div>
                <div className=" w-full mt-2">
                  <h1 className="py-3 font-semibold text-lg">
                    Areas of Improvement
                  </h1>
                  <ul className="list-disc list-inside text-sm text-gray-400">
                    {response.areasOfImprovement.map((key, index) => (
                      <li key={index}>{key}</li>
                    ))}
                  </ul>
                </div>
                <div className=" w-full mt-2">
                  <h1 className="py-3 font-semibold text-lg">Alignment</h1>
                  <p className=" text-sm text-gray-400">{response.alignment}</p>
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
                <div className="flex flex-col md:flex-row h-full items-center justify-center w-full">
                  <div className="flex flex-col items-center justify-center w-[50%]">
                    <h1 className=" text-2xl font-semibold">Total Score</h1>
                    <h2 className=" text-base text-gray-500">
                      {" "}
                      8/10 Questions
                    </h2>
                    <CirculerProgress marks={76} catorgory='Total score'/>
                    <p className=" text-gray-300">76% Accurate with expected answers</p>
                    <p className=" text-sm text-gray-500">
                      Showing Total Score for 8 out of 10 question
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center w-[50%]">
                    <h1 className=" text-2xl font-semibold">Relevance Score</h1>
                    <h2 className=" text-base text-gray-500">Question 01</h2>
                    <CirculerProgress marks={60} catorgory='Question 01'/>
                    <p className=" text-gray-300">60% Accurate with expected answer</p>
                    <p className=" text-sm text-gray-500">
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
                      {response.followUpQuestions.map((question, index) => (
                        <li key={index} className=" py-2 text-gray-400">
                          {question}
                        </li>
                      ))}
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
