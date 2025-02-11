"use client";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import socket from "../../../lib/utils/socket";
import { useEffect, useState, useRef } from "react";

import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import bgGrid from "@/assets/grid-bg.svg";
import bgGrain from "@/assets/grain-bg.svg";
import Carousel from "@/components/ui/carousel";
import SwiperComponent from "@/components/ui/swiperComponent";
import "../../../styles/swiper/swiperStyles.css";
import { PuffLoader } from "react-spinners";
import Loading from "@/app/loading";
import {
  usePathname,
  useRouter,
  redirect,
  useSearchParams,
} from "next/navigation";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useSession, getSession } from "next-auth/react";
import { CodeBlock } from "@/components/ui/code-block";
// import Editor from "@/components/rich-text/editor";
import CirculerProgress from "@/components/interview-room-analiyzer/circuler-progress";
import CodeEditor from "@/components/CodeEditor/CodeEditor";
import { StreamVideoCall } from "@/components/video/StreamVideoCall";
import VideoCall from "@/components/video/video";
import { set } from "zod";

const InterviewRoomPage = ({ params }) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const swiperRef = useRef(null);
  const searchParams = useSearchParams();
  const userId = searchParams.get("candidateId");
  const sessionID = searchParams.get("sessionID");
  const router = useRouter();
  // const { socket } = useSocket();
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState(null);
  const [isQuestionAvailabe, setIsQuestionAvailabe] = useState(false);
  const [recordedAnswer, setRecordedAnswer] = useState("");
  const [answer, setAnswer] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [timeNow, setTimeNow] = useState(() => new Date().toLocaleTimeString());
  const [code, setCode] = useState(`Write your code here`);
  const [question, setQuestion] = useState({});
  const [isQuestionCompleted, setIsQuestionCompleted] = useState(false);
  const [isSubmitBtnAvailable, setIsSubmitBtnAvailable] = useState(true);
  const [totalScore, setTotalScore] = useState(0);
  const [numberOfAnswers, setNumberOfAnswers] = useState(0);
  const [questionType, setQuestionType] = useState();
  const [isTechnicalOngoing, setIsTechnicalOngoing] = useState(false);
  const [technicalStatus, setTechnicalStatus] = useState("");
  const [isParticipantJoined, setIsParticipantJoined] = useState(false);

  const {
    isListening,
    transcript,
    recordingComplete,
    startListening,
    stopListening,
    setTranscript,
  } = useSpeechRecognition({ continuous: true });

  const [questionCountDown, setQuestionCountDown] = useState(0);

  useEffect(() => {
    if (question?.estimatedTimeMinutes) {
      const totalSeconds = question.estimatedTimeMinutes * 60;
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
  }, [question]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0"); // Two-digit minutes
    const secs = (seconds % 60).toString().padStart(2, "0"); // Two-digit seconds
    return `${minutes}:${secs}`;
  };

  const startStopListening = () => {
    isListening ? stopListening() : startListening();
  };
  const handleAnswerChange = (e) => {
    setTranscript(e.target.value);
    socket.emit("typingUpdate", {
      sessionId: question.sessionID,
      text: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const session = await getSession();

    const role = session?.user?.role;
    const candidateId = session?.user?.candidateID;

    // if (transcript.trim() !== "") {
    //   setActiveStep((prevStep) => {
    //     const nextStep = Math.min(prevStep + 1, questions.length - 1);
    //     return nextStep;
    //   });
    // }
    // const question = questions[activeStep];
    // const questionNumber = activeStep + 1;
    socket.emit("submitAnswer", {
      sessionId: question.sessionID,
      questionId: question.questionID,
      candidateId: candidateId,
      answerText: transcript,
      questionText: question.questionText,
    });
    stopListening();
    setTranscript("");
    setIsSubmitBtnAvailable(false);
  };
  // Update swiper on activeStep change
  // useEffect(() => {
  //     if (swiperRef.current && swiperRef.current.swiper) {
  //         swiperRef.current.swiper.slideTo(activeStep);
  //     }
  // }, [activeStep]);

  const progress = ((activeStep + 1) / questions.length) * 100;
  const handleSlideChange = (index) => {
    setActiveStep(index);
  };

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setSessionId(resolvedParams.id);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    const data = {
      sessionId: sessionID,
      userId: userId,
      role: "CANDIDATE",
    };
    socket.emit("joinInterviewSession", data);

    socket.on("question", (data) => {
      if (data.question) {
        setQuestionType(data.question.type);
        setIsQuestionAvailabe(true);
        setQuestion(data.question);
        setIsSubmitBtnAvailable(true);
      } else {
        setIsQuestionAvailabe(false);
        setIsQuestionCompleted(true);
      }
    });

    socket.on("navigateNextQuestion", (data) => {
      if (!data.followUpQuestion) {
        const nextquestion = activeStep + 1;
        if (swiperRef.current && swiperRef.current.swiper) {
          swiperRef.current.swiper.slideTo(nextquestion);
        }
      }

      setTranscript("");
      setAnswer("");
      stopListening();
    });

    socket.on("answerSubmitted", (data) => {
      setTotalScore(data.totalScore.score);
      setNumberOfAnswers(data.totalScore.numberOfAnswers);
    });

    socket.on("technicalStatus", (data) => {
      setTechnicalStatus(data.technicalStatus);
      if (data.technicalStatus === "ongoing") {
        setIsTechnicalOngoing(true);
      } else {
        setIsTechnicalOngoing(false);
      }
    });

    socket.on("participantLeft", (data) => {
      router.push(`/joined-interviews/${sessionID}`);
    });

    socket.on("participantJoined", (data) => {
      if (data.role === "COMPANY") {
        setIsParticipantJoined(true);
      }
    });

    socket.on("hasOtherParticipants", (data) => {
      setIsParticipantJoined(true);
    });

    return () => {
      socket.off("joinInterviewSession");
      socket.off("questions");
      socket.off("navigateNextQuestion");
      socket.off("answerSubmitted");
      socket.off("participantLeft");
      socket.off("technicalStatus");
      socket.off("participantJoined");
      socket.off("hasOtherParticipants");
    };
  }, []);

  const combinedAnswer = answer || transcript;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (status === "loading") {
    return (
      <>
        <Loading />
      </>
    );
  } else {
    if (session.user.role !== "CANDIDATE") {
      const loginURL = `/login?redirect=${encodeURIComponent(pathname)}`;
      redirect(loginURL);
    }
  }

  return (
    <>
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[calc-100vh-4rem-1px] bg-black text-white mx-auto"
      >
        {technicalStatus === "toBeConducted" && (
          <>
            {isParticipantJoined ? (
              <></>
            ) : (
              <>
                <ResizablePanel defaultSize={250}>
                  <div className="flex flex-col h-lvh w-full justify-center item-center bg-background text-white">
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
                        Waiting for the company to start the interview session.
                        Please hold on until the session begins.
                      </p>
                      <p className=" w-[25%] mx-auto text-center text-sm py-2 text-lightred">
                        Generating interview questions. Please hold on...
                      </p>
                    </div>
                  </div>
                </ResizablePanel>
              </>
            )}
          </>
        )}

        {technicalStatus === "ongoing" && (
          <>
            {isParticipantJoined ? (
              <>
                <ResizablePanel defaultSize={250}>
                  {questionType === "OPEN_ENDED" ? (
                    <div className="flex flex-col justify-center items-center w-full text-white py-3 bg-black">
                      <div className="absolute inset-0 bg-black -z-20"></div>
                      <div className="w-[70%] max-w-[1100px] relative">
                        <div className=" w-full py-9">
                          <div className=" relative p-8 h-[300px] bg-neutral-900 text-white shadow-md flex flex-col justify-center">
                            <div className=" absolute top-4 right-4 text-gray-400 text-2xl font-semibold">
                              <span className=" text-sm font-normal">Time Remaining</span>{" "}
                              <p className=" text-right">{formatTime(questionCountDown)}</p>
                            </div>
                            <h1 className="text-2xl font-semibold">
                              Question{" "}
                            </h1>
                            <p className="text-lg text-white pt-5">
                              {question.questionText}
                            </p>
                            <p className="text-sm text-gray-600">
                              Estimated Time: {question.estimatedTimeMinutes}{" "}
                              minutes
                            </p>
                          </div>
                        </div>

                        <div className="relative flex flex-col items-center justify-between w-full text-white py-6">
                          <div className="w-[70%] max-w-[1100px]">
                            <div className="relative w-full rounded-xl h-auto p-7 bg-neutral-900 text-white shadow-md mb-5">
                              <div>
                                <textarea
                                  onPaste={(e) => {
                                    e.preventDefault();
                                    return false;
                                  }}
                                  onCopy={(e) => {
                                    e.preventDefault();
                                    return false;
                                  }}
                                  value={transcript}
                                  onChange={handleAnswerChange}
                                  placeholder="your answer here..."
                                  className="w-full h-32 bg-transparent border-2 border-gray-600 rounded-lg p-3 text-white"
                                />
                              </div>
                            </div>

                            <div className="flex justify-center">
                              {isSubmitBtnAvailable && (
                                <button
                                  onClick={handleSubmit}
                                  disabled={!transcript}
                                  className="mt-5 bg-blue-400 hover:bg-blue-500 text-white py-2 px-6 rounded-lg"
                                >
                                  Submit Answer
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-[70%]">
                        <h1 className="text-2xl font-semibold text-center w-full pb-5">
                          What is Your Answer?
                        </h1>
                        <div className="rounded-lg w-full">
                          <div className="flex items-center w-full">
                            {isListening ? (
                              <button
                                onClick={stopListening}
                                className="mt-5 m-auto flex items-center justify-center bg-red-400 hover:bg-red-500 rounded-full aspect-square h-14 focus:outline-none"
                              >
                                <svg
                                  className="w-8 h-8"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill="white"
                                    d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"
                                  />
                                </svg>
                              </button>
                            ) : (
                              <button
                                onClick={startListening}
                                className="mt-2 m-auto flex items-center justify-center bg-blue-400 hover:bg-blue-500 rounded-full aspect-square h-14 focus:outline-none"
                              >
                                <svg
                                  viewBox="0 0 256 256"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-8 h-8 text-white"
                                >
                                  <path
                                    fill="currentColor"
                                    d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <CodeEditor
                      question={question.questionText}
                      handleSubmit={handleSubmit}
                      setTranscript={setTranscript}
                      isSubmitBtnAvailable={isSubmitBtnAvailable}
                      sessionID={sessionId}
                      socket={socket}
                      time={formatTime(questionCountDown)}
                    />
                  )}
                </ResizablePanel>
              </>
            ) : (
              <>
                <ResizablePanel defaultSize={250}>
                  <div className="flex flex-col h-lvh w-full justify-center item-center bg-background text-white">
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
                        Waiting for the company to start the interview session.
                        Please hold on until the session begins.
                      </p>
                      <p className=" w-[25%] mx-auto text-center text-sm py-2 text-lightred">
                        Generating interview questions. Please hold on...
                      </p>
                    </div>
                  </div>
                </ResizablePanel>
              </>
            )}
          </>
        )}

        {technicalStatus === "completed" && (
          <>
            {isParticipantJoined ? (
              <>
                <ResizablePanel defaultSize={250}>
                  <div className="flex flex-col h-lvh w-full justify-center item-center bg-black text-white">
                    <h1 className=" px-8 text-lg md:text-3xl font-semibold w-full text-center">
                      You have Successfully Completed Your Interview
                    </h1>
                    <div className="  text-gray-400 py-8 flex flex-col items-center justify-center w-full mt-5 rounded-lg">
                      <h1 className=" text-2xl font-semibold text-center">
                        Test Score
                      </h1>
                      <h2 className=" text-base text-gray-500 text-center">
                        {" "}
                        {numberOfAnswers}/{numberOfAnswers} Questions
                      </h2>
                      <CirculerProgress
                        marks={totalScore}
                        catorgory="Test score"
                        titleSize="text-3xl"
                        subTitleSize="text-sm"
                      />
                      <p className=" text-gray-300 text-center">
                        {parseInt(totalScore || 0).toFixed(2)}% Accurate with
                        expected answers
                      </p>
                      <p className=" text-sm text-gray-500 text-center">
                        Showing Test Score for {numberOfAnswers} out of{" "}
                        {numberOfAnswers} question
                      </p>
                    </div>
                    <div className="flex items-center w-full">
                      {isListening ? (
                        <button
                          onClick={stopListening}
                          className="mt-5 m-auto flex items-center justify-center bg-red-400 hover:bg-red-500 rounded-full aspect-square h-14 focus:outline-none"
                        >
                          <svg
                            className="w-8 h-8"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill="white"
                              d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"
                            />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={startListening}
                          className="mt-2 m-auto flex items-center justify-center bg-blue-400 hover:bg-blue-500 rounded-full aspect-square h-14 focus:outline-none"
                        >
                          <svg
                            viewBox="0 0 256 256"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-8 h-8 text-white"
                          >
                            <path
                              fill="currentColor"
                              d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </ResizablePanel>
              </>
            ) : (
              <>
                <ResizablePanel defaultSize={250}>
                  <div className="flex flex-col h-lvh w-full justify-center item-center bg-background text-white">
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
                        Waiting for the company to start the interview session.
                        Please hold on until the session begins.
                      </p>
                      <p className=" w-[25%] mx-auto text-center text-sm py-2 text-lightred">
                        Generating interview questions. Please hold on...
                      </p>
                    </div>
                  </div>
                </ResizablePanel>
              </>
            )}
          </>
        )}

        {/* {isQuestionAvailabe ? (
          <ResizablePanel defaultSize={250}>
            {questionType === "OPEN_ENDED" ? (
              <div className="flex flex-col justify-center items-center w-full text-white py-3 bg-black">
                <div className="absolute inset-0 bg-black -z-20"></div>
                <div className="w-[70%] max-w-[1100px]">

                  <div className="relative w-full py-9">
                    <div className="p-8 h-[300px] bg-neutral-900 text-white shadow-md flex flex-col justify-center">
                      <h1 className="text-2xl font-semibold">Question </h1>
                      <p className="text-lg text-white pt-5">
                        {question.questionText}
                      </p>
                      <p className="text-sm text-gray-600">
                        Estimated Time: {question.estimatedTimeMinutes} minutes
                      </p>
                    </div>
                  </div>

                  <div className="relative flex flex-col items-center justify-between w-full text-white py-6">
                    <div className="w-[70%] max-w-[1100px]">
                      <div className="relative w-full rounded-xl h-auto p-7 bg-neutral-900 text-white shadow-md mb-5">
                        <div>
                          <textarea
                            onPaste={(e) => {
                              e.preventDefault();
                              return false;
                            }}
                            onCopy={(e) => {
                              e.preventDefault();
                              return false;
                            }}
                            value={transcript}
                            onChange={handleAnswerChange}
                            placeholder="your answer here..."
                            className="w-full h-32 bg-transparent border-2 border-gray-600 rounded-lg p-3 text-white"
                          />
                        </div>
                      </div>

                      <div className="flex justify-center">
                        {isSubmitBtnAvailable && (
                          <button
                            onClick={handleSubmit}
                            disabled={!transcript}
                            className="mt-5 bg-blue-400 hover:bg-blue-500 text-white py-2 px-6 rounded-lg"
                          >
                            Submit Answer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-[70%]">
                  <h1 className="text-2xl font-semibold text-center w-full pb-5">
                    What is Your Answer?
                  </h1>
                  <div className="rounded-lg w-full">
                    <div className="flex items-center w-full">
                      {isListening ? (
                        <button
                          onClick={stopListening}
                          className="mt-5 m-auto flex items-center justify-center bg-red-400 hover:bg-red-500 rounded-full aspect-square h-14 focus:outline-none"
                        >
                          <svg
                            className="w-8 h-8"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill="white"
                              d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"
                            />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={startListening}
                          className="mt-2 m-auto flex items-center justify-center bg-blue-400 hover:bg-blue-500 rounded-full aspect-square h-14 focus:outline-none"
                        >
                          <svg
                            viewBox="0 0 256 256"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-8 h-8 text-white"
                          >
                            <path
                              fill="currentColor"
                              d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <CodeEditor
                question={question.questionText}
                handleSubmit={handleSubmit}
                setTranscript={setTranscript}
                isSubmitBtnAvailable={isSubmitBtnAvailable}
                sessionID={sessionId}
                socket={socket}
              />
            )}
          </ResizablePanel>
        ) : (
          <>
            {isQuestionCompleted ? (
              <ResizablePanel defaultSize={250}>
                <div className="flex flex-col h-lvh w-full justify-center item-center bg-black text-white">
                  <h1 className=" px-8 text-lg md:text-3xl font-semibold w-full text-center">
                    You have Successfully Completed Your Interview
                  </h1>
                  <div className="  text-gray-400 py-8 flex flex-col items-center justify-center w-full mt-5 rounded-lg">
                    <h1 className=" text-2xl font-semibold text-center">
                      Test Score
                    </h1>
                    <h2 className=" text-base text-gray-500 text-center">
                      {" "}
                      {numberOfAnswers}/{numberOfAnswers} Questions
                    </h2>
                    <CirculerProgress
                      marks={totalScore}
                      catorgory="Test score"
                      titleSize="text-3xl"
                      subTitleSize="text-sm"
                    />
                    <p className=" text-gray-300 text-center">
                      {parseInt(totalScore || 0).toFixed(2)}% Accurate with
                      expected answers
                    </p>
                    <p className=" text-sm text-gray-500 text-center">
                      Showing Test Score for {numberOfAnswers} out of{" "}
                      {numberOfAnswers} question
                    </p>
                  </div>
                  <div className="flex items-center w-full">
                    {isListening ? (
                      <button
                        onClick={stopListening}
                        className="mt-5 m-auto flex items-center justify-center bg-red-400 hover:bg-red-500 rounded-full aspect-square h-14 focus:outline-none"
                      >
                        <svg
                          className="w-8 h-8"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill="white"
                            d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"
                          />
                        </svg>
                      </button>
                    ) : (
                      <button
                        onClick={startListening}
                        className="mt-2 m-auto flex items-center justify-center bg-blue-400 hover:bg-blue-500 rounded-full aspect-square h-14 focus:outline-none"
                      >
                        <svg
                          viewBox="0 0 256 256"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-8 h-8 text-white"
                        >
                          <path
                            fill="currentColor"
                            d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </ResizablePanel>
            ) : (
              <>
                {isParticipantJoined ? (
                  <></>
                ) : (
                  <ResizablePanel defaultSize={250}>
                    <div className="flex flex-col h-lvh w-full justify-center item-center bg-background text-white">
                      <div className=" w-full flex flex-col justify-center items-center mb-14">
                        <div className=" w-full flex flex-col justify-center items-center">
                          <h1 className=" text-lg">
                            scheduled Time: 9:55:19 AM
                          </h1>
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
                          Waiting for the company to start the interview
                          session. Please hold on until the session begins.
                        </p>
                        <p className=" w-[25%] mx-auto text-center text-sm py-2 text-lightred">
                          Generating interview questions. Please hold on...
                        </p>
                      </div>
                    </div>
                  </ResizablePanel>
                )}
              </>
            )}
          </>
        )} */}
        {technicalStatus === "toBeConducted" && !isQuestionAvailabe && (<ResizableHandle withHandle />)}
        <ResizablePanel
          defaultSize={
            technicalStatus === "toBeConducted" && !isQuestionAvailabe
              ? 250
              : 100
          }
        >
          <div
            className={`flex flex-col w-full justify-center items-center ${
              technicalStatus === "toBeConducted" ? "h-lvh" : "h-[300px]"
            }`}
          >
            <VideoCall sessionId={sessionId} isCandidate={true} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
};

export default InterviewRoomPage;
