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

export default function CreateQuestionModal({ sessionId, setModalOpen }) {
  const [sessionID, setSessionID] = React.useState(sessionId);
  const [question, setQuestion] = React.useState("");
  const [time, setTime] = React.useState('');
  const [type, setType] = React.useState("OPEN_ENDED");

  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const questionData = {
        question,
        type,
        estimatedTimeInMinutes: parseInt(time, 10),
        sessionId: sessionID,
      };
      const response = await createQuestion(questionData);

      if (response) {
        setModalOpen(false);
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
          Create Question
        </h1>
        <button
          onClick={() => setModalOpen(false)}
          className=" absolute top-5 right-5 text-[#f3f3f3]"
        >
          <MdClose className=" text-2xl" />
        </button>
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Question"
            name="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            className=" h-[150px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2"
          />

          <div className=" w-full grid grid-cols-1 md:grid-cols-2 gap-2  mt-5">
            <div className="w-full">
              <input
                type="number"
                placeholder="Estimated Time (Minutes)"
                name="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className=" h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 mb-5"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className={`bg-[#32353b] w-full h-[45px] m-0 px-2 focus:outline-none outline-none`}
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
