"use client";

//MUI
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { getSession } from "next-auth/react";
import socket from "../../../lib/utils/socket";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { useEffect, useState, useCallback, use } from "react";
import { CircularProgress } from "@mui/material";
import CirculerProgress from "@/components/interview-room-analiyzer/circuler-progress";
import { analiyzeQuestion } from "@/lib/api/ai";
import ResponsiveAppBar from "@/components/ui/CandidateNavBar";
import { PuffLoader } from "react-spinners";

const InterviewRoomAnalizerPage = () => {
  const pages = ["candidate.Name", "candidate.Email"];
  const [candidateAnswers, setCandidateAnswers] = useState();
  const [analiyzeResponse, setAnaliyzeResponse] = useState({});
  const [isSubmitAnswers, setIsSubmitAnswers] = useState(false);
  const [numOfQuestions, setNumOfQuestions] = useState(0);
  const [answeredQuestionNo, setAnsweredQuestionNO] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [numberOfAnswers, setNumberOfAnswers] = useState(0);
  const [timeNow, setTimeNow] = useState(() => new Date().toLocaleTimeString());

  const { toast } = useToast();

  useEffect(() => {
    socket.on("answerSubmitted", (data) => {
      debugger;
      setIsSubmitAnswers(true);
      setCandidateAnswers({
        question: data.questionText,
        answer: data.answerText,
      });
      setAnaliyzeResponse(data.metrics);
      setAnsweredQuestionNO(data.questionNumber);
      setNumOfQuestions(data.numOfQuestions);
      setTotalScore(data.totalScore.totalScore);
      setNumberOfAnswers(data.totalScore.numberOfAnswers);
      // router.push(`/interview/${sessionId}/question`);
    });

    return () => {
      socket.off("answerSubmitted");
    };
  }, []);

  // const handleQuestionAnaliyze = useCallback(async () => {
  //   try {
  //     const response = await analiyzeQuestion(
  //       candidateAnswers
  //       // {question: "What is polymorphism in object-oriented programming?",
  //       // answer:'i dont know',}
  //     );

  //     if (response) {
  //       setAnaliyzeResponse(response.data);
  //     }
  //   } catch (error) {
  //     if (error.response) {
  //       const { data } = error.response;

  //       if (data && data.message) {
  //         toast({
  //           variant: "destructive",
  //           title: "Uh oh! Something went wrong.",
  //           description: `Question Analiysis failed: ${data.message}`,
  //           action: <ToastAction altText="Try again">Try again</ToastAction>,
  //         });
  //       } else {
  //         toast({
  //           variant: "destructive",
  //           title: "Uh oh! Something went wrong.",
  //           description: "An unexpected error occurred. Please try again.",
  //           action: <ToastAction altText="Try again">Try again</ToastAction>,
  //         });
  //       }
  //     } else {
  //       toast({
  //         variant: "destructive",
  //         title: "Uh oh! Something went wrong.",
  //         description:
  //           "An unexpected error occurred. Please check your network and try again.",
  //         action: <ToastAction altText="Try again">Try again</ToastAction>,
  //       });
  //     }
  //   }
  // }, [candidateAnswers, toast]);

  // useEffect(() => {
  //   if (candidateAnswers) {
  //     handleQuestionAnaliyze();
  //   }
  // }, [candidateAnswers, handleQuestionAnaliyze, toast]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {isSubmitAnswers ? (
        <>
          <div className=" h-lvh">
            <ResponsiveAppBar pages={pages} />

            <ResizablePanelGroup
              direction="horizontal"
              className=" rounded-lg md:min-w-full h-full"
            >
              <ResizablePanel defaultSize={150}>
                <div className=" h-full overflow-y-auto p-6">
                  <h1 className=" text-3xl font-semibold">
                    Live Analysis Result
                  </h1>
                  <div className=" w-full mt-2">
                    <h1 className=" py-3 font-semibold text-lg">Question</h1>
                    <p className=" text-sm text-gray-400">
                      {candidateAnswers.question}
                    </p>
                  </div>
                  <div className=" w-full mt-2">
                    <h1 className=" py-3 font-semibold text-lg">
                      Candidate&apos;s Answer
                    </h1>
                    <p className=" text-sm text-gray-400">
                      {candidateAnswers.answer}
                    </p>
                  </div>
                  <div className=" w-full rounded-lg bg-gray-600/30 py-4 px-7 mt-5">
                    <h1 className=" text-2xl font-semibold">
                      Analysis with AI
                    </h1>
                    <div className=" mt-2">
                      <div className=" w-full">
                        <h1 className="py-3 font-semibold text-lg">
                          keyStrengths
                        </h1>
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
                          {analiyzeResponse.areasOfImprovement?.map(
                            (key, index) => <li key={index}>{key}</li>
                          ) || "No areas of improvement found"}
                        </ul>
                      </div>
                      <div className=" w-full mt-2">
                        <h1 className="py-3 font-semibold text-lg">
                          Alignment
                        </h1>
                        <p className=" text-sm text-gray-400">
                          {analiyzeResponse?.alignment || ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    className="absolute h-16 y-8 mt-8"
                  >
                    Next Questions
                  </Button>

                  {/* <Button variant="secondary"  className="mt-60 ml-96 px-8 py-8 text-lg
    sm:mt-8 sm:mx-auto sm:ml-8 sm:block sm:text-base
    md:mt-60 md:ml-96 md:block flex item justify-center">Generate Next Questions</Button> */}
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={150}>
                <ResizablePanelGroup direction="vertical">
                  <ResizablePanel defaultSize={65}>
                    <div className=" w-full h-full overflow-y-auto p-6 relative">
                      <h1 className=" text-3xl font-semibold">
                        Marks Overview
                      </h1>
                      <div className="flex flex-col md:flex-row h-full items-center justify-start md:justify-center w-full">
                        <div className="flex flex-col items-center justify-center w-[50%] mt-7 md:mt-0">
                          <h1 className=" text-2xl font-semibold text-center">
                            Total Score
                          </h1>
                          <h2 className=" text-base text-gray-500 text-center">
                            {" "}
                            {numberOfAnswers}/{numOfQuestions} Questions
                          </h2>
                          <CirculerProgress
                            marks={totalScore}
                            catorgory="Total score"
                          />
                          <p className=" text-gray-300 text-center">
                            {totalScore}% Accurate with expected answers
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
                            {answeredQuestionNo}
                          </h2>
                          <CirculerProgress
                            marks={analiyzeResponse.relevanceScore}
                            catorgory="Question 01"
                          />
                          <p className=" text-gray-300 text-center">
                            {analiyzeResponse.relevanceScore}% Accurate with
                            expected answer
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
                    <div className="h-full w-full overflow-y-auto p-6">
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
        </>
      ) : (
        <div className="flex flex-col h-lvh w-full justify-center item-center">
          <div className=" w-full flex flex-col justify-center items-center mb-14">
            <div className=" w-full flex flex-col justify-center items-center">
              <h1 className=" text-lg">scheduled Time: 9:55:19 AM</h1>
              <h1 className=" font-semibold text-3xl py-3">
                Time now: {timeNow}
              </h1>
            </div>
          </div>
          <div className=" w-full flex flex-col justify-center items-center mb-16"> 
            <PuffLoader color="#ffffff" />
          </div>
          <div className=" w-full flex flex-col justify-center] items-center">
            <p className=" w-[75%] mx-auto text-center font-semibold text-xl pt-5">
              Awaiting the candidate&apos;s response to the first question. Please
              hold on while they provide their answer.
            </p>
            <p className=" w-[25%] mx-auto text-center text-sm py-2 text-lightred">
              Candidate is responding to the first question...
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default InterviewRoomAnalizerPage;
