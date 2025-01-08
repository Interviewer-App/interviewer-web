"use client";
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
import { use, useEffect, useRef, useState } from "react";
import { getInterviewById, updateInterview } from "@/lib/api/interview";
import { MdEdit } from "react-icons/md";

//MUI
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { deleteInterview } from "@/lib/api/interview";
import { useRouter } from "next/navigation";

export default function InterviewPreviewPage({ params }) {
  const [interviewDetail, setInterviewDetail] = useState("");
  const [interviewId, setInterviewId] = useState(null);
  const [description, setDescription] = useState("");
  const [editDitails, setEditDetails] = useState(false);
  const [title, setTitle] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [skills, setSkills] = useState([]);
  const textareaRef = useRef(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setInterviewId(resolvedParams.id);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await getInterviewById(interviewId);
        console.log(response.data);
        setInterviewDetail(response.data);
      } catch (error) {
        console.log("Error fetching interviews:", error);
      }
    };
    fetchInterview();
  }, [interviewId, editDitails]);

  useEffect(() => {
    setDescription(interviewDetail.jobDescription);
    setTitle(interviewDetail.jobTitle);
    if (interviewDetail?.requiredSkills) {
      setSkills(interviewDetail.requiredSkills.split(", "));
    } else {
      setSkills([]);
    }
  }, [interviewDetail]);

  const handlePublishInterview = async (e) => {
    e.preventDefault();
    try {
      const response = await updateInterview(interviewId, {
        status: "ACTIVE",
      });

      if (response) {
        setEditDetails(false);
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
      const response = await updateInterview(interviewId, {
        jobDescription: description,
        jobTitle: title,
        requiredSkills: skills.join(", "),
      });

      if (response) {
        setEditDetails(false);
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

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [description]);

  const handleDeleteInterview =async() => {
    try {
      const response=await deleteInterview(interviewId);
      console.log('Interview',response);
      router.push('/interviews');
    } catch (error) {
      console.log(error);
    }
  }


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

        <div className=" px-9 py-4  max-w-[1500px] w-full mx-auto">
          <h1 className=" text-4xl font-semibold">
            InterviewsInterview Details
          </h1>
          <div className=" w-full flex justify-between items-center">
            <h1 className=" text-2xl font-semibold pt-5">
              Job Title:{" "}
              <input
                type="text"
                readOnly={!editDitails}
                value={title || ""}
                onChange={(e) => setTitle(e.target.value)}
                className={` ${
                  !editDitails ? "bg-transparent" : "bg-[#32353b] px-5"
                } font-normal rounded-lg focus:outline-none w-[400px] h-[45px]`}
              />
            </h1>
            {!editDitails ? (
              <button
                onClick={() => setEditDetails(!editDitails)}
                className=" bg-gray-500/60 py-3 px-5 rounded-full text-sm font-normal ml-2 flex flex-row items-center"
              >
                <MdEdit className=" text-xl mr-2 cursor-pointer text-white inline-block" />
                Edit details
              </button>
            ) : (
              <button
                onClick={handleSaveCanges}
                className=" bg-darkred py-3 px-6 text-center rounded-full text-sm font-normal ml-2 "
              >
                Save Changes
              </button>
            )}
          </div>
          <div className="flex w-full flex-col lg:flex-row justify-between items-start gap-4">
            <div className=" w-full lg:w-[60%]">
              <h1 className=" text-2xl font-semibold py-5">Description</h1>
              <textarea
                ref={textareaRef}
                readOnly={!editDitails}
                className={` text-justify py-5 w-full resize-none ${
                  !editDitails ? "bg-transparent" : "bg-[#32353b] px-5"
                } rounded-lg focus:outline-none`}
                value={description || ""}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className=" w-full lg:w-[35%]">
              <h1 className=" text-2xl font-semibold py-5">Required Skills</h1>
              <div className=" flex flex-wrap w-full">
                {skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={
                      editDitails ? () => handleDelete(skill) : undefined
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
                {editDitails && (
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
          <div className=" w-full flex justify-between items-center mt-5">
            <button
              onClick={handlePublishInterview}
              className=" h-12 min-w-[150px] w-full md:w-[200px] mt-8 cursor-pointer bg-gradient-to-b from-lightred to-darkred rounded-lg text-center text-base text-white font-semibold"
            >
              Publish Now
            </button>
            <button
              onClick={handleDeleteInterview}
              className=" h-12 min-w-[150px] w-full md:w-[200px] mt-8 cursor-pointer bg-red-700 rounded-lg text-center text-base text-white font-semibold"
            >
              Remove
            </button>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
