import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { MdClose } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LoaderCircle, Sparkles } from "lucide-react";
import { generateInterviewQuestions, generateQuestions } from "@/lib/api/ai";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import SkillsInput from "../inputs/skillsInput";

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function GenerateQuestionModal({
  forSession,
  details,
  setGenerateModalOpen,
}) {
  
  const [sessionID, setSessionID] = React.useState("");
  const [interviewId, setInterviewId] = React.useState("");
  const [jobRole, setJobRole] = React.useState("");
  const [skillLevel, setSkillLevel] = React.useState("Junior");
  const [noOfQuestion, setNoOfQuestion] = React.useState("");
  const [questionType, setQuestionType] = React.useState("Technical");
  const [keywords, setKeywords] = React.useState([]);
  const [inputValue, setInputValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const { toast } = useToast();

  React.useEffect(() => {
    if (forSession) {
      setSessionID(details.sessionId);
      setJobRole(details.interview.jobTitle);
    } else {
      setInterviewId(details.interviewID);
      setJobRole(details.jobTitle);
    }
  }, [details]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      setKeywords((prevChips) => [
        ...prevChips,
        { key: keywords.length, label: inputValue.trim() },
      ]);
      setInputValue("");
    }
  };

  const handleDelete = (chipToDelete) => () => {
    setKeywords((chips) =>
      chips.filter((chip) => chip.key !== chipToDelete.key)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const validNoOfQuestions = parseInt(noOfQuestion, 10);

    if (isNaN(validNoOfQuestions) || validNoOfQuestions <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid Input",
        description: "Please enter a valid number of questions.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      setLoading(false);
      return;
    }

    let response;
    try {
      if (forSession) {
        response = await generateQuestions(sessionID, {
          jobRole: details.interview.jobTitle,
          skillLevel: details.interview.proficiencyLevel,
          QuestionType: questionType.toUpperCase(),
          Keywords: keywords.map((keyword) => keyword.label),
          noOfQuestions: validNoOfQuestions,
        });
      } else {
        response = await generateInterviewQuestions(interviewId, {
          jobRole,
          skillLevel,
          QuestionType: questionType.toUpperCase(),
          Keywords: keywords.map((keyword) => keyword.label),
          noOfQuestions: validNoOfQuestions,
        });
      }

      if (response) {
        setGenerateModalOpen(false);
        setLoading(false);
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Question Generation failed: ${data.message}`,
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
    <div className=" w-full">
      <div className=" fixed  top-0 left-0 z-40 h-full w-full flex items-center justify-center bg-black/50">
        <div className=" relative max-w-[700px] h-fit w-[90%] md:w-[50%] p-9  rounded-lg bg-[#09090b] border border-[#2d2f36]">
          <div className="pb-5">
            <h1 className=" text-2xl font-semibold text-[#f3f3f3] pb-1 flex items-center gap-2">
              <Sparkles />
              Genarate Questions
            </h1>
            <span className="text-[#737883] text-sm !pb-5">
              Our AI will generate high-quality technical interview questions based on your criteria.
            </span>
          </div>
          <button
            onClick={() => setGenerateModalOpen(false)}
            className=" absolute top-5 right-5 text-[#f3f3f3]"
          >
            <MdClose className=" text-2xl" />
          </button>
          <form onSubmit={handleSubmit}>
            

            {/* <input
              type="text"
              readOnly={true}
              placeholder="Job Role"
              name="jobRole"
              value={jobRole}
              required
              className=" h-[45px] w-full rounded-lg text-sm border text-gray-500 focus:outline-none bg-[#09090b] placeholder-[#3c3d41] px-6 py-2 mb-5 border-[#2d2f36]"
            /> */}
            {/* <div className=" w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="w-full">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className={`!bg-[#09090b] w-full h-[45px] m-0 px-2 focus:outline-none outline-none`}
                      variant="outline"
                    >
                      {skillLevel}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Skill Level</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={skillLevel}
                      onValueChange={setSkillLevel}
                    >
                      <DropdownMenuRadioItem value="Junior">
                        Junior
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="Senior">
                        Senior
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="w-full">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className={`!bg-[#09090b] w-full h-[45px] m-0 px-2 focus:outline-none outline-none`}
                      variant="outline"
                    >
                      {questionType}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Question Type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={questionType}
                      onValueChange={setQuestionType}
                    >
                      <DropdownMenuRadioItem value="Technical">
                        Technical
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div> */}
            <Paper
              sx={{
                border: "1px solid",
                borderColor: "#2d2f36",
                display: "flex",
                justifyContent: "start",
                flexWrap: "wrap",
                listStyle: "none",
                p: 0.5,
                m: 0,
                backgroundColor: "#09090b",
                color: "white",
                overflowY: "auto",
                height: "100px",
              }}
              component="ul"
            >
              {keywords.map((data) => {
                let icon;

                if (data.label === "React") {
                  icon = <TagFacesIcon />;
                }

                return (
                  <ListItem key={data.key}>
                    <Chip
                      icon={icon}
                      label={data.label}
                      onDelete={handleDelete(data)}
                      sx={{ backgroundColor: "#2d2f36", color: "white" }}
                    />
                  </ListItem>
                );
              })}
              <input
                type="text"
                placeholder="Add some keywords"
                name="keywords"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className=" h-[45px] rounded-lg text-sm border-0 bg-transparent placeholder-[#737883] px-5 py-3 mb-5 focus:outline-none"
              />
            </Paper>
            <div className="flex justify-center items-center w-full">
              <input
                type="number"
                placeholder="Number of question to generate"
                min={1}
                name="noOfQuestion"
                value={noOfQuestion}
                onChange={(e) => setNoOfQuestion(e.target.value)}
                required
                className="py-3 my-4 w-full rounded-lg text-sm border  placeholder-[#737883] px-5 focus:outline-none bg-[#09090b] border-[#2d2f36]"
              />
            </div>

            <div className=" w-full flex justify-center items-center">
              <button
                type="submit"
                className=" h-11 min-w-[150px] w-full md:w-[40%] mt-2 flex justify-center items-center cursor-pointer bg-white text-black text-sm rounded-lg text-center font-semibold"
              >
                {loading ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <>
                    <Sparkles size={16} />
                    Genarate
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
