"use client";
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
import { useState } from "react";
import Carousel from "@/components/ui/carousel";
import SwiperComponent from "@/components/ui/swiperComponent";
import "../../../styles/swiper/swiperStyles.css";

const InterviewSession = () => {
  const [answer, setAnswer] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [questions, setQuestions] = useState([
    "Can you explain the core principles of Object-Oriented Programming (OOP) and provide an example of how you've applied these principles in a project?",
    "What are the differences between a class and an interface in Object-Oriented Programming?",
    "How would you handle memory management in a project?",
    "Explain polymorphism and provide an example.",
    "Can you describe what a design pattern is and provide an example you’ve used?",
    "How do you approach debugging and troubleshooting in software development?",
  ]);
  const {
    isListening,
    transcript,
    recordingComplete,
    startListening,
    stopListening,
  } = useSpeechRecognition({ continuous: true });

  const startStopListening = () => {
    isListening ? stopListening() : startListening();
  };
  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = () => {
    if (answer.trim() !== "") {
      setActiveStep((prevStep) => Math.min(prevStep + 1, questions.length - 1));
      setAnswer("");
    }
  };

  const progress = ((activeStep + 1) / questions.length) * 100;
  const handleSlideChange = (index) => {
    setActiveStep(index);
  };

  return (
    <>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block cursor-pointer">
                  <BreadcrumbLink href='/my-interviews'>My Interviews</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block cursor-pointer">
                  <BreadcrumbPage>Interview Session</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className=" relative flex flex-col h-full items-center w-full text-white py-9 bg-cover overflow-hidden">
          <div className="absolute inset-0 bg-background -z-20"></div>
          <Image
            src={bgGrid}
            alt="bg"
            className=" absolute w-full  top-0 left-0 -z-10 "
          />
          <Image
            src={bgGrain}
            alt="bg"
            className=" absolute w-full top-0 left-0 -z-10 "
          />
          <div className="w-[70%] max-w-[1100px]">
            <div className="relative w-full py-9">
              <SwiperComponent
                questions={questions}
                onSlideChange={handleSlideChange}
              />
            </div>
            <div className="relative flex flex-col items-center justify-between w-full text-white py-9">
              <div className="w-[70%] max-w-[1100px]">
                <div className="relative w-full rounded-xl h-auto p-7 bg-gradient-to-br from-[#202225] to-[#282a2e] text-white shadow-md mb-5">
                  <textarea
                    value={transcript}
                    onChange={handleAnswerChange}
                    placeholder="your answer here..."
                    className="w-full h-32 bg-transparent border-2 border-gray-600 rounded-lg p-3 text-white"
                  />
                </div>

                <div className="w-full mt-8">
                  <div className="flex items-center mb-3">
                    <span className="text-sm text-gray-400">
                      Step {activeStep + 1} of {questions.length}
                    </span>
                  </div>

                  <div className="relative w-full h-2 bg-gray-400 rounded-full">
                    <div
                      className="absolute top-0 left-0 h-full bg-blue-400 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleSubmit}
                    disabled={!answer.trim()}
                    className="mt-5 bg-blue-400 hover:bg-blue-500 text-white py-2 px-6 rounded-lg"
                  >
                    Submit Answer
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[70%]">
            <h1 className=" text-2xl font-semibold text-center w-full pb-5">
              What is Your Answer?
            </h1>
            <div className=" rounded-lg w-full ">
              {(isListening || transcript) && (
                <div className="w-full m-auto min-h-[100px] rounded-lg px-6 py-5 bg-gradient-to-br from-[#2e3036] to-[#282a2e] text-white">
                  <div className="flex-1 flex w-full justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none text-white pb-1">
                        {recordingComplete ? "Recorded" : "Recording"}
                      </p>
                      <p className="text-sm text-muted-foreground text-[#8a8b8d]">
                        {recordingComplete
                          ? "Thanks for talking."
                          : "Start speaking..."}
                      </p>
                    </div>
                    {isListening && (
                      <div className="rounded-full w-4 h-4 bg-red-400 animate-pulse" />
                    )}
                  </div>

                  {transcript && (
                    <div className="border rounded-md p-2 h-fullm mt-4">
                      <p className="mb-0 ">{transcript}</p>
                    </div>
                  )}
                </div>
              )}
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
      </SidebarInset>
    </>
  );
};

export default InterviewSession;
