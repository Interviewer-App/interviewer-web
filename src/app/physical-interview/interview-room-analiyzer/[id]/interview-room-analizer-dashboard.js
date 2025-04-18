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

import socket from "@/lib/utils/socket";
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
import {
  ArrowUpRight,
  CircleCheckBig,
  Share,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addMarks } from "@/lib/api/interview-session";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";

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
      setManualScoreChange,
      manualScoreChange,
    },
    ref
  ) => {
    const videoCallRef = useRef();
    const [allAnswered, setAllAnswered] = useState(false);
    const [isAllUnansweredOrNoneAnswered, setIsAllUnansweredOrNoneAnswered] =
      useState(true);
    const [questionCountDown, setQuestionCountDown] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [score, setScore] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedQuestionID, setSelectedQuestionID] = useState(null); // New state for selected questionID
    const { toast } = useToast();

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

    const openTestOnNewTab = () => {
      // Define the hardcoded questions
      const questions = [
        {
          id: 1,
          questionText:
            "Explain the difference between let, const, and var in JavaScript.",
          estimatedTimeMinutes: 5,
          explanation:
            "This question tests the candidate's understanding of variable declaration and scoping in JavaScript.",
          isAnswered: false,
        },
        {
          id: 2,
          questionText:
            "What is the Virtual DOM in React and how does it improve performance?",
          estimatedTimeMinutes: 7,
          explanation:
            "This evaluates the candidate's knowledge of React's core optimization mechanism.",
          isAnswered: false,
        },
        {
          id: 3,
          questionText:
            "Describe how you would implement a debounce function in JavaScript.",
          estimatedTimeMinutes: 10,
          explanation:
            "Tests understanding of event handling and performance optimization techniques.",
          isAnswered: false,
        },
        {
          id: 4,
          questionText:
            "What are React hooks and how do they differ from class components?",
          estimatedTimeMinutes: 8,
          explanation:
            "Assesses knowledge of modern React patterns and state management.",
          isAnswered: false,
        },
        {
          id: 5,
          questionText:
            "Explain the concept of closures in JavaScript with an example.",
          estimatedTimeMinutes: 6,
          explanation:
            "Tests fundamental JavaScript knowledge and scoping understanding.",
          isAnswered: false,
        },
      ];

      // Create HTML content with navigation logic
      const htmlContent =
        "<html>" +
        "<head>" +
        "<title>Interview Questions</title>" +
        "<style>" +
        "body {" +
        "font-family: Arial, sans-serif;" +
        "background-color: #1a1a1a;" +
        "color: #d1d5db;" +
        "padding: 20px;" +
        "margin: 0;" +
        "display: flex;" +
        "flex-direction: column;" +
        "align-items: center;" +
        "justify-content: center;" +
        "height: 100vh;" +
        "}" +
        "h1 {" +
        "color: #ffffff;" +
        "font-size: 24px;" +
        "margin-bottom: 20px;" +
        "}" +
        ".question-container {" +
        "background-color: #2d2d2d;" +
        "padding: 20px;" +
        "border-radius: 8px;" +
        "border: 1px solid #4b5563;" +
        "width: 80%;" +
        "max-width: 600px;" +
        "}" +
        ".question-text {" +
        "font-size: 18px;" +
        "margin-bottom: 15px;" +
        "}" +
        ".details {" +
        "font-size: 14px;" +
        "color: #9ca3af;" +
        "}" +
        ".navigation {" +
        "margin-top: 20px;" +
        "display: flex;" +
        "justify-content: space-between;" +
        "width: 80%;" +
        "max-width: 600px;" +
        "}" +
        "button {" +
        "padding: 10px 20px;" +
        "background-color: #3b82f6;" +
        "color: white;" +
        "border: none;" +
        "border-radius: 5px;" +
        "cursor: pointer;" +
        "font-size: 14px;" +
        "}" +
        "button:disabled {" +
        "background-color: #6b7280;" +
        "cursor: not-allowed;" +
        "}" +
        "button:hover:not(:disabled) {" +
        "background-color: #2563eb;" +
        "}" +
        "</style>" +
        "</head>" +
        "<body>" +
        "<h1>Interview Questions</h1>" +
        '<div id="questionCounter" style="font-size: 16px; color: #9ca3af; margin-bottom: 20px;"></div>' + // Add this line
        '<div class="question-container" id="questionContainer"></div>' +
        '<div class="navigation">' +
        '<button id="prevBtn">Previous</button>' +
        '<button id="nextBtn">Next</button>' +
        "</div>" +
        "<script>" +
        "const questions = " +
        JSON.stringify(questions) +
        ";" +
        "let currentIndex = 0;" +
        "function displayQuestion(index) {" +
        "const question = questions[index];" +
        'const container = document.getElementById("questionContainer");' +
        'const counter = document.getElementById("questionCounter");' + // Add this line
        'counter.innerHTML = "Question " + (index + 1) + " of " + questions.length;' + // Add this line
        "container.innerHTML = " +
        '"<div class=\\"question-text\\">" + question.questionText + "</div>" + ' +
        '"<div class=\\"details\\">" + ' +
        '"Estimated Time: " + question.estimatedTimeMinutes + " minutes<br>" + ' +
        '"Explanation: " + question.explanation + ' +
        '"</div>";' +
        'const prevBtn = document.getElementById("prevBtn");' +
        'const nextBtn = document.getElementById("nextBtn");' +
        "prevBtn.disabled = index === 0;" +
        "nextBtn.disabled = index === questions.length - 1;" +
        "}" +
        "displayQuestion(currentIndex);" +
        'document.getElementById("prevBtn").addEventListener("click", () => {' +
        "if (currentIndex > 0) {" +
        "currentIndex--;" +
        "displayQuestion(currentIndex);" +
        "}" +
        "});" +
        'document.getElementById("nextBtn").addEventListener("click", () => {' +
        "if (currentIndex < questions.length - 1) {" +
        "currentIndex++;" +
        "displayQuestion(currentIndex);" +
        "}" +
        "});" +
        "</script>" +
        "</body>" +
        "</html>";

      // Open a new window with the questions
      const newWindow = window.open(
        "",
        "InterviewQuestions",
        "width=800,height=600,scrollbars=yes,resizable=yes"
      );
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
      } else {
        alert("Popup blocked! Please allow popups for this site.");
      }
    };

    const handleAddMarks = async (id, score) => {
      if (!id) {
        return;
      }
      setManualScoreChange(score);

      const payload = {
        questionID: id,
        feedback: "hi",
        score: parseInt(score, 10) || 0,
      };

      try {
        socket.emit("submitQuestionScore", {
          sessionId: sessionId,
          questionScore: payload,
        });
      } catch (error) {
        toast({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
          variant: "destructive",
        });
      }
    };

    const openDialogForQuestion = (questionID) => {
      setSelectedQuestionID(questionID); 
      setFeedback(""); 
      setScore(""); 
      setIsDialogOpen(true); 
    };

    const getScoreColor = (score) => {
      if (score >= 90) return "!text-green-500";
      if (score >= 80) return "!text-blue-500";
      if (score >= 70) return "!text-yellow-300";
      if (score >= 45) return "!text-orange-500";
      return "!text-red-500";
    };

    return (
      <div className=" h-[90vh] w-full bg-black">
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
                    <>
                      <button
                        variant="secondary"
                        className="absolute top-0 right-6 mt-6 bg-white rounded-lg text-center text-sm text-black font-semibold h-11 w-[130px]"
                        onClick={nextQuestion}
                      >
                        Next Question
                      </button>

                      <button
                        variant="secondary"
                        className="absolute top-0 right-48 mt-6 bg-white rounded-lg text-center text-sm text-black font-semibold h-11 w-[150px]"
                        onClick={openTestOnNewTab}
                      >
                        Share{" "}
                        <ArrowUpRight className="inline-block" width={15} />
                      </button>
                    </>
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
                        className=" bg-gray-700/20 mt-5 text-gray-400 border-2 border-gray-700 py-2 px-4 rounded-lg justify-between"
                        key={index}
                      >
                        <div>
                          <div className="flex justify-between">
                            <div className=" flex justify-start items-center">
                              <h1 className="text-md text-gray-400 font-semibold">
                                Question :
                              </h1>
                              <h1 className="text-md text-gray-400 font-semibold px-2 ">
                                {question.estimatedTimeMinutes} min
                              </h1>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge className="!bg-orange-500/10 !text-orange-600 mb-0 px-3 py-1 border !border-orange-600">
                                      <RiInformation2Line className="text-orange-500 h-4 mr-1" />
                                      Explanation
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent className="!bg-black p-4 rounded-lg !border-2 !border-gray-700">
                                    <p className=" w-[500px] text-gray-300">
                                      {question.explanation}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <div>
                              <div className="flex items-center space-x-3">
                                <span className="text-base font-semibold rounded-md p-2">
                                  {question.isAnswered && (
                                    <Badge className="!bg-green-500/10 !text-green-600 mb-0 px-3 py-1 border !border-green-600  mr-2">
                                      <CircleCheckBig className="text-green-500 h-4" />
                                      Answered
                                    </Badge>
                                  )}
                                  <span
                                    className={`${getScoreColor(
                                      question?.questionScore?.score || 0
                                    )}`}
                                  >
                                    {question?.questionScore?.score || 0}
                                  </span>
                                  /100
                                </span>
                                {/* Added space-x-3 for gap */}
                                {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                  <DialogTrigger asChild>
                                  <Button onClick={() => openDialogForQuestion(question.questionID)}>
                                {question.isAnswered ? "Edit Marks" : "Add Marks"}
                                      </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                      <DialogTitle>Add marks to the question</DialogTitle>
                                      <DialogDescription>
                                        Enter feedback and score for this question. Click save when you&apos;re done.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="feedback" className="text-right">
                                          Feedback
                                        </Label>
                                        <Input
                                          id="feedback"
                                          value={feedback}
                                          onChange={(e) => setFeedback(e.target.value)}
                                          className="col-span-3"
                                        />
                                      </div>
                                      <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="score" className="text-right">
                                          Score
                                        </Label>
                                        <div className="col-span-3 space-y-1">
                                          <Input
                                            id="score"
                                            type="number"
                                            value={score}
                                            onChange={(e) => setScore(e.target.value)}
                                          />
                                          <p className="text-xs text-muted-foreground text-red-400">
                                            Marks should not exceed 100
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button type="submit" onClick={handleAddMarks}>
                                        Save changes
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog> */}
                                {/* Display marks only if the question is answered and has a score */}
                                {/* {question.isAnswered &&
                                  question.questionScore?.score !==
                                    undefined && (
                                    <span className="text-sm text-orange-500 font-semibold bg-black border border-gray-500 rounded-md p-2">
                                      {question?.questionScore?.score}/100
                                    </span>
                                  )} */}
                              </div>
                            </div>
                          </div>

                          <div className=" mr-9 text-justify text-sm pt-3">
                            {question.questionText}
                          </div>
                        </div>
                        <div>
                          <Badge className="!bg-blue-500/20 !text-blue-600 px-3 py-1 border !border-blue-600">
                            {question.estimatedTimeMinutes} minutes
                          </Badge>
                          <Badge className="!bg-blue-500/20 !text-blue-600 px-3 py-1 border !border-blue-600 ml-2">
                            {question.type
                              .toLowerCase()
                              .split("_")
                              .map(
                                (word) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")}
                          </Badge>
                        </div>
                        <div className=" mt-5">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <ThumbsDown className="h-4 w-4 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                Poor
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                Excellent
                              </span>
                              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                          <Slider
                            value={[question?.questionScore?.score || 0]}
                            max={100}
                            step={1}
                            id={"technical-manual-marks"}
                            // marks={question?.questionScore?.score || 0}
                            // enableColor={true}
                            onValueChange={(value) =>
                              handleAddMarks(question.questionID, value[0])
                            }
                            className="mb-4"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle />
              {/* <ResizablePanel defaultSize={40} className="bg-black px-3">
                <VideoCall
                  sessionId={sessionId}
                  isCandidate={false}
                  ref={videoCallRef}
                  senderId={userID}
                  role='COMPANY'
                />
              </ResizablePanel> */}
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
                    marks={analiyzeResponse?.relevanceScore}
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
