"use client";
import React, { useState } from "react";
import CirculerProgress from "@/components/interview-room-analiyzer/circuler-progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// React Icons
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { RiInformation2Line } from "react-icons/ri";
import { MdExpandMore } from "react-icons/md";
import { MdExpandLess } from "react-icons/md";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, ThumbsDown, ThumbsUp, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useEffect } from "react";
import { getInterviewCategoryByInterviewId } from "@/lib/api/interview-category";
import socket from "@/lib/utils/socket";
import { Badge } from "@/components/ui/badge";

function InterviewRoomAnalizerScore({
  numberOfAnswers,
  numOfQuestions,
  totalScore,
  overollScore,
  questionList,
  sessionId,
  setCategoryScores,
  categoryScores,
  technicalStatus,
  setActiveTab,
}) {
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [avgSoftScore, setAvgSoftScore] = useState(0);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [selectedCategoryScoreId, setSelectedCategoryScoreId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);
  const [categoryPercentageList, setCategoryPercentageList] = useState([]);
  const { toast } = useToast();

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
    const softCategory = categoryScores.find(
      (category) => 
        category.categoryAssignment.category.categoryName === "Soft"
    );
    setAvgSoftScore(softCategory?.score || 0);
  }, [categoryScores]);

  const toggleExpand = (index) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

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
    socket.emit("submitSubCategoryScore", {
      sessionId: sessionId,
      subCategoryScoreId: subcategory.id,
      score: value[0],
    });
  };

  return (
    <div className=" w-[90%] max-w-[1500px] bg-black mx-auto h-full p-6">
      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Soft Skills Assessment
            </CardTitle>
            <CardDescription>
              Average Score: {avgSoftScore.toFixed(2)}/{100}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-6">
              {categoryScores
                .filter(
                  (category) =>
                    category.categoryAssignment.category.categoryName !==
                    "Technical"
                )
                .map((category, index) => (
                  <div key={index} className="space-y-6">
                    {category.subCategoryScores.map((subCategory) => (
                      <div key={subCategory.id} className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">
                              {subCategory.subCategoryAssignment.name}
                            </h3>
                            <span className="text-sm font-medium">
                              {subCategory.score}/{100}
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <ThumbsDown className="h-4 w-4 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                Poor
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                Excellent
                              </span>
                              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </div>
                          <Slider
                            value={[subCategory.score || 10]}
                            max={100}
                            step={1}
                            id={subCategory.id}
                            marks={subCategory.score}
                            // enableColor={true}
                            onValueChange={(value) =>
                              handleSubCategoryMarksChange(subCategory, value)
                            }
                            className="mb-4"
                          />
                        </div>
                        <div className=" mt-2">
                          {subCategory.subCategoryAssignment?.subCategoryParameters?.map(
                            (parameter) => (
                              <Badge
                                key={parameter.id}
                                className=" !text-blue-600 mr-1 !bg-black font-bold !border-blue-600"
                              >
                                {parameter.name}
                                {" - "}
                                {parameter.percentage}%
                              </Badge>
                            )
                          )}
                        </div>

                        <Separator />
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="border-t border-gray-500/40 pt-4 flex justify-between">
          {technicalStatus !== "endTest" ? (
                <Button className="!bg-indigo-600 hover:!bg-indigo-700 !text-white ml-auto" onClick={() => setActiveTab("technical")}>
                  {technicalStatus === "ongoing" ? 'Resume' : 'Start'} Technical Test
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button className="!bg-indigo-600 hover:!bg-indigo-700 !text-white ml-auto" onClick={() => setActiveTab("overall")}>
                  View Overall Score
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
        </CardFooter>
      </Card>
      {/* <h1 className=" text-3xl font-semibold">Marks Overview</h1>
      <div className=" w-full flex flex-col-reverse md:flex-row justify-between items-start mt-9">
        <div className=" w-full md:w-[65%] mt-10 md:mt-0 md:mb-10">
          <h1 className=" text-2xl font-semibold">Question List</h1>
          {questionList.map((question, index) => (
            <div
              key={index}
              className=" bg-gray-700/20 mt-5 text-gray-400 border-2 border-gray-700 py-2 px-4 rounded-lg"
            >
              <div className=" flex items-center justify-between">
                <div className="w-[90%]">
                  <div className=" flex justify-start items-center">
                    <h1 className="text-md text-gray-400 font-semibold">
                      Qestion {index + 1} :
                    </h1>
                    <h1 className="text-md text-gray-400 font-semibold pl-1">
                      {question.estimatedTimeMinutes} min
                    </h1>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <RiInformation2Line className="text-orange-400 text-[18px] ml-2 inline-block cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent className="!bg-black p-4 rounded-lg !border-2 !border-gray-700">
                          <p className=" w-[500px] text-gray-300">
                            {question.explanation}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className=" mr-9 text-justify text-sm pt-3">
                    {question.questionText}
                  </div>
                </div>
                <div className="w-[10%] flex flex-col items-center justify-center">
                  {question.isAnswered && (
                    <IoMdCheckmarkCircleOutline className="text-green-500 text-[25px]" />
                  )}
                  {question.isAnswered && (
                    <p className=" text-sm py-1">
                      Marks: {question.interviewResponses.score.score}
                    </p>
                  )}
                </div>
              </div>
              <h1
                onClick={() => toggleExpand(index)}
                className=" text-xs bg-indigo-900/50 text-indigo-500 w-fit px-4 py-1 rounded-full my-2 cursor-pointer"
              >
                {expandedQuestions[index]
                  ? "Hide Candidate Answer"
                  : "Show Candidate Answer"}
                {expandedQuestions[index] ? (
                  <MdExpandLess className="inline-block ml-1" />
                ) : (
                  <MdExpandMore className="inline-block ml-1" />
                )}
              </h1>
              {expandedQuestions[index] && (
                <p className=" text-sm text-gray-500 px-5 mx-auto">
                  {question.interviewResponses.responseText ||
                    "No Answer Given"}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className=" w-full md:w-[35%] p-8 flex flex-col h-full items-center justify-start md:justify-center">
          <div className="  bg-gray-700/20 text-gray-400 border-2 py-8 border-gray-700 flex flex-col items-center justify-center w-full mt-7 md:mt-5 rounded-lg">
            <h1 className=" text-2xl font-semibold text-center">
              Overall Score
            </h1>
            <h2 className=" text-base text-gray-500 text-center">
              for all categories
            </h2>
            <CirculerProgress
              marks={overollScore}
              catorgory="Overall score"
              titleSize="text-3xl"
              subTitleSize="text-sm"
            />
            <p className=" text-gray-300 text-center">
              The candidate&apos;s overall score is{" "}
              {parseInt(overollScore || 0).toFixed(2)}%
            </p>
          </div>
          <div className="  bg-gray-700/20 text-gray-400 border-2 py-8 border-gray-700 flex flex-col items-center justify-center w-full mt-7 md:mt-5 rounded-lg">
            <h1 className=" text-2xl font-semibold text-center">Test Score</h1>
            <h2 className=" text-base text-gray-500 text-center">
              {" "}
              {numberOfAnswers}/{numOfQuestions} Questions
            </h2>
            <CirculerProgress
              marks={totalScore}
              catorgory="Test score"
              titleSize="text-3xl"
              subTitleSize="text-sm"
            />
            <p className=" text-gray-300 text-center">
              {parseInt(totalScore || 0).toFixed(2)}% Accurate with expected
              answers
            </p>
            <p className=" text-sm text-gray-500 text-center">
              Showing Test Score for {numberOfAnswers} out of {numOfQuestions}{" "}
              question
            </p>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default InterviewRoomAnalizerScore;
