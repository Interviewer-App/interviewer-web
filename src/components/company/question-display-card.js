"use client";
import React, { useState } from "react";

//UI Components
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

//icons
import { LuCheck } from "react-icons/lu";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { deleteQuestion, updateQuestion } from "@/lib/api/question";
import { RiInformation2Line } from "react-icons/ri";


function QuestionDisplayCard({
  index,
  question,
  isQuestionEdit,
  setIsQuestionEdit,
}) {
  const [questionText, setQuestionText] = useState(question.questionText);
  const [questionType, setQuestionType] = useState(question.type);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    try {
      const response = await updateQuestion(question.questionID, {
        question: questionText,
        type: questionType,
      });

      if (response) {
        setIsEditing(false);
        setIsQuestionEdit(!isQuestionEdit);
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Question update failed: ${data.message}`,
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

  const handleDeleteQuestion = async (e) => {
    e.preventDefault();
    try {
      const response = await deleteQuestion(question.questionID);

      if (response) {
        setIsQuestionEdit(!isQuestionEdit);
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Question delete failed: ${data.message}`,
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
    <div
      key={index}
      className="bg-gray-700/20 mt-5 text-gray-400 border-2 border-gray-700 rounded-lg"
    >
      <div className=" w-full py-2 px-4 rounded-t-lg relative">
        <div className=" flex items-center justify-start gap-x-2">
          <h1 className=" text-xl font-semibold text-gray-400">
            Q{index + 1} : {question.estimatedTimeMinutes} min
          </h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className=" text-xs text-orange-500 cursor-pointer border-orange-500 py-1 rounded-full w-[120px] px-2 border-2 flex items-center justify-center ">
                  <RiInformation2Line className=" text-sm mr-1" /> Explanation
                </span>
              </TooltipTrigger>
              <TooltipContent className="!bg-black p-4 rounded-lg !border-2 !border-gray-700">
                <p className=" w-[500px] text-gray-300">
                  {question.explanation}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex gap-2 absolute right-4 top-0 h-full items-center justify-between">
          <span className=" text-sm text-gray-400">Type:</span>
          {!isEditing && (
            <span className=" text-sm w-full text-gray-400">
              {questionType === "CODING" ? "Coding" : "Open Ended"}
            </span>
          )}
          {isEditing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className={`!bg-gray-700 border-2 border-gray-500 h-9 mb-0 mr-5 px-2 focus:outline-none outline-none`}
                  variant="outline"
                >
                  {questionType === "CODING" ? "Coding" : "Open Ended"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Question Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={questionType}
                  onValueChange={setQuestionType}
                >
                  <DropdownMenuRadioItem value="OPEN_ENDED">
                    Open Ended
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="CODING">
                    Coding
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {isEditing && (
            <button
              onClick={handleUpdateQuestion}
              className="text-green-500 hover:text-green-400 border-green-500 hover:bg-green-300/20 border-2 text-lg aspect-square h-7 rounded-sm flex items-center justify-center"
            >
              <LuCheck />
            </button>
          )}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-300 hover:text-gray-200 border-gray-300 hover:bg-gray-300/20 border-2  text-lg aspect-square h-7 rounded-sm flex items-center justify-center"
            >
              <MdEdit />
            </button>
          )}

          <AlertDialog>
            <AlertDialogTrigger>
              <div className="text-red-500 hover:text-red-400 border-red-500 border-2 hover:bg-red-500/20 text-lg aspect-square h-7 rounded-sm flex items-center justify-center">
                <MdDelete />
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete this question?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="h-[45px]"
                  onClick={handleDeleteQuestion}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className="w-full py-3 text-gray-400 px-6 rounded-b-lg">
        <textarea
          readOnly={!isEditing}
          className={`text-base w-full rounded-md ${
            isEditing ? "bg-gray-700 py-2 px-4" : "bg-transparent text-gray-500"
          } focus:outline-none`}
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
        />
      </div>
    </div>
  );
}

export default QuestionDisplayCard;
