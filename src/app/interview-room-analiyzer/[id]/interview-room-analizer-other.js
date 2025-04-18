"use client";
import React, { use, useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import AddCategoryNote from "@/components/interview-room-analiyzer/add-category-note";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

// React Icons
import { FaDotCircle } from "react-icons/fa";

import { LuNotebookPen } from "react-icons/lu";
import { getInterviewCategoryByInterviewId } from "@/lib/api/interview-category";
import socket from "@/lib/utils/socket";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Code,
  Sparkles,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getInterviewSessionById } from "@/lib/api/interview-session";

function InterviewRoomAnalizerOther({
  setCategoryScores,
  categoryScores,
  sessionId,
  softSkillScore,
  allocation,
  questionList,
  totalScore,
  overollScore,
}) {
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [selectedCategoryScoreId, setSelectedCategoryScoreId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);
  const [categoryPercentageList, setCategoryPercentageList] = useState([]);
  const { toast } = useToast();
  const [sessionDetails, setSessionDetails] = useState({});
  const [interviewId, setInterviewId] = useState(null);

  // useEffect(() => {
  //   console.log('totalScore',totalScore)
  //   console.log('overollScore',overollScore)
  // },[])

  useEffect(() => {
    // console.log('questionList',questionList)
    const fetchCategoryPercentage = async () => {
      try {
        const response = await getInterviewCategoryByInterviewId(sessionId);
        if (response) {
          setCategoryPercentageList(response.data.categoryAssignments);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Error fetching category details: ${error}`,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    };
    if (sessionId) fetchCategoryPercentage();
  }, [sessionId]);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        if (!sessionId) return;

        const response = await getInterviewSessionById(sessionId);
        console.log("getInterviewSessionById", response.data);
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
  }, [sessionId]);

  const handleOpenNoteModal = (categoryId, categoryName) => {
    setSelectedCategoryScoreId(categoryId);
    setSelectedCategoryName(categoryName);
    setNoteModalOpen(true);
  };

  const handleCategoryMarksChange = (category, value) => {
    setCategoryScores((prev) =>
      prev.map((item) =>
        item.categoryAssignment.category.categoryId ===
        category.categoryAssignment.category.categoryId
          ? { ...item, score: value }
          : item
      )
    );
    socket.emit("submitCategoryScore", {
      sessionId: sessionId,
      categoryScoreId: category.categoryScoreId,
      score: value[0],
    });
  };

  const handleSubCategoryMarksChange = (subcategory, value) => {
    // setCategoryScores((prev) =>
    //   prev.map((item) =>
    //     item.categoryAssignment.category.categoryId ===
    // subcategory.categoryAssignment.category.categoryId
    //       ? { ...item, score: value }
    //       : item
    //   )
    // );
    socket.emit("submitSubCategoryScore", {
      sessionId: sessionId,
      subCategoryScoreId: subcategory.id,
      score: value[0],
    });
  };

  return (
    <>
      {/* <div className=" w-[90%] max-w-[1500px] bg-black mx-auto h-full p-6 relative">
      <h1 className=" text-3xl font-semibold">Other categories</h1>
      <div className=" flex flex-col md:flex-row justify-between items-start w-full mt-5">
        <div className={` w-full ${allocation ? 'md:w-[60%] md:border-r-2 md:pr-8' : 'md:w-full'}   border-gray-700/20 min-h-[500px]`}>
          {categoryScores
            .filter(
              (category) =>
                category.categoryAssignment.category.categoryName !==
                "Technical"
            )
            .map((category, index) => (
              <div
                key={index}
                className="bg-gray-700/20 mt-5 text-gray-400 border-2 border-gray-700 rounded-lg px-5 pt-2 pb-8"
              >
                <div className=" w-full flex justify-between items-center">
                  <h1 className="text-lg font-semibold text-gray-300 py-2">
                    {category.categoryAssignment.category.categoryName}
                  </h1>
                  <div className=" flex justify-end items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <LuNotebookPen
                            onClick={() =>
                              handleOpenNoteModal(
                                category.categoryScoreId,
                                category.categoryAssignment.category
                                  .categoryName
                              )
                            }
                            className=" text-blue-600 mr-3 text-xl cursor-pointer"
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className=" text-gray-300">Add Note</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <h1 className="text-lg font-semibold text-gray-300 py-2">
                      Marks: {parseInt(category.score).toFixed(2)}
                    </h1>
                  </div>
                </div>
                {category.subCategoryScores.length > 0 ? (
                  category.subCategoryScores.map((subCategory) => (
                    <div key={subCategory.id} className=" w-full mb-5 px-10">
                      <h1 className="text-base text-gray-500 py-2">
                        <FaDotCircle className=" text-blue-700 text-xs inline-block -ml-6 mr-2" />
                        {subCategory.subCategoryAssignment.name}
                      </h1>
                      <div className=" w-full flex text-sm justify-between">
                        <p>0</p>
                        <p>{subCategory.score}/100</p>
                      </div>
                      <Slider
                        defaultValue={[subCategory.score || 10]}
                        max={100}
                        step={1}
                        id={subCategory.id}
                        marks={subCategory.score}
                        onValueChange={(value) =>
                          handleSubCategoryMarksChange(subCategory, value)
                        }
                      />
                    </div>
                  ))
                ) : (
                  <div key={category.id} className=" w-full my-5 px-10">
                    <div className=" w-full flex text-sm justify-between">
                      <p>0</p>
                      <p>{category.score}/100</p>
                    </div>
                    <Slider
                      defaultValue={[category.score]}
                      max={100}
                      step={1}
                      marks={category.score}
                      onValueChange={(value) =>
                        handleCategoryMarksChange(category, value)
                      }
                    />
                  </div>
                )}
              </div>
            ))}
        </div>
        {allocation && (<div className=" w-full md:w-[40%] md:pl-8">
          <div className=" w-full  bg-gray-700/20 mt-5 text-gray-400 border-2 border-gray-700 rounded-lg px-5 py-5">
            <h1 className=" font-semibold text-xl">Mark Allocation</h1>
            <div className=" w-full">
              {categoryPercentageList.length > 0 ? (
                categoryPercentageList.map((category, index) => (
                  <div
                    key={index}
                    className=" w-full flex justify-between items-center mt-3 bg-gray-700/30 rounded-lg px-5 py-2"
                    style={{
                      backgroundColor: `${category.category.color}5A`
                    }}
                  >
                    <h1>{category.category.categoryName}</h1>
                    <p>{category.percentage}%</p>
                  </div>
                ))
              ) : (
                <p>No categories available.</p>
              )}
            </div>
          </div>
        </div>)}
      </div>
      {noteModalOpen && (
        <AddCategoryNote
          setNoteModalOpen={setNoteModalOpen}
          selectedCategoryScoreId={selectedCategoryScoreId}
          categoryName={selectedCategoryName}
        />
      )}
    </div> */}

      <Card className="flex flex-col max-w-[1600px] mx-auto">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Overall Score Breakdown
          </CardTitle>
          <CardDescription>
            Comprehensive assessment of candidate performance across all
            evaluation areas
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Technical Score */}
            <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <Code className="h-4 w-4" />
                  Technical Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-2">
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
                        stroke="hsl(var(--blue-500, 217 91.2% 59.8%))"
                        strokeWidth="10"
                        strokeDasharray={`${
                          (2 * Math.PI * 45 * (totalScore || 0)) / 100
                        } ${2 * Math.PI * 45 * (1 - (totalScore || 0) / 100)}`}
                        strokeDashoffset={2 * Math.PI * 45 * 0.25}
                        transform="rotate(-90 50 50)"
                        strokeLinecap="round"
                        className="text-blue-500"
                        style={{ stroke: "#3b82f6" }}
                      />
                      {/* Percentage text */}
                      <text
                        x="50"
                        y="50"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fontSize="18"
                        fontWeight="bold"
                        fill="currentColor"
                        className="text-blue-500"
                        style={{ fill: "#3b82f6" }}
                      >
                        {parseFloat(totalScore || 0).toFixed(1)}%
                      </text>
                    </svg>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-blue-100 !text-blue-700 border-blue-200 my-1"
                  >
                    Weight:{" "}
                    {sessionDetails?.CategoryScore?.find(
                      (item) =>
                        item.categoryAssignment.category.categoryName ===
                        "Technical"
                    ).categoryAssignment?.percentage ?? 0}
                    %
                  </Badge>
                  <p className="text-sm text-center text-muted-foreground">
                    Scored{" "}
                    {parseFloat(
                      (totalScore *
                        sessionDetails?.CategoryScore?.find(
                          (item) =>
                            item.categoryAssignment.category.categoryName ===
                            "Technical"
                        ).categoryAssignment?.percentage) /
                        100
                    ).toFixed(1)}{" "}
                    out of{" "}
                    {sessionDetails?.CategoryScore?.find(
                      (item) =>
                        item.categoryAssignment.category.categoryName ===
                        "Technical"
                    ).categoryAssignment?.percentage ?? 0}
                    , based on the weighted average across all assessment areas.
                  </p>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">
                    Question Breakdown
                  </h4>
                  <div className="space-y-3">
                    {Array.isArray(questionList) && questionList.length > 0 ? (
                      questionList.map((question, index) => (
                        <div
                          key={question.questionID || index}
                          className="px-4 py-3 rounded-md border bg-card"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-full bg-muted-foreground/20 text-muted-foreground flex items-center justify-center text-xs">
                              {index + 1}
                            </div>
                            <span className="font-medium">
                              Question {index + 1}
                            </span>
                            {question.isAnswered && (
                              <Badge
                                variant="outline"
                                className="bg-green-100 !text-green-700 ml-2"
                              >
                                Answered
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm ml-8">
                            {question.questionText}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
                        <p className="text-muted-foreground">
                          No questions available yet
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Soft Skills Score */}
            <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-purple-700 dark:text-purple-400">
                  <User className="h-4 w-4" />
                  Soft Skills Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-2">
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
                        stroke="hsl(var(--purple-500, 270 91.2% 59.8%))"
                        strokeWidth="10"
                        strokeDasharray={`${
                          (2 * Math.PI * 45 * (softSkillScore || 0)) / 100
                        } ${
                          2 * Math.PI * 45 * (1 - (softSkillScore || 0) / 100)
                        }`}
                        strokeDashoffset={2 * Math.PI * 45 * 0.25}
                        transform="rotate(-90 50 50)"
                        strokeLinecap="round"
                        style={{ stroke: "#8b5cf6" }}
                      />
                      {/* Percentage text */}
                      <text
                        x="50"
                        y="50"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fontSize="18"
                        fontWeight="bold"
                        fill="currentColor"
                        style={{ fill: "#8b5cf6" }}
                      >
                        {parseFloat(softSkillScore || 0).toFixed(1)}%
                      </text>
                    </svg>
                  </div>
                  {/* <p className="text-sm text-muted-foreground text-center"> */}
                  {/* Weight:{" "}
                    {sessionDetails?.CategoryScore?.find(
                      (item) =>
                        item.categoryAssignment.category.categoryName ===
                        "Technical"
                    ).categoryAssignment?.percentage ?? 0}
                    %
                  </p> */}
                  <Badge
                    variant="outline"
                    className="bg-purple-100 !text-purple-700 border-purple-200 my-1"
                  >
                    Weight:{" "}
                    {sessionDetails?.CategoryScore?.find(
                      (item) =>
                        item.categoryAssignment.category.categoryName === "Soft"
                    ).categoryAssignment?.percentage ?? 0}
                    %
                  </Badge>
                  <p className="text-sm text-center text-muted-foreground">
                    Scored{" "}
                    {parseFloat(
                      (totalScore *
                        sessionDetails?.CategoryScore?.find(
                          (item) =>
                            item.categoryAssignment.category.categoryName ===
                            "Technical"
                        ).categoryAssignment?.percentage) /
                        100
                    ).toFixed(1)}{" "}
                    out of{" "}
                    {sessionDetails?.CategoryScore?.find(
                      (item) =>
                        item.categoryAssignment.category.categoryName ===
                        "Technical"
                    ).categoryAssignment?.percentage ?? 0}
                    , based on the weighted average across all assessment areas.
                  </p>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Skill Breakdown</h4>
                  <div className="space-y-3">
                    {categoryScores
                      .filter(
                        (category) =>
                          category.categoryAssignment.category.categoryName ===
                          "Soft"
                      )
                      .map((category) =>
                        category.subCategoryScores.map((skill) => (
                          <div key={skill.id} className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>{skill.subCategoryAssignment.name}</span>
                              <span>
                                {skill.score}/{100}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-purple-500 h-1.5 rounded-full"
                                style={{
                                  width: `${(skill.score / 100) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        ))
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Combined Score */}
            <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-green-700 dark:text-green-400">
                  <Sparkles className="h-4 w-4" />
                  Combined Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 mb-2">
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
                        stroke="hsl(var(--green-500, 142 91.2% 59.8%))"
                        strokeWidth="10"
                        strokeDasharray={`${
                          (2 * Math.PI * 45 * overollScore) / 100
                        } ${2 * Math.PI * 45 * (1 - overollScore / 100)}`}
                        strokeDashoffset={2 * Math.PI * 45 * 0.25}
                        transform="rotate(-90 50 50)"
                        strokeLinecap="round"
                        style={{ stroke: "#22c55e" }}
                      />
                      {/* Percentage text */}
                      <text
                        x="50"
                        y="50"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fontSize="18"
                        fontWeight="bold"
                        fill="currentColor"
                        style={{ fill: "#22c55e" }}
                      >
                        {parseFloat(overollScore || 0).toFixed(1)}%
                      </text>
                    </svg>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className="bg-blue-100 !text-blue-700 border-blue-200"
                      >
                        Technical:{" "}
                        {parseFloat(
                          (totalScore *
                            sessionDetails?.CategoryScore?.find(
                              (item) =>
                                item.categoryAssignment.category
                                  .categoryName === "Technical"
                            ).categoryAssignment?.percentage) /
                            100 || 0
                        ).toFixed(1)}
                        %
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-purple-100 !text-purple-700 border-purple-200"
                      >
                        Soft Skills:{" "}
                        {parseFloat(
                          (softSkillScore *
                            sessionDetails?.CategoryScore?.find(
                              (item) =>
                                item.categoryAssignment.category
                                  .categoryName === "Soft"
                            ).categoryAssignment?.percentage) /
                            100 || 0
                        ).toFixed(1)}
                        %
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Weighted average of all assessment areas
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="p-3 rounded-md border border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-900/30">
                    <h4 className="text-sm font-medium flex items-center gap-1.5 mb-2 text-green-800 dark:text-green-300">
                      <AlertTriangle className="h-4 w-4" />
                      Assessment Summary
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      This candidate demonstrates strong technical knowledge
                      with room for improvement in communication skills. Overall
                      performance is above average for the position
                      requirements.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default InterviewRoomAnalizerOther;
