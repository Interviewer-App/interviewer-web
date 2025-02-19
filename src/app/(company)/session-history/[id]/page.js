"use client";
import QuestionAndAnswerCard from "@/components/company/question-and-answer-card";
import CirculerProgress from "@/components/interview-room-analiyzer/circuler-progress";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { getInterviewSessionHistoryById } from "@/lib/api/interview-session";
import { Separator } from "@radix-ui/react-dropdown-menu";
import React, { useEffect, useState } from "react";

import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

import { FaDotCircle } from "react-icons/fa";
import { getInterviewSessionScoreById } from "@/lib/api/answer";
import Loading from "@/app/loading";
import { usePathname, useRouter, redirect } from "next/navigation";
import { useSession, getSession } from "next-auth/react";
import { set } from "zod";
import FeedbackModal from "@/components/company/feedback-modal";

function SessionHistoryPage({ params }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [sessionId, setSessionId] = useState(null);
  const [interviewId, setInterviewId] = useState(null);
  const [sessionDetails, setSessionDetails] = useState({});
  const [sessionScoreDetails, setSessionScoreDetails] = useState({});
  const { toast } = useToast();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [feedbackDescription, setFeedbackDescription] = useState([]);

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
        const response = await getInterviewSessionHistoryById(sessionId);
        if (response.data) {
          setSessionDetails(response.data);
          setInterviewId(response.data.interview.interviewID);
          setFeedbackDescription(response.data.interviewFeedback);
          if (!response.data.feedbackId) {
            setIsFeedbackModalOpen(true);
          }
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

    if (sessionId) fetchSessionDetails();
  }, [sessionId, isFeedbackModalOpen]);

  useEffect(() => {
    const fetchSessionScoreDetails = async () => {
      try {
        const response = await getInterviewSessionScoreById(sessionId);
        if (response.data) {
          setSessionScoreDetails(response.data);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Error fetching session score: ${error}`,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    };

    if (sessionId) fetchSessionScoreDetails();
  }, [sessionId, toast]);

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
        <header className="flex h-16 bg-black shrink-0 items-center gap-2">
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
                  <BreadcrumbPage>Session history</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="px-9 py-4  max-w-[1500px] w-full mx-auto">
          <h1 className=" text-4xl font-semibold">Session History</h1>
          <div className=" flex flex-col md:flex-row justify-start md:justify-between gap-5 mt-5 w-full">
            <div className=" w-full md:w-[30%] bg-gray-500/20 rounded-lg p-8">
              <h1 className=" text-3xl font-semibold">
                {sessionDetails?.candidate?.user?.firstName || ""}{" "}
                {sessionDetails?.candidate?.user?.lastName || ""}
              </h1>
              <h1 className=" text-base text-gray-500">
                {sessionDetails?.candidate?.user?.email || ""}
              </h1>
              <h1 className=" py-3 font-semibold text-gray-500">
                {sessionDetails?.interview?.interviewCategory || ""} Interview
              </h1>
              <div className=" w-full px-5">
                <ul className=" w-full">
                  <li className=" text-sm pt-2 text-gray-400">
                    <FaDotCircle className="inline-block text-gray-400 mr-2" />
                    Scheduled Date:{" "}
                    {new Date(sessionDetails?.scheduledDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    ) || ""}
                  </li>
                  <li className=" text-sm pt-1 text-gray-400">
                    <FaDotCircle className="inline-block text-gray-400 mr-2" />
                    Scheduled Time:{" "}
                    {new Date(
                      sessionDetails?.scheduledAt
                    ).toLocaleTimeString() || ""}
                  </li>
                  <li className=" text-sm pt-1 text-gray-400">
                    <FaDotCircle className="inline-block text-gray-400 mr-2" />
                    Test Questions: {sessionDetails?.questions?.length || 0}
                  </li>
                  <li className=" text-sm pt-1 text-gray-400">
                    <FaDotCircle className="inline-block text-gray-400 mr-2" />
                    Test score: {sessionScoreDetails?.totalScore || 0}
                  </li>
                  <li className=" text-sm pt-1 text-gray-400">
                    <FaDotCircle className="inline-block text-gray-400 mr-2" />
                    Feedback: <br />
                    <span className=" italic text-gray-500 text-sm px-5 py-2">
                      {feedbackDescription ? (
                        <>
                          {feedbackDescription.map((detail) => (
                            <span key={detail.feedbackId}>
                              {detail.feedbackText}
                            </span>
                          ))}
                        </>
                      ) : (
                        <span>No feedback available</span>
                      )}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <div className=" w-full md:w-[70%] bg-gray-500/20 rounded-lg p-8 flex flex-col items-center justify-center mt-5 md:mt-0">
              <div className="flex items-center justify-between w-full">
                <div className=" w-[30%]">
                  <h2 className=" text-2xl font-semibold text-center">
                    Overall Score
                  </h2>
                  <h2 className=" text-sm text-gray-500 text-center">
                    for the entire interview
                  </h2>
                  <CirculerProgress
                    marks={sessionDetails?.score || 0}
                    catorgory="Overall score"
                  />
                  <p className=" text-gray-300 text-center text-sm">
                    You have Scored {parseInt(sessionDetails?.score).toFixed(2)}
                    % in entire interview.
                  </p>
                  <p className=" text-xs text-gray-500 text-center">
                    Include test marks and non-technical details.
                  </p>
                </div>

                <div className=" w-[30%]">
                  <h1 className=" text-2xl font-semibold text-center">
                    Test Score
                  </h1>
                  <h2 className=" text-sm text-gray-500 text-center">
                    {" "}
                    {sessionScoreDetails?.numberOfAnswers || 0}/
                    {sessionDetails?.questions?.length || 0} Questions
                  </h2>
                  <CirculerProgress
                    marks={sessionScoreDetails?.score || 0}
                    catorgory="Test score"
                  />

                  <p className=" text-gray-300 text-center text-sm">
                    {parseFloat(sessionScoreDetails?.score).toFixed(2) || 0}%
                    Accurate with expected answers
                  </p>
                  <p className=" text-xs text-gray-500 text-center">
                    Showing Test Score for{" "}
                    {sessionScoreDetails?.numberOfAnswers || 0} out of{" "}
                    {sessionDetails?.questions?.length || 0} question
                  </p>
                </div>

                <div className=" w-[30%]">
                  <h2 className=" text-2xl font-semibold text-center">
                    Soft Skills
                  </h2>
                  <h2 className=" text-sm text-gray-500 text-center">
                    Soft skills evaluation
                  </h2>
                  <CirculerProgress
                    marks={
                      sessionDetails?.score - sessionScoreDetails?.score || 0
                    }
                    catorgory="Soft Skills"
                  />
                  <p className=" text-gray-300 text-center text-sm">
                    You have Scored{" "}
                    {parseInt(
                      sessionDetails?.score - sessionScoreDetails?.score || 0
                    ).toFixed(2)}
                    % in in the soft skills assessment.
                  </p>
                  <p className=" text-xs text-gray-500 text-center">
                    Showing Score for Soft Skills evaluation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 bg-slate-500/10 p-5 rounded-lg">
            <div className=" w-full flex items-center justify-between">
              <h1 className=" text-2xl font-semibold">Questions</h1>
            </div>
            {sessionDetails.questions?.length > 0 ? (
              sessionDetails.questions.map((question, index) => (
                <QuestionAndAnswerCard
                  key={index}
                  index={index}
                  question={question}
                />
              ))
            ) : (
              <p>No questions available.</p>
            )}
          </div>
        </div>
        {isFeedbackModalOpen && (
          <FeedbackModal
            setIsFeedbackModalOpen={setIsFeedbackModalOpen}
            sessionId={sessionId}
          />
        )}
      </SidebarInset>
    </>
  );
}

export default SessionHistoryPage;
