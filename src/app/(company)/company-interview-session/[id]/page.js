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
    const tabData = sessionDetails.CategoryScore.sort((a, b) => a.order - b.order)
    .map((category) => ({
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
        <div className=" w-full">
          <div className="px-9 py-4 w-full max-w-[1500px] bg-black mx-auto">
            <h1 className=" text-4xl font-semibold">Session Preview</h1>
            <div className=" flex flex-col md:flex-row items-center justify-start md:justify-between mt-5 w-full bg-gray-500/20 rounded-lg p-5">
              <div className=" w-full md:w-[50%] ">
                <div className=" flex justify-start items-center gap-3">
                  <h1 className=" text-3xl font-semibold">
                    {sessionDetails?.candidate?.user?.firstName || ""}{" "}
                    {sessionDetails?.candidate?.user?.lastName || ""}
                  </h1>
                  <Link
                    href={`/interviews/${interviewId}/candidate-details?candidateId=${encodeURIComponent(
                      sessionDetails?.candidateId
                    )}`}
                    className=" text-xs border-2 border-blue-600 hover:text-blue-500 hover:border-blue-500  text-blue-600 bg-blue-500/20 rounded-full px-5 py-1 cursor-pointer"
                  >
                    More about Candidatre
                  </Link>
                </div>
                <h1 className=" text-base text-gray-500">
                  {sessionDetails?.candidate?.user?.email || ""}
                </h1>
                <p className=" text-base pt-5 text-gray-400">
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
                <p className=" text-base pt-1 text-gray-400">
                  Type: {sessionDetails?.interviewCategory || ""} Interview
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

            <div className="mt-5 bg-slate-500/10 p-9 rounded-lg">
              <div className=" w-full flex justify-between items-center">
                <div className="flex space-x-4 bg-slate-600/20 w-fit p-1 md:p-2 rounded-lg">
                  <button
                    onClick={() => setTab("technical")}
                    className={` text-xs md:text-sm py-2 px-4 md:px-6 rounded-lg ${
                      tab === "technical" ? "bg-gray-800" : ""
                    } `}
                  >
                    Technical
                  </button>
                  <button
                    onClick={() => setTab("others")}
                    className={` text-xs md:text-sm py-2 px-4 md:px-6 rounded-lg ${
                      tab === "others" ? "bg-gray-800" : ""
                    } `}
                  >
                    Others
                  </button>
                </div>
                <div
                  className={`${
                    tab === "technical" ? "block" : "hidden"
                  } w-full p-1 md:p-2 flex items-center justify-end`}
                >
                  <button
                    className=" h-11 min-w-[160px] md:mt-0 px-5 mr-5 cursor-pointer bg-white rounded-lg text-center text-black font-semibold"
                    onClick={() => setGenerateModalOpen(true)}
                  >
                    Genarate questions
                  </button>
                  <button
                    onClick={() => setCreateModalOpen(true)}
                    className=" h-11 min-w-[160px] md:mt-0 cursor-pointer bg-white text-black rounded-lg text-center font-semibold"
                  >
                    {" "}
                    + Add Question
                  </button>
                </div>
              </div>

              <div className=" flex justify-between items-start">
                {tab === "technical" ? (
                  <div className=" w-[68%] mt-3 border-r-2 border-gray-700/20 pr-9">
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
                          {category.categoryAssignment.category.categoryName} :{" "}
                          {category.categoryAssignment.percentage}%{" "}
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
                <div className=" w-[30%] mt-3 px-5">
                  <h1 className=" text-2xl font-semibold text-left w-full">
                    Question arrangement
                  </h1>
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
