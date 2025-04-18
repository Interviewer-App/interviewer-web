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
import {
  addSuggestedOrOriginalQuestionForInterview,
  addSuggestedOrOriginalQuestionForSession,
  createQuestion,
  createQuestionForInterview,
} from "@/lib/api/question";
import { Card, CardContent } from "../ui/card";
import { Check, CircleX, Loader2, Plus, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";

export default function CreateQuestionModal({
  forSession,
  id,
  setCreateModalOpen,
}) {
  const [sessionID, setSessionID] = React.useState("");
  const [interviewID, setInterviewID] = React.useState("");
  const [question, setQuestion] = React.useState("");
  const [time, setTime] = React.useState("");
  const [type, setType] = React.useState("OPEN_ENDED");
  const [suggestions, setSuggestions] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

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
    setLoading(true);
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
        setSuggestions(response.data);
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
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptSuggestions = async (e) => {
    e.preventDefault();
    let response;
    try {
      if (forSession) {
        const acceptSuggestionsData = {
          sessionId: sessionID,
          useSuggested: true,
          originalQuestion: suggestions.originalQuestion,
          suggestedQuestion: suggestions.suggestedQuestion,
        };

        response = await addSuggestedOrOriginalQuestionForSession(
          acceptSuggestionsData
        );
      } else {
        const acceptSuggestionsData = {
          interviewId: interviewID,
          useSuggested: true,
          originalQuestion: suggestions.originalQuestion,
          suggestedQuestion: suggestions.suggestedQuestion,
        };

        response = await addSuggestedOrOriginalQuestionForInterview(
          acceptSuggestionsData
        );
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

  const handleIgnoreSuggestions = async (e) => {
    e.preventDefault();
    let response;
    try {
      if (forSession) {
        const ignoreSuggestionsData = {
          sessionId: sessionID,
          useSuggested: false,
          originalQuestion: suggestions.originalQuestion,
          suggestedQuestion: suggestions.suggestedQuestion,
        };

        response = await addSuggestedOrOriginalQuestionForSession(
          ignoreSuggestionsData
        );
      } else {
        const ignoreSuggestionsData = {
          interviewId: interviewID,
          useSuggested: false,
          originalQuestion: suggestions.originalQuestion,
          // suggestedQuestion: suggestions.suggestedQuestion,
        };

        response = await addSuggestedOrOriginalQuestionForInterview(
          ignoreSuggestionsData
        );
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
        <form className="overflow-y-auto max-h-[500px]">
          <label className="block text-sm font-medium text-[#f3f3f3] mb-2 ">
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

          {suggestions ? (
            <Card className="border !border-blue-500/50 !bg-transparent">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-medium">AI Suggestions</h3>
                </div>

                <p className=" text-muted-foreground text-sm">
                  {suggestions?.message}
                </p>

                <div className="space-y-2">
                  <div>
                    <h4 className="font-medium">Recommended question</h4>
                    <div className=" text-muted-foreground text-sm flex items-start justify-start mt-2">
                      <Plus className="h-4 w-4 text-green-500 flex-shrink-0 mt-1 inline-block mr-2" />
                      {suggestions?.suggestedQuestion?.question}
                    </div>
                    <div className=" mt-2 ml-6">
                      <Badge
                        variant="outline"
                        className="!text-blue-500 !font-bold"
                      >
                        {suggestions?.suggestedQuestion?.type
                          .toLowerCase()
                          .split("-")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="!text-blue-500 !font-bold ml-2"
                      >
                        {suggestions?.suggestedQuestion?.estimatedTime}
                      </Badge>
                    </div>
                  </div>
                  <div className=" pt-3">
                    <h4 className="font-medium">OriginalQuestion question</h4>
                    <div className=" text-muted-foreground text-sm flex items-start justify-start mt-2">
                      <CircleX className="h-4 w-4 text-red-500 flex-shrink-0 mt-1 inline-block mr-2" />
                      {suggestions?.originalQuestion?.question}
                    </div>
                    <div className=" mt-2 ml-6">
                      <Badge
                        variant="outline"
                        className="!text-blue-500 !font-bold"
                      >
                        {suggestions?.originalQuestion?.type
                          .toLowerCase()
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="!text-blue-500 !font-bold ml-2"
                      >
                        {suggestions?.originalQuestion?.estimatedTime}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-2">
                  <Button variant="outline" onClick={handleIgnoreSuggestions}>
                    Ignore & Add My Question
                  </Button>
                  <Button
                    type="button"
                    onClick={handleAcceptSuggestions}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Apply Suggestions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className=" w-full flex justify-center items-center">
              <Button disabled={loading}
                // type="submit"
                onClick={handleSubmit}
                className=" h-12 min-w-[150px] w-full md:w-[40%] mt-8 cursor-pointer rounded-lg text-center text-sm text-black bg-white font-semibold"
              >
                {loading ? (<Loader2 className="h-4 w-4 mr-2 animate-spin" />) : (<span>Create Question</span>)}
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
