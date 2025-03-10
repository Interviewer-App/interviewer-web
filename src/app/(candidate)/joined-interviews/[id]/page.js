"use client";
import { useEffect, useState } from "react";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getInterviewSessionHistoryById } from "@/lib/api/interview-session";
import QuestionAndAnswerCard from "@/components/company/question-and-answer-card";
import CirculerProgress from "@/components/interview-room-analiyzer/circuler-progress";

import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

import { FaDotCircle } from "react-icons/fa";
import { getInterviewSessionScoreById } from "@/lib/api/answer";
import Loading from "@/app/loading";
import { usePathname, useRouter, redirect } from "next/navigation";
import { useSession } from "next-auth/react";

const JoinedInterviewsDetails = ({ params }) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [sessionId, setSessionId] = useState(null);
  const [sessionDetails, setSessionDetails] = useState({});
  const [sessionScoreDetails, setSessionScoreDetails] = useState({});
  const { toast } = useToast();
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
          setFeedbackDescription(response.data.interviewFeedback)
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
  }, [sessionId, toast]);

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
    if (session.user.role !== "CANDIDATE") {
      const loginURL = `/login?redirect=${encodeURIComponent(pathname)}`;
      redirect(loginURL);
    }
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-3">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/joined-interviews">
                  Joined Interviews
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block " />
              <BreadcrumbItem className="hidden md:block cursor-pointer">
                <BreadcrumbPage>Interview History</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="px-9 py-4  max-w-[1500px] w-full mx-auto text-white">
        <h1 className=" text-4xl font-semibold">Joined Interviews Details</h1>
        <div className=" flex flex-col md:flex-row justify-start md:justify-between mt-5 w-full bg-gray-500/20 rounded-lg p-8">
          <div className=" w-full md:w-[50%]">
            <h1 className=" text-3xl font-semibold">
              {sessionDetails?.interview?.jobTitle || ""} Position
            </h1>
            <h1 className=" text-xl font-semibold text-gray-500">
              {sessionDetails?.interview?.interviewCategory || ""} Interview
            </h1>
            <div className=" w-full px-5">
              <ul className=" w-full">
                <li className=" text-base pt-3 text-gray-400 mt-5">
                  <FaDotCircle className="inline-block text-gray-400 mr-2" />
                  Scheduled Date:{" "}
                  {new Date(
                    sessionDetails?.scheduledDate
                  ).toLocaleDateString("en-GB",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }) || ""}
                </li>
                <li className=" text-base pt-1 text-gray-400">
                  <FaDotCircle className="inline-block text-gray-400 mr-2" />
                  Scheduled Time:{" "}
                  {new Date(
                    sessionDetails?.scheduledAt
                  ).toLocaleTimeString() || ""}
                </li>
                <li className=" text-base pt-1 text-gray-400">
                  <FaDotCircle className="inline-block text-gray-400 mr-2" />
                  Total Questions: {sessionDetails?.questions?.length || 0}
                </li>
                <li className=" text-base pt-1 text-gray-400">
                  <FaDotCircle className="inline-block text-gray-400 mr-2" />
                  Test score: {parseFloat(sessionScoreDetails?.score).toFixed(2)  || 0}
                </li>
                <li className=" text-base pt-1 text-gray-400">
                  <FaDotCircle className="inline-block text-gray-400 mr-2" />
                  Feedback: <br />
                  <span className=" italic text-gray-500 text-sm px-5 py-2">
                  {feedbackDescription ? (<>{feedbackDescription.map((detail) => (
                        <span key={detail.feedbackId}>{detail.feedbackText}</span>
                                ))}</>) : (<span>No feedback available</span>)}
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className=" w-full md:w-[50%] flex flex-col items-center justify-center mt-5 md:mt-0">
            <h1 className=" text-2xl font-semibold text-center">Test Score</h1>
            <h2 className=" text-base text-gray-500 text-center">
              {" "}
              {sessionScoreDetails?.numberOfAnswers || 0}/
              {sessionDetails?.questions?.length || 0} Questions
            </h2>
            <CirculerProgress
              marks={sessionScoreDetails?.score || 0}
              catorgory="Test score"
            />
            <p className=" text-gray-300 text-center">
              {parseFloat(sessionScoreDetails?.score).toFixed(2)  || 0}% Accurate with expected
              answers
            </p>
            <p className=" text-sm text-gray-500 text-center">
              Showing Test Score for{" "}
              {sessionScoreDetails?.numberOfAnswers || 0} out of{" "}
              {sessionDetails?.questions?.length || 0} question
            </p>
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
    </SidebarInset>
  );
};

export default JoinedInterviewsDetails;
