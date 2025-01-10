"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

//Breadcrumbs
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

//Icons
import { MdEdit } from "react-icons/md";

//UI Components
import { Chip } from "@mui/material";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
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
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { DataTable } from "@/components/ui/InterviewDataTable/Datatable";
import { interviewSessionTableColumns } from "@/components/ui/InterviewDataTable/column";
import { fetchInterviewSessionsForInterview } from "@/lib/api/interview-session";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

//API
import { getInterviewById, updateInterview } from "@/lib/api/interview";
import { deleteInterview } from "@/lib/api/interview";
import { Button } from "@/components/ui/button";

export default function InterviewPreviewPage({ params }) {
  const [interviewDetail, setInterviewDetail] = useState("");
  const [interviewId, setInterviewId] = useState(null);
  const [description, setDescription] = useState("");
  const [editDitails, setEditDetails] = useState(false);
  const [title, setTitle] = useState("");
  const [interviewCategory, setInterviewCategory] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [skills, setSkills] = useState([]);
  const textareaRef = useRef(null);
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [interviewSessions, setInterviewSessions] = useState([]);
  const [interviewSessionsSort, setInterviewSessionsSort] = useState([]);
  const [totalsessions, setTotalSessions] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setInterviewId(resolvedParams.id);
    };
    unwrapParams();
  }, [params]);

  useEffect(() => {
    const fetchSessionData = async () => {
      setLoading(true);
      try {
        await fetchInterviewSessionsForInterview(
          interviewId,
          page,
          limit,
          setLoading,
          setInterviewSessions,
          setTotalSessions
        );
      } catch (error) {
        console.log("Error fetching interviews:", error);
      } finally {
        setLoading(false);
      }
    };

    if (interviewId) fetchSessionData();
  }, [interviewId, page, limit]);

  const handleNextPage = () => {
    if (page * limit < totalsessions) {
      setPage(page + 1);
    }
  };

  const handlePage = (page) => {
    if (page * limit < totalsessions) {
      setPage(page);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    const sortedSessions = interviewSessions.map((session) => ({
      interviewId: session.interview.interviewID,
      sessionId: session.sessionId,
      email: session.candidate.user.email,
      candidateName: session.candidate.user.firstName,
      startAt: new Date(session.scheduledDate).toLocaleDateString(),
      endAt: new Date(session.scheduledAt).toLocaleTimeString(),
      status: session.interviewStatus,
      score: session.score,
    }));

    setInterviewSessionsSort(sortedSessions);
  }, [interviewSessions]);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await getInterviewById(interviewId);
        setInterviewDetail(response.data);
      } catch (error) {
        console.log("Error fetching interviews:", error);
      }
    };
    if (interviewId) fetchInterview();
  }, [interviewId]);

  useEffect(() => {
    setDescription(interviewDetail.jobDescription);
    setTitle(interviewDetail.jobTitle);
    setInterviewCategory(interviewDetail.interviewCategory);
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
        interviewCategory,
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

  const handleDeleteInterview = async () => {
    try {
      const response = await deleteInterview(interviewId);
      router.push("/interviews");
    } catch (error) {
      console.log(error);
    }
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

        <div className=" px-9 py-4  max-w-[1500px] w-full mx-auto">
          <h1 className=" text-4xl font-semibold">
            Interview Details
          </h1>
          <div className=" w-full h-fit bg-slate-600/10 p-9 rounded-lg mt-5">
            <div className=" w-full flex justify-between items-center">
              <h1 className=" text-2xl font-semibold">
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
              <div className=" w-full lg:w-[35%] flex flex-col items-start">
                <div>
                  <h1 className=" text-2xl font-semibold py-5">
                    Required Skills
                  </h1>
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
                <div className=" w-full mt-5">
                  <h1 className=" text-2xl font-semibold py-5">
                    Interview Catagory
                  </h1>
                  {!editDitails && (
                    <h1 className=" bg-[#2d2f36] py-2 w-fit px-9 rounded-full">
                      {interviewCategory}
                    </h1>
                  )}
                  {editDitails && (<DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className={`bg-[#32353b] w-[150px] h-[45px] m-0 px-2 focus:outline-none outline-none`}
                        variant="outline"
                      >
                        {interviewCategory}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Interview Catagory</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup
                        value={interviewCategory}
                        onValueChange={setInterviewCategory}
                      >
                        <DropdownMenuRadioItem value="Technical">
                          Technical
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Behavioural">
                          Behavioural
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>)}
                </div>
              </div>
            </div>
            <div className=" w-full flex justify-between items-center mt-5">
              <button
                onClick={handlePublishInterview}
                className=" h-12 min-w-[150px] w-[200px] mt-8 cursor-pointer bg-gradient-to-b from-lightred to-darkred rounded-lg text-center text-base text-white font-semibold"
              >
                Publish Now
              </button>
              <AlertDialog>
                <AlertDialogTrigger>
                  <div className="h-12 min-w-[150px] w-[200px] mt-8 cursor-pointer bg-red-700 rounded-lg text-center text-base text-white font-semibold flex items-center justify-center">
                    Remove
                  </div>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to delete this interview?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteInterview} className='h-[45px]'>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <div className=" bg-slate-600/10 w-full h-fit min-h-[950px]  p-9 rounded-lg mt-5">
            <div>
              <h1 className=" text-2xl font-semibold">Interview sessions</h1>
              <div>
                {loading ? (
                  <div>Loading interview sessions...</div>
                ) : (
                  <DataTable
                    columns={interviewSessionTableColumns}
                    data={interviewSessionsSort}
                  />
                )}
              </div>
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => handlePreviousPage()} />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink onClick={() => handlePage(page + 1)}>
                    {page + 1}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink onClick={() => handlePage(page + 2)}>
                    {page + 2}
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext onClick={() => handleNextPage()} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
