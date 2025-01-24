"use client";
import React, { useEffect, useState } from "react";
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
// import Editor from "@/components/rich-text/editor";
import { LuNotebookPen } from "react-icons/lu";
import { getInterviewCategoryByInterviewId } from "@/lib/api/interview-category";
import socket from "@/lib/utils/socket";
function InterviewRoomAnalizerOther({
  setCategoryScores,
  categoryScores,
  sessionId,
}) {
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [selectedCategoryScoreId, setSelectedCategoryScoreId] = useState(null);
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);
  const [categoryPercentageList, setCategoryPercentageList] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
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
    fetchCategoryPercentage();
  }, [sessionId]);

  const handleOpenNoteModal = (categoryId, categoryName) => {
    setSelectedCategoryScoreId(categoryId);
    setSelectedCategoryName(categoryName);
    setNoteModalOpen(true);
  };

  const handleCategoryMarksChange = (category, value) => {
    setCategoryScores((prev) =>
      prev.map((item) =>
        item.categoryAssignment.category.categoryId === category.categoryAssignment.category.categoryId
          ? { ...item, score: value }
          : item
      )
    );
    socket.emit("submitCategoryScore",  { sessionId: sessionId, categoryScoreId: category.categoryScoreId, score: value[0] })

  };

  return (
    <div className=" w-[90%] max-w-[1500px] mx-auto h-full p-6 relative">
      <h1 className=" text-3xl font-semibold">Other categories</h1>
      <div className=" flex flex-col md:flex-row justify-between items-start w-full mt-5">
        <div className=" w-full md:w-[60%] md:pr-8 md:border-r-2 border-gray-700/20 min-h-[500px]">
          {categoryScores
            .filter((category) => category.categoryAssignment.category.categoryName !== "Technical")
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
                                category.categoryAssignment.category.categoryName
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
                      Marks: {category.score}
                    </h1>
                  </div>
                </div>
                <div className=" w-full flex justify-between">
                  <p>0</p>
                  <p>100</p>
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
            ))}
        </div>
        <div className=" w-full md:w-[40%] md:pl-8">
          <div className=" w-full  bg-gray-700/20 mt-5 text-gray-400 border-2 border-gray-700 rounded-lg px-5 py-5">
            <h1 className=" font-semibold text-xl">Mark Allocation</h1>
            <div className=" w-full">
              {categoryPercentageList.length > 0 ? (
                categoryPercentageList.map((category, index) => (
                  <div
                    key={index}
                    className=" w-full flex justify-between items-center mt-3 bg-gray-700/30 rounded-lg px-5 py-2"
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
        </div>
      </div>
      {noteModalOpen && (
        <AddCategoryNote
          setNoteModalOpen={setNoteModalOpen}
          selectedCategoryScoreId={selectedCategoryScoreId}
          categoryName={selectedCategoryName}
        />
      )}
    </div>
  );
}

export default InterviewRoomAnalizerOther;
