"use client";
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import socket from "../../../../lib/utils/socket";
import { useRouter, useSearchParams, redirect } from "next/navigation";

//UI Components
import { ToastAction } from "@/components/ui/toast";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getSession } from "next-auth/react";

//API
import { getInterviewSessionById } from "@/lib/api/interview-session";
import { generateQuestions } from "@/lib/api/ai";
import QuestionDisplayCard from "@/components/company/question-display-card";

function InterviewSessionPreviewPage({ params }) {
  const [sessionId, setSessionId] = useState(null);
  const [isGenerateQuestions, setGenerateQuestions] = useState(false);
  const [sessionDetails, setSessionDetails] = useState({});
  const [isQuestionEdit, setIsQuestionEdit] = useState(false);
  const { toast } = useToast();
  // const { socket } = useSocket();
  const router = useRouter();

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setSessionId(resolvedParams.id);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        if (!sessionId) return;

        const response = await getInterviewSessionById(sessionId);
        console.log(response.data);
        if (response.data) {
          setSessionDetails(response.data);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Error fetching session: ${error}`,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    };

    fetchSessionDetails();
  }, [sessionId, isGenerateQuestions, isQuestionEdit]);

  const handleQuestionGenarate = async (e) => {
    e.preventDefault();
    setGenerateQuestions(false);

    try {
      const response = await generateQuestions(sessionId, {
        jobRole: sessionDetails.interview.jobTitle,
        skillLevel: "Senior",
      });

      if (response) {
        setGenerateQuestions(true);
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Question Generation failed: ${data.message}`,
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

  const interviewStart = async (e) => {
    const session = await getSession();

    const sessionId = sessionDetails.sessionId;
    const role = session?.user?.role;
    const userId = session?.user?.id;
    if (sessionId && userId && role) {
      socket.emit("joinInterviewSession", {
        sessionId: sessionId,
        userId: userId,
        role: role,
      });
      router.push(`/interview-room-analiyzer/${sessionId}`);
    }
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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Company</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Session Preview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="px-9 py-4  max-w-[1500px] w-full mx-auto">
          <h1 className=" text-4xl font-semibold">Session Preview</h1>
          <div className=" flex flex-col md:flex-row items-center justify-start md:justify-between mt-5 w-full bg-gray-500/20 rounded-lg p-5">
            <div className=" w-full md:w-[50%] ">
              <h1 className=" text-3xl font-semibold">
                {sessionDetails?.interview?.jobTitle || ""} Position
              </h1>
              <h1 className=" text-xl font-semibold text-gray-500">
                {sessionDetails?.interviewCategory || ""} Interview
              </h1>
              <p className=" text-base pt-3 text-gray-400">
                Scheduled Date:{" "}
                {new Date(
                  sessionDetails?.interview?.scheduledDate
                ).toLocaleDateString() || ""}
              </p>
              <p className=" text-base pt-1 text-gray-400">
                Scheduled Time:{" "}
                {new Date(
                  sessionDetails?.interview?.scheduledAt
                ).toLocaleTimeString() || ""}
              </p>
            </div>
            <div className=" w-full md:w-[50%] flex items-center justify-start md:justify-end mt-5 md:mt-0">
              <button
                type="button"
                onClick={interviewStart}
                className=" h-12 min-w-[150px] w-[280px] cursor-pointer bg-gradient-to-b from-lightred to-darkred rounded-lg text-center text-base text-white font-semibold"
              >
                Start Interview
              </button>
            </div>
          </div>

          <div className="mt-5 bg-slate-500/10 p-5 rounded-lg">
            <div className=" w-full flex items-center justify-between">
              <h1 className=" text-2xl font-semibold">Questions</h1>
              <button className=" h-12 min-w-[160px] cursor-pointer bg-gradient-to-b from-lightred to-darkred rounded-lg text-center text-base text-white font-semibold">
                {" "}
                + Add Question
              </button>
            </div>
            {sessionDetails.questions?.length > 0 ? (
              sessionDetails.questions.map((question, index) => (
                <QuestionDisplayCard
                  key={index}
                  index={index}
                  question={question}
                  isQuestionEdit={isQuestionEdit}
                  setIsQuestionEdit={setIsQuestionEdit}
                />
              ))
            ) : (
              <p>No questions available.</p>
            )}
            <div className=" w-full flex items-center justify-center">
              <button
                className=" h-12 min-w-[150px] w-[280px] mt-8 cursor-pointer bg-gradient-to-b from-lightred to-darkred rounded-lg text-center text-base text-white font-semibold"
                onClick={handleQuestionGenarate}
              >
                Genarate questions
              </button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}

export default InterviewSessionPreviewPage;
