"use client";

//MUI
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import socket from "../../../lib/utils/socket";

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
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3, Clock, Code, Sparkles, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [elapsedTime, setElapsedTime] = useState(0)
  const [activeTab, setActiveTab] = useState("technical")

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
      setTotalScore(data.totalScore.score);
      setNumberOfAnswers(data.totalScore.numberOfAnswers);
      setIsQuestionAvailabe(true);
    });

    socket.on("totalScore", (data) => {
      setOverollScore(data.totalScore.totalScore);
      setSessionData(data.totalScore.session);
    });

    socket.on("categoryScores", (data) => {
      setCategoryScores(data.categoryScores.categoryScores);
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
  }, []);

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

  const formatElapsedTime = () => {
    const hours = Math.floor(elapsedTime / 3600)
    const minutes = Math.floor((elapsedTime % 3600) / 60)
    const seconds = elapsedTime % 60

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`
  }

  return (
    <>
      <div className="  bg-black min-h-screen flex flex-col">
      <header className="border-b border-border/40 bg-background/95 w-full backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className=" px-6 flex h-14 items-center w-full justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => router.push(`/company-interview-session/${sessionId}`)}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-lg font-semibold">sessionData.name</h1>
              <p className="text-sm text-muted-foreground">
                sessionData.date, • sessionData.startTime - sessionData.endTime
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-blue-500/20 text-blue-500 border-blue-500/20 flex items-center gap-1"
            >
              <Clock className="h-3 w-3" />
              <span>Ongoing</span>
            </Badge>

            <div className="flex items-center gap-1 bg-muted/50 px-3 py-1 rounded-md">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-mono">{formatElapsedTime()}</span>
            </div>

            {/* <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setShowNotesDialog(true)}>
                    <FileText className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Session Notes</p>/
                </TooltipContent>
              </Tooltip>
            </TooltipProvider> */}

            {/* <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={saveSessionData}>
                    {isSaving ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : savedFeedback ? (
                      <ClipboardCheck className="h-4 w-4 text-green-500" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save Progress</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider> */}

            <Button variant="destructive" size="sm" onClick={leaveRoom}>
              End Session
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 py-6 flex flex-col w-full px-6">
        {/* Candidate info */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              <img
                src={sessionData?.candidate?.avatar || "/placeholder.svg?height=48&width=48"}
                alt={sessionData?.candidate?.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-medium">{sessionData?.candidate?.name}</h2>
              <p className="text-sm text-muted-foreground">{sessionData?.candidate?.email}</p>
            </div>
          </div>
          {/* {interviewStage !== "pre-interview" && ( */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
              <TabsList>
                <TabsTrigger value="technical" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Technical
                </TabsTrigger>
                <TabsTrigger value="soft" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Soft Skills
                </TabsTrigger>
                <TabsTrigger value="overall" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Overall Score
                </TabsTrigger>
                <TabsTrigger value="ai-analysis" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI Analysis
                </TabsTrigger>
              </TabsList>
            </Tabs>
          {/* )} */}
        </div>

          </main>
        {/* <div className=" w-full h-[10%] bg-gray-900 py-3 flex justify-between items-center px-6">
          <div className=" flex items-center justify-start space-x-1">
            <button
              onClick={() => handleTabChange("DASHBOARD")}
              className={` ${
                tab === "DASHBOARD" ? "bg-gray-700/50" : ""
              } px-4 py-2 hover:bg-gray-700/50 rounded-md h-11`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleTabChange("OTHER")}
              className={` ${
                tab === "OTHER" ? "bg-gray-700/50" : ""
              } px-4 py-2 hover:bg-gray-700/50 rounded-md h-11`}
            >
              Other
            </button>
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
        </div> */}

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
            setActiveTab={setActiveTab}
          />
        )}
        {tab === "SCORE" && (
          <InterviewRoomAnalizerScore
            numberOfAnswers={numberOfAnswers}
            numOfQuestions={numOfQuestions}
            totalScore={totalScore}
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
