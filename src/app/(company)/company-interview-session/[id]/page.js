"use client";
import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import socket from "../../../../lib/utils/socket";
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
import QuestionDisplayCard from "@/components/company/question-display-card";
import CreateQuestionModal from "@/components/company/create-question-modal";
import GenerateQuestionModal from "@/components/company/generate-question-modal";
import Loading from "@/app/loading";
import { usePathname, useRouter, redirect } from "next/navigation";
import { useSession } from "next-auth/react";

function InterviewSessionPreviewPage({ params }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [sessionId, setSessionId] = useState(null);
  const [sessionDetails, setSessionDetails] = useState({});
  const [interviewId, setInterviewId] = useState(null);
  const [isQuestionEdit, setIsQuestionEdit] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);

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
        // console.log(response.data.questions.explnations);
        if (response.data) {
          setSessionDetails(response.data);
          setInterviewId(response.data.interview.interviewID);
          // console.log(response.data.interviewId);
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
  }, [sessionId, generateModalOpen, isQuestionEdit, modalOpen]);

  useEffect(() => {
    console.log("interviewId", interviewId);
  }, [interviewId]);

  const interviewStart = async (e) => {
    const session = await getSession();

    const sessionId = sessionDetails.sessionId;
    const role = session?.user?.role;
    const userId = session?.user?.id;
    if (sessionId && userId && role) {
      // socket.emit("joinInterviewSession", {
      //   sessionId: sessionId,
      //   userId: userId,
      //   role: role,
      // });
      router.push(
        `/interview-room-analiyzer/${sessionId}?companyID=${userId}&sessionID=${sessionId}`
      );
    }
  };

  if (status === "loading") {
    return (
      <>
        <Loading />
      </>
    );
  } else {
    if (session.user.role !== "COMPANY") {
      const loginURL = `/login?redirect=${encodeURIComponent(pathname)}`;
      redirect(loginURL);
    }
  }



  return (
    <>
      <SidebarInset>
        <header className="flex bg-black  h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink
                    href="/interviews"
                    className=" cursor-pointer"
                  >
                    Interviews
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block cursor-pointer">
                  <BreadcrumbLink
                    href={`/interviews/${encodeURIComponent(interviewId)}`}
                  >
                    Interview details
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block cursor-pointer">
                  <BreadcrumbPage>Session details</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className=" w-full">
          <div className="px-9 py-4 w-full max-w-[1500px] bg-black mx-auto">
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
                  {new Date(sessionDetails?.scheduledDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  ) || ""}
                </p>
                <p className=" text-base pt-1 text-gray-400">
                  Scheduled Time:{" "}
                  {new Date(sessionDetails?.scheduledAt).toLocaleTimeString() ||
                    ""}
                </p>
              </div>
              <div className=" w-full md:w-[50%] flex items-center justify-start md:justify-end mt-5 md:mt-0">
                <button
                  type="button"
                  onClick={interviewStart}
                  className=" h-12 min-w-[150px] w-[170px] cursor-pointer rounded-lg text-center text-base text-white bg-darkred font-semibold"
                >
                  Start Interview
                </button>
              </div>
            </div>

            <div className="mt-5 bg-slate-500/10 p-5 rounded-lg">
              <div className=" w-full  flex flex-col md:flex-row items-center justify-between">
                <h1 className=" text-2xl font-semibold text-left w-full">
                  Questions
                </h1>
                <div className=" w-full flex items-center justify-end">
                  <button
                    className=" h-12 min-w-[160px] mt-5 md:mt-0 px-5 mr-5 cursor-pointer bg-white rounded-lg text-center text-sm md:text-base text-black font-semibold"
                    onClick={() => setGenerateModalOpen(true)}
                  >
                    Genarate questions
                  </button>
                  <button
                    onClick={() => setModalOpen(true)}
                    className=" h-12 min-w-[160px] mt-5 md:mt-0 cursor-pointer bg-white text-black rounded-lg text-center text-sm md:text-base font-semibold"
                  >
                    {" "}
                    + Add Question
                  </button>
                </div>
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
            </div>
          </div>
          {modalOpen && (
            <CreateQuestionModal
              sessionId={sessionId}
              setModalOpen={setModalOpen}
            />
          )}
          {generateModalOpen && (
            <GenerateQuestionModal
              session={sessionDetails}
              setGenerateModalOpen={setGenerateModalOpen}
            />
          )}
        </div>
      </SidebarInset>
    </>
  );
}

export default InterviewSessionPreviewPage;
