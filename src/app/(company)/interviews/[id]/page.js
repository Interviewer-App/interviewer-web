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
import { IoCloseCircle } from "react-icons/io5";
import { CalendarIcon, Percent } from "lucide-react";

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
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import Editor from "@/components/rich-text/editor";

//API
import { getInterviewById, updateInterview } from "@/lib/api/interview";
import { deleteInterview } from "@/lib/api/interview";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, redirect } from "next/navigation";
import { useSession, getSession } from "next-auth/react";
import InviteCandidateModal from "@/components/company/invite-candidate-modal";
import { getInterviewCategoryCompanyById } from "@/lib/api/interview-category";
import InvitedCandidates from "@/components/interviews/invite-candidates";
import InterviewCharts from "@/components/interviews/interviewCharts";
import QuillEditor from "@/components/quillEditor";

export default function InterviewPreviewPage({ params }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [interviewDetail, setInterviewDetail] = useState("");
  const [interviewId, setInterviewId] = useState(null);
  const [description, setDescription] = useState("");
  const [editDetails, setEditDetails] = useState(false);
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
  const [interviewCategories, setInterviewCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [inputPercentage, setInputPercentage] = useState("");
  const [categoryList, setCatagoryList] = useState([]);
  const [inputCatagory, setInputCatagory] = useState("");
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [inputScheduleDate, setInputScheduleDate] = useState(new Date());
  const [inputScheduleStartTime, setInputScheduleStartTime] = useState("");
  const [inputScheduleEndTime, setInputScheduleEndTime] = useState("");
  const [scheduleList, setScheduleList] = useState([]);
  const [dateRange, setDateRange] = useState({});

  useEffect(() => {
    const fetchInterviewCategories = async () => {
      try {
        const session = await getSession();
        const companyId = session?.user?.companyID;
        const response = await getInterviewCategoryCompanyById(companyId);
        if (response) {
          setInterviewCategories(response.data.categories);
          setFilteredCategories(response.data.categories);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Error fetching interviews: ${error}`,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    };
    fetchInterviewCategories();
  }, []);

  useEffect(() => {
    const filter = interviewCategories.filter((category) =>
      categoryList.every((item) => item.key !== category.categoryId)
    );
    setFilteredCategories(filter);
  }, [categoryList, inputCatagory, inputPercentage]);

  const handleAddCatagoty = (e) => {
    e.preventDefault();

    if (
      inputCatagory.trim() !== "" &&
      inputPercentage.trim() !== "" &&
      totalPercentage < 100
    ) {
      setCatagoryList((prev) => [
        ...prev,
        {
          key: inputCatagory.trim(),
          catagory: interviewCategories.find(
            (cat) => cat.categoryId === inputCatagory.trim()
          )?.categoryName,
          percentage: inputPercentage.trim(),
        },
      ]);
      setInputPercentage("");
      setInputCatagory("");
    }
  };

  const handleDeleteCategory = (catagoryToDelete) => () => {
    setCatagoryList((catagory) =>
      catagory.filter((catagory) => catagory.key !== catagoryToDelete.key)
    );
  };

  const handleAddSchedule = (e) => {
    e.preventDefault();

    if (
      !inputScheduleDate ||
      !inputScheduleStartTime ||
      !inputScheduleEndTime
    ) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `All fields are required.`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }

    const newStart = convertToMinutes(inputScheduleStartTime);
    const newEnd = convertToMinutes(inputScheduleEndTime);
    if (newStart >= newEnd) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Start time must be earlier than end time.`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }

    const hasConflict = scheduleList.some((schedule) => {
      const existingStart = convertToMinutes(schedule.startTime);
      const existingEnd = convertToMinutes(schedule.endTime);

      return (
        schedule.date === inputScheduleDate &&
        newStart < existingEnd &&
        newEnd > existingStart
      );
    });

    if (hasConflict) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `The schedule conflicts with an existing time slot.`,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return;
    }
    setScheduleList((prev) => [
      ...prev,
      {
        key: scheduleList.length,
        date: inputScheduleDate,
        startTime: inputScheduleStartTime,
        endTime: inputScheduleEndTime,
      },
    ]);
    setInputScheduleDate("");
    setInputScheduleStartTime("");
    setInputScheduleEndTime("");
  };

  const convertToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const handleDeleteSchedule = (scheduleToDelete) => () => {
    setScheduleList((schedule) =>
      schedule.filter((schedule) => schedule.key !== scheduleToDelete.key)
    );
  };

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
        if (response.data) {
          setInterviewDetail(response.data);
          if (response.data.CategoryAssignment) {
            const categories = response.data.CategoryAssignment.map(
              (category) => {
                const matchingCategory = interviewCategories.find(
                  (cat) => cat.categoryId === category.categoryId
                );

                return {
                  key: category.categoryId,
                  catagory: matchingCategory?.categoryName || "",
                  percentage: category.percentage,
                };
              }
            );
            setCatagoryList(categories);
          }
          if (response.data.scheduling) {
            const schedules = response.data.scheduling.map((schedule) => ({
              key: schedule.scheduleID,
              date: new Date(schedule.startTime).toLocaleDateString(),
              startTime: new Date(schedule.startTime).toLocaleTimeString(),
              endTime: new Date(schedule.endTime).toLocaleTimeString(),
              isBooked: schedule.isBooked,
            }));
            setScheduleList(schedules);
          }
          if (response.data.startDate && response.data.endDate) {
            setDateRange({
              from: new Date(response.data.startDate),
              to: new Date(response.data.endDate),
            });
            console.log("date range", dateRange);
          }
        }
      } catch (error) {
        console.log("Error fetching interviews:", error);
      }
    };
    if (interviewId) fetchInterview();
  }, [interviewId, status, interviewCategories]);

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

  useEffect(() => {
    let total = 0;
    categoryList.map((catagory) => {
      total += parseFloat(catagory.percentage);
    });
    setTotalPercentage(total);
  }, [categoryList]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const response = await updateInterview(interviewId, {
        jobDescription: description,
        jobTitle: title,
        requiredSkills: skills.join(", "),
        interviewCategory,
        startDate: new Date(dateRange.from).toISOString(),
        endDate: new Date(dateRange.to).toISOString(),
        categoryAssignments: categoryList.map((catagory) => {
          return {
            categoryId: catagory.key,
            percentage: parseFloat(catagory.percentage),
          };
        }),
        schedules: scheduleList
          .filter((schedule) => !schedule.isBooked)
          .map((schedule) => {
            const startDate = new Date(schedule.date);
            const endDate = new Date(schedule.date);

            const [startHours, startMinutes] = schedule.startTime
              .split(":")
              .map(Number);
            const localStart = new Date(
              startDate.setHours(startHours, startMinutes, 0, 0)
            );

            const [endHours, endMinutes] = schedule.endTime
              .split(":")
              .map(Number);
            const localend = new Date(
              endDate.setHours(endHours, endMinutes, 0, 0)
            );

            const startDateUtc = localStart.toISOString();
            const endDateUtc = localend.toISOString();

            return {
              startTime: startDateUtc,
              endTime: endDateUtc,
            };
          }),
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
  }, [description, tab, editDetails]);

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
  const handleOnChange  =  (content) => {
    // debugger
    // console.log('Updated Desc:', content);
    // console.log(content);
    setDescription(content)
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
            <h1 className=" text-4xl font-semibold">
              {interviewDetail.jobTitle} - Interview
            </h1>
            {interviewDetail.status !== "ACTIVE" ? (
              <AlertDialog>
                <AlertDialogTrigger>
                  <span
                    className={` ${
                      tab === "edit" || tab === "settings" ? "hidden" : "block"
                    } py-2.5 min-w-[130px] w-[130px] mt-5 md:mt-0 cursor-pointer bg-white rounded-lg text-center text-sm text-black font-semibold`}
                  >
                    Publish Now
                  </span>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to publish this interview?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Once published, the job details will become visible to
                      candidates.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handlePublishInterview("ACTIVE")}
                      className="h-[40px] font-medium"
                    >
                      Publish
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger>
                  <span
                    className={` ${
                      tab === "edit" || tab === "settings" ? "hidden" : "block"
                    } py-2.5 min-w-[130px] w-[130px] mt-5 md:mt-0 cursor-pointer bg-gradient-to-b from-red-600 to-red-700 rounded-lg text-center text-sm text-white font-semibold`}
                  >
                    Unpublish
                  </span>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to Unpublish this interview?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      If you unpublish your job post, its details will no longer
                      be visible to candidates
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handlePublishInterview("ARCHIVED")}
                      className="h-[40px] font-medium"
                    >
                      Unpublish
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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
              <InterviewCharts />
            </div>
          )}

          {tab === "edit" && (
            <div className="w-full h-fit">
              {interviewDetail.status === "ACTIVE" &&
                interviewSessions.length > 0 && (
                  <div className="w-full h-fit bg-red-900/10 py-5 px-7 rounded-lg mt-5 border-2 border-red-600">
                    <div className=" w-full flex items-center justify-between">
                      <div>
                        <h1 className=" text-2xl font-semibold">
                          Warning: Edit Mode Unavailable
                        </h1>
                        <p className=" text-sm text-gray-500 py-3">
                          {`You cannot access edit mode because your interview has already been published and includes ${interviewSessions.length} interview sessions.`}
                        </p>
                      </div>

                      <div
                        onClick={() => setTab("sessions")}
                        className="h-11 min-w-[150px] w-[170px] mt-5 md:mt-0 cursor-pointer bg-red-600 rounded-lg text-center text-sm text-white font-semibold flex items-center justify-center"
                      >
                        View Sessions
                      </div>
                    </div>
                  </div>
                )}
              {interviewDetail.status === "ACTIVE" &&
                interviewSessions.length === 0 && (
                  <div className="w-full h-fit bg-red-900/10 py-5 px-7 rounded-lg mt-5 border-2 border-red-600">
                    <div className=" w-full flex items-center justify-between">
                      <div>
                        <h1 className=" text-2xl font-semibold">
                          Warning: Edit Mode Unavailable
                        </h1>
                        <p className=" text-sm text-gray-500 py-3">
                          {`You cannot access edit mode because your interview has already been published.`}
                        </p>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger>
                          <span className="h-11 min-w-[150px] w-[170px] mt-5 md:mt-0 cursor-pointer bg-red-600 rounded-lg text-center text-sm text-white font-semibold flex items-center justify-center">
                            Unpublish now
                          </span>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure you want to Unpublish this interview?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              If you unpublish your job post, its details will
                              no longer be visible to candidates
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handlePublishInterview("ARCHIVED")}
                              className="h-[40px] font-medium"
                            >
                              Unpublish
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                )}
              {interviewDetail.status !== "ACTIVE" &&
                interviewSessions.length > 0 && (
                  <div className="w-full h-fit bg-red-900/10 py-5 px-7 rounded-lg mt-5 border-2 border-red-600">
                    <div className=" w-full flex items-center justify-between">
                      <div>
                        <h1 className=" text-2xl font-semibold">
                          Warning: Edit Mode Unavailable
                        </h1>
                        <p className=" text-sm text-gray-500 py-3">
                          {`You cannot access edit mode because your interview has already includes ${interviewSessions.length} interview sessions.`}
                        </p>
                      </div>

                      <div
                        onClick={() => setTab("sessions")}
                        className="h-11 min-w-[150px] w-[170px] mt-5 md:mt-0 cursor-pointer bg-red-600 rounded-lg text-center text-sm text-white font-semibold flex items-center justify-center"
                      >
                        View Sessions
                      </div>
                    </div>
                  </div>
                )}
              <div className=" w-full h-fit bg-slate-600/10 p-9 rounded-lg mt-5">
                <div className=" w-full flex justify-between items-center">
                  <h1 className=" text-2xl font-semibold">
                    Job Title:{" "}
                    <input
                      type="text"
                      readOnly={!editDetails}
                      value={title || ""}
                      onChange={(e) => setTitle(e.target.value)}
                      className={` ${
                        !editDetails ? "bg-transparent" : "bg-[#32353b] px-5"
                      } font-normal rounded-lg focus:outline-none w-[400px] h-[45px]`}
                    />
                  </h1>
                  {interviewDetail.status !== "ACTIVE" &&
                    interviewSessions.length === 0 && (
                      <div>
                        <button
                          onClick={() => setEditDetails(!editDetails)}
                          className={` ${
                            editDetails ? "hidden" : "block"
                          } bg-gray-500/60 py-3 px-5 rounded-full text-sm font-normal ml-2 flex flex-row items-center`}
                        >
                          <MdEdit className=" text-xl mr-2 cursor-pointer text-white inline-block" />
                          Edit details
                        </button>

                        <button
                          onClick={handleSaveChanges}
                          className={` ${
                            editDetails && totalPercentage == 100
                              ? "block"
                              : "hidden"
                          } bg-darkred py-3 px-6 text-center rounded-full text-sm font-normal ml-2 `}
                        >
                          Save Changes
                        </button>
                        <button
                          className={` ${
                            editDetails && totalPercentage != 100
                              ? "block"
                              : "hidden"
                          } bg-gray-600 py-3 px-6 text-center rounded-full text-sm font-normal ml-2 `}
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                </div>
                <div className="flex w-full flex-col lg:flex-row justify-between items-start gap-4">
                  <div className=" w-full lg:w-[63%] pr-10 border-r-2 border-gray-800/50">
                    <h1 className=" text-2xl font-semibold py-5  ">
                      Description
                    </h1>
                    {/* <div
                      className="text-justify w-full bg-transparent rounded-lg"
                      dangerouslySetInnerHTML={{ __html: description }}
                    /> */}

                    <QuillEditor
                      value={description}
                      placeholder="Enter job description..." // Make sure this is passed correctly
                      onChange={handleOnChange}
                    />



                    {/* {editDetails ? (
                      <Editor
                        content={description}
                        onChange={setDescription}
                        placeholder="Write your post"
                        readOnly={false}
                        required
                        className=" w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-3 rich-text"
                      />
                    ) : (
                      <div
                        className="text-justify w-full bg-transparent rounded-lg"
                        dangerouslySetInnerHTML={{ __html: description }}
                      />
                    )} */}
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
                              editDetails
                                ? () => handleDelete(skill)
                                : undefined
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
                        {editDetails && (
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
                    <div>
                      <h1 className=" text-2xl font-semibold py-5">
                        Interview Schedules
                      </h1>
                      <table className=" w-full">
                        <thead className=" bg-gray-700/20 text-center rounded-lg text-sm">
                          <tr>
                            <td className=" p-3 w-[30%]">Date</td>
                            <td className=" p-3 w-[30%]">Start Time</td>
                            <td className=" p-3 w-[30%]">End Time</td>
                            <td className=" p-3 w-[10%]"></td>
                          </tr>
                        </thead>
                        <tbody>
                          {editDetails && (
                            <tr>
                              <td className=" w-[30%]">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "w-full justify-start !bg-[#32353b] h-[45px] text-left font-normal",
                                        !inputScheduleDate &&
                                          "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon />
                                      {inputScheduleDate
                                        ? inputScheduleDate.toLocaleDateString()
                                        : "Scheduled Date"}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={inputScheduleDate}
                                      onSelect={setInputScheduleDate}
                                      initialFocus
                                      disabled={(date) => {
                                        const startDate = new Date(
                                          dateRange.from
                                        );
                                        const endDate = new Date(dateRange.to);

                                        return (
                                          date < startDate || date > endDate
                                        );
                                      }}
                                    />
                                  </PopoverContent>
                                </Popover>
                              </td>
                              <td className=" w-[30%] p-1">
                                <input
                                  type="time"
                                  placeholder="Start Time"
                                  name="start_time"
                                  value={inputScheduleStartTime}
                                  onChange={(e) =>
                                    setInputScheduleStartTime(e.target.value)
                                  }
                                  required
                                  className=" h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 mt-3 md:mt-0"
                                />
                              </td>
                              <td className=" w-[30%]">
                                <input
                                  type="time"
                                  placeholder="End Time"
                                  name="end_time"
                                  value={inputScheduleEndTime}
                                  onChange={(e) =>
                                    setInputScheduleEndTime(e.target.value)
                                  }
                                  required
                                  className=" h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 mt-3 md:mt-0"
                                />
                              </td>
                              <td className=" w-[10%]">
                                <button
                                  onClick={handleAddSchedule}
                                  className=" h-[45px] aspect-square text-black bg-white hover:border-gray-500 rounded-lg text-3xl flex items-center justify-center ml-2"
                                >
                                  +
                                </button>
                              </td>
                            </tr>
                          )}
                          {scheduleList.map((schedule) => (
                            <tr key={schedule.key} className=" bg-gray-800/10">
                              <td className=" py-3 px-4 w-[30%] text-center">
                                {new Date(schedule.date).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )}
                              </td>
                              <td className=" p-3 w-[30%] text-center">
                                {schedule.startTime}
                              </td>
                              <td className=" p-3 w-[30%] text-center">
                                {schedule.endTime}
                              </td>
                              <td className=" p-3 w-[10%] text-center">
                                {editDetails ? (
                                  <>
                                    <IoCloseCircle
                                      onClick={handleDeleteSchedule(schedule)}
                                      className={` ${
                                        schedule.isBooked ? "hidden" : "block"
                                      } text-gray-500 text-2xl cursor-pointer`}
                                    />
                                    <div
                                      className={` ${
                                        schedule.isBooked ? "block" : "hidden"
                                      } text-xs px-3 py-1 text-green-500 bg-green-500/20 rounded-full flex justify-start items-center`}
                                    >
                                      <div className=" aspect-square h-[8px] rounded-full bg-green-400"></div>
                                      <div className=" ml-2">Booked</div>
                                    </div>
                                  </>
                                ) : (
                                  <div
                                    className={` ${
                                      schedule.isBooked ? "block" : "hidden"
                                    } text-xs px-3 py-1 text-green-500 bg-green-500/20 rounded-full flex justify-start items-center`}
                                  >
                                    <div className=" aspect-square h-[8px] rounded-full bg-green-400"></div>
                                    <div className=" ml-2">Booked</div>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className=" w-full lg:w-[32%] flex flex-col items-start">
                    <div className=" w-full mt-5 md:mt-0 min-h-[350px]">
                      <h1 className=" text-2xl font-semibold py-5">
                        Interview Catagory
                      </h1>
                      {editDetails && (
                        <p
                          className={` text-red-500 text-xs py-2 ${
                            totalPercentage !== 100 ? "block" : "hidden"
                          }`}
                        >
                          *Please ensure the total percentage equals 100%. The
                          sum of all category percentages should not exceed or
                          fall below 100%. Adjust your inputs accordingly.
                        </p>
                      )}

                      <div
                        className={`flex w-full justify-between space-x-2 ${
                          editDetails ? "block" : "hidden"
                        }`}
                      >
                        <div className="w-[40%]">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                className={`!bg-[#32353b] w-full h-[45px] m-0 px-2 focus:outline-none outline-none`}
                                variant="outline"
                              >
                                {interviewCategories.find(
                                  (cat) => cat.categoryId === inputCatagory
                                )?.categoryName || "Select Category"}
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                              <DropdownMenuLabel>
                                Interview Catagory
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuRadioGroup
                                value={inputCatagory}
                                onValueChange={setInputCatagory}
                              >
                                {filteredCategories.map((category) => (
                                  <DropdownMenuRadioItem
                                    key={category.categoryId}
                                    value={category.categoryId}
                                  >
                                    {category.categoryName}
                                  </DropdownMenuRadioItem>
                                ))}
                              </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="w-[40%]">
                          <input
                            value={inputPercentage}
                            onChange={(e) => setInputPercentage(e.target.value)}
                            placeholder="Percentage"
                            type="number"
                            className="h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 mb-5"
                          />
                        </div>
                        <div className="w-[20%]">
                          <button
                            onClick={handleAddCatagoty}
                            className=" h-[45px] aspect-square text-black bg-white hover:border-gray-500 rounded-full text-3xl flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="  overflow-y-auto min-h-[250px]">
                        <table className=" w-full">
                          <thead className=" bg-gray-700/20 text-center rounded-lg text-sm">
                            <tr>
                              <td className=" p-3 w-[40%]">Catagory</td>
                              <td className=" p-3 w-[40%]">Percentage</td>
                              {editDetails && (
                                <td className=" p-3 w-[20%]"></td>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {categoryList.map((catagory) => (
                              <tr
                                key={catagory.key}
                                className=" bg-gray-800/10"
                              >
                                <td className=" py-3 px-4 w-[40%]">
                                  {catagory.catagory}
                                </td>
                                <td className=" p-3 w-[40%] text-center">
                                  {catagory.percentage}
                                </td>
                                <td
                                  className={` p-3 w-[20%] text-center ${
                                    editDetails ? "block" : "hidden"
                                  }`}
                                >
                                  <IoCloseCircle
                                    onClick={handleDeleteCategory(catagory)}
                                    className=" text-gray-500 text-2xl cursor-pointer"
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <h1 className=" text-2xl font-semibold py-5">
                        Scheduled Date Range
                        <div className=" w-full mt-5">
                          {!editDetails ? (
                            <span className=" text-base font-normal text-gray-400">
                              {dateRange.from.toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}{" "}
                              -{" "}
                              {dateRange.to.toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                          ) : (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full justify-start !bg-[#32353b] h-[45px] text-left font-normal",
                                    !dateRange && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon />
                                  {dateRange?.from ? (
                                    dateRange.to ? (
                                      <>
                                        {dateRange.from.toLocaleDateString(
                                          "en-GB",
                                          {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                          }
                                        )}{" "}
                                        -{" "}
                                        {dateRange.to.toLocaleDateString(
                                          "en-GB",
                                          {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                          }
                                        )}
                                      </>
                                    ) : (
                                      dateRange.from.toLocaleDateString(
                                        "en-GB",
                                        {
                                          day: "numeric",
                                          month: "long",
                                          year: "numeric",
                                        }
                                      )
                                    )
                                  ) : (
                                    <span>Pick Date Range</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="range"
                                  selected={dateRange}
                                  onSelect={setDateRange}
                                  initialFocus
                                  numberOfMonths={2}
                                />
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                      </h1>
                    </div>
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
                        className="h-[40px] font-medium"
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
            <>
              <div className="w-full h-fit bg-yellow-900/10 py-5 px-7 rounded-lg mt-5 border-2 border-yellow-600">
                <div className=" w-full flex items-center justify-between">
                  <div>
                    <h1 className=" text-2xl font-semibold">
                      Invite Candidate
                    </h1>
                    <p className=" text-sm text-gray-500 py-3">
                      You can now invite the desired candidate by using their
                      email address. Ensure the email is accurate before sending
                      the invitation.
                    </p>
                  </div>

                  <div
                    onClick={() => setInviteModalOpen(true)}
                    className="h-11 min-w-[150px] w-[170px] mt-5 md:mt-0 cursor-pointer bg-yellow-600 rounded-lg text-center text-sm text-white font-semibold flex items-center justify-center"
                  >
                    Invite Candidates
                  </div>
                </div>
              </div>
              <InvitedCandidates
                interviewId={interviewId}
                inviteModalOpen={inviteModalOpen}
              />
            </>
          )}
        </div>
      </SidebarInset>
      {inviteModalOpen && (
        <InviteCandidateModal
          setInviteModalOpen={setInviteModalOpen}
          interviewId={interviewId}
        />
      )}
    </>
  );
}
