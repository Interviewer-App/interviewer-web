"use client";

//MUI
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import socket from "../../../lib/utils/socket";

import { useEffect, useState, useCallback } from "react";
import CirculerProgress from "@/components/interview-room-analiyzer/circuler-progress";
import { analiyzeQuestion } from "@/lib/api/ai";
import ResponsiveAppBar from "@/components/ui/CandidateNavBar";
import { PuffLoader } from "react-spinners";
import Loading from "@/app/loading";
import { usePathname, useRouter, redirect } from "next/navigation";
import { useSession, getSession } from "next-auth/react";
import { getInterviewCategoryCompanyById } from "@/lib/api/interview-category";
import { Slider } from "@/components/ui/slider";
import InterviewRoomAnalizerDashboard from "./interview-room-analizer-dashboard";
import InterviewRoomAnalizerScore from "./interview-room-analizer-score";
import InterviewRoomAnalizerOther from "./interview-room-analizer-other";
import InterviewRoomAnalizerCandidateProfile from "./interview-room-analizer-candidate-profile";
import { use } from "react";

const InterviewRoomAnalizerPage = ({ params }) => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
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
  const [categoryScores , setCategoryScores] = useState([]);
  const [sessionData, setSessionData] = useState({
    
  });

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
    socket.on("questions", (data) => {
      setQuestionList(data.questions);
      setIsQuestionAvailabe(true);
    });

    // setIsSubmitAnswers(true);
    // setCandidateAnswers({
    //   question:
    //     "Explain the core principles of Object-Oriented Programming (OOP) and how you would apply them in a Java project to ensure maintainability and scalability.",
    //   answer: "incapsulation",
    // });
    // setAnaliyzeResponse({
    //   relevanceScore: 10,
    //   keyStrengths: [],
    //   areasOfImprovement: [
    //     "Lack of explanation of OOP principles",
    //     "Incomplete response",
    //     "Did not mention other core principles of OOP",
    //     "Did not mention application in Java project",
    //     "Did not discuss maintainability and scalability",
    //   ],
    //   alignment: "Very Low",
    //   followUpQuestions: [
    //     "Could you elaborate on what encapsulation means to you in the context of OOP?",
    //     "Besides encapsulation, what are the other core principles of OOP?",
    //     "How would you apply encapsulation, and other OOP principles, to build a maintainable and scalable Java application?",
    //   ],
    // });
    // setAnsweredQuestionNO(1);
    // setNumOfQuestions(5);
    // setTotalScore(10);
    // setNumberOfAnswers(1);
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
      // router.push(`/interview/${sessionId}/question`);
    });

    socket.on("totalScore", (data) => {
      setOverollScore(data.totalScore.totalScore);
      setSessionData(data.totalScore.session);
    });
   
    socket.on("categoryScores", (data) => {
      setCategoryScores(data.categoryScores.categoryScores);
    });

    return () => {
      socket.off("answerSubmitted");
      // socket.off("questions");
    };
  }, []);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTimeNow(new Date().toLocaleTimeString());
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

  const nextQuestion = () => {
    const data = {
      sessionId: sessionId,
    };
    socket.emit("nextQuestion", data);
  };

  useEffect(() => {
    const fetchInterviewCategories = async () => {
      try {
        const session = await getSession();
        const companyId = session?.user?.companyID;
        const response = await getInterviewCategoryCompanyById(companyId);
        if (response) {
          setInterviewCategories(response.data.categories);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Error fetching interview categories: ${error}`,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    };
    fetchInterviewCategories();
  }, []);

  useEffect(() => {
    if (interviewCategories.length > 0) {
      setCategoryMarks((prev) => {
        const existingIds = new Set(prev.map((item) => item.categoryId));
        const newMarks = interviewCategories
          .filter((category) => !existingIds.has(category.categoryId))
          .map((category) => ({
            categoryId: category.categoryId,
            categoryName: category.categoryName,
            marks: 10,
          }));
        return [...prev, ...newMarks];
      });
    }
  }, [interviewCategories]);

  const handleCategoryMarksChange = (category, value) => {
    setCategoryMarks((prev) =>
      prev.map((item) =>
        item.categoryId === category.categoryId
          ? { ...item, marks: value }
          : item
      )
    );
  };

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
    socket.emit("leaveInterviewSession", data);
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
      <div className=" h-lvh">
        <div className=" w-full fixed bottom-0 z-50 opacity-0 hover:opacity-100 transition-opacity duration-1000">
          <ResponsiveAppBar pages={pages} />
        </div>
        <div className=" w-full h-[10%] bg-gray-900 flex justify-between items-center px-6">
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
              onClick={() => handleTabChange("SCORE")}
              className={` ${
                tab === "SCORE" ? "bg-gray-700/50" : ""
              } px-4 py-2 hover:bg-gray-700/50 rounded-md h-11`}
            >
              Score
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
            Leave Session
          </button>
        </div>

        {tab === "DASHBOARD" && (
          <InterviewRoomAnalizerDashboard
            analiyzeResponse={analiyzeResponse}
            candidateAnswers={candidateAnswers}
            sessionId={sessionId}
            questionList={questionList}
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
          />
        )}
        {tab === "CANDIDATE_PROFILE" && (
          <InterviewRoomAnalizerCandidateProfile
            candidateId={sessionData.candidateId}
          />
        )}
        {/* <ResizablePanelGroup
          direction="horizontal"
          className=" rounded-lg md:min-w-full h-full"
        >
          <ResizablePanel defaultSize={150}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={65}>
                <div className=" h-full overflow-y-auto p-6 relative">
                  <h1 className=" text-3xl font-semibold">
                    Live Analysis Result
                  </h1>
                  <div className=" w-full mt-2">
                    <h1 className=" py-3 font-semibold text-lg">Question</h1>
                    <p className=" text-sm text-gray-400">
                      {candidateAnswers?.question}
                    </p>
                  </div>
                  <div className=" w-full mt-2">
                    <h1 className=" py-3 font-semibold text-lg">
                      Candidate&apos;s Answer
                    </h1>
                    <p className=" text-sm text-gray-400">
                      {candidateAnswers?.answer}
                    </p>
                  </div>
                  <div className=" w-full rounded-lg bg-gray-600/30 py-4 px-7 mt-5">
                    <h1 className=" text-2xl font-semibold">
                      Analysis with AI
                    </h1>
                    <div className=" mt-2">
                      <div className=" w-full">
                        <h1 className="py-3 font-semibold text-lg">
                          keyStrengths
                        </h1>
                        <ul className="list-disc list-inside text-sm text-gray-400">
                          {analiyzeResponse.keyStrengths?.map((key, index) => (
                            <li key={index}>{key}</li>
                          )) || "No key strengths found"}
                        </ul>
                      </div>
                      <div className=" w-full mt-2">
                        <h1 className="py-3 font-semibold text-lg">
                          Areas of Improvement
                        </h1>
                        <ul className="list-disc list-inside text-sm text-gray-400">
                          {analiyzeResponse.areasOfImprovement?.map(
                            (key, index) => <li key={index}>{key}</li>
                          ) || "No areas of improvement found"}
                        </ul>
                      </div>
                      <div className=" w-full mt-2">
                        <h1 className="py-3 font-semibold text-lg">
                          Alignment
                        </h1>
                        <p className=" text-sm text-gray-400">
                          {analiyzeResponse?.alignment || ""}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    variant="secondary"
                    className=" absolute top-0 right-6 mt-6 bg-gradient-to-b from-lightred to-darkred rounded-lg text-center text-sm text-white font-semibold h-11 w-[130px]"
                    onClick={nextQuestion}
                  >
                    Next Question
                  </button>
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={35}>
                <div className="h-full w-full overflow-y-auto p-6">
                  <h1 className=" text-3xl font-semibold">Other categories</h1>
                  <div className=" mt-4">
                    {categoryMarks
                      .filter(
                        (category) => category.categoryName !== "Technical"
                      )
                      .map((category, index) => (
                        <div key={index} className="mb-8">
                          <h1 className="text-md font-semibold text-gray-500 py-2">
                            {category.categoryName}
                          </h1>
                          <div className=" w-full flex justify-between">
                            <p>0</p>
                            <p>{category.marks}/100</p>
                          </div>
                          <Slider
                            defaultValue={[10]}
                            max={100}
                            step={1}
                            onValueChange={(value) =>
                              handleCategoryMarksChange(category, value)
                            }
                          />
                        </div>
                      ))}
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={150}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={65}>
                <div className=" w-full h-full overflow-auto p-6 relative">
                  <h1 className=" text-3xl font-semibold">Marks Overview</h1>
                  <div className="flex flex-col md:flex-row h-full items-center justify-start md:justify-center w-full">
                    <div className="flex flex-col items-center justify-center w-[50%] mt-7 md:mt-0">
                      <h1 className=" text-2xl font-semibold text-center">
                        Total Score
                      </h1>
                      <h2 className=" text-base text-gray-500 text-center">
                        {" "}
                        {numberOfAnswers}/{numOfQuestions} Questions
                      </h2>
                      <CirculerProgress
                        marks={totalScore}
                        catorgory="Total score"
                      />
                      <p className=" text-gray-300 text-center">
                        {totalScore}% Accurate with expected answers
                      </p>
                      <p className=" text-sm text-gray-500 text-center">
                        Showing Total Score for 8 out of 10 question
                      </p>
                    </div>
                    <div className="flex flex-col items-center justify-center w-[50%] mt-7 md:mt-0">
                      <h1 className=" text-2xl font-semibold text-center">
                        Relevance Score
                      </h1>
                      <h2 className=" text-base text-gray-500 text-center">
                        Question - {answeredQuestionNo}
                      </h2>
                      <CirculerProgress
                        marks={analiyzeResponse.relevanceScore}
                        catorgory="Question Score"
                      />
                      <p className=" text-gray-300 text-center">
                        {analiyzeResponse.relevanceScore}% Accurate with
                        expected answer
                      </p>
                      <p className=" text-sm text-gray-500 text-center">
                        Showing Relevance Score for current question
                      </p>
                    </div>
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={35}>
                <div className="h-full w-full overflow-y-auto p-6">
                  <div>
                    <h1 className=" text-3xl font-semibold">
                      Follow Up Questions
                    </h1>
                    <div className=" mt-3 rounded-lg py-2">
                      <ol className="list-decimal list-outside pl-7 ">
                        {analiyzeResponse.followUpQuestions?.map(
                          (question, index) => (
                            <li key={index} className=" py-2 text-gray-400">
                              {question}
                            </li>
                          )
                        ) || "No follow up questions found"}
                      </ol>
                    </div>
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup> */}
      </div>
    </>
  );
};

export default InterviewRoomAnalizerPage;
