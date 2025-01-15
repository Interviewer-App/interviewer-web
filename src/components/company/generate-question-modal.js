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
import { generateQuestions } from "@/lib/api/ai";
import Loading from "@/app/loading";
import TagFacesIcon from "@mui/icons-material/TagFaces";

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function GenerateQuestionModal({
  session,
  setGenerateModalOpen,
}) {
  const [sessionID, setSessionID] = React.useState(session.sessionId);
  const [jobRole, setJobRole] = React.useState(session.interview.jobTitle);
  const [skillLevel, setSkillLevel] = React.useState("Junior");
  const [companyCulture, setCompanyCulture] = React.useState("");
  const [companyAim, setCompanyAim] = React.useState("");
  const [questionType, setQuestionType] = React.useState("Technical");
  const [keywords, setKeywords] = React.useState([]);
  const [inputValue, setInputValue] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const { toast } = useToast();

  console.log("session", session);

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

    try {
      const response = await generateQuestions(sessionID, {
        jobRole,
        skillLevel,
        companyCulture,
        companyAim,
        QuestionType: questionType.toUpperCase(),
        Keywords: keywords.map((keyword) => keyword.label),
      });

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
        <div className=" relative max-w-[700px] h-fit max-h-[670px] w-[90%] md:w-[50%] p-9 bg-gradient-to-br from-[#1f2126] to-[#17191d] rounded-lg">
          <h1 className=" text-2xl font-semibold text-[#f3f3f3] pb-5">
            Genarate Questions
          </h1>
          <button
            onClick={() => setGenerateModalOpen(false)}
            className=" absolute top-5 right-5 text-[#f3f3f3]"
          >
            <MdClose className=" text-2xl" />
          </button>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              readOnly={true}
              placeholder="Job Role"
              name="jobRole"
              value={jobRole}
              required
              className=" h-[45px] w-full rounded-lg text-sm border-0 text-gray-500 focus:outline-none bg-[#32353b] placeholder-[#3c3d41] px-6 py-2 mb-5"
            />
            <div className=" w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="w-full">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      className={`!bg-[#32353b] w-full h-[45px] m-0 px-2 focus:outline-none outline-none`}
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
                      className={`!bg-[#32353b] w-full h-[45px] m-0 px-2 focus:outline-none outline-none`}
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
            </div>
            <textarea
              placeholder="Company Culture"
              name="companyCulture"
              value={companyCulture}
              onChange={(e) => setCompanyCulture(e.target.value)}
              required
              className=" h-[100px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-5 py-3 mb-4"
            />
            <textarea
              placeholder="Company Aim"
              name="companyAim"
              value={companyAim}
              onChange={(e) => setCompanyAim(e.target.value)}
              required
              className=" h-[100px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-5 py-3 mb-4"
            />
           

            {/* <div className=" w-full flex flex-col md:flex-row justify-between items-center mt-1"></div> */}
            <Paper
              sx={{
                display: "flex",
                justifyContent: "start",
                flexWrap: "wrap",
                listStyle: "none",
                p: 0.5,
                m: 0,
                backgroundColor: "#32353b",
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
                placeholder="add keywords"
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
                placeholder="Number of question to generate:"
                min={0}
                className="py-2 my-3 w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-5 focus:outline-none "
              />
            </div>


            <div className=" w-full flex justify-center items-center">
              <button
                type="submit"
                className=" h-12 min-w-[150px] w-full md:w-[40%] mt-2 cursor-pointer bg-gradient-to-b from-lightred to-darkred rounded-lg text-center text-base text-white font-semibold"
              >
                Genarate
              </button>
            </div>
          </form>
        </div>
      </div>
      {loading && (
        <div className=" fixed  top-0 left-0 z-50 h-full w-full flex items-center justify-center bg-black/50">
          <Loading />
        </div>
      )}
    </div>
  );
}
