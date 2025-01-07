import * as React from "react";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import TagFacesIcon from "@mui/icons-material/TagFaces";

import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

import { MdClose } from "react-icons/md";
import { createInterview } from "@/lib/api/interview";

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export default function CreateInterviewModal({ setModalOpen }) {
  const [chipData, setChipData] = React.useState([]);
  const [inputValue, setInputValue] = React.useState("");
  const [jobTitle, setJobTitle] = React.useState("");
  const [jobDescription, setJobDescription] = React.useState("");
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");

  const toast = useToast();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      setChipData((prevChips) => [
        ...prevChips,
        { key: chipData.length, label: inputValue.trim() },
      ]);
      setInputValue("");
    }
  };

  const handleDelete = (chipToDelete) => () => {
    setChipData((chips) =>
      chips.filter((chip) => chip.key !== chipToDelete.key)
    );
    console.log(chipData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const interviewData = {
        companyID: "cm5f3mptx0001u77ka8iv6sss",
        jobTitle,
        jobDescription,
        requiredSkills: chipData.map((chip) => chip.label).join(", "),
        scheduledDate: new Date(`${date}T${time}`).toISOString(),
        scheduledAt: new Date(`${date}T${time}`).toISOString(),
        status: "DRAFT",
      };
      console.log(interviewData);
      const response = await createInterview(interviewData);

      if (response) {
        window.location.reload();
      }
      // }
    } catch (err) {
      if (err.response) {
        const { data } = err.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Interview create failed: ${data.message}`,
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
          Add new interview
        </h1>
        <button
          onClick={() => setModalOpen(false)}
          className=" absolute top-5 right-5 text-[#f3f3f3]"
        >
          <MdClose className=" text-2xl" />
        </button>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Job Title"
            name="title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
            className=" h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 mb-5"
          />
          <textarea
            placeholder="Job Description"
            name="description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            required
            rows={5}
            className=" w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-3 mb-5"
          />

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
            }}
            component="ul"
          >
            {chipData.map((data) => {
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
              placeholder="Add Skills"
              name="skills"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className=" h-[45px] rounded-lg text-sm border-0 bg-transparent placeholder-[#737883] px-6 py-2 mb-5 focus:outline-none"
            />
          </Paper>

          <div className=" w-full flex flex-col md:flex-row justify-between items-center mt-5">
            <div className=" w-full md:w-[48%]">
              <input
                type="date"
                placeholder="Schedule Date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className=" h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 mb-5"
              />
            </div>
            <div className="w-full md:w-[48%]">
              <input
                type="time"
                placeholder="Scheduled Time"
                name="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className=" h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 mb-5"
              />
            </div>
          </div>

          <div className=" w-full flex justify-center items-center">
            <button
              type="submit"
              className=" h-12 min-w-[150px] w-full md:w-[40%] mt-8 cursor-pointer bg-gradient-to-b from-lightred to-darkred rounded-lg text-center text-base text-white font-semibold"
            >
              Create Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
