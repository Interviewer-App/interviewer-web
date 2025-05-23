"use client";
import React, { useEffect, useRef, useState } from "react";

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
import {
  deleteInterviewQuestion,
  deleteQuestion,
  updateInterviewQuestion,
  updateQuestion,
} from "@/lib/api/question";
import { RiInformation2Line } from "react-icons/ri";
import { Clock } from "lucide-react";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";

function QuestionDisplayCard({
  forSession,
  index,
  question,
  isQuestionEdit,
  setIsQuestionEdit,
}) {
  const [questionText, setQuestionText] = useState(question.questionText);
  const [questionType, setQuestionType] = useState(question.type);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [questionText]);

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    let response;
    try {
      if (forSession) {
        response = await updateQuestion(question.questionID, {
          question: questionText,
          type: questionType,
        });
      } else {
        response = await updateInterviewQuestion(question.interviewQuestionID, {
          question: questionText,
          type: questionType,
        });
      }

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
    let response;
    try {
      if (forSession) {
        response = await deleteQuestion(question.questionID);
      } else {
        response = await deleteInterviewQuestion(question.interviewQuestionID);
      }

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
      className="group bg-[#09090b] hover:bg-[#141921] mt-5 text-gray-400 border-2 border-gray-700 rounded-lg"
    >
      <div className=" w-full py-2 px-4 rounded-t-lg relative">
        <div className=" flex items-center justify-start gap-x-2">
          <h1 className=" text-lg font-semibold text-gray-400 p-1 rounded-3xl">
            Q{index + 1}
          </h1>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="!bg-orange-500/10 !text-orange-600 px-4 py-1 border !border-orange-600">
                  <RiInformation2Line className=" text-sm mr-1" /> Explanation
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="!bg-black p-3 rounded-lg !border !border-gray-700">
                <p className=" w-[400px] text-gray-300">
                  {question.explanation
                    ? question.explanation
                    : "No explanation provided."}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex gap-2 absolute right-4 top-0 h-full items-center justify-between">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-end px-4">
            {isEditing && (
              <button
                onClick={handleUpdateQuestion}
                className="text-green-500 hover:text-green-400 border-green-500 hover:bg-green-300/20 text-lg aspect-square h-7 rounded-sm flex items-center justify-center"
              >
                <LuCheck />
              </button>
            )}
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-300 hover:text-gray-200 border-gray-300 hover:bg-gray-300/20 text-lg aspect-square h-7 rounded-sm flex items-center justify-center p-2 gap-1"
                >
                  <MdEdit />
                </button>
              </>
            )}

            <AlertDialog>
              <AlertDialogTrigger>
                <div className="text-red-500 hover:text-red-400 border-red-500  hover:bg-red-500/20 text-lg aspect-square h-7 rounded-sm flex items-center justify-center p-2 gap-1">
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
                    className="h-10"
                    onClick={handleDeleteQuestion}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
      <div className="w-full py-3 text-gray-400 px-6 rounded-b-lg">
        {isEditing && <Label>Question</Label>}
        {isEditing ? (
          <textarea
            ref={textareaRef}
            readOnly={!isEditing}
            className={`text-base w-full rounded-md ${
              isEditing
                ? "bg-black border border-gray-500/40 mt-2 py-2 px-4"
                : "bg-transparent text-gray-500"
            } focus:outline-none`}
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
        ) : (
          <p className="text-base">{questionText}</p>
        )}

        {isEditing && (
          <>
            <Label>Question Type</Label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className={`!bg-black mt-2 border border-gray-500 h-9 mb-0 mr-5 px-2 focus:outline-none outline-none w-full`}
                  variant="outline"
                >
                  {questionType
                    .toLowerCase()
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
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
          </>
        )}

        <div className=" w-full flex items-center justify-between mt-4">
          <div>
            <Badge className="!bg-blue-500/20 !text-blue-600 px-4 py-1 border !border-blue-600">
              {questionType
                .toLowerCase()
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </Badge>
            <Badge className="!bg-blue-500/20 !text-blue-600 px-4 py-1 border !border-blue-600 ml-2">
              {question.estimatedTimeMinutes} minutes
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuestionDisplayCard;
