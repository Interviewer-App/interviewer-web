"use client";
import React from "react";
import { Slider } from "@/components/ui/slider";

function InterviewRoomAnalizerOther({ setCategoryMarks, categoryMarks }) {
  const handleCategoryMarksChange = (category, value) => {
    setCategoryMarks((prev) =>
      prev.map((item) =>
        item.categoryId === category.categoryId
          ? { ...item, marks: value }
          : item
      )
    );
  };
  return (
    <div className=" w-[90%] max-w-[1500px] mx-auto h-full p-6 relative">
      <h1 className=" text-3xl font-semibold">Other categories</h1>
      <div className=" flex justify-between items-start w-full mt-5">
        <div className=" w-[70%]">
          {categoryMarks
            .filter((category) => category.categoryName !== "Technical")
            .map((category, index) => (
              <div
                key={index}
                className="bg-gray-700/20 mt-5 text-gray-400 border-2 border-gray-700 rounded-lg px-5 pt-2 pb-8"
              >
                <div className=" w-full flex justify-between items-center">
                  <h1 className="text-lg font-semibold text-gray-300 py-2">
                    {category.categoryName}
                  </h1>
                  <h1 className="text-lg font-semibold text-gray-300 py-2">
                    Marks: {category.marks}
                  </h1>
                </div>
                <div className=" w-full flex justify-between">
                  <p>0</p>
                  <p>100</p>
                </div>
                <Slider
                  defaultValue={[10]}
                  max={100}
                  step={1}
                  marks={category.marks}
                  onValueChange={(value) =>
                    handleCategoryMarksChange(category, value)
                  }
                />
              </div>
            ))}
        </div>
        <div className=" w-[30%]"></div>
      </div>
    </div>
  );
}

export default InterviewRoomAnalizerOther;
