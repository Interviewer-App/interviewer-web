'use client'
import React, { use, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { fetchDocumet, getCandidateById } from "@/lib/api/users";
import { FaDiscord, FaXTwitter } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
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
  User,
  Mail,
  Phone,
  Linkedin,
  Github,
  Facebook,
  ExternalLink,
  ArrowLeft,
  Star,
  FileText,
  Calendar,
  Briefcase,
  Clock,
  Download,
  GraduationCap,
  Sparkles,
  Brain,
  FlaskConical,
  NotebookPen,
  Ghost,
  LinkedinIcon,
  GithubIcon,
  Plus,
  Check,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  getInterviewSessionById,
  getInterviewSessionHistoryById,
} from "@/lib/api/interview-session";
import { createQuestion, createQuestionForInterview } from "@/lib/api/question";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertDialog } from "@radix-ui/react-alert-dialog";

function InterviewRoomAnalizerCandidateProfile({candidateId,sessionId}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const candidateId = searchParams.get("candidateID"); // Adjust if the param name differs
  // const sessionId = searchParams.get("sessionID");
  const [candidateDetails, setCandidateDetails] = useState({});
  const [documentAnalizedData, setDocumentAnalizedData] = useState("");
  const [age, setAge] = useState(0);
  const { toast } = useToast();
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [activeTab, setActiveTab] = useState("details");
  const [activeAssessmentTab, setActiveAssesmentTab] = useState("technical");
  const [sessionDetails, setSessionDetails] = useState({});
  const [sessionhistory, setSessionHistory] = useState([]);
  const [categoryMarks, setCategoryMarks] = useState([
    {
      id: "cm8sb9c4p0005u7mo3zc1wyfb",
      parentAssignmentId: "cm8sb9c4p0004u7mo01t5suh0",
      name: "Communication",
      color: "#641B44",
      percentage: 30,
      createdAt: "2025-03-28T04:57:13.129Z",
      updatedAt: "2025-03-28T04:57:13.129Z",
    },
    {
      id: "cm8sb9c4q0009u7momffp4uu6",
      parentAssignmentId: "cm8sb9c4p0004u7mo01t5suh0",
      name: "Problem-Solving",
      color: "#CBB271",
      percentage: 35,
      createdAt: "2025-03-28T04:57:13.129Z",
      updatedAt: "2025-03-28T04:57:13.129Z",
    },
    {
      id: "cm8sb9c4q000du7motwsztbfa",
      parentAssignmentId: "cm8sb9c4p0004u7mo01t5suh0",
      name: "Collaboration",
      color: "#D63A85",
      percentage: 25,
      createdAt: "2025-03-28T04:57:13.129Z",
      updatedAt: "2025-03-28T04:57:13.129Z",
    },
    {
      id: "cm8sb9c4q000hu7moodkuc7u7",
      parentAssignmentId: "cm8sb9c4p0004u7mo01t5suh0",
      name: "Adaptability",
      color: "#19EA0B",
      percentage: 10,
      createdAt: "2025-03-28T04:57:13.129Z",
      updatedAt: "2025-03-28T04:57:13.129Z",
    },
  ]);

  useEffect(() => {
    console.log("Candidate ID:", candidateId);
    console.log("Session ID:", sessionId);
    // debugger
    const fetchCandidateDetails = async () => {
      try {
        const response = await getCandidateById(candidateId);
        if (response.data) {
          const parsedExperiences = response.data?.experience
            ? JSON.parse(response.data.experience)
            : [];

          const parsedSkills = response.data?.skillHighlights
            ? JSON.parse(response.data?.skillHighlights)
            : [];
          setCandidateDetails(response.data);
          setExperiences(parsedExperiences);
          setSkills(parsedSkills);
        }
      } catch (err) {
        if (err.response) {
          const { data } = err.response;

          if (data && data.message) {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: `Candidate Details Fetching Faild: ${data.message}`,
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

    if (candidateId) fetchCandidateDetails();
  }, [candidateId]);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await getInterviewSessionById(sessionId);
        if (response.data) {
          setSessionDetails(response.data);
        }
      } catch (err) {
        if (err.response) {
          const { data } = err.response;

          if (data && data.message) {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: `Session Fetching Faild: ${data.message}`,
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

    if (sessionId) fetchSessionData();
  }, [sessionId]);

  useEffect(() => {
    const fetchSessionHistory = async () => {
      try {
        const response = await getInterviewSessionHistoryById(sessionId);
        if (response.data) {
          setSessionHistory(response.data);
        }
      } catch (err) {
        if (err.response) {
          const { data } = err.response;

          if (data && data.message) {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: `Session History Fetching Faild: ${data.message}`,
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

    if (sessionDetails.interviewStatus === "completed" && sessionId)
      fetchSessionHistory();
  }, [sessionDetails, sessionId]);

  useEffect(() => {
    const fetchdocument = async () => {
      try {
        const response = await fetchDocumet(candidateId);
        if (response.data) {
          setDocumentAnalizedData(response.data);
        }
      } catch (err) {
        if (err.response) {
          const { data } = err.response;

          if (data && data.message) {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: `documents Fetching Faild: ${data.message}`,
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

    if (candidateId) fetchdocument();
  }, [candidateId]);

  useEffect(() => {
    if (candidateDetails?.user?.dob) {
      calculateAge(candidateDetails?.user?.dob);
    }
  }, [candidateDetails]);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    setAge(age);
  };

  const handleAddQuestion = async (question, type, minutes) => {
    try {
      const questionDataforSession = {
        question: question,
        type: type,
        estimatedTimeInMinutes: parseInt(minutes, 10),
        sessionId: sessionDetails.sessionId,
      };
      const response = await createQuestion(questionDataforSession);

      if (response) {
        toast({
          variant: "success",
          title: "Question created successfully.",
          description: "The question has been added to the interview.",
        });
      }
    } catch (err) {
      if (err.response) {
        const { data } = err.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Question Adding failed: ${data.message}`,
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

  const getScoreColor = (score) => {
    if (score >= 90) return "!text-green-500";
    if (score >= 80) return "!text-blue-500";
    if (score >= 70) return "!text-amber-500";
    return "!text-red-500";
  };

  // Get background color based on score
  const getScoreBgColor = (score) => {
    if (score >= 90) return "!bg-green-500";
    if (score >= 80) return "!bg-blue-500";
    if (score >= 70) return "!bg-amber-500";
    return "!bg-red-500";
  };

  const getInterviewStatusBadge = (status) => {
    switch (status) {
      case "toBeConducted":
        return (
          <Badge
            variant="outline"
            className=" !text-orange-400 !border-orange-400/30 py-1 px-4 bg-orange-400/20"
          >
            To Be Conducted
          </Badge>
        );
      case "ongoing":
        return (
          <Badge
            variant="outline"
            className="!text-emerald-400 py-1 px-4 !border-emerald-400/30 !bg-emerald-400/20"
          >
            Ongoing
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="!text-green-600 !border-green-600/30 bg-green-600/20 py-1 px-4"
          >
            Completed
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="!text-gray-600 !border-gray-600/30 bg-gray-600/20 py-1 px-4"
          >
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className=" w-full">   

        <div className=" w-[90%] max-w-[1500px] bg-black mx-auto h-full p-6 relative">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Candidate Details</h1>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() =>
                router.push(`/interviews/${sessionDetails.interviewId}`)
              }
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Interview
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="md:col-span-1 !bg-transparent">
              <CardHeader className="pb-2">
                <CardTitle>Candidate Profile</CardTitle>
                <CardDescription>Interview results and details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage
                      src={candidateDetails?.user?.avatar}
                      alt={candidateDetails?.user?.firstName}
                    />
                    <AvatarFallback className="text-2xl">
                      {candidateDetails?.user?.firstName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold mb-1">
                    {candidateDetails?.user?.firstName}{" "}
                    {candidateDetails?.user?.lastName}
                  </h2>
                  {getInterviewStatusBadge(
                    sessionDetails?.interviewStatus || "Not Scheduled"
                  )}
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span>{candidateDetails?.user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    {candidateDetails?.user?.contactNo ? (
                      <span>{candidateDetails?.user?.contactNo}</span>
                    ) : (
                      <span className=" text-gray-500 text-sm">
                        Not Provided
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>
                      {new Date(candidateDetails?.user?.dob).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    {sessionDetails?.interview?.startDate ? (
                      <span>
                        {new Date(
                          sessionDetails?.interview?.startDate
                        ).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}{" "}
                        -{" "}
                        {new Date(
                          sessionDetails?.interview?.endDate
                        ).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </span>
                    ) : (
                      <span className=" text-gray-500 text-sm">
                        Not Scheduled
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Interviewer</h3>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      {/* <AvatarImage src={candidateDetails.interviewer.avatar} alt={candidateDetails.interviewer.name} /> */}
                      <AvatarFallback>
                        {/* {candidateDetails?.user?.firstName.charAt(0)} */}
                        {"Ushan".charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{"Ushan Sankalpa"}</div>
                      <div className="text-sm text-muted-foreground">
                        {"Senior Engineering Manager"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 !bg-transparent">
              <CardHeader>
                <CardTitle>Interview Results</CardTitle>
                {sessionDetails?.interviewStatus ? (
                  sessionDetails?.interviewStatus === "completed" ? (
                    <CardDescription>
                      Completed on{" "}
                      {new Date(
                        sessionDetails?.interview?.endDate
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      at{" "}
                      {new Date(
                        sessionDetails?.interview?.endDate
                      ).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </CardDescription>
                  ) : (
                    <CardDescription>
                      Scheduled for{" "}
                      {new Date(
                        sessionDetails?.interview?.startDate
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}{" "}
                      at{" "}
                      {new Date(
                        sessionDetails?.interview?.startDate
                      ).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </CardDescription>
                  )
                ) : (
                  <span className=" text-gray-500 text-sm">
                    Not Scheduled Yet
                  </span>
                )}
              </CardHeader>
              {sessionDetails?.interviewStatus === "completed" ? (
                <CardContent className="space-y-6">
                  <div className="flex flex-col items-center">
                    <div className="relative w-40 h-40">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="hsl(var(--muted))"
                          strokeWidth="10"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke={
                            (sessionDetails.score ?? 0).toFixed(2) >= 90
                              ? "#10b981"
                              : (sessionDetails.score ?? 0).toFixed(2) >= 80
                              ? "#3b82f6"
                              : (sessionDetails.score ?? 0).toFixed(2) >= 70
                              ? "#f59e0b"
                              : "#ef4444"
                          }
                          strokeWidth="10"
                          strokeDasharray={`${
                            (2 *
                              Math.PI *
                              45 *
                              (sessionDetails.score ?? 0).toFixed(2)) /
                            100
                          } ${
                            2 *
                            Math.PI *
                            45 *
                            (1 - (sessionDetails.score ?? 0).toFixed(2) / 100)
                          }`}
                          strokeDashoffset={2 * Math.PI * 45 * 0.25}
                          transform="rotate(-90 50 50)"
                          strokeLinecap="round"
                        />
                        {/* Percentage text */}
                        <text
                          x="50"
                          y="45"
                          dominantBaseline="middle"
                          textAnchor="middle"
                          fontSize="24"
                          fontWeight="bold"
                          fill="currentColor"
                          className={getScoreColor(
                            (sessionDetails.score ?? 0).toFixed(2)
                          )}
                        >
                          {(sessionDetails.score ?? 0).toFixed(2)}
                        </text>
                        <text
                          x="50"
                          y="60"
                          dominantBaseline="middle"
                          textAnchor="middle"
                          fontSize="10"
                          fill="currentColor"
                        >
                          Overall Score
                        </text>
                      </svg>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Technical Skills</h3>
                        <span
                          className={`font-bold ${getScoreColor(
                            (
                              sessionDetails?.CategoryScore?.find(
                                (item) =>
                                  item.categoryAssignment.category
                                    .categoryName === "Technical"
                              ).score ?? 0
                            ).toFixed(2)
                          )}`}
                        >
                          {(
                            sessionDetails?.CategoryScore?.find(
                              (item) =>
                                item.categoryAssignment.category
                                  .categoryName === "Technical"
                            ).score ?? 0
                          ).toFixed(2)}
                        </span>
                      </div>
                      <Progress
                        value={(
                          sessionDetails?.CategoryScore?.find(
                            (item) =>
                              item.categoryAssignment.category.categoryName ===
                              "Technical"
                          ).score ?? 0
                        ).toFixed(2)}
                        className="h-2"
                        indicatorclassName={getScoreBgColor(
                          (
                            sessionDetails?.CategoryScore?.find(
                              (item) =>
                                item.categoryAssignment.category
                                  .categoryName === "Technical"
                            ).score ?? 0
                          ).toFixed(2)
                        )}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Soft Skills</h3>
                        <span
                          className={`font-bold ${getScoreColor(
                            (
                              sessionDetails?.CategoryScore?.find(
                                (item) =>
                                  item.categoryAssignment.category
                                    .categoryName === "Soft"
                              ).score ?? 0
                            ).toFixed(2)
                          )}`}
                        >
                          {(
                            sessionDetails?.CategoryScore?.find(
                              (item) =>
                                item.categoryAssignment.category
                                  .categoryName === "Soft"
                            ).score ?? 0
                          ).toFixed(2)}
                        </span>
                      </div>
                      <Progress
                        value={(
                          sessionDetails?.CategoryScore?.find(
                            (item) =>
                              item.categoryAssignment.category.categoryName ===
                              "Soft"
                          ).score ?? 0
                        ).toFixed(2)}
                        className="h-2"
                        indicatorclassName={getScoreBgColor(
                          (
                            sessionDetails?.CategoryScore?.find(
                              (item) =>
                                item.categoryAssignment.category
                                  .categoryName === "Soft"
                            ).score ?? 0
                          ).toFixed(2)
                        )}
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="font-medium mb-3">Interviewer Feedback</h3>
                    {sessionhistory?.interviewFeedback?.feedbackText ? (
                      <div className="flex flex-col items-center w-full justify-center py-5 text-center border border-dashed border-muted-foreground rounded-lg">
                        <NotebookPen className="h-8 w-8 text-muted-foreground mb-3" />
                        <h3 className="text-base font-medium mb-2">
                          No Feedback Found
                        </h3>
                        <p className=" text-xs text-muted-foreground max-w-md">
                          The interviewer&apos;s notes will be available once
                          interviewr submit the feedback.
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-muted/30 h-full min-h-[150px] rounded-md">
                        <p>{sessionhistory?.interviewFeedback?.feedbackText}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              ) : (
                <div className="flex flex-col h-full items-center w-full justify-center text-center">
                  <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">
                    Interview Not Yet Completed
                  </h3>
                  <p className="text-muted-foreground max-w-md">
                    The assessment results will be available once the interview
                    is completed.{" "}
                    {sessionDetails?.interview?.startDate &&
                      `The interview is scheduled for ${" "}
                    ${new Date(
                      sessionDetails?.interview?.startDate
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}${" "}
                    at${" "}
                    ${new Date(
                      sessionDetails?.interview?.startDate
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    .`}
                  </p>
                </div>
              )}
            </Card>
          </div>

          <Card className="!bg-transparent">
            <CardHeader>
              <CardTitle>Detailed Assessment</CardTitle>
              <CardDescription>
                Breakdown of candidate&apos;s performance in different skill areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger
                    value="details"
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Candidate Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="assessment"
                    className="flex items-center gap-2"
                  >
                    <Star className="h-4 w-4" />
                    Assessment
                  </TabsTrigger>
                  <TabsTrigger
                    value="resume"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Resume & Questions
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column - Experience and Skills */}
                    <div className="md:col-span-2 space-y-6">
                      <Card className="!bg-transparent">
                        <CardHeader>
                          <CardTitle className="text-blue-400">
                            Experiences
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {experiences.length > 0 ? (
                            experiences.map((exp, index) => (
                              <div
                                key={index}
                                className="flex items-start gap-3"
                              >
                                <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div>
                                  <div className="font-medium">{exp.title}</div>
                                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                                    {/* <span>{exp.company}</span> */}
                                    {exp.company && (
                                      <>
                                        <span>{exp.company}</span>
                                        {/* <span className="w-1 h-1 rounded-full bg-muted-foreground inline-block"></span> */}
                                      </>
                                    )}
                                    <Badge
                                      variant="outline"
                                      className={
                                        new Date(exp.endDate) > new Date()
                                          ? "!text-blue-400 !border-blue-400"
                                          : "!text-green-400 !border-green-400"
                                      }
                                    >
                                      {new Date(exp.endDate) > new Date()
                                        ? "Ongoing"
                                        : "Completed"}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="flex flex-col items-center w-full justify-center py-12 text-center">
                              <FlaskConical className="h-16 w-16 text-muted-foreground mb-4" />
                              <h3 className="text-xl font-medium mb-2">
                                No Experience Found
                              </h3>
                              <p className="text-muted-foreground max-w-md">
                                The candidate&apos;s experience details will be
                                available once the interview is completed.
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <Card className="!bg-transparent">
                        <CardHeader>
                          <CardTitle className="text-orange-400">
                            Skill Highlights
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {skills.length > 0 ? (
                              skills.map((skill, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="px-3 py-1 text-sm"
                                >
                                   {typeof skill === "string" ? skill : skill.name} 
                                </Badge>
                              ))
                            ) : (
                              <div className="flex flex-col items-center w-full justify-center py-12 text-center">
                                <Brain className="h-16 w-16 text-muted-foreground mb-4" />
                                <h3 className="text-xl font-medium mb-2">
                                  No Skills Found
                                </h3>
                                <p className="text-muted-foreground max-w-md">
                                  The candidate&apos;s skill highlights will be
                                  available once the interview is completed.
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Right Column - Personal Details and Social Media */}
                    <div className="space-y-6">
                      <Card className="!bg-transparent">
                        <CardHeader>
                          <CardTitle>Personal Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <User className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div className="text-sm text-muted-foreground">
                                  Full Name
                                </div>
                                <div className="font-medium">
                                  {candidateDetails?.user?.firstName}{" "}
                                  {candidateDetails?.user?.lastName}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <Calendar className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div className="text-sm text-muted-foreground">
                                  Date of Birth
                                </div>
                                <div className="font-medium">
                                  {new Date(
                                    candidateDetails?.user?.dob
                                  ).toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })}
                                  <span className="text-sm text-muted-foreground ml-2">
                                    ({age} Years old)
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <User className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div className="text-sm text-muted-foreground">
                                  Gender
                                </div>
                                <div className="font-medium">
                                  {candidateDetails?.user?.gender
                                    ? candidateDetails?.user?.gender
                                        .charAt(0)
                                        .toUpperCase() +
                                      candidateDetails?.user?.gender
                                        .slice(1)
                                        .toLowerCase()
                                    : "not specified"}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <Mail className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div className="text-sm text-muted-foreground">
                                  Email
                                </div>
                                <div className="font-medium">
                                  {candidateDetails?.user?.email}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <Phone className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div className="text-sm text-muted-foreground">
                                  Phone
                                </div>
                                <div className="font-medium">
                                  {candidateDetails?.user?.contactNo
                                    ? candidateDetails?.user?.contactNo
                                    : "Not Provided"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="!bg-transparent">
                        <CardHeader>
                          <CardTitle>Social Media</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className={`flex items-center gap-3`}>
                                <div className="bg-[#b3b3b31a] rounded-md p-2">
                                  <Linkedin size={16} />
                                </div>
                                <div className="w-full">
                                  <p className="text-sm font-medium">
                                    LinkedIn
                                  </p>
                                  <p className="text-xs text-[#b3b3b3] max-w-[80%] whitespace-nowrap overflow-hidden text-ellipsis">
                                    {candidateDetails?.linkedInUrl
                                      ? candidateDetails?.linkedInUrl.replace(
                                          /^https?:\/\/(www\.)?/i,
                                          ""
                                        )
                                      : "linkedin.com/in/username"}
                                  </p>
                                </div>
                              </div>
                              {candidateDetails?.linkedInUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-accent relative"
                                  asChild
                                >
                                  <a
                                    href={candidateDetails?.linkedInUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink
                                      size={14}
                                      className=" text-yellow-400 absolute top-1/2 right-0 transform -translate-y-1/2"
                                    />
                                  </a>
                                </Button>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <div
                                className={`flex items-center gap-3 w-[80%]`}
                              >
                                <div className="bg-[#b3b3b31a] rounded-md p-2">
                                  <Github size={16} />
                                </div>
                                <div className="w-full">
                                  <p className="text-sm font-medium">Github</p>
                                  <p className="text-xs text-[#b3b3b3] max-w-[80%] whitespace-nowrap overflow-hidden text-ellipsis">
                                    {candidateDetails?.githubUrl
                                      ? candidateDetails?.githubUrl.replace(
                                          /^https?:\/\/(www\.)?/i,
                                          ""
                                        )
                                      : "github.com/username"}
                                  </p>
                                </div>
                              </div>
                              {candidateDetails?.githubUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-accent relative"
                                  asChild
                                >
                                  <a
                                    href={candidateDetails?.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink
                                      size={14}
                                      className=" text-yellow-400 absolute top-1/2 right-0 transform -translate-y-1/2"
                                    />
                                  </a>
                                </Button>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <div
                                className={`flex items-center gap-3 w-[80%]`}
                              >
                                <div className="bg-[#b3b3b31a] rounded-md p-2">
                                  <Facebook size={16} />
                                </div>
                                <div className=" w-full">
                                  <p className="text-sm font-medium">
                                    Facebook
                                  </p>
                                  <p className="text-xs text-[#b3b3b3] max-w-[80%] whitespace-nowrap overflow-hidden text-ellipsis">
                                    {candidateDetails?.facebookUrl
                                      ? candidateDetails?.facebookUrl.replace(
                                          /^https?:\/\/(www\.)?/i,
                                          ""
                                        )
                                      : "facebook username"}
                                  </p>
                                </div>
                              </div>
                              {candidateDetails?.facebookUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-accent relative"
                                  asChild
                                >
                                  <a
                                    href={candidateDetails?.facebookUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink
                                      size={14}
                                      className=" text-yellow-400 absolute top-1/2 right-0 transform -translate-y-1/2"
                                    />
                                  </a>
                                </Button>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <div
                                className={`flex items-center gap-3 w-[80%]`}
                              >
                                <div className="bg-[#b3b3b31a] rounded-md p-2">
                                  <FaXTwitter size={16} />
                                </div>
                                <div className="w-full">
                                  <p className="text-sm font-medium">X</p>
                                  <p className="text-xs text-[#b3b3b3] max-w-[80%] whitespace-nowrap overflow-hidden text-ellipsis">
                                    {candidateDetails?.twitterUrl
                                      ? candidateDetails?.twitterUrl.replace(
                                          /^https?:\/\/(www\.)?/i,
                                          ""
                                        )
                                      : "x.com/username"}
                                  </p>
                                </div>
                              </div>
                              {candidateDetails?.twitterUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-accent relative"
                                  asChild
                                >
                                  <a
                                    href={candidateDetails?.twitterUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink
                                      size={14}
                                      className=" text-yellow-400 absolute top-1/2 right-0 transform -translate-y-1/2"
                                    />
                                  </a>
                                </Button>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <div
                                className={`flex items-center gap-3 w-[80%]`}
                              >
                                <div className="bg-[#b3b3b31a] rounded-md p-2">
                                  <FaDiscord size={16} />
                                </div>
                                <div className="w-full">
                                  <p className="text-sm font-medium">Discord</p>
                                  <p className="text-xs text-[#b3b3b3] max-w-[80%] whitespace-nowrap overflow-hidden text-ellipsis">
                                    {candidateDetails?.discordUrl
                                      ? candidateDetails?.discordUrl.replace(
                                          /^https?:\/\/(www\.)?/i,
                                          ""
                                        )
                                      : "discord.com/username"}
                                  </p>
                                </div>
                              </div>
                              {candidateDetails?.discordUrl && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-accent relative"
                                  asChild
                                >
                                  <a
                                    href={candidateDetails?.discordUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink
                                      size={14}
                                      className=" text-yellow-400 absolute top-1/2 right-0 transform -translate-y-1/2"
                                    />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="assessment" className="space-y-6">
                  <Card className="!bg-transparent">
                    <CardHeader>
                      <CardTitle>Interview Results</CardTitle>
                      {sessionDetails?.interviewStatus ? (
                        sessionDetails?.interviewStatus === "completed" ? (
                          <CardDescription>
                            Completed on{" "}
                            {new Date(
                              sessionDetails?.interview?.endDate
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}{" "}
                            at{" "}
                            {new Date(
                              sessionDetails?.interview?.endDate
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </CardDescription>
                        ) : (
                          <CardDescription>
                            Scheduled for{" "}
                            {new Date(
                              sessionDetails?.interview?.startDate
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}{" "}
                            at{" "}
                            {new Date(
                              sessionDetails?.interview?.startDate
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </CardDescription>
                        )
                      ) : (
                        <span className=" text-gray-500 text-sm">
                          Not Scheduled Yet
                        </span>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {sessionDetails?.interviewStatus === "completed" ? (
                        <>
                          <Tabs
                            value={activeAssessmentTab}
                            onValueChange={setActiveAssesmentTab}
                          >
                            <TabsList className="grid grid-cols-2 mb-6">
                              <TabsTrigger
                                value="technical"
                                className="flex items-center gap-2"
                              >
                                <User className="h-4 w-4" />
                                Technical Skills
                              </TabsTrigger>
                              <TabsTrigger
                                value="soft"
                                className="flex items-center gap-2"
                              >
                                <Star className="h-4 w-4" />
                                Soft Skills{" "}
                              </TabsTrigger>
                            </TabsList>
                            <TabsContent
                              value="technical"
                              className="space-y-6"
                            >
                              <Card className="!bg-transparent">
                                <CardHeader>
                                  <CardTitle>Technical Skills</CardTitle>
                                  <CardDescription>
                                    Breakdown of candidate&apos;s performance in
                                    different skill areas
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex justify-between items-center">
                                    <h3 className="font-medium">
                                      Technical Skills
                                    </h3>
                                    <span
                                      className={`font-bold ${getScoreColor(
                                        (
                                          sessionDetails?.CategoryScore?.find(
                                            (item) =>
                                              item.categoryAssignment.category
                                                .categoryName === "Technical"
                                          ).score ?? 0
                                        ).toFixed(2)
                                      )}`}
                                    >
                                      {(
                                        sessionDetails?.CategoryScore?.find(
                                          (item) =>
                                            item.categoryAssignment.category
                                              .categoryName === "Technical"
                                        ).score ?? 0
                                      ).toFixed(2)}
                                    </span>
                                  </div>
                                  <Progress
                                    value={(
                                      sessionDetails?.CategoryScore?.find(
                                        (item) =>
                                          item.categoryAssignment.category
                                            .categoryName === "Technical"
                                      ).score ?? 0
                                    ).toFixed(2)}
                                    className="h-2"
                                    indicatorclassName={getScoreBgColor(
                                      (
                                        sessionDetails?.CategoryScore?.find(
                                          (item) =>
                                            item.categoryAssignment.category
                                              .categoryName === "Technical"
                                        ).score ?? 0
                                      ).toFixed(2)
                                    )}
                                  />
                                  <div className=" mt-5 w-full">
                                    {sessionDetails?.questions?.map(
                                      (question, index) => (
                                        <Card
                                          key={question.questionID}
                                          className="!bg-transparent mt-2 py-2"
                                        >
                                          <CardContent>
                                            <div className=" flex w-full justify-between items-center">
                                              <span className=" text-base">
                                                {question.questionText}
                                              </span>
                                              <span className=" text-base">
                                                23 / 25
                                              </span>
                                            </div>
                                            <div className=" w-full text-sm items-center text-gray-500">
                                              Answer:{" "}
                                              <span>
                                                {question.answer ||
                                                  "no given answer"}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-5">
                                              <Badge className="flex items-center gap-2 !bg-blue-500/20 !text-blue-500 !border-blue-500">
                                                <Star className="h-3 w-3" />
                                                <span className="font-bold">
                                                  {question.type
                                                    .toLowerCase()
                                                    .split("_")
                                                    .map(
                                                      (word) =>
                                                        word
                                                          .charAt(0)
                                                          .toUpperCase() +
                                                        word.slice(1)
                                                    )
                                                    .join(" ")}
                                                </span>
                                              </Badge>
                                              <Badge className="flex items-center gap-2 !bg-blue-500/20 !text-blue-500 !border-blue-500">
                                                <Clock className="h-4 w-4" />
                                                <span className="text-blue-500">
                                                  {
                                                    question.estimatedTimeMinutes
                                                  }{" "}
                                                  minutes
                                                </span>
                                              </Badge>
                                            </div>
                                          </CardContent>
                                        </Card>
                                      )
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            </TabsContent>
                            <TabsContent value="soft" className="space-y-6">
                              <Card className="!bg-transparent">
                                <CardHeader>
                                  <CardTitle>Soft Skills</CardTitle>
                                  <CardDescription>
                                    Breakdown of candidate&apos;s performance in soft
                                    skills areas like communication, teamwork,
                                    etc.
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex justify-between items-center">
                                    <h3 className="font-medium">Soft Skills</h3>
                                    <span
                                      className={`font-bold ${getScoreColor(
                                        (
                                          sessionDetails?.CategoryScore?.find(
                                            (item) =>
                                              item.categoryAssignment.category
                                                .categoryName === "Soft"
                                          ).score ?? 0
                                        ).toFixed(2)
                                      )}`}
                                    >
                                      {(
                                        sessionDetails?.CategoryScore?.find(
                                          (item) =>
                                            item.categoryAssignment.category
                                              .categoryName === "Soft"
                                        ).score ?? 0
                                      ).toFixed(2)}
                                    </span>
                                  </div>
                                  <Progress
                                    value={(
                                      sessionDetails?.CategoryScore?.find(
                                        (item) =>
                                          item.categoryAssignment.category
                                            .categoryName === "Soft"
                                      ).score ?? 0
                                    ).toFixed(2)}
                                    className="h-2"
                                    indicatorclassName={getScoreBgColor(
                                      (
                                        sessionDetails?.CategoryScore?.find(
                                          (item) =>
                                            item.categoryAssignment.category
                                              .categoryName === "Soft"
                                        ).score ?? 0
                                      ).toFixed(2)
                                    )}
                                  />
                                  <div className=" mt-5 w-full">
                                    {categoryMarks.map((category) => (
                                      <Card
                                        key={category.id}
                                        className="!bg-transparent mt-3"
                                      >
                                        <CardContent>
                                          <div className="my-2">
                                            <div className="flex justify-between items-center">
                                              <h3 className="font-medium">
                                                {category.name}
                                              </h3>
                                              <span
                                                className={`font-bold ${getScoreColor(
                                                  (
                                                    category.percentage ?? 0
                                                  ).toFixed(2)
                                                )}`}
                                              >
                                                {(
                                                  category.percentage ?? 0
                                                ).toFixed(2)}
                                              </span>
                                            </div>
                                            <Progress
                                              value={(
                                                category.percentage ?? 0
                                              ).toFixed(2)}
                                              className="h-2"
                                              indicatorclassName={getScoreBgColor(
                                                (
                                                  category.percentage ?? 0
                                                ).toFixed(2)
                                              )}
                                            />
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            </TabsContent>
                          </Tabs>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                          <h3 className="text-xl font-medium mb-2">
                            Interview Not Yet Completed
                          </h3>
                          <p className="text-muted-foreground max-w-md">
                            The assessment results will be available once the
                            interview is completed.{" "}
                            {sessionDetails?.interview?.startDate &&
                              `The interview is scheduled for ${" "}
                    ${new Date(
                      sessionDetails?.interview?.startDate
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}${" "}
                    at${" "}
                    ${new Date(
                      sessionDetails?.interview?.startDate
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    .`}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {candidateDetails.status === "Completed" && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Detailed Assessment</CardTitle>
                        <CardDescription>
                          Breakdown of candidate&apos;s performance in different
                          skill areas
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="technical" className="w-full">
                          <TabsList className="grid grid-cols-2 mb-6">
                            <TabsTrigger
                              value="technical"
                              className="flex items-center gap-2"
                            >
                              <Star className="h-4 w-4" />
                              Technical Skills
                            </TabsTrigger>
                            <TabsTrigger
                              value="soft"
                              className="flex items-center gap-2"
                            >
                              <User className="h-4 w-4" />
                              Soft Skills
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="technical" className="space-y-6">
                            {candidateDetails.technicalSkills.map(
                              (skill, index) => (
                                <div key={index} className="space-y-3">
                                  <div className="flex justify-between items-center">
                                    <h3 className="font-medium">
                                      {skill.name}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`font-bold ${getScoreColor(
                                          (skill.score ?? 0).toFixed(2)
                                        )}`}
                                      >
                                        {(skill.score ?? 0).toFixed(2)}
                                      </span>
                                      <span className="text-muted-foreground">
                                        / {skill.maxScore}
                                      </span>
                                    </div>
                                  </div>
                                  <Progress
                                    value={(skill.score / skill.maxScore) * 100}
                                    className="h-2"
                                    indicatorclassName={getScoreBgColor(
                                      skill.score
                                    )}
                                  />
                                  <div className="p-3 bg-muted/30 rounded-md">
                                    <div className="flex items-start gap-2">
                                      <Check className="h-4 w-4 mt-1 text-muted-foreground" />
                                      <p className="text-sm">{skill.notes}</p>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </TabsContent>

                          <TabsContent value="soft" className="space-y-6">
                            {candidateDetails.softSkills.map((skill, index) => (
                              <div key={index} className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <h3 className="font-medium">{skill.name}</h3>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`font-bold ${getScoreColor(
                                        skill.score
                                      )}`}
                                    >
                                      {skill.score}
                                    </span>
                                    <span className="text-muted-foreground">
                                      / {skill.maxScore}
                                    </span>
                                  </div>
                                </div>
                                <Progress
                                  value={(skill.score / skill.maxScore) * 100}
                                  className="h-2"
                                  indicatorclassName={getScoreBgColor(
                                    skill.score
                                  )}
                                />
                                <div className="p-3 bg-muted/30 rounded-md">
                                  <div className="flex items-start gap-2">
                                    <Check className="h-4 w-4 mt-1 text-muted-foreground" />
                                    <p className="text-sm">{skill.notes}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="resume" className="space-y-6">
                  <Card className="!bg-transparent">
                    <CardHeader>
                      <CardTitle>Resume</CardTitle>
                      <CardDescription>
                        Upload and view candidate&apos;s resume
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {documentAnalizedData.url ? (
                        <div className="space-y-6">
                          {sessionDetails?.candidate?.resumeURL ? (
                            <>
                              <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium">
                                  Resume Analyze
                                </h3>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-2"
                                >
                                  <Download className="h-4 w-4" />
                                  Download
                                </Button>
                              </div>
                              <div className=" bg-black/90 flex items-center justify-center">
                                <iframe
                                  src={`${sessionDetails?.candidate?.resumeURL}`}
                                  className=" overflow-x-hidden rounded-lg mt-2"
                                  width="100%"
                                  height="700px"
                                  style={{ border: "none" }}
                                  title="PDF Viewer"
                                />
                              </div>
                              <Card className="!bg-transparent !border-blue-500">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-blue-500 flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-blue-500" />
                                    Resume Analysis
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                  <div>
                                    <h4 className="text-lg font-medium mb-2">
                                      Summary
                                    </h4>
                                    <p className="text-muted-foreground text-sm">
                                      {documentAnalizedData.summary}
                                    </p>
                                  </div>

                                  {documentAnalizedData.contactInfo && (
                                    <div>
                                      <h4 className="text-lg font-medium mb-2">
                                        Contact Information
                                      </h4>
                                      {documentAnalizedData.contactInfo
                                        .phone && (
                                        <div className="flex items-start gap-3  mt-2">
                                          <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                                          <div className="font-medium">
                                            {
                                              documentAnalizedData.contactInfo
                                                .phone
                                            }
                                          </div>
                                        </div>
                                      )}
                                      {documentAnalizedData.contactInfo
                                        .linkedin && (
                                        <div className="flex items-start gap-3  mt-2">
                                          <LinkedinIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                                          <div className="font-medium">
                                            {
                                              documentAnalizedData.contactInfo
                                                .linkedin
                                            }
                                          </div>
                                        </div>
                                      )}
                                      {documentAnalizedData.contactInfo
                                        .github && (
                                        <div className="flex items-start gap-3  mt-2">
                                          <GithubIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                                          <div className="font-medium">
                                            {
                                              documentAnalizedData.contactInfo
                                                .github
                                            }
                                          </div>
                                        </div>
                                      )}
                                      {documentAnalizedData.contactInfo
                                        .email && (
                                        <div className="flex items-start gap-3 mt-2">
                                          <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                                          <div className="font-medium">
                                            {
                                              documentAnalizedData.contactInfo
                                                .email
                                            }
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  <div>
                                    <h4 className="text-lg font-medium mb-2">
                                      Education
                                    </h4>
                                    <div className="space-y-2">
                                      {documentAnalizedData.education.map(
                                        (edu, index) => (
                                          <div
                                            key={index}
                                            className="flex items-start gap-3"
                                          >
                                            <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                                            <div>
                                              <div className="font-medium">
                                                {edu.title}
                                              </div>
                                              <div className="text-sm text-muted-foreground">
                                                {edu.institution} -{" "}
                                                {new Date(
                                                  edu.startDate
                                                ).getFullYear()}{" "}
                                                -{" "}
                                                {edu.endDate
                                                  ? new Date(
                                                      edu.endDate
                                                    ).getFullYear()
                                                  : "Present"}
                                              </div>
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="text-lg font-medium mb-2">
                                      Experience
                                    </h4>
                                    <div className="space-y-3">
                                      {documentAnalizedData.experience
                                        .slice(0, 5)
                                        .map((exp, index) => (
                                          <div
                                            key={index}
                                            className="flex items-start gap-3"
                                          >
                                            <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                                            <div>
                                              <div className="font-medium">
                                                {exp.jobTitle}
                                                <Badge
                                                  variant="outline"
                                                  className={
                                                    exp.status === "Ongoing"
                                                      ? "!text-blue-400 !border-blue-400 ml-2"
                                                      : "!text-green-400 !border-green-400 ml-2"
                                                  }
                                                >
                                                  {exp.status}
                                                </Badge>
                                              </div>
                                              <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                <span>
                                                  {new Date(
                                                    exp.startDate
                                                  ).getFullYear()}{" "}
                                                  -{" "}
                                                  {exp.endDate
                                                    ? new Date(
                                                        exp.endDate
                                                      ).getFullYear()
                                                    : "Present"}
                                                </span>

                                                {exp.company && (
                                                  <>
                                                    <span className="w-1 h-1 rounded-full bg-muted-foreground inline-block"></span>
                                                    <span>{exp.company}</span>
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="text-lg font-medium mb-2">
                                      Skills
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {documentAnalizedData.skills.map(
                                        (skill, index) => (
                                          <Badge
                                            key={index}
                                            variant="secondary"
                                            className="px-3 py-1 text-sm !bg-gray-500/20 !border-gray-600 !text-gray-300"
                                          >
                                            {skill}
                                          </Badge>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              <Card className="mt-8 !border-blue-500">
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2 text-blue-500">
                                    <Sparkles className="h-5 w-5 text-blue-500" />
                                    AI-Generated Interview Questions
                                  </CardTitle>
                                  <CardDescription>
                                    Questions tailored to the candidate&apos;s
                                    profile based on their resume
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-8">
                                    <h3 className="text-lg font-medium flex items-center gap-2">
                                      <Star className="h-5 w-5 text-blue-400" />
                                      Technical Skills
                                    </h3>

                                    {documentAnalizedData.questions.technical.map(
                                      (question, qIndex) => (
                                        <div key={qIndex} className="group">
                                          <div className="flex items-start gap-3 p-3 rounded-md hover:bg-accent/50 transition-colors">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                                              {qIndex + 1}
                                            </div>
                                            <div className="flex-1">
                                              <p>{question.question}</p>
                                            </div>
                                            <AlertDialog>
                                              <AlertDialogTrigger
                                                className={` opacity-0 group-hover:opacity-100 transition-opacity`}
                                              >
                                                <Plus className="!h-6 !w-6 text-green-500" />
                                              </AlertDialogTrigger>

                                              <AlertDialogContent>
                                                <AlertDialogHeader>
                                                  <AlertDialogTitle>
                                                    Are you sure you want to
                                                    feed this question to the
                                                    candidate?
                                                  </AlertDialogTitle>
                                                  <AlertDialogDescription>
                                                    Once you add this question
                                                    to the candidate&apos;s questionnaire, you cannot
                                                    undo this action.
                                                  </AlertDialogDescription>
                                                </AlertDialogHeader>

                                                <AlertDialogFooter>
                                                  <AlertDialogCancel>
                                                    Cancel
                                                  </AlertDialogCancel>
                                                  <AlertDialogAction
                                                    onClick={() =>
                                                      handleAddQuestion(
                                                        question.question,
                                                        question.type,
                                                        question.estimatedTimeInMinutes
                                                      )
                                                    }
                                                    className="h-[40px] font-medium"
                                                  >
                                                    Add Question
                                                  </AlertDialogAction>
                                                </AlertDialogFooter>
                                              </AlertDialogContent>
                                            </AlertDialog>
                                          </div>
                                        </div>
                                      )
                                    )}
                                    <h3 className="text-lg font-medium flex items-center gap-2">
                                      <User className="h-5 w-5 text-amber-400" />
                                      Soft Skills & Leadership Skills
                                    </h3>

                                    {documentAnalizedData.questions.soft_skills.map(
                                      (question, qIndex) => (
                                        <div key={qIndex} className="group">
                                          <div className="flex items-start gap-3 p-3 rounded-md hover:bg-accent/50 transition-colors">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                                              {qIndex + 1}
                                            </div>
                                            <div className="flex-1">
                                              <p>{question.question}</p>
                                              <p className=" text-muted-foreground text-sm">
                                                {question.context}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    )}

                                    <div className="flex justify-end">
                                      <Button
                                        variant="outline"
                                        className="gap-2"
                                      >
                                        <Download className="h-4 w-4" />
                                        Export Questions
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                              {/* )} */}
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-muted-foreground/20 rounded-lg">
                              <Ghost className="h-16 w-16 text-muted-foreground mb-4" />
                              <h3 className="text-xl font-medium mb-2">
                                Resume Not Uploaded
                              </h3>
                              <p className="text-muted-foreground max-w-md">
                                Candidate&apos;s is not uploaded the resume yet.
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                          <h3 className="text-xl font-medium mb-2">
                            No Resume Uploaded
                          </h3>
                          <p className="text-muted-foreground text-center max-w-md mb-6">
                            Upload the candidate&apos;s resume to view it here and
                            generate AI-powered interview questions.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

    </div>
  );
}

export default InterviewRoomAnalizerCandidateProfile;
