"use client";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import socket from "../../../lib/utils/socket";
import { useEffect, useState, useRef, use } from "react";

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
import { Mic, Pause, RefreshCw, TriangleAlert } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { set } from "react-hook-form";

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
  const [videoView, setVideoView] = useState(false);
  const [interviewStatus, setInterviewStatus] = useState(null);
  // const boxRef = useRef(null);

  const {
    isListening,
    transcript,
    recordingComplete,
    startListening,
    stopListening,
    setTranscript,
  } = useSpeechRecognition({ continuous: true });

  const [questionCountDown, setQuestionCountDown] = useState(0);

  // useEffect(() => {
  //   const box = boxRef.current;

  //   const handleResize = () => {
  //     const currentLeft = parseFloat(box.style.left) || 0;
  //     const currentTop = parseFloat(box.style.top) || 0;

  //     const screenWidth = window.innerWidth;
  //     const screenHeight = window.innerHeight;
  //     const boxWidth = box.offsetWidth;
  //     const boxHeight = box.offsetHeight;

  //     const maxLeft = screenWidth - boxWidth;
  //     const maxTop = screenHeight - boxHeight;

  //     const newLeft = Math.max(0, Math.min(currentLeft, maxLeft));
  //     const newTop = Math.max(0, Math.min(currentTop, maxTop));

  //     box.style.right = `${newLeft}px`;
  //     box.style.bottom = `${newTop}px`;
  //   };

  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  useEffect(() => {
    if (isParticipantJoined) {
      if (
        technicalStatus !== "ongoing" &&
        technicalStatus !== "completed" &&
        technicalStatus !== "testEnd"
      ) {
        setVideoView(true);
      } else {
        setVideoView(false);
      }
    } else {
      setVideoView(false);
    }
  }, [technicalStatus, isParticipantJoined]);

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

    socket.on("sessionStat", (data) => {
      setInterviewStatus(data);
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

  useEffect(() => {
    const data = {
      sessionId: sessionID,
      role: "COMPANY",
    };

    window.addEventListener("beforeunload", socket.emit("leaveSession", data));
    return () => {
      window.removeEventListener(
        "beforeunload",
        socket.emit("leaveSession", data)
      );
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

  const combinedAnswer = answer || transcript;

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

  const handleBackNavigation = (role) => {
    const data = {
      sessionId: sessionID,
      role: role,
    };

    socket.emit("leaveSession", data);
    router.push(`/my-interviews`);
  };

  // const handleMouseDown = (e) => {
  //   e.preventDefault();
  //   const box = boxRef.current;

  //   const offsetX = e.clientX - box.getBoundingClientRect().left;
  //   const offsetY = e.clientY - box.getBoundingClientRect().top;

  //   const handleMouseMove = (e) => {
  //     const screenWidth = window.innerWidth;
  //     const screenHeight = window.innerHeight;
  //     const boxWidth = box.offsetWidth;
  //     const boxHeight = box.offsetHeight;

  //     const maxLeft = screenWidth - boxWidth;
  //     const maxTop = screenHeight - boxHeight;

  //     let newLeft = e.clientX - offsetX;
  //     let newTop = e.clientY - offsetY;

  //     newLeft = Math.max(0, Math.min(newLeft, maxLeft));
  //     newTop = Math.max(0, Math.min(newTop, maxTop));

  //     box.style.left = `${newLeft}px`;
  //     box.style.top = `${newTop}px`;
  //   };

  //   const handleMouseUp = () => {
  //     document.removeEventListener("mousemove", handleMouseMove);
  //     document.removeEventListener("mouseup", handleMouseUp);
  //   };

  //   document.addEventListener("mousemove", handleMouseMove);
  //   document.addEventListener("mouseup", handleMouseUp);
  // };

  return (
    // <>
    //   <ResizablePanelGroup
    //     direction="horizontal"
    //     className="min-h-[calc-100vh-4rem-1px] bg-black text-white mx-auto"
    //   >
    //     {technicalStatus === "toBeConducted" && (
    //       <>
    //         {isParticipantJoined ? (
    //           <ResizablePanel defaultSize={0}></ResizablePanel>
    //         ) : (
    //           <>
    //             <ResizablePanel defaultSize={250}>
    //               <div className="flex flex-col h-lvh w-full justify-center item-center bg-background text-white">
    //                 <div className=" w-full flex flex-col justify-center items-center mb-14">
    //                   <div className=" w-full flex flex-col justify-center items-center">
    //                     <h1 className=" text-lg">scheduled Time: 9:55:19 AM</h1>
    //                     <h1 className=" font-semibold text-3xl py-3">
    //                       Time now: {timeNow}
    //                     </h1>
    //                   </div>
    //                 </div>
    //                 <div className=" w-full flex flex-col justify-center items-center mb-16">
    //                   <PuffLoader color="#ffffff" />
    //                 </div>
    //                 <div className=" w-full flex flex-col justify-center] items-center">
    //                   <p className=" w-[75%] mx-auto text-center font-semibold text-xl pt-5">
    //                     Waiting for the company to start the interview session.
    //                     Please hold on until the session begins.
    //                   </p>
    //                   <p className=" w-[25%] mx-auto text-center text-sm py-2 text-lightred">
    //                     Generating interview questions. Please hold on...
    //                   </p>
    //                 </div>
    //               </div>
    //             </ResizablePanel>
    //           </>
    //         )}
    //       </>
    //     )}

    //     {technicalStatus === "ongoing" && (
    //       <>
    //         {isParticipantJoined ? (
    //           <>
    //             <ResizablePanel defaultSize={250}>
    //               {questionType === "OPEN_ENDED" ? (
    //                 <div className="flex flex-col justify-center items-center w-full text-white py-3 bg-black">
    //                   {/* <div className="absolute inset-0 bg-black -z-20"></div> */}
    //                   <div className="w-[80%] max-w-[1500px] mx-auto flex flex-col justify-between h-lvh relative">
    //                     <div className=" w-full py-9">
    //                       <div className=" relative p-8 rounded-lg bg-neutral-900 text-white shadow-md flex flex-col justify-center">
    //                         <div className=" absolute top-4 right-6 text-gray-400 text-2xl font-semibold">
    //                           <span className=" text-sm font-normal">
    //                             Time Remaining
    //                           </span>{" "}
    //                           <p className=" text-right">
    //                             {formatTime(questionCountDown)}
    //                           </p>
    //                         </div>
    //                         <h1 className="text-2xl font-semibold">
    //                           Question{" "}
    //                         </h1>
    //                         <p className="text-lg text-white pt-5">
    //                           {question.questionText}
    //                         </p>
    //                         <p className="text-sm text-gray-600">
    //                           Estimated Time: {question.estimatedTimeMinutes}{" "}
    //                           minutes
    //                         </p>
    //                       </div>
    //                     </div>

    //                     <div className="relative flex flex-col items-center justify-between w-full text-white py-6">
    //                       {isSubmitBtnAvailable ? (
    //                         <div className="w-full">
    //                           <h1 className="text-2xl font-semibold text-center w-full pb-5">
    //                             What is Your Answer?
    //                           </h1>
    //                           <div className="relative w-full rounded-xl h-auto bg-neutral-900 text-white shadow-md">
    //                             <div>
    //                               <textarea
    //                                 onPaste={(e) => {
    //                                   e.preventDefault();
    //                                   return false;
    //                                 }}
    //                                 onCopy={(e) => {
    //                                   e.preventDefault();
    //                                   return false;
    //                                 }}
    //                                 value={transcript}
    //                                 onChange={handleAnswerChange}
    //                                 placeholder="your answer here..."
    //                                 className="w-full mb-10 h-32 outline-none focus:outline-none bg-transparent border-gray-600 rounded-lg px-6 py-4 text-white"
    //                               />
    //                             </div>
    //                             <div className="absolute bottom-2 right-2">
    //                               {isListening ? (
    //                                 <button
    //                                   onClick={stopListening}
    //                                   className="mt-5 m-auto flex items-center justify-center bg-red-400 hover:bg-red-500 rounded-full aspect-square h-8 focus:outline-none"
    //                                 >
    //                                   <svg
    //                                     className="w-5 h-5"
    //                                     viewBox="0 0 24 24"
    //                                     xmlns="http://www.w3.org/2000/svg"
    //                                   >
    //                                     <path
    //                                       fill="white"
    //                                       d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"
    //                                     />
    //                                   </svg>
    //                                 </button>
    //                               ) : (
    //                                 <button
    //                                   onClick={startListening}
    //                                   className="mt-2 m-auto flex items-center justify-center bg-blue-400 hover:bg-blue-500 rounded-full aspect-square h-8 focus:outline-none"
    //                                 >
    //                                   <svg
    //                                     viewBox="0 0 256 256"
    //                                     xmlns="http://www.w3.org/2000/svg"
    //                                     className="w-5 h-5 text-white"
    //                                   >
    //                                     <path
    //                                       fill="currentColor"
    //                                       d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
    //                                     />
    //                                   </svg>
    //                                 </button>
    //                               )}
    //                             </div>
    //                           </div>
    //                           <div className="flex justify-center">
    //                             {isSubmitBtnAvailable && (
    //                               <button
    //                                 onClick={handleSubmit}
    //                                 disabled={!transcript}
    //                                 className="my-5 bg-blue-400 hover:bg-blue-500 text-white py-2 px-6 rounded-lg"
    //                               >
    //                                 Submit Answer
    //                               </button>
    //                             )}
    //                           </div>
    //                         </div>
    //                       ) : (
    //                         <div className=" flex min-h-[300px] justify-center flex-col items-center h-full">
    //                           <p className=" text-xl font-semibold">
    //                             Your answer has been submitted.
    //                           </p>
    //                           <p className=" text-gray-500 text-xs">
    //                             Analyzing your answer...
    //                           </p>
    //                         </div>
    //                       )}
    //                     </div>
    //                   </div>
    //                   {/* {isSubmitBtnAvailable ? (
    //                     <div className="w-[70%]">
    //                       <div className="rounded-lg w-full">
    //                         <div className="flex items-center w-full">
    //                           {isListening ? (
    //                             <button
    //                               onClick={stopListening}
    //                               className="mt-5 m-auto flex items-center justify-center bg-red-400 hover:bg-red-500 rounded-full aspect-square h-14 focus:outline-none"
    //                             >
    //                               <svg
    //                                 className="w-8 h-8"
    //                                 viewBox="0 0 24 24"
    //                                 xmlns="http://www.w3.org/2000/svg"
    //                               >
    //                                 <path
    //                                   fill="white"
    //                                   d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"
    //                                 />
    //                               </svg>
    //                             </button>
    //                           ) : (
    //                             <button
    //                               onClick={startListening}
    //                               className="mt-2 m-auto flex items-center justify-center bg-blue-400 hover:bg-blue-500 rounded-full aspect-square h-14 focus:outline-none"
    //                             >
    //                               <svg
    //                                 viewBox="0 0 256 256"
    //                                 xmlns="http://www.w3.org/2000/svg"
    //                                 className="w-8 h-8 text-white"
    //                               >
    //                                 <path
    //                                   fill="currentColor"
    //                                   d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
    //                                 />
    //                               </svg>
    //                             </button>
    //                           )}
    //                         </div>
    //                       </div>
    //                     </div>
    //                   ) : (
    //                     <p className=" text-xl font-semibold">
    //                       Your answer has been submitted.
    //                     </p>
    //                   )} */}
    //                 </div>
    //               ) : (
    //                 <CodeEditor
    //                   question={question.questionText}
    //                   handleSubmit={handleSubmit}
    //                   setTranscript={setTranscript}
    //                   isSubmitBtnAvailable={isSubmitBtnAvailable}
    //                   sessionID={sessionId}
    //                   socket={socket}
    //                   time={formatTime(questionCountDown)}
    //                 />
    //               )}
    //             </ResizablePanel>
    //           </>
    //         ) : (
    //           <>
    //             <ResizablePanel defaultSize={250}>
    //               <div className="flex flex-col h-lvh w-full justify-center item-center bg-background text-white">
    //                 <div className=" w-full flex flex-col justify-center items-center mb-14">
    //                   <div className=" w-full flex flex-col justify-center items-center">
    //                     <h1 className=" text-lg">scheduled Time: 9:55:19 AM</h1>
    //                     <h1 className=" font-semibold text-3xl py-3">
    //                       Time now: {timeNow}
    //                     </h1>
    //                   </div>
    //                 </div>
    //                 <div className=" w-full flex flex-col justify-center items-center mb-16">
    //                   <PuffLoader color="#ffffff" />
    //                 </div>
    //                 <div className=" w-full flex flex-col justify-center] items-center">
    //                   <p className=" w-[75%] mx-auto text-center font-semibold text-xl pt-5">
    //                     Waiting for the company to start the interview session.
    //                     Please hold on until the session begins.
    //                   </p>
    //                   <p className=" w-[25%] mx-auto text-center text-sm py-2 text-lightred">
    //                     Generating interview questions. Please hold on...
    //                   </p>
    //                 </div>
    //               </div>
    //             </ResizablePanel>
    //           </>
    //         )}
    //       </>
    //     )}

    //     {technicalStatus === "completed" && (
    //       <>
    //         {isParticipantJoined ? (
    //           <>
    //             <ResizablePanel defaultSize={250}>
    //               <div className="flex flex-col h-lvh w-full justify-center item-center bg-black text-white">
    //                 <h1 className=" px-8 text-lg md:text-3xl font-semibold w-full text-center">
    //                   You have Successfully Completed Your Interview
    //                 </h1>
    //                 <div className="  text-gray-400 py-8 flex flex-col items-center justify-center w-full mt-5 rounded-lg">
    //                   <h1 className=" text-2xl font-semibold text-center">
    //                     Test Score
    //                   </h1>
    //                   <h2 className=" text-base text-gray-500 text-center">
    //                     {" "}
    //                     {numberOfAnswers}/{numberOfAnswers} Questions
    //                   </h2>
    //                   <CirculerProgress
    //                     marks={totalScore}
    //                     catorgory="Test score"
    //                     titleSize="text-3xl"
    //                     subTitleSize="text-sm"
    //                   />
    //                   <p className=" text-gray-300 text-center">
    //                     {parseInt(totalScore || 0).toFixed(2)}% Accurate with
    //                     expected answers
    //                   </p>
    //                   <p className=" text-sm text-gray-500 text-center">
    //                     Showing Test Score for {numberOfAnswers} out of{" "}
    //                     {numberOfAnswers} question
    //                   </p>
    //                 </div>
    //                 <div className="flex items-center w-full">
    //                   {isListening ? (
    //                     <button
    //                       onClick={stopListening}
    //                       className="mt-5 m-auto flex items-center justify-center bg-red-400 hover:bg-red-500 rounded-full aspect-square h-14 focus:outline-none"
    //                     >
    //                       <svg
    //                         className="w-8 h-8"
    //                         viewBox="0 0 24 24"
    //                         xmlns="http://www.w3.org/2000/svg"
    //                       >
    //                         <path
    //                           fill="white"
    //                           d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"
    //                         />
    //                       </svg>
    //                     </button>
    //                   ) : (
    //                     <button
    //                       onClick={startListening}
    //                       className="mt-2 m-auto flex items-center justify-center bg-blue-400 hover:bg-blue-500 rounded-full aspect-square h-14 focus:outline-none"
    //                     >
    //                       <svg
    //                         viewBox="0 0 256 256"
    //                         xmlns="http://www.w3.org/2000/svg"
    //                         className="w-8 h-8 text-white"
    //                       >
    //                         <path
    //                           fill="currentColor"
    //                           d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
    //                         />
    //                       </svg>
    //                     </button>
    //                   )}
    //                 </div>
    //               </div>
    //             </ResizablePanel>
    //           </>
    //         ) : (
    //           <>
    //             <ResizablePanel defaultSize={250}>
    //               <div className="flex flex-col h-lvh w-full justify-center item-center bg-background text-white">
    //                 <div className=" w-full flex flex-col justify-center items-center mb-14">
    //                   <div className=" w-full flex flex-col justify-center items-center">
    //                     <h1 className=" text-lg">scheduled Time: 9:55:19 AM</h1>
    //                     <h1 className=" font-semibold text-3xl py-3">
    //                       Time now: {timeNow}
    //                     </h1>
    //                   </div>
    //                 </div>
    //                 <div className=" w-full flex flex-col justify-center items-center mb-16">
    //                   <PuffLoader color="#ffffff" />
    //                 </div>
    //                 <div className=" w-full flex flex-col justify-center] items-center">
    //                   <p className=" w-[75%] mx-auto text-center font-semibold text-xl pt-5">
    //                     Waiting for the company to start the interview session.
    //                     Please hold on until the session begins.
    //                   </p>
    //                   <p className=" w-[25%] mx-auto text-center text-sm py-2 text-lightred">
    //                     Generating interview questions. Please hold on...
    //                   </p>
    //                 </div>
    //               </div>
    //             </ResizablePanel>
    //           </>
    //         )}
    //       </>
    //     )}

    //     {/* {isQuestionAvailabe ? (
    //       <ResizablePanel defaultSize={250}>
    //         {questionType === "OPEN_ENDED" ? (
    //           <div className="flex flex-col justify-center items-center w-full text-white py-3 bg-black">
    //             <div className="absolute inset-0 bg-black -z-20"></div>
    //             <div className="w-[70%] max-w-[1100px]">

    //               <div className="relative w-full py-9">
    //                 <div className="p-8 h-[300px] bg-neutral-900 text-white shadow-md flex flex-col justify-center">
    //                   <h1 className="text-2xl font-semibold">Question </h1>
    //                   <p className="text-lg text-white pt-5">
    //                     {question.questionText}
    //                   </p>
    //                   <p className="text-sm text-gray-600">
    //                     Estimated Time: {question.estimatedTimeMinutes} minutes
    //                   </p>
    //                 </div>
    //               </div>

    //               <div className="relative flex flex-col items-center justify-between w-full text-white py-6">
    //                 <div className="w-[70%] max-w-[1100px]">
    //                   <div className="relative w-full rounded-xl h-auto p-7 bg-neutral-900 text-white shadow-md mb-5">
    //                     <div>
    //                       <textarea
    //                         onPaste={(e) => {
    //                           e.preventDefault();
    //                           return false;
    //                         }}
    //                         onCopy={(e) => {
    //                           e.preventDefault();
    //                           return false;
    //                         }}
    //                         value={transcript}
    //                         onChange={handleAnswerChange}
    //                         placeholder="your answer here..."
    //                         className="w-full h-32 bg-transparent border-2 border-gray-600 rounded-lg p-3 text-white"
    //                       />
    //                     </div>
    //                   </div>

    //                   <div className="flex justify-center">
    //                     {isSubmitBtnAvailable && (
    //                       <button
    //                         onClick={handleSubmit}
    //                         disabled={!transcript}
    //                         className="mt-5 bg-blue-400 hover:bg-blue-500 text-white py-2 px-6 rounded-lg"
    //                       >
    //                         Submit Answer
    //                       </button>
    //                     )}
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //             <div className="w-[70%]">
    //               <h1 className="text-2xl font-semibold text-center w-full pb-5">
    //                 What is Your Answer?
    //               </h1>
    //               <div className="rounded-lg w-full">
    //                 <div className="flex items-center w-full">
    //                   {isListening ? (
    //                     <button
    //                       onClick={stopListening}
    //                       className="mt-5 m-auto flex items-center justify-center bg-red-400 hover:bg-red-500 rounded-full aspect-square h-14 focus:outline-none"
    //                     >
    //                       <svg
    //                         className="w-8 h-8"
    //                         viewBox="0 0 24 24"
    //                         xmlns="http://www.w3.org/2000/svg"
    //                       >
    //                         <path
    //                           fill="white"
    //                           d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"
    //                         />
    //                       </svg>
    //                     </button>
    //                   ) : (
    //                     <button
    //                       onClick={startListening}
    //                       className="mt-2 m-auto flex items-center justify-center bg-blue-400 hover:bg-blue-500 rounded-full aspect-square h-14 focus:outline-none"
    //                     >
    //                       <svg
    //                         viewBox="0 0 256 256"
    //                         xmlns="http://www.w3.org/2000/svg"
    //                         className="w-8 h-8 text-white"
    //                       >
    //                         <path
    //                           fill="currentColor"
    //                           d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
    //                         />
    //                       </svg>
    //                     </button>
    //                   )}
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         ) : (
    //           <CodeEditor
    //             question={question.questionText}
    //             handleSubmit={handleSubmit}
    //             setTranscript={setTranscript}
    //             isSubmitBtnAvailable={isSubmitBtnAvailable}
    //             sessionID={sessionId}
    //             socket={socket}
    //           />
    //         )}
    //       </ResizablePanel>
    //     ) : (
    //       <>
    //         {isQuestionCompleted ? (
    //           <ResizablePanel defaultSize={250}>
    //             <div className="flex flex-col h-lvh w-full justify-center item-center bg-black text-white">
    //               <h1 className=" px-8 text-lg md:text-3xl font-semibold w-full text-center">
    //                 You have Successfully Completed Your Interview
    //               </h1>
    //               <div className="  text-gray-400 py-8 flex flex-col items-center justify-center w-full mt-5 rounded-lg">
    //                 <h1 className=" text-2xl font-semibold text-center">
    //                   Test Score
    //                 </h1>
    //                 <h2 className=" text-base text-gray-500 text-center">
    //                   {" "}
    //                   {numberOfAnswers}/{numberOfAnswers} Questions
    //                 </h2>
    //                 <CirculerProgress
    //                   marks={totalScore}
    //                   catorgory="Test score"
    //                   titleSize="text-3xl"
    //                   subTitleSize="text-sm"
    //                 />
    //                 <p className=" text-gray-300 text-center">
    //                   {parseInt(totalScore || 0).toFixed(2)}% Accurate with
    //                   expected answers
    //                 </p>
    //                 <p className=" text-sm text-gray-500 text-center">
    //                   Showing Test Score for {numberOfAnswers} out of{" "}
    //                   {numberOfAnswers} question
    //                 </p>
    //               </div>
    //               <div className="flex items-center w-full">
    //                 {isListening ? (
    //                   <button
    //                     onClick={stopListening}
    //                     className="mt-5 m-auto flex items-center justify-center bg-red-400 hover:bg-red-500 rounded-full aspect-square h-14 focus:outline-none"
    //                   >
    //                     <svg
    //                       className="w-8 h-8"
    //                       viewBox="0 0 24 24"
    //                       xmlns="http://www.w3.org/2000/svg"
    //                     >
    //                       <path
    //                         fill="white"
    //                         d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"
    //                       />
    //                     </svg>
    //                   </button>
    //                 ) : (
    //                   <button
    //                     onClick={startListening}
    //                     className="mt-2 m-auto flex items-center justify-center bg-blue-400 hover:bg-blue-500 rounded-full aspect-square h-14 focus:outline-none"
    //                   >
    //                     <svg
    //                       viewBox="0 0 256 256"
    //                       xmlns="http://www.w3.org/2000/svg"
    //                       className="w-8 h-8 text-white"
    //                     >
    //                       <path
    //                         fill="currentColor"
    //                         d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
    //                       />
    //                     </svg>
    //                   </button>
    //                 )}
    //               </div>
    //             </div>
    //           </ResizablePanel>
    //         ) : (
    //           <>
    //             {isParticipantJoined ? (
    //               <></>
    //             ) : (
    //               <ResizablePanel defaultSize={250}>
    //                 <div className="flex flex-col h-lvh w-full justify-center item-center bg-background text-white">
    //                   <div className=" w-full flex flex-col justify-center items-center mb-14">
    //                     <div className=" w-full flex flex-col justify-center items-center">
    //                       <h1 className=" text-lg">
    //                         scheduled Time: 9:55:19 AM
    //                       </h1>
    //                       <h1 className=" font-semibold text-3xl py-3">
    //                         Time now: {timeNow}
    //                       </h1>
    //                     </div>
    //                   </div>
    //                   <div className=" w-full flex flex-col justify-center items-center mb-16">
    //                     <PuffLoader color="#ffffff" />
    //                   </div>
    //                   <div className=" w-full flex flex-col justify-center] items-center">
    //                     <p className=" w-[75%] mx-auto text-center font-semibold text-xl pt-5">
    //                       Waiting for the company to start the interview
    //                       session. Please hold on until the session begins.
    //                     </p>
    //                     <p className=" w-[25%] mx-auto text-center text-sm py-2 text-lightred">
    //                       Generating interview questions. Please hold on...
    //                     </p>
    //                   </div>
    //                 </div>
    //               </ResizablePanel>
    //             )}
    //           </>
    //         )}
    //       </>
    //     )} */}
    //     {technicalStatus !== "toBeConducted" && isQuestionAvailabe && (
    //       <ResizableHandle withHandle />
    //     )}
    //     <ResizablePanel
    //       defaultSize={
    //         technicalStatus === "toBeConducted" && !isQuestionAvailabe
    //           ? 300
    //           : 100
    //       }
    //     >
    //       <div
    //         className={`flex flex-col w-full justify-center items-centerz ${
    //           technicalStatus === "toBeConducted" ? "h-lvh" : "h-[300px]"
    //         }`}
    //       >
    //         <VideoCall
    //           sessionId={sessionId}
    //           isCandidate={true}
    //           senderId={userId}
    //           role="CANDIDATE"
    //         />
    //       </div>
    //     </ResizablePanel>
    //   </ResizablePanelGroup>
    // </>
    <div className=" w-full relative h-lvh bg-black text-white">
      {/* <div
        ref={boxRef}
        onMouseDown={handleMouseDown}
        className={` ${
          technicalStatus === "toBeConducted" && isParticipantJoined
            ? " w-full h-lvh"
            : "h-[200px] w-fit"
        } z-[1000]  cursor-move text-white flex items-center justify-center absolute bottom-0 right-0`}
      >
        <VideoCall
          sessionId={sessionId}
          isCandidate={true}
          senderId={userId}
          role="CANDIDATE"
        />
      </div> */}
      {isParticipantJoined ? (
        <div className=" flex flex-row justify-between items-center w-full h-lvh ">
          {!interviewStatus?.isCompanyJoined && (<div className=" w-full h-lvh bg-black z-50 fixed top-0 left-0 ">
            <div className="flex flex-col h-full w-full justify-center items-center bg-background text-white">
              {/* Header */}
              <div className="mb-10 text-center">
                <h1 className="text-2xl font-semibold">Host Disconnected</h1>
                <p className="text-sm mt-2 text-gray-300">
                  We're currently unable to connect with the meeting host.
                </p>
              </div>

              {/* Icon */}
              <div className="mb-10">
                <TriangleAlert className="text-yellow-500 w-12 h-12" />
              </div>

              {/* Message */}
              <div className="text-center w-[80%] md:w-[50%]">
                <p className="text-lg font-medium mb-3">
                  It looks like the interviewer is experiencing connection
                  issues.
                </p>
                <p className="text-sm text-gray-400">
                  Please remain on this page. The session will continue once the
                  host reconnects.
                </p>
              </div>
            </div>
          </div>)}
          <div className=" w-[80%]">
            {technicalStatus === "ongoing" ? (
              <div className=" bg-black h-lvh w-full">
                {questionType === "OPEN_ENDED" ? (
                  <div className="flex flex-col max-w-[1500px] mx-auto justify-center items-center w-full text-white bg-black">
                    <div className="w-[80%] max-w-[1500px] mx-auto flex flex-col h-lvh py-3 justify-center relative">
                      <div className=" w-full pt-9">
                        <div className=" relative p-8 rounded-lg bg-[#0a0a0a] py-8 px-6 border border-gray-700 text-white shadow-md flex flex-col justify-center">
                          {isSubmitBtnAvailable && (
                            <div className=" absolute top-3 right-6 text-gray-400 text-2xl font-semibold">
                              <span className=" text-sm font-normal">
                                Time Remaining
                              </span>{" "}
                              <p className=" text-right">
                                {formatTime(questionCountDown)}
                              </p>
                            </div>
                          )}
                          <h1 className="text-2xl absolute top-4 left-6 font-semibold text-[#b3b3b3]">
                            Question{" "}
                          </h1>
                          <p className="text-base text-white py-10 mt-5">
                            {question.questionText}
                          </p>
                          <p className="text-sm absolute bottom-4 left-6 text-gray-600">
                            Estimated Time: {question.estimatedTimeMinutes}{" "}
                            minutes
                          </p>
                        </div>
                      </div>

                      <div className="relative flex flex-col items-center justify-between w-full text-white pt-4">
                        {isSubmitBtnAvailable ? (
                          <div className="w-full">
                            <h1 className="text-2xl font-semibold text-left w-full pb-5">
                              What is Your Answer?
                            </h1>
                            <div className="relative w-full rounded-xl h-auto bg-[#2a2a2a] border border-gray-700 text-white shadow-md">
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
                                  placeholder="Type your answer here..."
                                  className="w-full mb-10 h-32 outline-none focus:outline-none bg-transparent border-gray-600 rounded-lg px-6 py-4 text-white"
                                />
                              </div>
                              <div className="absolute bottom-2 right-2 flex items-center justify-center gap-3">
                                {isListening ? (
                                  <button
                                    onClick={stopListening}
                                    className="mt-2 cursor-pointer px-5 m-auto flex items-center justify-center bg-red-800/30 border border-red-600 hover:bg-red-800/40 rounded-full h-8 focus:outline-none"
                                  >
                                    {/* <svg
                                      className="w-5 h-5"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        fill="white"
                                        d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"
                                      />
                                    </svg> */}
                                    <Pause className="w-5 h-5 mr-2" />
                                    <span className=" font-normal text-sm">
                                      Stop Listening
                                    </span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={startListening}
                                    className="mt-2 cursor-pointer px-5 m-auto flex items-center justify-center bg-blue-800/30 border border-blue-600 hover:bg-blue-800/40 rounded-full h-8 focus:outline-none"
                                  >
                                    {/* <svg
                                      viewBox="0 0 256 256"
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-5 h-5 text-white"
                                    >
                                      <path
                                        fill="currentColor"
                                        d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
                                      />
                                    </svg> */}
                                    <Mic className="w-5 h-5 mr-2" />
                                    <span className=" font-normal text-sm">
                                      Voice Input
                                    </span>
                                  </button>
                                )}
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button
                                        onClick={() => setTranscript("")}
                                        className="mt-2 cursor-pointer m-auto flex items-center justify-center bg-green-800/30 border border-green-600 hover:bg-green-800/40 rounded-full h-8 aspect-square focus:outline-none"
                                      >
                                        <RefreshCw className="w-5 h-5" />
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-800 text-white p-2 rounded-md text-sm max-w-[200px] text-center">
                                      Clear Answer
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                            <div className="flex justify-center">
                              {isSubmitBtnAvailable && (
                                <button
                                  onClick={handleSubmit}
                                  disabled={!transcript}
                                  className="mt-5 mb-24 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg"
                                >
                                  Submit Answer
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className=" flex min-h-[300px] justify-center flex-col items-center h-full">
                            <p className=" text-xl font-semibold">
                              Your answer has been submitted.
                            </p>
                            <p className=" text-gray-500 text-xs">
                              Analyzing your answer...
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : questionType === "CODING" ? (
                  <CodeEditor
                    question={question}
                    handleSubmit={handleSubmit}
                    setTranscript={setTranscript}
                    isSubmitBtnAvailable={isSubmitBtnAvailable}
                    sessionID={sessionId}
                    socket={socket}
                    time={formatTime(questionCountDown)}
                  />
                ) : (
                  <div className=" w-full h-lvh flex flex-col justify-center items-center">
                    <div className="flex flex-col h-lvh w-full justify-center item-center bg-background text-white">
                      <div className=" w-full flex flex-col justify-center items-center mb-14">
                        <div className=" w-full flex flex-col justify-center items-center">
                          <h1 className=" text-lg">
                            Technical interview is ongoing
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
                          Waiting for the interviewer to send the next question.
                          Please hold on until the questionnaire starts.
                        </p>
                        <p className=" w-[25%] mx-auto text-center text-sm py-2 text-lightred">
                          Please wait while we proceed...
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : technicalStatus === "completed" ? (
              <div>
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
              </div>
            ) : technicalStatus === "testEnd" ? (
              <div className=" w-full h-lvh flex flex-col justify-center items-center">
                <div className="flex flex-col h-lvh w-full justify-center item-center bg-background text-white">
                  <div className=" w-full flex flex-col justify-center items-center mb-14">
                    <div className=" w-full flex flex-col justify-center items-center">
                      <h1 className=" text-lg">scheduled Time: 9:55:19 AM</h1>
                      <h1 className=" font-semibold text-3xl py-3">
                        You have Successfully Completed Your Technical
                        Evaluation
                      </h1>
                    </div>
                  </div>
                  <div className=" w-full flex flex-col justify-center items-center mb-16">
                    <PuffLoader color="#ffffff" />
                  </div>
                  <div className=" w-full flex flex-col justify-center] items-center">
                    <p className=" w-[75%] mx-auto text-center font-semibold text-xl pt-5">
                      Please wait while the company concludes the interview
                      session.
                    </p>
                    <p className=" w-[25%] mx-auto text-center text-sm py-2 text-lightred">
                      Kindly remain available. Please hold on...
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <div className=" w-[20%] max-w-[400px] h-lvh bg-black border-l rounded-lg border-gray-500/40">
            <div className=" px-4 py-4 border-b border-gray-500/40">
              <h1 className=" text-lg font-semibold">Video Conference</h1>
              <p className=" text-muted-foreground text-sm ">
                You are connected with your interviewer
              </p>
            </div>
            <div className=" px-3 mt-8">
              <VideoCall
                sessionId={sessionId}
                isCandidate={true}
                senderId={userId}
                videoView={videoView}
                handleBackNavigation={handleBackNavigation}
                role="CANDIDATE"
              />
            </div>
            <div className=" px-3">
              <div className=" bg-muted-foreground/20 text-white text-sm p-3 rounded-lg mt-4">
                Your interviewer will guide you through the technical assessment
                and answer any questions you may have.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className=" w-full h-lvh flex flex-col justify-center items-center">
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
                Waiting for the company to start the interview session. Please
                hold on until the session begins.
              </p>
              <p className=" w-[25%] mx-auto text-center text-sm py-2 text-lightred">
                Generating interview questions. Please hold on...
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewRoomPage;
