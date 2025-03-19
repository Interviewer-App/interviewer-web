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
import { jsPDF } from 'jspdf';
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

import { FaDotCircle } from "react-icons/fa";
import { getInterviewSessionScoreById } from "@/lib/api/answer";
import Loading from "@/app/loading";
import { usePathname, useRouter, redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { Award, Building, Calendar, CheckCircle, Clock, Download, HelpCircle, Lightbulb, List, MessageCircle, Target, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  const handleDownload = () => {
    try {
      // Create a new PDF document
      const doc = new jsPDF();

      // Set title and basic information
      doc.setFontSize(22);
      doc.text('Interview Results Certificate', 105, 20, { align: 'center' });

      doc.setFontSize(14);
      doc.text('TechLead Position - Technical Interview', 105, 30, { align: 'center' });
      doc.text(`Interview ID: ${sessionId || 'N/A'}`, 105, 40, { align: 'center' });
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 105, 50, { align: 'center' });

      // Add a decorative line
      doc.setLineWidth(0.5);
      doc.line(20, 55, 190, 55);

      // Calculate total score
      const totalScore = sessionDetails.questions.reduce((sum, q) => sum + q.score, 0);
      const maxScore = sessionDetails.questions.reduce((sum, q) => sum + q.maxScore, 0);
      const overallPercentage = Math.round((totalScore / maxScore) * 100);

      // Add summary
      doc.setFontSize(16);
      doc.text('Summary', 20, 70);

      doc.setFontSize(12);
      doc.text(`Overall Score: ${totalScore}/${maxScore} (${overallPercentage}%)`, 20, 80);
      doc.text('Status: Completed', 20, 90);

      // Add questions and scores
      doc.setFontSize(16);
      doc.text('Questions & Scores', 20, 110);

      let yPos = 120;
      sessionDetails.questions.forEach((question, index) => {
        // Ensure we don't go off the page
        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(12);
        doc.text(`${index + 1}. ${question.id} (${question.type})`, 20, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.text(`Score: ${question.score}/${question.maxScore}`, 25, yPos);
        yPos += 15;
      });

      // Add a footer
      const finalY = yPos + 20;
      doc.setLineWidth(0.5);
      doc.line(20, finalY, 190, finalY);
      doc.setFontSize(10);
      doc.text('This certificate was generated automatically and serves as a record of your interview performance.', 105, finalY + 10, { align: 'center' });

      // Save the PDF
      doc.save(`interview-results-${sessionId || 'certificate'}.pdf`);

      // Show success toast
      toast({
        title: "Success",
        description: "Your interview results have been downloaded",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Failed",
        description: "There was a problem downloading your results",
        variant: "destructive",
      });
    }
  };

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
        {/* <h1 className=" text-4xl font-semibold">Joined Interviews Details</h1> */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{sessionDetails?.interview?.jobTitle || ""} Position</h1>
            <p className="text-muted-foreground">{sessionDetails?.interview?.interviewCategory || ""} Interview</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="gap-2" onClick={handleDownload}>
              <Download size={16} />
              Download Certificate
            </Button>
            <Button className="gap-2">
              <MessageCircle size={16} />
              Contact Recruiter
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full mb-6">
          <TabsList className="dark:bg-[#000] border-b border-border w-full justify-start rounded-none h-auto p-0 mb-6">
            <TabsTrigger
              value="overview"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-11"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="questions"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-11"
            >
              Questions
            </TabsTrigger>
            {/* <TabsTrigger
              value="feedback"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-11"
            >
              Feedback
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-11"
            >
              Resources
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* <InterviewOverviewTab overallScore={7.5} /> */}
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card className="border-t-4 border-t-primary">
                    <CardHeader className="pb-3">
                      <CardTitle>Interview Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                          <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Date</p>
                            <p className="font-medium">{new Date(
                              sessionDetails?.scheduledDate
                            ).toLocaleDateString("en-GB",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }) || ""}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Time</p>
                            <p className="font-medium">{new Date(
                              sessionDetails?.scheduledAt
                            ).toLocaleTimeString() || ""}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Company</p>
                            <p className="font-medium">Tech Solutions Inc.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <List className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Total Questions</p>
                            <p className="font-medium">{sessionDetails?.questions?.length || 0}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Target className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge className="mt-1" variant="outline">Completed</Badge>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Award className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Test Score</p>
                            <p className="font-medium">{parseFloat(sessionScoreDetails?.score).toFixed(2) || 0} / 100</p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium mb-2">Feedback</h3>
                        <div className="bg-muted/30 p-4 rounded-md border border-border">
                          <p className="text-muted-foreground italic">
                            {feedbackDescription ? (<>{feedbackDescription.map((detail) => (
                              <span key={detail.feedbackId}>{detail.feedbackText}</span>
                            ))}</>) : (<span>No feedback available</span>)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card className="border-t-4 border-t-primary h-full">
                    <CardHeader className="pb-3">
                      <CardTitle>Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex flex-col items-center justify-center">
                        <div className="relative w-40 h-40 mb-4">
                          <CirculerProgress
                            marks={parseFloat(sessionScoreDetails?.score).toFixed(2) || 0}
                            catorgory="Test score"
                          />
                          {/* <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <span className="text-4xl font-bold">{parseFloat(sessionScoreDetails?.score).toFixed(2) || 0}</span>
                              <p className="text-sm text-muted-foreground">Test Score</p>
                            </div>
                          </div> */}
                          {/* <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                            <circle cx="60" cy="60" r="54" fill="none" stroke="hsla(var(--muted))" strokeWidth="12" />
                            <circle
                              cx="60"
                              cy="60"
                              r="54"
                              fill="none"
                              stroke="hsla(var(--primary))"
                              strokeWidth="12"
                              strokeDasharray={`${(sessionScoreDetails?.score / 10) * 339.292} 339.292`}
                              strokeLinecap="round"
                            />
                          </svg> */}
                        </div>

                        <div className="w-full mt-4 space-y-3">
                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <span>Questions Completed</span>
                              <span className="font-medium">{sessionScoreDetails?.numberOfAnswers || 0}/{sessionDetails?.questions?.length || 0}</span>
                            </div>
                            {/* <Progress value={100} className="h-2" /> */}
                          </div>

                          <div>
                            <div className="flex justify-between mb-1 text-sm">
                              <span>Accuracy</span>
                              <span className="font-medium">{parseFloat(sessionScoreDetails?.score).toFixed(2) || 0}%</span>
                            </div>
                            {/* <Progress value={75} className="h-2" /> */}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <ThumbsUp className="h-5 w-5 text-emerald-500" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Strong problem-solving approach</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Good understanding of algorithms</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>Clear communication skills</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-500" />
                      Areas for Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <HelpCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        <span>Consider edge cases more thoroughly</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <HelpCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        <span>Provide more detailed explanations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <HelpCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        <span>Structure responses more methodically</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </>
          </TabsContent>

          <TabsContent value="questions" className="space-y-6">
            {/* <InterviewQuestionsTab /> */}
            <Card>
              <CardHeader>
                <CardTitle>Interview Questions</CardTitle>
                <CardDescription>
                  Review your answers and feedback for each question
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8"  >
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
              </CardContent>
            </Card>
            {/* <div className="mt-5 bg-slate-500/10 p-5 rounded-lg">
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
            </div> */}
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            {/* <InterviewFeedbackTab /> */}
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            {/* <InterviewResourcesTab /> */}
          </TabsContent>
        </Tabs>

        {/* <div className=" flex flex-col md:flex-row justify-start md:justify-between mt-5 w-full bg-gray-500/20 rounded-lg p-8">
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
                  Test score: {parseFloat(sessionScoreDetails?.score).toFixed(2) || 0}
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
              {parseFloat(sessionScoreDetails?.score).toFixed(2) || 0}% Accurate with expected
              answers
            </p>
            <p className=" text-sm text-gray-500 text-center">
              Showing Test Score for{" "}
              {sessionScoreDetails?.numberOfAnswers || 0} out of{" "}
              {sessionDetails?.questions?.length || 0} question
            </p>
          </div>
        </div> */}


      </div>
    </SidebarInset>
  );
};

export default JoinedInterviewsDetails;
