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
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

//icons
import { LuCheck } from "react-icons/lu";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";
import { deleteQuestion, updateQuestion } from "@/lib/api/question";

function QuestionDisplayCard({
  index,
  question,
  isQuestionEdit,
  setIsQuestionEdit,
}) {
  const [questionText, setQuestionText] = useState(question.questionText);
  const [questionType, setQuestionType] = useState(question.type);
  const [isEditing, setIsEditing] = useState(false);
  const [explanation, setExplanation] = useState(question.explanation);
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
    <div key={index} className="mt-5">
      <div className=" w-full bg-slate-500/40 py-2 px-4 rounded-t-lg relative">
        <h1 className=" text-xl font-semibold text-gray-400">Q{index + 1}</h1>
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
                  className={`bg-black border-2 border-gray-500 h-9 mb-0 mr-5 px-2 focus:outline-none outline-none`}
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
              className="text-green-500 bg-green-300/20 hover:text-green-100 hover:border-green-100 border-green-500 text-lg aspect-square h-9 border-2 rounded-sm flex items-center justify-center"
            >
              <LuCheck />
            </button>
          )}
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-300 bg-gray-300/20 hover:text-gray-100 hover:border-gray-100 border-gray-500 text-lg aspect-square h-9 border-2 rounded-sm flex items-center justify-center"
            >
              <MdEdit />
            </button>
          )}

          <AlertDialog>
            <AlertDialogTrigger>
              <div className="text-red-500 bg-red-300/20 hover:text-red-100 hover:border-red-100 border-red-500 text-lg aspect-square h-9 border-2 rounded-sm flex items-center justify-center">
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
                <AlertDialogAction className='h-[45px]' onClick={handleDeleteQuestion}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          

          <AlertDialog>
            <AlertDialogTrigger>
            <div
            className="text-gray-300 bg-gray-300/20 hover:text-gray-100 hover:border-gray-100 border-gray-500 text-lg aspect-square h-9 border-2 rounded-sm flex items-center justify-center">
            <FaInfoCircle />
          </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Explanation</AlertDialogTitle>
                <AlertDialogDescription>
                  {explanation}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
                {/* <AlertDialogAction>Close</AlertDialogAction> */}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </div>
      </div>
      <div className="w-full bg-slate-500/20 py-3 text-gray-300 px-6 rounded-b-lg">
        <textarea
          readOnly={!isEditing}
          className={`text-base w-full rounded-md ${
            isEditing ? "bg-gray-700 py-2 px-4" : "bg-transparent text-gray-400"
          } focus:outline-none`}
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
        />
      </div>
    </div>
  );
}

export default QuestionDisplayCard;
