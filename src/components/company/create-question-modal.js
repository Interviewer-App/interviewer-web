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
import { createQuestion, createQuestionForInterview } from "@/lib/api/question";

export default function CreateQuestionModal({ forSession, id, setCreateModalOpen }) {
  const [sessionID, setSessionID] = React.useState("");
  const [interviewID, setInterviewID] = React.useState("");
  const [question, setQuestion] = React.useState("");
  const [time, setTime] = React.useState("");
  const [type, setType] = React.useState("OPEN_ENDED");

  const { toast } = useToast();

  React.useEffect(() => {
    if (forSession) {
      setSessionID(id);
    } else {
      setInterviewID(id);
    }
  }, [forSession, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;
    try {
      if (forSession) {
        const questionDataforSession = {
          question,
          type,
          estimatedTimeInMinutes: parseInt(time, 10),
          sessionId: sessionID,
        };
        response = await createQuestion(questionDataforSession);
      } else {
        const questionDataforInterview = {
          question,
          type,
          estimatedTimeInMinutes: parseInt(time, 10),
          interviewId: interviewID,
        };
        response = await createQuestionForInterview(questionDataforInterview);
      }

      if (response) {
        setCreateModalOpen(false);
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
      <div className=" relative max-w-[700px] h-fit max-h-[670px] w-[90%] md:w-[50%] p-9 bg-[#09090b] rounded-lg border border-[#2d2f36]">
        <div className="pb-5">
          <h1 className=" text-2xl font-semibold text-[#f3f3f3] pb-1 flex items-center gap-2">
            Create Questions
          </h1>
          <span className="text-[#737883] text-sm !pb-5">
            Create a new technical question for the interview.
          </span>
        </div>
        <button
          onClick={() => setCreateModalOpen(false)}
          className=" absolute top-5 right-5 text-[#f3f3f3]"
        >
          <MdClose className=" text-2xl" />
        </button>
        <form onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-[#f3f3f3] mb-2">
            Question
          </label>
          <textarea
            placeholder="e.g. What is the difference between a stack and a queue?"
            name="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            className=" h-[150px] w-full rounded-lg text-sm border bg-[#09090b] border-[#2d2f36] placeholder-[#737883] px-6 py-2"
          />

          <div className=" w-full grid grid-cols-1 md:grid-cols-2 gap-2  mt-5">
            <div className="w-full">
              <label className="block text-sm font-medium text-[#f3f3f3] mb-2">
                Duration(minutes)
              </label>
              <input
                type="number"
                placeholder="Estimated Time (Minutes)"
                name="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className=" h-[45px] w-full rounded-lg text-sm border bg-[#09090b] border-[#2d2f36] placeholder-[#737883] px-6 py-2 mb-5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#f3f3f3] mb-2">
                Category
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className={`bg-[#09090b] border-[#2d2f36] w-full h-[45px] m-0 px-2 focus:outline-none outline-none`}
                    variant="outline" 
                  >
                    {type === "CODING" ? "Coding" : "Open Ended"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Question Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={type} onValueChange={setType}>
                    <DropdownMenuRadioItem value="OPEN_ENDED">
                      Open Ended
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="CODING">
                      Coding
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className=" w-full flex flex-col md:flex-row justify-between items-center mt-1"></div>

          <div className=" w-full flex justify-center items-center">
            <button
              type="submit"
              className=" h-12 min-w-[150px] w-full md:w-[40%] mt-8 cursor-pointer rounded-lg text-center text-sm text-black bg-white font-semibold"
            >
              Create Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
