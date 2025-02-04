import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { MdClose } from "react-icons/md";
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
import { createQuestion } from "@/lib/api/question";

export default function FeedbackModal({ setIsFeedbackModalOpen}) {
  const [sessionID, setSessionID] = React.useState("");
  const [interviewID, setInterviewID] = React.useState("");
  const [question, setQuestion] = React.useState("");
  const [time, setTime] = React.useState("");
  const [type, setType] = React.useState("OPEN_ENDED");

  const { toast } = useToast();

//   React.useEffect(() => {
//     if (forSession) {
//       setSessionID(id);
//     } else {
//       setInterviewID(id);
//     }
//   }, [forSession, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;
    try {
      

      if (response) {
        setIsFeedbackModalOpen(false);
      }
    } catch (err) {
      if (err.response) {
        const { data } = err.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Question create failed: ${data.message}`,
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
    <div className=" fixed  top-0 left-0 z-50 h-full w-full flex items-center justify-center bg-black/50">
      <div className=" relative max-w-[700px] h-fit max-h-[670px] w-[90%] md:w-[50%] p-9 bg-gradient-to-br from-[#1f2126] to-[#17191d] rounded-lg">
        <h1 className=" text-2xl font-semibold text-[#f3f3f3] pb-5">
          Feedback
        </h1>
        <button
          onClick={() => setIsFeedbackModalOpen(false)}
          className=" absolute top-5 right-5 text-[#f3f3f3]"
        >
          <MdClose className=" text-2xl" />
        </button>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Feedback"
            name="Feedback"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            className=" h-[150px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2"
          />
          <div className=" w-full flex flex-col md:flex-row justify-between items-center mt-1"></div>

          <div className=" w-full flex justify-center items-center">
            <button
              type="submit"
              className=" h-12 min-w-[150px] w-full md:w-[40%] mt-8 cursor-pointer rounded-lg text-center text-sm text-black bg-white font-semibold"
            >
              Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
