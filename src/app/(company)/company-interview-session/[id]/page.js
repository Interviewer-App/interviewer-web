"use client";
import React, { useEffect, useState } from "react";
import { getInterviewSessionById } from "@/lib/api/interview-session";
import { generateQuestions } from "@/lib/api/ai";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

function InterviewSessionPreviewPage({ params }) {
  const [sessionId, setSessionId] = useState(null);
  const [isGenerateQuestions, setGenerateQuestions] = useState(false);
  const [sessionDetails, setSessionDetails] = useState({});
  const { toast } = useToast();

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
        setSessionDetails(response.data);
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
  }, [sessionId, isGenerateQuestions]);

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
            description: `Interview update failed: ${data.message}`,
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
  return (
    <div>
      <h1>Interview Session Preview</h1>
      <p>Session ID: {sessionId}</p>
      {sessionDetails.questions?.length > 0 ? (
        sessionDetails.questions.map((question, index) => (
          <div key={index}>
            <h1 className=" text-xl font-semibold mt-5">
              question {index + 1}
            </h1>
            <p>{question.questionText}</p>
          </div>
        ))
      ) : (
        <p>No questions available.</p>
      )}

      <div>
        <button onClick={handleQuestionGenarate}>Genarate questions</button>
      </div>
    </div>
  );
}

export default InterviewSessionPreviewPage;
