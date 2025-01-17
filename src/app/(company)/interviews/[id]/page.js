"use client";
import { useEffect, useRef, useState } from "react";
import socket from "../../../../lib/utils/socket";

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
import {
  fetchInterviewSessionsForInterview,
  getInterviewOverviewById,
} from "@/lib/api/interview-session";
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
import Loading from "@/app/loading";
import { usePathname, useRouter, redirect } from "next/navigation";
import { useSession, getSession } from "next-auth/react";
import InviteCandidateModal from "@/components/company/invite-candidate-modal";

export default function InterviewPreviewPage({ params }) {
  const { data: session } = useSession();
  const pathname = usePathname();
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
  const [tab, setTab] = useState("overview");
  const [status, setStatus] = useState("");
  const [interviewOverview, setInterviewOverview] = useState({});
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

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

    socket.on("joinedParticipants", (data) => {
      if (interviewId) fetchSessionData();
      toast({
        title: "New Participant Joined!",
        description: "A new participant has successfully joined the interview.",
        action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
      });
    });

    if (interviewId) fetchSessionData();

    return () => {
      socket.off("joinedParticipants");
    };
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
      score: session.score ? session.score : "N/A",
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
  }, [interviewId, status]);

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

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const response = await getInterviewOverviewById(interviewId);
        if (response.data) {
          setInterviewOverview(response.data);
        }
      } catch (error) {
        console.log("Error fetching interview overview:", error);
      }
    };
    if (interviewId) fetchOverviewData();
  }, [interviewId]);

  const handlePublishInterview = async (status) => {
    try {
      const response = await updateInterview(interviewId, {
        status: status,
      });

      if (response) {
        setEditDetails(false);
        setStatus(status);
        socket.emit("publishInterview", {
          interviewId: interviewId,
          companyId: interviewDetail.companyID,
        });
        toast({
          title: `Interview ${
            status === "ACTIVE" ? "published" : "unpublished"
          } Successfully!`,
          description: `The interview has been ${
            status === "ACTIVE" ? "published" : "unpublished"
          } and is now ${status === "ACTIVE" ? "available" : "not available"}.`,
          action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
        });
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
        socket.emit("publishInterview", {
          interviewId: interviewId,
          companyId: interviewDetail.companyID,
        });
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
  }, [description, tab, editDitails]);

  const handleDeleteInterview = async () => {
    try {
      const response = await deleteInterview(interviewId);
      if (response) {
        socket.emit("publishInterview", {
          interviewId: interviewId,
          companyId: interviewDetail.companyID,
        });
        router.push("/interviews");
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (session.user.role !== "COMPANY") {
    const loginURL = `/login?redirect=${encodeURIComponent(pathname)}`;
    redirect(loginURL);
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
          <div className=" w-full flex flex-col md:flex-row justify-between md:items-center">
            <h1 className=" text-4xl font-semibold">{interviewDetail.jobTitle} - Interview</h1>
            {interviewDetail.status !== "ACTIVE" ? (
              <button
                onClick={() => handlePublishInterview("ACTIVE")}
                className={` ${
                  tab === "edit" || tab === "settings" ? "hidden" : "block"
                } py-2.5 min-w-[130px] w-[130px] mt-5 md:mt-0 cursor-pointer bg-white rounded-lg text-center text-sm text-black font-semibold`}
              >
                Publish Now
              </button>
            ) : (
              <button
                onClick={() => handlePublishInterview("ARCHIVED")}
                className={` ${
                  tab === "edit" || tab === "settings" ? "hidden" : "block"
                } py-2.5 min-w-[130px] w-[130px] mt-5 md:mt-0 cursor-pointer bg-gradient-to-b from-red-600 to-red-700 rounded-lg text-center text-sm text-white font-semibold`}
              >
                Unpublish
              </button>
            )}
          </div>
          <div className=" w-full mt-5">
            <div className="flex space-x-4 bg-slate-600/20 w-fit p-1 md:p-2 rounded-lg">
              <button
                onClick={() => setTab("overview")}
                className={` text-xs md:text-sm py-2 px-4 md:px-6 rounded-lg ${
                  tab === "overview" ? "bg-gray-800" : ""
                } `}
              >
                Overview
              </button>
              <button
                onClick={() => setTab("sessions")}
                className={` text-xs md:text-sm py-2 px-4 md:px-6 rounded-lg ${
                  tab === "sessions" ? "bg-gray-800" : ""
                } `}
              >
                Interview Sessions
              </button>
              <button
                onClick={() => setTab("invitation")}
                className={` text-xs md:text-sm py-2 px-4 md:px-6 rounded-lg ${
                  tab === "invitation" ? "bg-gray-800" : ""
                } `}
              >
                Invitation
              </button>
              <button
                onClick={() => setTab("edit")}
                className={` text-xs md:text-sm py-2 px-4 md:px-6 rounded-lg ${
                  tab === "edit" ? "bg-gray-800" : ""
                } `}
              >
                Edit
              </button>
              <button
                onClick={() => setTab("settings")}
                className={` text-xs md:text-sm py-2 px-4 md:px-6 rounded-lg ${
                  tab === "settings" ? "bg-gray-800" : ""
                } `}
              >
                Settings
              </button>
            </div>
          </div>

          {tab === "overview" && (
            <div className=" w-full h-full md:p-9 rounded-lg mt-5">
              <div className=" w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className=" bg-slate-600/10 rounded-lg px-6 py-5 w-full">
                  <h1 className=" text-lg md:text-2xl font-semibold">
                    Highest Mark
                  </h1>
                  <h1 className=" text-2xl md:text-5xl lg:text-7xl font-semibold pt-6 px-5">
                    {interviewOverview?.maxScore || 0}
                    <span className=" text-base px-2">%</span>
                  </h1>
                  <p className=" text-md font-semibold px-5">
                    {interviewOverview?.maxScoreCandidateFirstName || ""}{" "}
                    {interviewOverview?.maxScoreCandidateLastName ||
                      "             "}
                  </p>
                </div>
                <div className=" bg-slate-600/10 rounded-lg px-6 py-5 w-full">
                  <h1 className=" text-lg md:text-2xl font-semibold">
                    Total Sessions
                  </h1>
                  <h1 className=" text-2xl md:text-5xl lg:text-7xl font-semibold py-6 px-5">
                    {interviewOverview?.total || 0}
                    <span className=" text-base px-2">Sessions</span>
                  </h1>
                </div>
                <div className=" bg-slate-600/10 rounded-lg px-6 py-5 w-full">
                  <h1 className=" text-lg md:text-2xl font-semibold">
                    Completed Sessions
                  </h1>
                  <h1 className=" text-2xl md:text-5xl lg:text-7xl font-semibold py-6 px-5">
                    {interviewOverview?.totalCompletedInterviews || 0}
                    <span className=" text-base px-2">Sessions</span>
                  </h1>
                </div>
              </div>
            </div>
          )}

          {tab === "edit" && (
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
                    className={` bg-gray-500/60 py-3 px-5 rounded-full text-sm font-normal ml-2 flex flex-row items-center`}
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
                    {editDitails && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className={`bg-[#32353b] w-[150px] h-[45px] m-0 px-2 focus:outline-none outline-none`}
                            variant="outline"
                          >
                            {interviewCategory}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          <DropdownMenuLabel>
                            Interview Catagory
                          </DropdownMenuLabel>
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
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {tab === "sessions" && (
            <div className=" bg-slate-600/10 w-full h-fit p-9 rounded-lg mt-5">
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
          )}

          {tab === "settings" && (
            <div className="w-full h-fit bg-red-900/10 py-5 px-7 rounded-lg mt-5 border-2 border-red-700">
              <div className=" w-full flex items-center justify-between">
                <div>
                  <h1 className=" text-2xl font-semibold">Delete Interview</h1>
                  <p className=" text-sm text-gray-500 py-3">
                    Once this action is performed, your interview will be
                    permanently deleted.
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <div className="h-11 min-w-[130px] w-[140px] mt-5 md:mt-0 cursor-pointer bg-red-700 rounded-lg text-center text-sm text-white font-semibold flex items-center justify-center">
                      Delete
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
                      <AlertDialogAction
                        onClick={handleDeleteInterview}
                        className="h-[45px]"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
          {tab === "invitation" && (
            <div className="w-full h-fit bg-yellow-900/10 py-5 px-7 rounded-lg mt-5 border-2 border-yellow-600">
              <div className=" w-full flex items-center justify-between">
                <div>
                  <h1 className=" text-2xl font-semibold">Invite Candidate</h1>
                  <p className=" text-sm text-gray-500 py-3">
                    You can now invite the desired candidate by using their
                    email address. Ensure the email is accurate before sending
                    the invitation.
                  </p>
                </div>

                <div onClick={() => setInviteModalOpen(true)} className="h-11 min-w-[150px] w-[170px] mt-5 md:mt-0 cursor-pointer bg-yellow-600 rounded-lg text-center text-sm text-white font-semibold flex items-center justify-center">
                  Invite Candidates
                </div>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
      {inviteModalOpen && (<InviteCandidateModal setInviteModalOpen={setInviteModalOpen}/>)}
    </>
  );
}
