"use client";
import React, { use, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import SortableLinks from "@/components/SortableLinks";
import { Card, CardContent } from "@/components/ui/card";
import { FaDotCircle } from "react-icons/fa";
import {
  Calendar1,
  Check,
  CirclePlus,
  Clock,
  Mic,
  Sparkles,
  UserCircle2,
  Video,
  VideoIcon,
  Wifi,
  X,
} from "lucide-react";
//API
import { getInterviewSessionById } from "@/lib/api/interview-session";
import QuestionDisplayCard from "@/components/company/question-display-card";
import CreateQuestionModal from "@/components/company/create-question-modal";
import GenerateQuestionModal from "@/components/company/generate-question-modal";
import Loading from "@/app/loading";
import { usePathname, useRouter, redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { importQuestions } from "@/lib/api/question";
import Link from "next/link";
import { reorderInterviewFlow } from "@/lib/api/interview";
import { Dot } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

function InterviewSessionPreviewPage({ params }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [sessionId, setSessionId] = useState(null);
  const [sessionDetails, setSessionDetails] = useState({});
  const [interviewId, setInterviewId] = useState(null);
  const [isQuestionEdit, setIsQuestionEdit] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [tab, setTab] = useState("technical");
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [items, setItems] = useState([]);

  const { toast } = useToast();
  const router = useRouter();
  const requirements = [
    {
      icon: <UserCircle2 className="h-5 w-5" />,
      text: "Complete your profile information",
      subtext: "Ensure your profile details are up-to-date",
    },
    {
      icon: <Wifi className="h-5 w-5" />,
      text: "Stable internet connection",
      subtext: "Minimum 1Mbps upload and download speed",
    },
    {
      icon: <Video className="h-5 w-5" />,
      text: "Camera is ready",
      subtext: "Find a well-lit, professional background",
    },
    {
      icon: <Mic className="h-5 w-5" />,
      text: "Microphone is working",
      subtext: "Test your audio in a quiet environment",
    },
  ];

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
          setInterviewId(response.data.interview.interviewID);
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
  }, [sessionId, generateModalOpen, isQuestionEdit, createModalOpen]);

  useEffect(() => {
    console.log("interviewId", interviewId);
  }, [interviewId]);

  useEffect(() => {
    if (!sessionDetails || !sessionDetails.CategoryScore) return;
    const tabData = sessionDetails.CategoryScore.sort(
      (a, b) => a.order - b.order
    ).map((category) => ({
      name: category.categoryAssignment.category.categoryName,
      id: category.categoryAssignment.category.categoryId,
      color: category.categoryAssignment.category.color,
    }));
    setItems(tabData);
  }, [sessionDetails]);

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
      if (
        sessionDetails.interview.interviewMedium === "PHYSICAL" &&
        sessionDetails.interview.isWithDevice === false
      ) {
        router.push(
          `/physical-interview/interview-room-analiyzer/${sessionId}?companyID=${userId}&sessionID=${sessionId}`
        );
      } else {
        router.push(
          `/interview-room-analiyzer/${sessionId}?companyID=${userId}&sessionID=${sessionId}`
        );
      }
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

  const handleImportQuestions = async (e) => {
    e.preventDefault();
    try {
      const response = await importQuestions(sessionId);
      if (response) {
        toast({
          title: "Success!",
          description: `Questions Imported Successfully`,
        });
        setIsQuestionEdit(!isQuestionEdit);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Error importing questions: ${error}`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
  };

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((prevItems) => {
        const oldIndex = prevItems.findIndex((item) => item.id === active.id);
        const newIndex = prevItems.findIndex((item) => item.id === over.id);

        const updatedArray = arrayMove(prevItems, oldIndex, newIndex);

        hanleChangeFlow(updatedArray);

        return updatedArray;
      });
    }
  }

  const hanleChangeFlow = async (array) => {
    try {
      const updatedArray = {
        sessionId,
        categories: array.map((item, index) => {
          return {
            categoryId: item.id,
            order: index,
          };
        }),
      };
      const response = await reorderInterviewFlow(updatedArray);
      if (response) {
      }
    } catch (err) {
      if (err.response) {
        const { data } = err.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `ordering Faild: ${data.message}`,
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
        <div className="w-full">
          <div className="px-9 py-4 w-full max-w-[1500px] bg-black mx-auto">
            <h1 className="text-3xl font-bold tracking-tight">
              Session Preview
            </h1>

            <div className="flex flex-col md:flex-col p-5 w-ful border-2 border-gray-700 rounded-lg mt-5">
              <div className="flex flex-col md:flex-row justify-between md:justify-between  w-full !bg-[#140d20] rounded-lg h-48 md:h-24 p-4">
                <div className="w-full md:w-[50%] ">
                  <div className=" flex justify-start items-center gap-3">
                    <div className="flex flex-col">
                      <h1 className=" text-2xl font-semibold">
                        {sessionDetails?.candidate?.user?.firstName || ""}{" "}
                        {sessionDetails?.candidate?.user?.lastName || ""}
                      </h1>
                      <h1 className=" text-base font-semibold text-gray-500">
                        {sessionDetails?.candidate?.user?.email || ""}
                      </h1>
                    </div>
                    <Link
                      href={`/interviews/${interviewId}/candidate-details?candidateId=${encodeURIComponent(
                        sessionDetails?.candidateId
                      )}`}
                      className=" text-xs border-2 border-black hover:text-blue-500 hover:border-blue-500 text-white bg-[#191e2b] rounded-xs py-1 px-1 cursor-pointer rounded-xl"
                    >
                      More about Candidatre
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-2 items-center justify-between">
                  {/* <button
                    type="button"
                    onClick={interviewStart}
                    className="h-12 min-w-[150px] md:w-[170px] w-full cursor-pointer rounded-lg text-center text-base text-black bg-darkred font-semibold bg-[#7b3aed]"
                  >
                    Start Interview
                  </button> */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="dark:bg-[#7b3aed] dark:hover:bg-[#7c3aeddc] dark:text-white"
                        size="sm"
                      >
                        <VideoIcon className="h-4 w-4 mr-1" />
                        {sessionDetails?.interviewStatus === "ongoing"
                          ? "Re-Join Interview"
                          : "Join Interview"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-md bg-gray-900 border-gray-800">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl text-gray-100">
                          Ready to Join the Interview?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-400">
                          Please ensure you meet all requirements before joining
                          the live interview session.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <div className="space-y-4 my-4">
                        {requirements.map((req, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700"
                          >
                            <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
                              {req.icon}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-200">
                                {req.text}
                              </h4>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {req.subtext}
                              </p>
                            </div>
                            <Check className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                          </div>
                        ))}
                      </div>

                      <AlertDialogFooter className="sm:space-x-2 justify-between">
                        <AlertDialogCancel className="bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:text-gray-100">
                          <X className="h-4 w-4 mr-2" />
                          Not Ready Yet
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={interviewStart}
                          className="bg-emerald-600 text-white hover:bg-emerald-500"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Join Interview
                        </AlertDialogAction>
                      </AlertDialogFooter>

                      <div className="mt-4 text-center">
                        <p className="text-xs text-gray-500">
                          By joining, you agree to our interview guidelines and
                          code of conduct. Your session may be recorded for
                          quality assurance.
                        </p>
                      </div>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <div className="p-4 flex flex-row w-full justify-between items-center mt-10  rounded-lg md:mt-0">
                <div className="flex flex-row gap-2 items-center">
                  <Calendar1 size={20} />
                  <div className="flex flex-col">
                    <p className=" text-base text-white">Scheduled Date: </p>
                    <p className="text-gray-400">
                      {" "}
                      {new Date(
                        sessionDetails?.scheduledDate
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }) || ""}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <Clock size={20} />
                  <div className="flex flex-col">
                    <p className=" text-base text-white">Scheduled Time: </p>
                    <p className="text-gray-400">
                      {" "}
                      {new Date(
                        sessionDetails?.scheduledAt
                      ).toLocaleTimeString() || ""}
                    </p>
                  </div>
                </div>
                {/* <div className="flex flex-row gap-2 items-center">
                  <Dot size={38} />
                  <div className="flex flex-col">
                    <p className=" text-base text-white">
                      Type:{" "}
                    </p>
                    <p className="text-gray-400">  {sessionDetails?.interviewCategory || ""}</p>
                  </div>
                </div> */}
              </div>
            </div>

            <div className="flex md:flex-row flex-col w-full justify-between">
              <div className=" bg-slate-500/10 p-5 rounded-lg w-full">
                <div className="flex justify-between flex-col md:flex-row gap-3 w-full">
                  <div className="flex bg-slate-600/20 w-fit p-1 rounded-lg align-center gap-2">
                    <button
                      onClick={() => setTab("technical")}
                      className={`text-xs md:text-sm px-4 py-1.5 rounded-lg ${
                        tab === "technical" ? "bg-gray-800" : ""
                      } `}
                    >
                      Technical
                    </button>
                    <button
                      onClick={() => setTab("others")}
                      className={` text-xs md:text-sm px-4 py-1.5 rounded-lg ${
                        tab === "others" ? "bg-gray-800" : ""
                      } `}
                    >
                      Soft
                    </button>
                  </div>
                  <div
                    className={`${
                      tab === "technical" ? "block" : "hidden"
                    } w-full p-1 md:p-2 flex items-center justify-end gap-3`}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGenerateModalOpen(true)}
                      className="flex items-center gap-1 text-blue-500 !border-blue-500/50 hover:!bg-blue-500/10"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Generate with AI</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCreateModalOpen(true)}
                      className="flex items-center gap-1 !text-black !bg-white"
                    >
                      <CirclePlus className="mr-2" size={15} />
                      Add Question
                    </Button>
                  </div>
                </div>

                <div className=" flex justify-between items-start">
                  {tab === "technical" ? (
                    <div className=" w-full mt-3 border-gray-700/20">
                      <div className=" w-full flex flex-col md:flex-row items-center justify-between">
                        <h1 className=" text-2xl font-semibold text-left w-full">
                          Questions
                        </h1>
                      </div>
                      {sessionDetails.questions?.length > 0 ? (
                        sessionDetails.questions.map((question, index) => (
                          <QuestionDisplayCard
                            forSession={true}
                            key={index}
                            index={index}
                            question={question}
                            isQuestionEdit={isQuestionEdit}
                            setIsQuestionEdit={setIsQuestionEdit}
                          />
                        ))
                      ) : (
                        <div className=" w-full flex flex-col items-center justify-center min-h-[300px] gap-2">
                          <p>No questions available.</p>
                          <button
                            className=" h-11 min-w-[160px] md:mt-0 px-5 mt-5 cursor-pointer border-2 hover:bg-white/30 border-white rounded-lg text-center text-white font-semibold"
                            onClick={handleImportQuestions}
                          >
                            Import questions
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className=" w-[68%] mt-3 border-r-2 border-gray-700/20">
                      {sessionDetails.CategoryScore.filter(
                        (category) =>
                          category.categoryAssignment.category.categoryName !==
                          "Technical"
                      ).map((category) => (
                        <div
                          key={category.categoryScoreId}
                          className=" w-full mt-5 "
                        >
                          <h1 className=" text-2xl font-semibold text-left w-full">
                            <FaDotCircle className=" text-blue-700 text-xs inline-block mr-2" />
                            {category.categoryAssignment.category.categoryName}{" "}
                            : {category.categoryAssignment.percentage}%{" "}
                          </h1>

                          <div className=" px-8">
                            {category.categoryAssignment.SubCategoryAssignment.map(
                              (subCategory) => (
                                <div
                                  key={subCategory.id}
                                  className=" mt-3 px-5 py-2 rounded-lg border-2 border-gray-600 text-gray-400 bg-gray-500/20"
                                >
                                  <h1 className=" font-semibold">
                                    {subCategory.name}
                                  </h1>
                                  <p>{subCategory.percentage}%</p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="md:w-1/3 w-full mt-3 border border-gray-800 rounded-lg p-4">
                <h1 className=" text-2xl font-semibold text-left w-full">
                  Question arrangement
                </h1>
                <h5 className="text-sm font-semibold text-left text-gray-300">
                  Drag to reorder questions for the interview
                </h5>
                <Card className="w-full !border-0 !bg-transparent md:max-w-lg">
                  <CardContent className="grid gap-4 p-5 bg-gray-700/20 mt-5 text-gray-400 border-2 border-gray-700 rounded-lg">
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                      modifiers={[
                        restrictToVerticalAxis,
                        restrictToParentElement,
                      ]}
                    >
                      <SortableContext
                        items={items}
                        strategy={verticalListSortingStrategy}
                      >
                        {items.map((item) => (
                          <SortableLinks key={item.id} id={item} />
                        ))}
                      </SortableContext>
                    </DndContext>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          {createModalOpen && (
            <CreateQuestionModal
              forSession={true}
              id={sessionId}
              setCreateModalOpen={setCreateModalOpen}
            />
          )}
          {generateModalOpen && (
            <GenerateQuestionModal
              forSession={true}
              details={sessionDetails}
              setGenerateModalOpen={setGenerateModalOpen}
            />
          )}
        </div>
      </SidebarInset>
    </>
  );
}

export default InterviewSessionPreviewPage;
