"use client";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import Image from "next/image";

import bgGrid from "@/assets/grid-bg.svg";
import bgGrain from "@/assets/grain-bg.svg";

const InterviewSession = () => {
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
  return (
    <div className=" relative flex flex-col h-lvh items-center justify-between w-full text-white py-9 bg-cover overflow-hidden">
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
        <div className="relative w-[70%] rounded-xl h-auto p-7 bg-gradient-to-br from-[#1d1f24] to-[#1a1d23] text-white shadow-md">
          <h1 className="text-xl font-semibold">Question</h1>
          <p className="text-base text-[#909194] pt-5">
            Can you explain the core principles of Object-Oriented Programming
            (OOP) and provide an example of how you've applied these principles
            in a project?
          </p>
        </div>
        <div className="relative float-right mt-5 w-[70%] rounded-xl h-auto p-7 bg-gradient-to-br from-[#202225] to-[#282a2e] text-white shadow-md">
          <h1 className="text-lg font-semibold text-right">Answer</h1>
          <p className="text-base text-[#909194] pt-5 text-justify">
            OOP principles include encapsulation, bundling data with methods;
            inheritance, reusing code; polymorphism, flexible method behavior;
            and abstraction, simplifying complexity by exposing only necessary
            details, creating secure, reusable, and maintainable software.
          </p>
        </div>
      </div>
      <div className="w-[70%]">
        <h1 className=" text-2xl font-semibold text-center w-full pb-5">
          What is Your Answer?
        </h1>
        <div className=" rounded-lg w-full ">
          {(isListening || transcript) && (
            <div className="w-full m-auto min-h-[100px] rounded-lg px-6 py-5 bg-gradient-to-br from-[#2e3036] to-[#282a2e]">
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
                  <p className="mb-0 text-black">{transcript}</p>
                </div>
              )}
            </div>
          )}
          <div className="flex items-center w-full">
            {isListening ? (
              // Button for stopping recording
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
              // Button for starting recording
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
                    fill="currentColor" // Change fill color to the desired color
                    d="M128 176a48.05 48.05 0 0 0 48-48V64a48 48 0 0 0-96 0v64a48.05 48.05 0 0 0 48 48ZM96 64a32 32 0 0 1 64 0v64a32 32 0 0 1-64 0Zm40 143.6V232a8 8 0 0 1-16 0v-24.4A80.11 80.11 0 0 1 48 128a8 8 0 0 1 16 0a64 64 0 0 0 128 0a8 8 0 0 1 16 0a80.11 80.11 0 0 1-72 79.6Z"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
