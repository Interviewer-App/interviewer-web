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
function InterviewRoomAnalizerOther({
  setCategoryScores,
  categoryScores,
  sessionId,
  allocation,
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
    if ( sessionId) fetchCategoryPercentage();
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
    <div className=" w-[90%] max-w-[1500px] bg-black mx-auto h-full p-6 relative">
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
    </div>
  );
}

export default InterviewRoomAnalizerOther;
