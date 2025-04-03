"use client";
import React, { use, useEffect } from "react";
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
import { forwardRef, useRef, useImperativeHandle } from "react";

// React Icons
import { ImCross } from "react-icons/im";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { RiInformation2Line } from "react-icons/ri";
import CirculerProgress from "@/components/interview-room-analiyzer/circuler-progress";
import { StreamVideoCall } from "@/components/video/StreamVideoCall";
import { useState } from "react";
import InterviewRoomAnalizerOther from "./interview-room-analizer-other";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Code, PlusCircle } from "lucide-react";

const InterviewRoomAnalizerDashboard = forwardRef(
  (
    {
      analiyzeResponse,
      candidateAnswers,
      sessionId,
      questionList,
      availableQuestion,
      setAnaliyzeResponse,
      typingAnswer,
      setTypingAnswer,
      categoryScores,
      setCategoryScores,
      technicalStatus,
      userID,
      setActiveTab,
    },
    ref
  ) => {
    const videoCallRef = useRef();
    const [allAnswered, setAllAnswered] = useState(false);
    const [isAllUnansweredOrNoneAnswered, setIsAllUnansweredOrNoneAnswered] =
      useState(true);
    const [questionCountDown, setQuestionCountDown] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    useEffect(() => {
      if (availableQuestion?.estimatedTimeMinutes) {
        const totalSeconds = availableQuestion.estimatedTimeMinutes * 60;
        setQuestionCountDown(totalSeconds); // Initialize countdown in seconds

        const interval = setInterval(() => {
          setQuestionCountDown((prevCountDown) => {
            if (prevCountDown <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prevCountDown - 1;
          });
        }, 1000); // Update every second

        return () => clearInterval(interval);
      }
    }, [availableQuestion]);

    // Format time as MM:SS
    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0"); // Two-digit minutes
      const secs = (seconds % 60).toString().padStart(2, "0"); // Two-digit seconds
      return `${minutes}:${secs}`;
    };

    useEffect(() => {
      const unansweredQuestions = questionList.filter(
        (question) => question.isAnswered === false
      );
      const answeredCount = questionList.length - unansweredQuestions;
      setAllAnswered(unansweredQuestions.length === 0);
      setIsAllUnansweredOrNoneAnswered(
        answeredCount === 0 || unansweredQuestions.length === 0
      );
    }, [questionList]);

    const handleExternalEndCall = () => {
      videoCallRef.current?.endCall();
    };
    // Expose the handleExternalEndCall function through the ref
    useImperativeHandle(ref, () => ({
      endCall: handleExternalEndCall,
    }));

    const nextQuestion = () => {
      const data = {
        sessionId: sessionId,
      };
      socket.emit("nextQuestion", data);
      setAnaliyzeResponse({});
      setTypingAnswer("typing...");
      setCurrentQuestionIndex((prev) => prev + 1)
    };

    const endTechnicalTest = () => {
      const data = {
        sessionId: sessionId,
      };
      socket.emit("endTest", data);
      setAnaliyzeResponse({});
      setTypingAnswer("typing...");
    };

    const startTechnicalQuestions = () => {
      const data = {
        sessionId: sessionId,
      };
      socket.emit("startTest", data);
    };

    const handleFollowUpQuestion = (question) => {
      socket.emit("nextQuestion", {
        sessionId: sessionId,
        followUpQuestion: question,
      });
      setTypingAnswer("typing...");
    };

    // const nextQuestion = () => {
    //   if (currentQuestionIndex < questionList.length - 1) {
    //     setCurrentQuestionIndex((prev) => prev + 1)
    //   } else {
    //     setInterviewStage("completed")
    //     setTechnicalTestCompleted(true)
    //   }
    // }
  
    // Navigate to previous question
    const prevQuestion = () => {
      if (currentQuestionIndex > 0) {
        setCurrentQuestionIndex((prev) => prev - 1)
      }
    }

    return (
      <div className=" h-[90vh] w-full bg-black px-6">
        {/* {interviewStage === "pre-interview" && ( */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left panel - Questions preview */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Code className="h-5 w-5" />
                Technical Assessment Preview
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 py-4 overflow-auto">
              <div className="space-y-4">
                <p className="text-muted-foreground mb-4">
                  The following technical questions will be presented to the
                  candidate:
                </p>

                {/* Question List */}
                <div className="flex flex-col gap-3 mb-4">
                  {questionList.map((question, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 rounded-md border bg-card"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-muted-foreground/20 text-muted-foreground flex items-center justify-center text-xs">
                          {index + 1}
                        </div>
                        <span className="font-medium">
                          Question {index + 1}
                        </span>
                      </div>
                      <p className="text-sm ml-8">{question.questionText}</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center mt-6">
                  <Button
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    size="lg"
                    onClick={startTechnicalQuestions}
                  >
                    Start technical test
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right panel - Options */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg">Interview Options</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 py-6">
              <div className="flex flex-col items-center justify-center h-full space-y-8">
                <div className="text-center max-w-md">
                  <h3 className="text-xl font-medium mb-3">
                    You can start the technical test right away or evaluate soft
                    skills
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Some details saying the user can evaluate soft skills before
                    starting the technical test. This gives you flexibility in
                    how you conduct the interview.
                  </p>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full mb-4"
                    onClick={() => setActiveTab("overall")}
                  >
                    Evaluate soft skills
                  </Button>

                  {/* <Button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white w-full"
                      size="lg"
                      onClick={startTechnicalQuestions}
                    >
                      Start technical test
                    </Button> */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* )} */}

        {/* {interviewStage === "technical-test" && activeTab === "technical" && ( */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left panel - Current Question */}
            <Card className="flex flex-col">
              <CardHeader className="pb-3 border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Question {currentQuestionIndex + 1}
                  </CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span>
                      {currentQuestionIndex + 1}/{questionList.length}
                    </span>
                    <div className="flex ml-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={prevQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="h-7 w-7"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={nextQuestion}
                        disabled={currentQuestionIndex === questionList.length - 1}
                        className="h-7 w-7"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 py-4 overflow-auto">
                <div className="space-y-4">
                  {/* Question List - Simplified Navigation */}
                  <div className="flex flex-col gap-2 mb-4">
                    {questionList.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentQuestionIndex(index)}
                        className={`text-left px-3 py-2 rounded-md flex items-center gap-2 transition-colors ${
                          currentQuestionIndex === index ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            currentQuestionIndex === index
                              ? "bg-primary-foreground text-primary"
                              : "bg-muted-foreground/20 text-muted-foreground"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className="line-clamp-1 flex-1">{question.questionText}</span>
                      </button>
                    ))}
                  </div>

                  {/* Current Question */}
                  {/* <div className="border rounded-md p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium text-base">{currentQuestion.question}</h3>
                      <Badge variant="outline">
                        {currentQuestion.type === "multiple-choice"
                          ? "Multiple Choice"
                          : currentQuestion.type === "coding"
                            ? "Coding"
                            : "Text"}
                      </Badge>
                    </div>

                    {currentQuestion.type === "multiple-choice" && currentQuestion.options && (
                      <div className="space-y-2 mt-3">
                        {currentQuestion.options.map((option, index) => (
                          <div key={index} className="p-2 rounded-md border bg-card">
                            <div className="flex items-center gap-2">
                              <div className="h-4 w-4 rounded-full border border-muted-foreground flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full" />
                              </div>
                              <span className="text-sm">{option}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {currentQuestion.type === "coding" && (
                      <div className="mt-3 bg-muted/30 border rounded-md p-2 font-mono text-sm">
                        <pre className="whitespace-pre-wrap min-h-[150px] p-2">
                          {currentQuestion.candidateAnswer || "// Candidate will provide code here"}
                        </pre>
                      </div>
                    )}

                    {currentQuestion.type === "text" && (
                      <div className="mt-3 bg-muted/30 border rounded-md p-3 min-h-[150px]">
                        {currentQuestion.candidateAnswer || "Candidate will provide their answer here..."}
                      </div>
                    )}
                  </div> */}

                  <div className="flex justify-center mt-6">
                    {currentQuestionIndex < questionList.length - 1 ? (
                      <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={nextQuestion}>
                        Next question
                      </Button>
                    ) : (
                      <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={endTechnicalTest}>
                        End technical test
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Right panel - Analysis */}
            <Card className="flex flex-col">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg">Real-time Analysis</CardTitle>
              </CardHeader>

              <CardContent className="flex-1 py-4 overflow-auto">
                <div className="space-y-4">
                  {/* Candidate Answer */}
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium text-sm mb-2">Candidate's Answer</h4>
                    <div className="bg-muted/30 rounded-md p-3 min-h-[100px]">
                      <p className="text-sm">
                        {candidateAnswers?.answer || "Waiting for candidate to respond..."}
                      </p>
                    </div>
                  </div>

                  {/* Key Strengths and Improvements */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border rounded-md p-3">
                      <h4 className="text-sm font-medium mb-2">Key Strengths</h4>
                      {candidateAnswers?.answer ? (
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          
                        {analiyzeResponse.keyStrengths?.map((key, index) => (
                          <li key={index}>{key}</li>
                        )) || "No key strengths found"}
                
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">Waiting for candidate response...</p>
                      )}
                    </div>

                    <div className="border rounded-md p-3">
                      <h4 className="text-sm font-medium mb-2">Improvements</h4>
                      {candidateAnswers?.answer ? (
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {analiyzeResponse.areasOfImprovement?.map(
                          (key, index) => <li key={index}>{key}</li>
                        ) || "No areas of improvement found"}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">Waiting for candidate response...</p>
                      )}
                    </div>
                  </div>

                  {/* Alignment with requirements */}
                  <div className="border rounded-md p-3">
                    <h4 className="text-sm font-medium mb-2">Alignments with requirements</h4>
                    {candidateAnswers?.answer ? (
                      <p className="text-sm">
                        {analiyzeResponse?.alignment || ""}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">Waiting for candidate response...</p>
                    )}
                  </div>

                  {/* Follow-up Questions */}
                  <div className="border rounded-md p-3 bg-muted/20">
                    <h4 className="text-sm font-medium mb-2">Followup questions</h4>
                    <div className="space-y-2">
                    {analiyzeResponse.followUpQuestions?.map(
                        (question, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded-md border bg-card hover:bg-muted cursor-pointer text-sm"
                          >
                            <div className=" pr-2">{question}</div>
                            <div>
                              <AlertDialog>
                                <AlertDialogTrigger>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                      <PlusCircle className="h-4 w-4 text-blue-500 flex-shrink-0 ml-2" />
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
                                      Are you sure you want to add as next
                                      question?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>

                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
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
                      {/* <div className="flex items-center justify-between p-2 rounded-md border bg-card hover:bg-muted cursor-pointer text-sm">
                        
                        <span>Can you elaborate on your experience with similar challenges?</span>
                        <PlusCircle className="h-4 w-4 text-blue-500 flex-shrink-0 ml-2" />
                      </div> */}
                    </div>
                  </div>

                  {/* AI Score */}
                  {/* <div className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-sm">AI Score</h4>
                      <div className="flex items-center">
                        {editingAiScore === currentQuestion.id ? (
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              value={tempAiScore}
                              onChange={(e) =>
                                setTempAiScore(Math.min(100, Math.max(0, Number.parseInt(e.target.value) || 0)))
                              }
                              className="w-16 h-8 text-center"
                              min="0"
                              max="100"
                            />
                            <div className="flex gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-green-500"
                                onClick={() => handleSaveAiScore(currentQuestion.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 p-0 text-red-500"
                                onClick={handleCancelAiScoreEdit}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <div
                              className={`text-2xl font-bold ${
                                (currentQuestion.aiScore || 0) >= 80
                                  ? "text-green-600"
                                  : (currentQuestion.aiScore || 0) >= 60
                                    ? "text-blue-600"
                                    : (currentQuestion.aiScore || 0) >= 40
                                      ? "text-amber-600"
                                      : "text-red-600"
                              }`}
                            >
                              {currentQuestion.aiScore || 0}%
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                              onClick={() => handleEditAiScore(currentQuestion.id)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            (currentQuestion.aiScore || 0) >= 80
                              ? "bg-green-500"
                              : (currentQuestion.aiScore || 0) >= 60
                                ? "bg-blue-500"
                                : (currentQuestion.aiScore || 0) >= 40
                                  ? "bg-amber-500"
                                  : "bg-red-500"
                          }`}
                          style={{ width: `${currentQuestion.aiScore || 0}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-muted-foreground">Poor</span>
                        <span className="text-xs text-muted-foreground">Excellent</span>
                      </div>
                    </div>
                  </div>*/}
                </div> 
              </CardContent>
            </Card>
          </div>
        {/* )} */}
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={160}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={60}>
                <div className=" h-full w-full overflow-y-auto p-6 relative">
                  {technicalStatus === "testEnd" && (
                    <button
                      variant="secondary"
                      className="absolute top-0 right-6 mt-6 bg-white rounded-lg text-center text-sm text-black font-semibold h-11 w-[150px]"
                      onClick={endTechnicalTest}
                    >
                      End Technical Test
                    </button>
                  )}

                  {technicalStatus === "toBeConducted" && (
                    <button
                      variant="secondary"
                      className="absolute top-0 right-6 mt-6 bg-white rounded-lg text-center text-sm text-black font-semibold h-11 w-[150px]"
                      onClick={startTechnicalQuestions}
                    >
                      Start Technical Test
                    </button>
                  )}

                  {technicalStatus === "ongoing" && (
                    <button
                      variant="secondary"
                      className="absolute top-0 right-6 mt-6 bg-white rounded-lg text-center text-sm text-black font-semibold h-11 w-[130px]"
                      onClick={nextQuestion}
                    >
                      Next Question
                    </button>
                  )}

                  <h1 className=" text-3xl font-semibold">Question List</h1>
                  {technicalStatus === "ongoing" && (
                    <div className=" bg-[#b378ff]/20 mt-5 text-gray-400 border-2 border-[#b378ff] p-4 rounded-lg">
                      <h1 className=" text-2xl font-semibold">
                        {formatTime(questionCountDown)}
                      </h1>
                      <p className=" text-sm text-justify pt-3">
                        {typingAnswer}
                      </p>
                    </div>
                  )}

                  <div className=" mt-5 w-full">
                    {questionList.map((question, index) => (
                      <div
                        className=" bg-gray-700/20 mt-5 text-gray-400 border-2 border-gray-700 py-2 px-4 rounded-lg flex items-center justify-between"
                        key={index}
                      >
                        <div>
                          <div className=" flex justify-start items-center">
                            <h1 className="text-md text-gray-400 font-semibold">
                              Qestion :
                            </h1>
                            <h1 className="text-md text-gray-400 font-semibold px-2 ">
                              {question.estimatedTimeMinutes} min
                            </h1>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className=" text-[10px] text-orange-500 cursor-pointer border-orange-500 py-1 rounded-full w-[100px] px-1 border-2 flex items-center justify-center ">
                                    <RiInformation2Line className=" text-sm mr-1" />{" "}
                                    Explanation
                                  </span>
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
              <ResizablePanel defaultSize={40} className="bg-black px-3">
                <VideoCall
                  sessionId={sessionId}
                  isCandidate={false}
                  ref={videoCallRef}
                  senderId={userID}
                  role="COMPANY"
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={140}>
            {technicalStatus === "toBeConducted" ||
            technicalStatus === "completed" ? (
              <div className=" h-full overflow-y-auto p-6 overflow-x-hidden">
                <InterviewRoomAnalizerOther
                  categoryScores={categoryScores}
                  setCategoryScores={setCategoryScores}
                  sessionId={sessionId}
                  allocation={false}
                />
              </div>
            ) : (
              <div className=" h-full overflow-y-auto p-6 overflow-x-hidden relative">
                <div className=" absolute top-4 right-4 w-[100px] h-[100px]">
                  <CirculerProgress
                    marks={analiyzeResponse.relevanceScore}
                    catorgory="Score"
                    titleSize="text-lg"
                    subTitleSize="text-[10px]"
                  />
                </div>
                <h1 className=" text-3xl font-semibold">
                  Live Analysis Result
                </h1>
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
                    {/* <div className=" w-full mt-2">
                      <h1 className="py-3 font-semibold text-lg">Alignment</h1>
                      <p className=" text-sm text-gray-400">
                        {analiyzeResponse?.alignment || ""}
                      </p>
                    </div> */}
                  </div>
                </div>
                <div className=" w-full bg-blue-700/20 mt-5 text-gray-400 border-2 border-blue-700 px-4 py-3 rounded-lg">
                  <h1 className="py-3 font-semibold text-lg">Alignment</h1>
                  <p className=" text-sm text-gray-400">
                    {analiyzeResponse?.alignment || ""}
                  </p>
                </div>
                <div className=" w-full bg-gray-700/20 mt-5 text-gray-400 border-2 border-gray-700 rounded-lg py-4 px-7">
                  <h1 className=" font-semibold text-lg">Available Question</h1>
                  <p className=" text-sm text-gray-400">
                    {availableQuestion?.questionText || ""}
                  </p>
                </div>
                <div className="w-full bg-gray-700/20 mt-5 text-gray-400 border-2 border-gray-700 rounded-lg py-4 px-7">
                  <div>
                    <h1 className=" text-lg font-semibold">
                      Follow Up Questions
                    </h1>
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
                                      Are you sure you want to add as next
                                      question?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>

                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancel
                                    </AlertDialogCancel>
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
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    );
  }
);

InterviewRoomAnalizerDashboard.displayName = "InterviewRoomAnalizerDashboard";

export default InterviewRoomAnalizerDashboard;
