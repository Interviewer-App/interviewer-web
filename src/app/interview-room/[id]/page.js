"use client";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import socket from '../../../lib/utils/socket';
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
import '../../../styles/swiper/swiperStyles.css'
import { PuffLoader } from "react-spinners";
import Loading from "@/app/loading";
import { usePathname, useRouter, redirect } from 'next/navigation';
import { useSession, getSession } from "next-auth/react"

const InterviewRoomPage = ({ params }) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const swiperRef = useRef(null); // Reference for the Swiper component

  // const { socket } = useSocket();
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState(null);
  const [isQuestionAvailabe, setIsQuestionAvailabe] = useState(false);
  const [recordedAnswer, setRecordedAnswer] = useState(""); // State for stored transcript
  const [answer, setAnswer] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [questions, setQuestions] = useState([]); // Example questions
  const [timeNow, setTimeNow] = useState(() => new Date().toLocaleTimeString());

  const {
    isListening,
    transcript,
    recordingComplete,
    startListening,
    stopListening,
    setTranscript
  } = useSpeechRecognition({ continuous: true });

  const startStopListening = () => {
    isListening ? stopListening() : startListening();
  };
  const handleAnswerChange = (e) => {
    // setAnswer(e.target.value); 
    setTranscript(e.target.value);
  };

  const handleSubmit = async () => {
    const session = await getSession();

    const role = session?.user?.role;
    const candidateId = session?.user?.candidateID;

    if (transcript.trim() !== "") {
      setActiveStep((prevStep) => {
        const nextStep = Math.min(prevStep + 1, questions.length - 1);
        return nextStep;
      });
    }
    const question = questions[activeStep];
    const questionNumber = activeStep + 1;
    socket.emit('submitAnswer', { sessionId: question.sessionID, questionId: question.questionID, candidateId: candidateId, answerText: transcript, questionText: question.questionText, questionNumber: questionNumber, numOfQuestions: questions.length });
    stopListening();
    setTranscript("");
  };
  // Update swiper on activeStep change
  // useEffect(() => {
  //     if (swiperRef.current && swiperRef.current.swiper) {
  //         swiperRef.current.swiper.slideTo(activeStep); 
  //     }
  // }, [activeStep]);

  const progress = ((activeStep + 1) / questions.length) * 100;
  const handleSlideChange = (index) => {
    setActiveStep(index); // Updates active step when slide changes
  };




  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setSessionId(resolvedParams.id);
    };
    unwrapParams();
  }, [params]);


  useEffect(() => {
    socket.on('questions', (data) => {
      console.log('Received questions:', data.questions);
      setQuestions(data.questions);
      setIsQuestionAvailabe(true);
    });


    socket.on("navigateNextQuestion", (data) => {
      if (!data.followUpQuestion) {
        const nextquestion = activeStep + 1
        if (swiperRef.current && swiperRef.current.swiper) {
          swiperRef.current.swiper.slideTo(nextquestion);
        }
      }

      setTranscript('')
      setAnswer('')
      stopListening();

    });


    return () => {
      socket.off('questions');
      socket.off('navigateNextQuestion');
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
    if (session.user.role !== 'CANDIDATE') {
      const loginURL = `/login?redirect=${encodeURIComponent(pathname)}`;
      redirect(loginURL);
    }
  }

  return (
    <>
      {isQuestionAvailabe ? (<>
        <div className="flex flex-col justify-center items-center w-full text-white py-3 bg-black">
          <div className="absolute inset-0 bg-black -z-20"></div>
          <div className="w-[70%] max-w-[1100px]">
            {/* Swiper Component with Questions */}
            <div className="relative w-full py-9">
              <SwiperComponent
                ref={swiperRef}
                questions={questions}
                onSlideChange={(index) => setActiveStep(index)} // Slide change handler
              />
            </div>
            <div className="relative flex flex-col items-center justify-between w-full text-white py-6">
              <div className="w-[70%] max-w-[1100px]">
                <div className="relative w-full rounded-xl h-auto p-7 bg-neutral-900 text-white shadow-md mb-5">
                  <textarea
                    value={transcript} // Use combined answer (typed or transcript)
                    onChange={handleAnswerChange} // Handle typing
                    placeholder="your answer here..."
                    className="w-full h-32 bg-transparent border-2 border-gray-600 rounded-lg p-3 text-white"
                  />
                </div>

                {/* Custom Stepper (Progress Bar) */}
                <div className="w-full mt-8">
                  <div className="flex items-center mb-3">
                    <span className="text-sm text-gray-400">
                      Step {activeStep + 1} of {questions.length}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="relative w-full h-2 bg-gray-400 rounded-full">
                    <div
                      className="absolute top-0 left-0 h-full bg-blue-400 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                  {activeStep < 4 ? (<button
                    onClick={handleSubmit}
                    disabled={!transcript}
                    className="mt-5 bg-blue-400 hover:bg-blue-500 text-white py-2 px-6 rounded-lg"
                  >
                    Submit Answer
                  </button>):(
                  <button
                    // onClick={handleSubmit}
                    // disabled={!transcript}
                    className="mt-5 bg-blue-400 hover:bg-blue-500 text-white py-2 px-6 rounded-lg"
                  >
                    Finish Attempt
                  </button>)}
                </div>
              </div>
            </div>
          </div>
          <div className="w-[70%]">
            <h1 className="text-2xl font-semibold text-center w-full pb-5">
              What is Your Answer?
            </h1>
            <div className="rounded-lg w-full">
              {/* {(isListening ) && (
                <div className="w-full m-auto min-h-[100px] rounded-lg px-6 py-5 bg-gradient-to-br from-[#2e3036] to-[#282a2e] text-white">
                  <div className="flex-1 flex w-full justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none text-white pb-1">
                        {recordingComplete ? "Recorded" : "Recording"}
                      </p>
                      <p className="text-sm text-muted-foreground text-[#8a8b8d]">
                        {recordingComplete ? "Thanks for talking." : "Start speaking..."}
                      </p>
                    </div>
                    {isListening && (
                      <div className="rounded-full w-4 h-4 bg-red-400 animate-pulse" />
                    )}
                  </div>
    
                  {transcript && (
                    <div className="border rounded-md p-2 h-full mt-4">
                      <p className="mb-0 ">{transcript}</p>
                    </div>
                  )}
                </div>
              )} */}
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
                      <path fill="white" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
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
      </>) : (<div className="flex flex-col h-lvh w-full justify-center item-center bg-background text-white">
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
            Waiting for the company to start the interview session. Please hold on until the session begins.
          </p>
          <p className=" w-[25%] mx-auto text-center text-sm py-2 text-lightred">
            Generating interview questions. Please hold on...
          </p>
        </div>
      </div>)}
    </>
  );
};

export default InterviewRoomPage;