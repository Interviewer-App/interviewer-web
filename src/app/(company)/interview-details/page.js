"use client";
import CreateInterviewModal from "@/components/interviews/create-interview-modal";
import InterviewDisplayCard from "@/components/interviews/interview-display-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Chip } from "@mui/material";
import { use, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { getInterviewById, updateInterview } from "@/lib/api/interview";
import { MdEdit } from "react-icons/md";

const InterviewDetailsPage = () => {
  const interview = JSON.parse(localStorage.getItem("interview"));
  const [interviewDetail, setInterviewDetail] = useState("");
  const [description, setDescription] = useState("");
  const [editDescription, setEditDescription] = useState(false);
  const [editSkills, setEditSkills] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await getInterviewById(interview.interviewID);
        console.log(response.data);
        setInterviewDetail(response.data);
      } catch (error) {
        console.log("Error fetching interviews:", error);
      }
    };
    fetchInterview();
  }, []);

  useEffect(() => {
      setDescription(interviewDetail.jobDescription);
      if (interviewDetail?.requiredSkills) {
        setSkills(interviewDetail.requiredSkills.split(", "));
      } else {
        setSkills([]);
      }
  }, [interviewDetail]);

  console.log("interviewDetail", interviewDetail);
  const { toast } = useToast();

  const handlePublishInterview = async (e) => {
    e.preventDefault();
    try {
      const response = await updateInterview(interviewDetail.interviewID, {
        status: "ACTIVE",
      });

      if (response) {
        window.location.href = "/interviews";
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Interview update failed: ${data.message}`,
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
  const handleSaveCanges = async (e) => {
    e.preventDefault();
    try {
      const response = await updateInterview(interviewDetail.interviewID, {
        jobDescription: description,
        requiredSkills: skills.join(", "),
      });

      if (response) {
        window.location.href = "/interview-details";
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Interview update failed: ${data.message}`,
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      setSkills((prevSkills) => [...prevSkills, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleDelete = (skillToDelete) => {
    setSkills((prevSkills) =>
      prevSkills.filter((skill) => skill !== skillToDelete)
    );
  };

  return (
    <>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Company</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Interview details</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className=" p-9 max-w-[1500px] w-full mx-auto">
          <h1 className=" text-5xl font-semibold">
            {interviewDetail.jobTitle}
          </h1>
          <div className="flex w-full flex-col lg:flex-row justify-between items-start gap-4 mt-4">
            <div className=" w-full lg:w-[60%]">
              <h1 className=" text-2xl font-semibold py-5">
                Description{" "}
                {!editDescription ? (
                  <MdEdit
                    onClick={() => setEditDescription(!editDescription)}
                    className=" text-2xl ml-2 cursor-pointer text-gray-500 inline-block"
                  />
                ) : (
                  <button
                    onClick={handleSaveCanges}
                    className=" bg-darkred py-2 px-4 rounded-full text-sm font-normal ml-2 "
                  >
                    Save Changes
                  </button>
                )}
              </h1>
              <textarea
                readOnly={!editDescription}
                className={` text-justify py-5 w-full resize-none ${
                  !editDescription ? "bg-transparent" : "bg-[#32353b] px-5"
                } rounded-lg focus:outline-none`}
                rows={11}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className=" w-full lg:w-[35%]">
              <h1 className=" text-2xl font-semibold py-5">
                Required Skills
                {!editSkills ? (
                  <MdEdit
                    onClick={() => setEditSkills(!editSkills)}
                    className=" text-2xl ml-2 cursor-pointer text-gray-500 inline-block"
                  />
                ) : (
                  <button
                    onClick={handleSaveCanges}
                    className=" bg-darkred py-2 px-4 rounded-full text-sm font-normal ml-2 "
                  >
                    Save Changes
                  </button>
                )}
              </h1>
              <div className=" flex flex-wrap w-full">
                {skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={
                      editSkills ? () => handleDelete(skill) : undefined
                    }
                    sx={{
                      fontWeight: "bold",
                      fontSize: "1rem",
                      padding: "1rem",
                      paddingY: "20px",
                      borderRadius: "9999px",
                      margin: "0.2rem",
                      backgroundColor: "#2d2f36",
                      color: "white",
                    }}
                  />
                ))}
                {editSkills && (
                  <input
                    type="text"
                    placeholder="Add Skills"
                    name="skills"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className=" h-[45px] rounded-lg text-sm border-0 bg-transparent placeholder-[#737883] px-6 py-2 mb-5 focus:outline-none"
                  />
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handlePublishInterview}
            className=" h-12 min-w-[150px] w-full md:w-[200px] mt-8 cursor-pointer bg-gradient-to-b from-lightred to-darkred rounded-lg text-center text-base text-white font-semibold"
          >
            Publish Now
          </button>
        </div>
      </SidebarInset>
    </>
  );
};

export default InterviewDetailsPage;
