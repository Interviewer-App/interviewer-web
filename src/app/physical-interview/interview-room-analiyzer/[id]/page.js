"use client";

//MUI
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import socket from "@/lib/utils/socket";

import { useEffect, useState, useCallback, useRef } from "react";
import CirculerProgress from "@/components/interview-room-analiyzer/circuler-progress";
import { analiyzeQuestion } from "@/lib/api/ai";
import ResponsiveAppBar from "@/components/ui/CandidateNavBar";
import { PuffLoader } from "react-spinners";
import Loading from "@/app/loading";
import {
  usePathname,
  useRouter,
  redirect,
  useSearchParams,
} from "next/navigation";
import { useSession, getSession } from "next-auth/react";
import { getInterviewCategoryCompanyById } from "@/lib/api/interview-category";
import { Slider } from "@/components/ui/slider";
import InterviewRoomAnalizerDashboard from "./interview-room-analizer-dashboard";
import InterviewRoomAnalizerScore from "./interview-room-analizer-score";
import InterviewRoomAnalizerOther from "./interview-room-analizer-other";
import InterviewRoomAnalizerCandidateProfile from "./interview-room-analizer-candidate-profile";

const InterviewRoomAnalizerPage = ({ params }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const userID = searchParams.get("companyID");
  const sessionID = searchParams.get("sessionID");
  const pages = ["candidate.Name", "candidate.Email"];
  const [candidateAnswers, setCandidateAnswers] = useState();
  const [analiyzeResponse, setAnaliyzeResponse] = useState({});
  const [isSubmitAnswers, setIsSubmitAnswers] = useState(true);
  const [numOfQuestions, setNumOfQuestions] = useState(0);
  const [answeredQuestionNo, setAnsweredQuestionNO] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [overollScore, setOverollScore] = useState(0);
  const [numberOfAnswers, setNumberOfAnswers] = useState(0);
  // const [timeNow, setTimeNow] = useState(() => new Date().toLocaleTimeString());
  const [sessionId, setSessionId] = useState(null);
  const [interviewCategories, setInterviewCategories] = useState([]);
  const [categoryMarks, setCategoryMarks] = useState([]);
  const [tab, setTab] = useState("DASHBOARD");
  const [questionList, setQuestionList] = useState([]);
  const [isQuestionsAvailable, setIsQuestionAvailabe] = useState(false);
  const [categoryScores, setCategoryScores] = useState([]);
  const [sessionData, setSessionData] = useState({});
  const [availableQuestion, setAvailableQuestion] = useState({});
  const [typingAnswer, setTypingAnswer] = useState("typing...");
  const dashboardRef = useRef();
  const [technicalStatus, setTechnicalStatus] = useState('');
  const [softSkillScore, setSoftSkillScore] = useState(0);
  const [manualScoreChange, setManualScoreChange] = useState(0);

  const { toast } = useToast();
  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setSessionId(resolvedParams.id);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    setNumOfQuestions(questionList.length);
  }, [questionList]);

  useEffect(() => {
    socket.emit("joinInterviewSession", {
      sessionId: sessionID,
      userId: userID,
      role: "COMPANY",
    });

    socket.on("question", (data) => {
      if (data.question) {
        setAvailableQuestion(data.question);
      }
    });

    socket.on("questions", (data) => {
      setQuestionList(data.questions);
      setIsQuestionAvailabe(true);
    });
    
    socket.on("technicalStatus", (data) => {
      setTechnicalStatus(data.technicalStatus);
    });

    socket.on("answerSubmitted", (data) => {
      setIsSubmitAnswers(true);
      setCandidateAnswers({
        question: data.questionText,
        answer: data.answerText,
      });
      setAnaliyzeResponse(data.metrics);
      setAnsweredQuestionNO(data.questionNumber);
      // setTotalScore(data.totalScore.score);
      setNumberOfAnswers(data.totalScore.numberOfAnswers);
      setIsQuestionAvailabe(true);
    });

    socket.on("totalScore", (data) => {
      setOverollScore(data.totalScore.totalScore);
      setSessionData(data.totalScore.session);
    });

    socket.on("categoryScores", (data) => {
      setCategoryScores(data.categoryScores.categoryScores);
      setTotalScore(data.categoryScores.categoryScores.find((category) => category.categoryAssignment.category.categoryName === "Technical")?.score);
      setSoftSkillScore(data.categoryScores.categoryScores.find((category) => category.categoryAssignment.category.categoryName === "Soft")?.score);
    });

    socket.on("participantLeft", (data) => {
      toast({
        variant: "info",
        title: "Participant Left",
        description: `Participant has left the meeting`,
        action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
      });
    });

    socket.on("typingUpdate", (data) => {
      setTypingAnswer(data.text);
    });

    return () => {
      socket.off("answerSubmitted");
      socket.off("joinInterviewSession");
      socket.off("categoryScores");
      socket.off("totalScore");
      socket.off("question");
      socket.off("questions");
      socket.off("participantLeft");
      socket.off("typingUpdate");
    };
  }, [manualScoreChange, sessionID, userID]);

  const handleTabChange = (tab) => {
    setTab(tab);
  };

  const leaveRoom = async (e) => {
    const session = await getSession();

    const userId = session?.user?.companyID;
    const data = {
      sessionId,
      userId,
    };
    dashboardRef.current?.endCall();
    socket.emit("endInterviewSession", data);
    router.push(`/session-history/${sessionId}`);
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
      <div className="  bg-black">
        <div className=" w-full h-[10%] bg-gray-900 py-3 flex justify-between items-center px-6">
          <div className=" flex items-center justify-start space-x-1">
            <button
              onClick={() => handleTabChange("DASHBOARD")}
              className={` ${
                tab === "DASHBOARD" ? "bg-gray-700/50" : ""
              } px-4 py-2 hover:bg-gray-700/50 rounded-md h-11`}
            >
              Dashboard
            </button>
            {/* <button
              onClick={() => handleTabChange("OTHER")}
              className={` ${
                tab === "OTHER" ? "bg-gray-700/50" : ""
              } px-4 py-2 hover:bg-gray-700/50 rounded-md h-11`}
            >
              Other
            </button> */}
            <button
              onClick={() => handleTabChange("SCORE")}
              className={` ${
                tab === "SCORE" ? "bg-gray-700/50" : ""
              } px-4 py-2 hover:bg-gray-700/50 rounded-md h-11`}
            >
              Score
            </button>
            <button
              onClick={() => handleTabChange("CANDIDATE_PROFILE")}
              className={` ${
                tab === "CANDIDATE_PROFILE" ? "bg-gray-700/50" : ""
              } px-4 py-2 hover:bg-gray-700/50 rounded-md h-11`}
            >
              Candidate Profile
            </button>
          </div>
          <button
            className=" text-sm bg-red-700 py-1 h-11 px-4 rounded-md"
            onClick={leaveRoom}
          >
            End Interview
          </button>
        </div>

        {tab === "DASHBOARD" && (
          <InterviewRoomAnalizerDashboard
            analiyzeResponse={analiyzeResponse}
            candidateAnswers={candidateAnswers}
            sessionId={sessionId}
            questionList={questionList}
            availableQuestion={availableQuestion}
            categoryScores={categoryScores}
            setCategoryScores={setCategoryScores}
            setAnaliyzeResponse={setAnaliyzeResponse}
            typingAnswer={typingAnswer}
            technicalStatus={technicalStatus}
            setTypingAnswer={setTypingAnswer}
            ref={dashboardRef}
            userID={userID}
            setManualScoreChange={setManualScoreChange}
            manualScoreChange={manualScoreChange}
          />
        )}
        {tab === "SCORE" && (
          <InterviewRoomAnalizerScore
            numberOfAnswers={numberOfAnswers}
            numOfQuestions={numOfQuestions}
            totalScore={totalScore}
            softSkillScore={softSkillScore}
            overollScore={overollScore}
            analiyzeResponse={analiyzeResponse}
            answeredQuestionNo={answeredQuestionNo}
            questionList={questionList}
          />
        )}
        {tab === "OTHER" && (
          <InterviewRoomAnalizerOther
            categoryScores={categoryScores}
            setCategoryScores={setCategoryScores}
            sessionId={sessionId}
            allocation={true}
          />
        )}
        {tab === "CANDIDATE_PROFILE" && (
          <InterviewRoomAnalizerCandidateProfile
            candidateId={sessionData.candidateId}
          />
        )}
      </div>
    </>
  );
};

export default InterviewRoomAnalizerPage;
