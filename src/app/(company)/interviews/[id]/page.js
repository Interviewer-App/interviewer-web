"use client";
import { use, useEffect, useRef, useState } from "react";
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
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarIcon,
  ChevronRight,
  Clock,
  Edit,
  Percent,
  Trash2,
  Users,
  AlertCircleIcon,
  Sparkles,
  Plus,
  LoaderCircle,
  Calendar as CalendarIcon2,
  UserPlus,
  Share2,
  Mail,
  Copy,
  X,
  Check,
  Loader2,
  Save,
  StopCircle,
  ArrowUpRight,
  Hourglass,
  AlertCircle,
} from "lucide-react";
import { GiDiamondTrophy } from "react-icons/gi";
import Trophy from "@/assets/analyze/trophy.png";
import brownzeTrophy from "@/assets/analyze/brownzeTrophy.png";
import silverTrophy from "@/assets/analyze/silverTrophy.png";
import goldTrophy from "@/assets/analyze/goldTrophy.png";
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
import { candidatesTableColumns } from "@/components/ui/candidateDataTable/column";
import {
  fetchCandidatesForInterview,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import GenerateQuestionModal from "@/components/company/generate-question-modal";
import CreateQuestionModal from "@/components/company/create-question-modal";
import dynamic from "next/dynamic";
// import { Doughnut, Pie } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement
// );
const QuillEditor = dynamic(() => import("@/components/quillEditor"), {
  ssr: false,
});

//API
import {
  getInterviewById,
  interviewStatus,
  sortCandidates,
  updateInterview,
} from "@/lib/api/interview";
import { deleteInterview } from "@/lib/api/interview";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter, redirect } from "next/navigation";
import { useSession, getSession } from "next-auth/react";
import InviteCandidateModal from "@/components/company/invite-candidate-modal";
import { getInterviewCategoryCompanyById } from "@/lib/api/interview-category";
import InvitedCandidates from "@/components/interviews/invite-candidates";
import QuestionDisplayCard from "@/components/company/question-display-card";
import { CandidateDataTable } from "@/components/ui/candidateDataTable/DataTable";
import SubCategoryDisplayCard from "@/components/interviews/subCategory-display-card";
import Image from "next/image";
import Link from "next/link";
import { LuCircleCheckBig } from "react-icons/lu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  createQuestionForInterview,
  deleteInterviewQuestion,
  updateInterviewQuestion,
} from "@/lib/api/question";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip";
import { RiInformation2Line } from "react-icons/ri";
import {
  generateInterviewQuestions,
  generateRecommondations,
  generateSoftSkills,
} from "@/lib/api/ai";

import {
  getInterviewTimeSlotsInterviewById,
  sendInvitaionForCandidates,
} from "@/lib/api/interview-invitation";
import CandidateAnalysisTab from "@/components/company/analysis-tab";
import SkillsInput from "@/components/inputs/skillsInput";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import TimeSlotsTab from "@/components/company/time-slots-tab";


export default function InterviewPreviewPage({ params }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [interviewDetail, setInterviewDetail] = useState({});
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
  const [interviewCandidates, setInterviewCandidates] = useState([]);
  const [interviewCandidateSort, setInterviewCandidateSort] = useState([]);
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [totalsessions, setTotalSessions] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [tab, setTab] = useState("overview");
  const [questionTab, setQuestionTab] = useState("technical");
  const [status, setStatus] = useState("");
  const [interviewOverview, setInterviewOverview] = useState({});
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [interviewCategories, setInterviewCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [inputPercentage, setInputPercentage] = useState("");
  const [categoryList, setCatagoryList] = useState([]);
  const [inputCatagory, setInputCatagory] = useState("");
  const [totalPercentage, setTotalPercentage] = useState(0);
  const [inputScheduleDate, setInputScheduleDate] = useState(new Date());
  const [inputScheduleStartTime, setInputScheduleStartTime] = useState("");
  const [inputScheduleEndTime, setInputScheduleEndTime] = useState("");
  const [isQuestionEdit, setIsQuestionEdit] = useState(false);
  const [scheduleList, setScheduleList] = useState([]);
  const [questionList, setQuestionList] = useState([]);
  const [selectedSubAssignment, setSelectedSubAssignment] = useState(null);
  const [selectedSortCategory, setSelectedSortCategory] = useState("overall");
  const [sortLimit, setSortLimit] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [sortDirection, setSortDirection] = useState("desc");
  const [dateRange, setDateRange] = useState({});
  const [interviewStatusDetails, setInterviewStatusDetails] = useState({});
  const [activeTab, setActiveTab] = useState("overview");
  const [bookingsData, setBookingsData] = useState([]);
  const [sessionsData, setSessionsData] = useState([]);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmails, setInviteEmails] = useState("");
  const [inviteLink, setInviteLink] = useState(
    "https://interviews.skillchecker.ai/i/cm8qzz3bi0015lf4gaOil6auh"
  );
  const [interviewInviteTab, setInterviewInviteTab] = useState("email");
  const [email, setEmail] = useState("");
  const [interviewTimeSlots, setInterviewTimeSlots] = useState({});
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [interviewTimeSlotsDates, setInterviewTimeSlotsDates] = useState([]);
  const [interviewTimeSlotsTabel, setInterviewTimeSlotsTabel] = useState([]);
  const [filterInterviewTimeSlots, setFilterInterviewTimeSlots] = useState([]);
  const [noOfQuestions, setNoOfQuestions] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [todayCandidates, setTodayCandidates] = useState(0);

  // useEffect(() => {
  //   console.log('interviewIddddd',)
  // }, [interviewId])

  const handleInvite = () => {
    // In a real app, this would send invitations to the provided emails
    // toast.success(`Invitations sent to ${inviteEmails.split("\n").length} candidates`)
    setInviteEmails("");
    setIsInviteDialogOpen(false);
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(inviteLink);
      toast({
        title: "Success!",
        description: "Invitation link copied to clipboard",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy link to clipboard",
      });
      console.error("Failed to copy: ", err);
    }
    setIsCopied(true);

    // Reset after 2 seconds
    setTimeout(() => setIsCopied(false), 2000);
  };

  const [chartData, setChartData] = useState({
    labels: ["Requests", "Invitations"],
    datasets: [
      {
        label: "Schedules",
        data: [0, 0],
        backgroundColor: ["rgba(111, 88, 223, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(111, 88, 223, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  });
  const [pieChartData, setPieChartData] = useState({
    labels: ["Pending", "Completed"],
    datasets: [
      {
        label: "Sessions",
        data: [0, 0],
        backgroundColor: ["rgba(111, 88, 223, 0.2)", "rgba(54, 162, 235, 0.2)"],
        borderColor: ["rgba(111, 88, 223, 1)", "rgba(54, 162, 235, 1)"],
        borderWidth: 1,
      },
    ],
  });
  const [categoryChartData, setCategoryChartData] = useState({});
  const [technicalPercentage, setTechnicalPercentage] = useState(60);
  const [softSkillsPercentage, setSoftSkillsPercentage] = useState(40);
  const [useQuestionnaire, setUseQuestionnaire] = useState(true);
  const [newSoftSkill, setNewSoftSkill] = useState({
    name: "",
    description: "",
    percentage: 0,
    subcategories: [],
  });
  const [isSoftSkillPromptOpen, setIsSoftSkillPromptOpen] = useState(false);
  const [softSkillPrompt, setSoftSkillPrompt] = useState("");
  const [editingSoftSkill, setEditingSoftSkill] = useState(null);
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false);

  // Add new state for subcategory management
  const [newSubcategory, setNewSubcategory] = useState({
    skillId: null,
    name: "",
    description: "",
  });
  const [proficiencyLevel, setProficiencyLevel] = useState(null);
  const [relatedField, setRelatedField] = useState(null);

  const [isSubcategoryPromptOpen, setIsSubcategoryPromptOpen] = useState(false);
  const [subcategoryPrompt, setSubcategoryPrompt] = useState("");
  const [currentSkillForSubcategories, setCurrentSkillForSubcategories] =
    useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [softSkills, setSoftSkills] = useState([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState({});
  const [isAddingSoftSkill, setIsAddingSoftSkill] = useState(false);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [softSkillsLoading, setSoftSkillsLoading] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newQuestionTimeDuration, setNewQuestionTimeDuration] = useState(0);
  const [newQuestionType, setNewQuestionType] = useState("OPEN_ENDED");
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [isQuestionPromptOpen, setIsQuestionPromptOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [questionGenerationLoading, setQuestionGenerationLoading] =
    useState(false);
  const [questions, setQuestions] = useState([
    {
      id: "q1",
      text: "Explain the concept of state management in React",
      marks: 10,
    },
    {
      id: "q2",
      text: "What are the key differences between REST and GraphQL?",
      marks: 10,
    },
  ]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingQuestionDetails, setEditingQuestionDetails] = useState({
    questionText: "",
    estimatedTimeMinutes: 0,
    type: "",
    interviewQuestionID: null,
  });

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

  useEffect(() => {
    const fetchCandidatesData = async () => {
      setLoading(true);
      try {
        await fetchCandidatesForInterview(
          interviewId,
          page,
          limit,
          setLoading,
          setInterviewCandidates,
          setTotalCandidates
        );
        setTotalCandidates(response.total);

        // Count today's candidates
        const todayCount = response.data.filter(schedule =>
          isToday(schedule.startTime)
        ).length;

        setTodayCandidates(todayCount);

      } catch (error) {
        console.log("Error fetching interviews:", error);
      } finally {
        setLoading(false);
      }
    };

    if (interviewId) fetchCandidatesData();
  }, [interviewId, page, limit, inviteModalOpen]);

  const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const hexToRgba = (hex, opacity = 0.2) => {
    // Remove the hash symbol if it exists
    hex = hex.replace("#", "");

    // Convert the hex string into RGB values
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Return the RGBA format
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  useEffect(() => {
    const totalPercentage = categoryList.reduce(
      (acc, cat) => acc + parseFloat(cat.percentage),
      0
    );
    const remaining = 100 - totalPercentage;

    // Use actual colors from subcategories
    const backgroundColors = categoryList.map((cat) =>
      hexToRgba(cat.color, 0.2)
    );
    const borderColors = categoryList.map((cat) => hexToRgba(cat.color, 1));

    const dataset = {
      labels: categoryList.map((cat) => cat.catagory),
      datasets: [
        {
          label: "Percentage",
          data: [
            ...categoryList.map((cat) => parseFloat(cat.percentage)),
            remaining,
          ],
          backgroundColor: [
            ...backgroundColors,
            "rgba(192, 192, 192,0.05)", // Remaining background color
          ],
          borderColor: [
            ...borderColors,
            "rgba(192, 192, 192,0.2)", // Remaining border color
          ],
          borderWidth: 1,
        },
      ],
    };
    setCategoryChartData(dataset);
  }, [categoryList]);

  useEffect(() => {
    const sortedSessions = interviewSessions.map((session) => ({
      interviewId: session.interview.interviewID,
      sessionId: session.sessionId,
      email: session.candidate.user.email,
      candidateName: session.candidate.user.firstName,
      startAt: new Date(session.scheduledDate).toLocaleDateString(),
      endAt: new Date(session.scheduledAt).toLocaleTimeString("en-GB", {
        hour: "numeric",
        minute: "numeric",
      }),
      status: session.interviewStatus,
      score: session.score ?? "N/A",
      userId: session.candidate.user.userID,
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
                  assignmentId: category.assignmentId,
                  color: matchingCategory?.color || "#000000",
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
  }, [
    interviewId,
    isQuestionEdit,
    status,
    interviewCategories,
    generateModalOpen,
    createModalOpen,
    questionGenerationLoading,
  ]);

  useEffect(() => {
    setDescription(interviewDetail.jobDescription);
    setTitle(interviewDetail.jobTitle);
    setInterviewCategory(interviewDetail.interviewCategory);
    setQuestionList(interviewDetail?.questions);
    if (interviewDetail?.requiredSkills) {
      setSkills(interviewDetail.requiredSkills.split(", "));
    } else {
      setSkills([]);
    }
  }, [interviewDetail, createModalOpen, editingQuestion]);

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

    if (interviewId) {
      fetchOverviewData();
    }
  }, [interviewId, createModalOpen, editingQuestion]);

  useEffect(() => {
    const fetchInterviewStatus = async () => {
      try {
        const response = await interviewStatus(interviewId);
        if (response.data) {
          setInterviewStatusDetails(response.data);
        }
      } catch (error) {
        console.log("Error fetching interview status:", error);
      }
    };

    if (interviewId) {
      fetchInterviewStatus();
    }

    const fetchInterviewTimeSlots = async () => {
      try {
        // const session = await getSession();
        // const companyId = session?.user?.companyID;
        const response = await getInterviewTimeSlotsInterviewById(interviewId);
        if (response) {
          const scheduleData = response.data.schedulesByDate || [];

          // Process dates and time slots
          const dates = Array.from(
            new Set(
              scheduleData.map(
                (group) => new Date(group.date).toISOString().split("T")[0]
              )
            )
          ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

          const timeSlotsMap = scheduleData.reduce((acc, group) => {
            const dateKey = new Date(group.date).toISOString().split("T")[0];
            acc[dateKey] = group.schedules.map((slot) => ({
              scheduleID: slot.id,
              startTime: new Date(slot.start).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }),
              endTime: new Date(slot.end).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }),
              isBooked: slot.isBooked,
            }));
            return acc;
          }, {});

          const transformedSchedules = scheduleData.flatMap(({ date, schedules }) =>
            schedules.map(({ id, start, end, isBooked, candidateDetails }) => ({
                id,
                date: new Date(date).toISOString().split("T")[0],
                startTime: new Date(start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
                endTime: new Date(end).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
                isBooked,
                candidateDetails: isBooked ? candidateDetails : null,
            }))
          );

          setInterviewTimeSlotsTabel(transformedSchedules)
          setInterviewTimeSlotsDates(dates);
          setInterviewTimeSlots(timeSlotsMap);
          setFilterInterviewTimeSlots(timeSlotsMap);
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
    if (interviewId) fetchInterviewTimeSlots();
  }, [interviewId]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [description, tab, editDetails]);

  useEffect(() => {
    if (interviewStatusDetails) {
      setChartData({
        labels: ["Requests", "Invitations"],
        datasets: [
          {
            label: "Schedules",
            data: [
              interviewStatusDetails.bookedSchedules,
              interviewStatusDetails.schedulesWithInvitations,
            ],
            backgroundColor: [
              "rgba(111, 88, 223, 0.2)",
              "rgba(54, 162, 235, 0.2)",
            ],
            borderColor: ["rgba(111, 88, 223, 1)", "rgba(54, 162, 235, 1)"],
            borderWidth: 1,
          },
        ],
      });
      setPieChartData({
        labels: ["Pending", "Completed"],
        datasets: [
          {
            label: "Sessions",
            data: [
              interviewStatusDetails.totalSchedules -
              interviewStatusDetails.completedSchedules,
              interviewStatusDetails.completedSchedules,
            ],
            backgroundColor: [
              "rgba(111, 88, 223, 0.2)",
              "rgba(54, 162, 235, 0.2)",
            ],
            borderColor: ["rgba(111, 88, 223, 1)", "rgba(54, 162, 235, 1)"],
            borderWidth: 1,
          },
        ],
      });
    }
  }, [interviewStatusDetails]);

  useEffect(() => {
    let total = 0;
    categoryList.map((catagory) => {
      total += parseFloat(catagory.percentage);
    });
    setTotalPercentage(total);
  }, [categoryList]);

  useEffect(() => {
    if (interviewId) sortTopCandidates();
  }, [interviewId]);

  useEffect(() => {
    console.log("interviewDetail", interviewDetail);
    const softSkillId = interviewCategories.find(
      (category) => category.categoryName === "Soft"
    )?.categoryId;
    if (softSkillId) {
      const softSkill = interviewDetail.CategoryAssignment.find(
        (assignment) => assignment.categoryId === softSkillId
      );
      if (softSkill) {
        setSoftSkills(softSkill.SubCategoryAssignment);
        setSoftSkillsPercentage(softSkill.percentage);
        setTechnicalPercentage(100 - softSkill.percentage);
      }
    }
  }, [interviewCategories, categoryList, interviewDetail]);

  useEffect(() => {
    if (interviewStatusDetails) {
      setBookingsData([
        {
          name: "Requests",
          value: interviewStatusDetails.bookedSchedules,
          color: "#6b46c1",
        },
        {
          name: "Invitations",
          value: interviewStatusDetails.schedulesWithInvitations,
          color: "#0ea5e9",
        },
        {
          name: "Rmaining",
          value:
            interviewStatusDetails.totalSchedules -
            (interviewStatusDetails.bookedSchedules +
              interviewStatusDetails.schedulesWithInvitations),
          color: "#9999993a",
        },
      ]);
      setSessionsData([
        {
          name: "Pending",
          value:
            interviewStatusDetails.totalSchedules -
            interviewStatusDetails.completedSchedules,
          color: "#6b46c1",
        },
        {
          name: "Completed",
          value: interviewStatusDetails.completedSchedules,
          color: "#0ea5e9",
        },
      ]);
    }
  }, [interviewStatusDetails]);

  useEffect(() => {
    // Reset the tab to 'email' when the modal is closed
    if (!isInviteDialogOpen) {
      setInterviewInviteTab("email");
    }
  }, [isInviteDialogOpen]);

  const handleInvitationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const invitaionData = {
        to: email,
        interviewId: interviewId,
        scheduleId: selectedTimeSlot,
      };
      const response = await sendInvitaionForCandidates(invitaionData);

      if (response) {
        // setInviteModalOpen(false);

        setIsInviteDialogOpen(false); // Closes the modal
        setEmail("");
        toast({
          title: "Invitation sent!",
          description: "The invitation has been sent successfully.",
        });
      }
      setLoading(false);
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

  useEffect(() => {
    if (interviewId) {
      const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_PORT; // Fallback if env var is missing
      console.log("baseUrl", baseUrl);
      setInviteLink(`${baseUrl}/interview-schedules/${interviewId}`);
    }
  }, [interviewId]);

  const sortTopCandidates = async (e) => {
    let data;
    try {
      if (selectedSortCategory === "overall") {
        data = {
          interviewId: interviewId,
        };
      } else {
        data = {
          interviewId: interviewId,
          categoryId: selectedSortCategory,
          limit: parseInt(sortLimit),
          type: "category",
        };
      }
      const response = await sortCandidates(data);
      if (response) {
        setCandidates(response.data);
      }
    } catch (err) {
      if (err.response) {
        const { data } = err.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `sorting Faild: ${data.message}`,
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

  const handleAddCatagoty = (e) => {
    e.preventDefault();

    if (
      inputCatagory.trim() !== "" &&
      inputPercentage.trim() !== "" &&
      totalPercentage < 100
    ) {
      const lastAssignmentId =
        prev.length > 0 ? prev[prev.length - 1].assignmentId : null;
      setCatagoryList((prev) => [
        ...prev,
        {
          key: inputCatagory.trim(),
          catagory: interviewCategories.find(
            (cat) => cat.categoryId === inputCatagory.trim()
          )?.categoryName,
          percentage: inputPercentage.trim(),
          assignmentId: lastAssignmentId,
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
          title: `Interview ${status === "ACTIVE" ? "published" : "unpublished"
            } Successfully!`,
          description: `The interview has been ${status === "ACTIVE" ? "published" : "unpublished"
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
        toast({
          variant: "default",
          title: "Success!",
          description: "Interview details have been updated successfully.",
          action: <ToastAction altText="Close">Close</ToastAction>,
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
  const handleOnChange = (content) => {
    setDescription(content);
  };

  const handleQuestionTabChange = (category) => {
    setSelectedSubAssignment(category);
    setQuestionTab(category.catagory);
  };

  const options = {
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
  };

  const getStatusBadge = (startTime, endTime) => {
    const currentDate = new Date();
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    let status = "upcoming";

    if (currentDate < startDate) {
      status = "upcoming";
    } else if (currentDate >= startDate && currentDate <= endDate) {
      status = "ongoing";
    } else if (currentDate > endDate) {
      status = "completed";
    }

    switch (status) {
      case "upcoming":
        return (
          <Badge
            variant="outline"
            className=" !text-orange-400 !border-orange-400/30 py-1 px-4 bg-orange-400/10"
          >
            Upcoming
          </Badge>
        );
      case "ongoing":
        return (
          <Badge
            variant="outline"
            className="!text-emerald-400 py-1 px-4 !border-emerald-400/30 !bg-emerald-400/10"
          >
            Ongoing
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="!text-green-600 !border-green-600/30 bg-green-600/10 py-1 px-4"
          >
            Completed
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleViewCandidates = () => {
    setActiveTab("candidates");
  };

  const handleTechnicalPercentageChange = (value) => {
    const newValue = value[0];
    setTechnicalPercentage(newValue);
    setSoftSkillsPercentage(100 - newValue);
  };

  const handleSoftSkillsPercentageChange = (value) => {
    const newValue = value[0];
    setSoftSkillsPercentage(newValue);
    setTechnicalPercentage(100 - newValue);
  };

  const handleToggleExpand = (skillId) => {
    // e.preventDefault();
    setSoftSkills(
      softSkills.map((skill) =>
        skill.id === skillId ? { ...skill, expanded: !skill.expanded } : skill
      )
    );
  };

  const handleGenerateSoftSkills = async (e) => {
    e.preventDefault();
    setSoftSkillsLoading(true);
    try {
      const data = {
        position: interviewDetail.jobTitle,
        qualifications: interviewDetail.jobDescription,
        industry: interviewDetail.industry,
        experience_level: interviewDetail.proficiencyLevel,
      };
      const response = await generateSoftSkills(data);
      if (response) {
        // const data = response.data.skills;
        setSoftSkills(
          response.data.softskills.map((skill, index) => ({
            ...skill,
            expanded: false,
            id: `s${index + 1}`,
          }))
        );
        setSoftSkillsLoading(false);
      }
    } catch (err) {
      setSoftSkillsLoading(false);
      if (err.response) {
        const { data } = err.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Soft Skill generation failed: ${data.message}`,
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

  const handleAnalyze = () => {
    setShowAnalysis(true);
  };

  const handleAddQuestion = async () => {
    try {
      const questionDataforInterview = {
        question: newQuestion,
        type: newQuestionType,
        estimatedTimeInMinutes: parseInt(newQuestionTimeDuration, 10),
        interviewId,
      };
      const response = await createQuestionForInterview(
        questionDataforInterview
      );
      // }

      if (response) {
        setNewQuestion("");
        setNewQuestionTimeDuration(0);
        setNewQuestionType("OPEN_ENDED");
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
    } finally {
      setNewQuestion("");
      setNewQuestionTimeDuration(0);
      setNewQuestionType("OPEN_ENDED");
      setCreateModalOpen(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      const response = await deleteInterviewQuestion(id);
      if (response) {
        toast({
          variant: "default",
          title: "Success!",
          description: "Question deleted successfully.",
        });
        setQuestionList((prev) =>
          prev.filter((question) => question.interviewQuestionID !== id)
        );
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Question delete failed: ${data.message}`,
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

  const handleEditQuestion = async (id, question, duration, type) => {
    setEditingQuestionDetails((prev) => ({
      ...prev,
      questionText: question,
      estimatedTimeMinutes: duration,
      type: type,
      interviewQuestionID: id,
    }));
  };

  const handleUpdateQuestion = async () => {
    try {
      const response = await updateInterviewQuestion(
        editingQuestionDetails.interviewQuestionID,
        {
          question: editingQuestionDetails.questionText,
          type: editingQuestionDetails.type,
          estimatedTimeInMinutes: editingQuestionDetails.estimatedTimeMinutes,
        }
      );

      if (response) {
        setEditingQuestionDetails({
          questionText: "",
          estimatedTimeMinutes: 0,
          type: "",
          interviewQuestionID: null,
        });
        setEditingQuestion(null);
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Question update failed: ${data.message}`,
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
      setEditingQuestionDetails({
        questionText: "",
        estimatedTimeMinutes: 0,
        type: "",
        interviewQuestionID: null,
      });
      setEditingQuestion(null);
    }
  };

  const handleGenerateQuestions = async () => {
    loading(true);
    const validNoOfQuestions = parseInt(10, 10);

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

    try {
      const response = await generateInterviewQuestions(interviewDetail.interviewID, {
        jobRole: interviewDetail.jobTitle,
        skillLevel: interviewDetail.proficiencyLevel,
        QuestionType: interviewDetail.interviewCategory,
        Keywords: interviewDetail.requiredSkills,
        noOfQuestions: validNoOfQuestions,
      });


      if (response) {
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
      <SidebarInset>
        <header className="flex bg-black h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink
                    href="/interviews"
                    className=" cursor-pointer"
                  >
                    Interviews
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block cursor-pointer">
                  <BreadcrumbPage>Interview details</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className=" px-9 py-4  max-w-[1500px] bg-black w-full mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                {interviewDetail.jobTitle} - Interview
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              {interviewDetail.status !== "ACTIVE" ? (
                <AlertDialog>
                  <AlertDialogTrigger
                    className={` ${tab === "edit" || tab === "settings" ? "hidden" : "block"
                      } flex items-center gap-1 h-9 rounded-md text-sm px-3 bg-green-500 text-neutral-50 hover:bg-green-500/90 dark:bg-green-700 dark:text-neutral-50 dark:hover:bg-green-700/90`}
                  >
                    <LuCircleCheckBig className="h-4 w-4" />
                    Publish
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
                  <AlertDialogTrigger
                    className={` ${tab === "edit" || tab === "settings" ? "hidden" : "block"
                      } flex items-center gap-1 h-9 rounded-md text-sm px-3 bg-red-500 text-neutral-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90`}
                  >
                    <Trash2 className="h-4 w-4" />
                    Unpublish
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to Unpublish this interview?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        If you unpublish your job post, its details will no
                        longer be visible to candidates
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel className="h-9 font-medium">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handlePublishInterview("ARCHIVED")}
                        className="h-9 font-medium"
                      >
                        Unpublish
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>

          <Tabs
            defaultValue="overview"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="!bg-transparent border-b border-border w-full justify-start rounded-none h-auto p-0 mb-6">
              <TabsTrigger
                value="overview"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-11"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="insights"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-11"
              >
                Experties
              </TabsTrigger>
              <TabsTrigger
                value="sessions"
                className=" rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-11"
              >
                <div className="flex justify-start items-center gap-2">
                  {interviewSessions.filter(
                    (session) => session.interviewStatus === "ongoing"
                  ).length > 0 && (
                      <div className=" relative flex items-center justify-center h-full w-2.5 ">
                        <span className="absolute w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                        <span className="absolute w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                      </div>
                    )}
                  Interview Sessions
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="timeslots"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-11"
              >
                Time Slots
              </TabsTrigger>
              <TabsTrigger
                value="invitation"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-11"
              >
                Invitation
              </TabsTrigger>
              <TabsTrigger
                value="candidates"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-11"
              >
                Candidates
              </TabsTrigger>
              <TabsTrigger
                value="analyze"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-11"
              >
                Analyze
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none h-11"
              >
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab Content */}
            <TabsContent value="overview" className="space-y-6 p-0 border-none">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="!bg-[#1b1d23]">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Highest Mark</h3>
                    <div className="flex items-baseline">
                      <span className="text-5xl font-bold">
                        {parseFloat(interviewOverview?.maxScore).toFixed(2) ||
                          0}
                      </span>
                      <span className="ml-1 text-lg text-[#b3b3b3]">%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="!bg-[#1b1d23]">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Total Sessions</h3>
                    <div className="flex items-baseline">
                      <span className="text-5xl font-bold">
                        {interviewOverview?.total || 0}
                      </span>
                      <span className="ml-2 text-sm text-[#b3b3b3]">
                        Sessions
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="!bg-[#1b1d23]">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">
                      Completed Sessions
                    </h3>
                    <div className="flex items-baseline">
                      <span className="text-5xl font-bold">
                        {interviewOverview?.totalCompletedInterviews || 0}
                      </span>
                      <span className="ml-2 text-sm text-[#b3b3b3]">
                        Sessions
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Interview Details */}
              <Card className="!bg-[#1b1d23]">
                <CardHeader>
                  <CardTitle>Interview Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-[#b3b3b3] mb-1">
                          Position
                        </h4>
                        <p className="text-base">{interviewDetail.jobTitle}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-[#b3b3b3] mb-1">
                          Department
                        </h4>
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-2 text-[#b3b3b3]" />
                          <p className="text-base">
                            {interviewDetail.department || (
                              <span className="text-sm text-[#b3b3b3]">
                                no department specified
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-[#b3b3b3] mb-1">
                          Interview Type
                        </h4>
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-2 text-[#b3b3b3]" />
                          <p className="text-base">
                            {interviewDetail.interviewCategory}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-[#b3b3b3] mb-1">
                          Start Date
                        </h4>
                        <div className="flex items-center">
                          <CalendarIcon2 className="h-4 w-4 mr-2 text-[#b3b3b3]" />
                          <p className="text-base">
                            {new Date(scheduleList[0]?.date).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-[#b3b3b3] mb-1">
                          End Date
                        </h4>
                        <div className="flex items-center">
                          <CalendarIcon2 className="h-4 w-4 mr-2 text-[#b3b3b3]" />
                          <p className="text-base">
                            {new Date(
                              scheduleList[scheduleList.length - 1]?.date
                            ).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-[#b3b3b3] mb-1">
                          Status
                        </h4>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-[#b3b3b3]" />
                          {getStatusBadge(
                            scheduleList[0]?.date,
                            scheduleList[scheduleList.length - 1]?.date
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <Separator />

                  <div>
                    <h4 className="text-sm font-medium text-[#b3b3b3] mb-2">
                      Description
                    </h4>
                    <p
                      className="text-base text-[#b3b3b3] description line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: description }}
                    ></p>
                  </div> */}

                  <Separator />

                  <div>
                    <h4 className="text-sm font-medium text-[#b3b3b3] mb-2">
                      Candidates
                    </h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-2 text-[#b3b3b3]" />
                        <p className="text-base">
                          {interviewCandidates.length} candidates applied
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={handleViewCandidates}
                      >
                        <span>View Candidates</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Charts Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="!bg-[#1b1d23]">
                  <CardHeader>
                    <CardTitle>Bookings Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ChartContainer
                        config={{
                          requests: { color: "#6b46c1" },
                          invitations: { color: "#0ea5e9" },
                          remaining: { color: "#9999993a" },
                        }}
                      >
                        {scheduleList.length > 0 ? (
                          <PieChart>
                            <Pie
                              data={bookingsData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {bookingsData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                          </PieChart>
                        ) : (
                          <div className="flex items-center text-[#b3b3b3] justify-center h-full">
                            <p>No schedules available</p>
                          </div>
                        )}
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="!bg-[#1b1d23]">
                  <CardHeader>
                    <CardTitle>Sessions Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ChartContainer
                        config={{
                          pending: { color: "#6b46c1" },
                          completed: { color: "#0ea5e9" },
                        }}
                      >
                        {interviewSessions.length > 0 ? (
                          <PieChart>
                            <Pie
                              data={sessionsData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {sessionsData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                          </PieChart>
                        ) : (
                          <div className="flex items-center text-[#b3b3b3] justify-center h-full">
                            <p>No sessions available</p>
                          </div>
                        )}
                      </ChartContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="p-0 border-none space-y-8">
              <div className="space-y-8">
                {/* Percentage Allocation */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">
                    Assessment Weighting
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Adjust the percentage allocation between technical expertise
                    and soft skills assessment. The total must equal 100%.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card
                    className={`overflow-hidden border-2 transition-all ${technicalPercentage >= 50
                      ? "!border-blue-500 !shadow-[0_0_2px_#3b82f6,0_0_4px_#3b82f6]"
                      : "border-muted"
                      }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="rounded-full bg-blue-500/20 p-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-blue-500"
                          >
                            <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
                            <path d="M17.92 12.62A5 5 0 0 0 15 8.5" />
                            <path d="M5.5 12.55a5 5 0 0 1 8.34 5.24" />
                            <path d="M14.5 9.5 20 8l-1.5 5.5" />
                            <path d="m4 15 1.5-5.5L11 11" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">
                            Technical Expertise
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Field-related knowledge and skills
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {/* Prominent percentage indicator */}
                        <div className="flex justify-center">
                          <div className="relative w-32 h-32">
                            <svg
                              className="w-full h-full"
                              viewBox="0 0 100 100"
                            >
                              {/* Background circle */}
                              <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="hsl(var(--muted))"
                                strokeWidth="10"
                              />
                              {/* Progress circle */}
                              <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="hsl(var(--blue-500, 217 91.2% 59.8%))"
                                strokeWidth="10"
                                strokeDasharray={`${(2 * Math.PI * 45 * technicalPercentage) / 100
                                  } ${2 *
                                  Math.PI *
                                  45 *
                                  (1 - technicalPercentage / 100)
                                  }`}
                                strokeDashoffset={2 * Math.PI * 45 * 0.25}
                                transform="rotate(-90 50 50)"
                                strokeLinecap="round"
                                className="text-blue-500"
                                style={{ stroke: "#3b82f6" }}
                              />
                              {/* Percentage text */}
                              <text
                                x="50"
                                y="50"
                                dominantBaseline="middle"
                                textAnchor="middle"
                                fontSize="24"
                                fontWeight="bold"
                                fill="currentColor"
                                className="text-blue-500"
                                style={{ fill: "#3b82f6" }}
                              >
                                {technicalPercentage}%
                              </text>
                            </svg>
                          </div>
                        </div>

                        {/* Less prominent slider */}
                        <div className="space-y-2">
                          <p className="text-sm text-center text-muted-foreground mb-2">
                            Adjust percentage
                          </p>
                          <Slider
                            id="technical-percentage"
                            min={0}
                            max={100}
                            step={5}
                            enableColor={false}
                            value={[technicalPercentage]}
                            onValueChange={handleTechnicalPercentageChange}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`overflow-hidden border-2 transition-all ${softSkillsPercentage >= 50
                      ? "!border-blue-500 !shadow-[0_0_2px_#3b82f6,0_0_4px_#3b82f6]"
                      : "border-muted"
                      }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="rounded-full bg-blue-500/20 p-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-blue-500"
                          >
                            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">Soft Skills</h3>
                          <p className="text-sm text-muted-foreground">
                            Human qualities and attributes
                          </p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {/* Prominent percentage indicator */}
                        <div className="flex justify-center">
                          <div className="relative w-32 h-32">
                            <svg
                              className="w-full h-full"
                              viewBox="0 0 100 100"
                            >
                              {/* Background circle */}
                              <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="hsl(var(--muted))"
                                strokeWidth="10"
                              />
                              {/* Progress circle */}
                              <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="hsl(var(--blue-500, 217 91.2% 59.8%))"
                                strokeWidth="10"
                                strokeDasharray={`${(2 * Math.PI * 45 * softSkillsPercentage) /
                                  100
                                  } ${2 *
                                  Math.PI *
                                  45 *
                                  (1 - softSkillsPercentage / 100)
                                  }`}
                                strokeDashoffset={2 * Math.PI * 45 * 0.25}
                                transform="rotate(-90 50 50)"
                                strokeLinecap="round"
                                className="text-blue-500"
                                style={{ stroke: "#3b82f6" }}
                              />
                              {/* Percentage text */}
                              <text
                                x="50"
                                y="50"
                                dominantBaseline="middle"
                                textAnchor="middle"
                                fontSize="24"
                                fontWeight="bold"
                                fill="currentColor"
                                className="text-blue-500"
                                style={{ fill: "#3b82f6" }}
                              >
                                {softSkillsPercentage}%
                              </text>
                            </svg>
                          </div>
                        </div>

                        {/* Less prominent slider */}
                        <div className="space-y-2">
                          <p className="text-sm text-center text-muted-foreground mb-2">
                            Adjust percentage
                          </p>
                          <Slider
                            id="soft-skills-percentage"
                            min={0}
                            max={100}
                            step={5}
                            value={[softSkillsPercentage]}
                            onValueChange={handleSoftSkillsPercentageChange}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Technical Expertise (Cat 1) */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Technical Expertise</h2>
                  <Badge className="!bg-blue-500/20 !text-blue-600 px-4 py-1 border !border-blue-600">
                    {technicalPercentage}%
                  </Badge>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="use-questionnaire"
                    checked={useQuestionnaire}
                    onCheckedChange={setUseQuestionnaire}
                  />
                  <Label htmlFor="use-questionnaire">
                    Use questionnaire for assessment
                  </Label>
                </div>

                {useQuestionnaire ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Questions</h3>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          // onClick={() => setIsQuestionPromptOpen(true)}
                          className="flex items-center gap-1 text-blue-500 border-blue-500/50 hover:bg-blue-500/10"
                        >
                          <Sparkles className="h-4 w-4" />
                          <span>Generate with AI</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCreateModalOpen(true)}
                          className="flex items-center gap-1"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add Question</span>
                        </Button>
                      </div>
                    </div>

                    {createModalOpen && (
                      <div className="space-y-2 p-4 border rounded-md bg-card">
                        <Label htmlFor="new-question">New Question</Label>
                        <Textarea
                          id="new-question"
                          value={newQuestion}
                          onChange={(e) => setNewQuestion(e.target.value)}
                          placeholder="Enter your question here"
                          className="min-h-[80px]"
                        />
                        <div className="flex justify-between space-x-2 mt-2">
                          <div className="w-full space-y-2">
                            <Label htmlFor="question-duration">
                              Time Duration (mins)
                            </Label>
                            <Input
                              id="question-duration"
                              type="number"
                              value={newQuestionTimeDuration}
                              onChange={(e) =>
                                setNewQuestionTimeDuration(e.target.value)
                              }
                              className="w-full"
                            />
                          </div>
                          <div className="w-full space-y-2">
                            <Label htmlFor="question-duration">
                              Question Type
                            </Label>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  className={`bg-[#09090b] border-[#2d2f36] w-full m-0 px-2 focus:outline-none outline-none`}
                                  variant="outline"
                                >
                                  {newQuestionType === "CODING"
                                    ? "Coding"
                                    : "Open Ended"}
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>
                                  Question Type
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup
                                  value={newQuestionType}
                                  onValueChange={setNewQuestionType}
                                >
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
                        <div className="flex justify-end space-x-2 mt-5">
                          <Button
                            variant="outline"
                            onClick={() => setCreateModalOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleAddQuestion}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Add Question
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {questionList?.map((question) => (
                        <Card
                          key={question.interviewQuestionID}
                          className="overflow-hidden"
                        >
                          <CardContent className="p-4">
                            {editingQuestion ===
                              question.interviewQuestionID ? (
                              <div className="space-y-3">
                                <Label htmlFor="question-text">Question</Label>
                                <Textarea
                                  id="question-text"
                                  value={editingQuestionDetails.questionText}
                                  onChange={(e) =>
                                    handleEditQuestion(
                                      editingQuestionDetails.interviewQuestionID,
                                      e.target.value,
                                      editingQuestionDetails.estimatedTimeMinutes,
                                      editingQuestionDetails.type
                                    )
                                  }
                                  className="min-h-[80px]"
                                />
                                <div className="flex items-center justify-between space-x-2">
                                  <div className=" w-full space-y-2">
                                    <Label
                                      htmlFor={`duration-${question.interviewQuestionID}`}
                                    >
                                      Question Duration (mins):
                                    </Label>
                                    <Input
                                      id={`duration-${question.interviewQuestionID}`}
                                      type="number"
                                      value={
                                        editingQuestionDetails.estimatedTimeMinutes
                                      }
                                      onChange={(e) =>
                                        handleEditQuestion(
                                          editingQuestionDetails.interviewQuestionID,
                                          editingQuestionDetails.questionText,
                                          Number.parseInt(e.target.value) || 0,
                                          editingQuestionDetails.type
                                        )
                                      }
                                      className="w-full"
                                    />
                                  </div>
                                  <div className=" w-full space-y-2">
                                    <Label
                                      htmlFor={`duration-${question.interviewQuestionID}`}
                                    >
                                      Question Type:
                                    </Label>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          className={`bg-[#09090b] border-[#2d2f36] w-full m-0 px-2 focus:outline-none outline-none`}
                                          variant="outline"
                                        >
                                          {editingQuestionDetails.type ===
                                            "CODING"
                                            ? "Coding"
                                            : "Open Ended"}
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent className="w-56">
                                        <DropdownMenuLabel>
                                          Question Type
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuRadioGroup
                                          value={editingQuestionDetails.type}
                                          onValueChange={(value) =>
                                            handleEditQuestion(
                                              editingQuestionDetails.interviewQuestionID,
                                              editingQuestionDetails.questionText,
                                              editingQuestionDetails.estimatedTimeMinutes,
                                              value
                                            )
                                          }
                                        >
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
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    onClick={() => setEditingQuestion(null)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    className="bg-blue-600 hover:bg-blue-700"
                                    onClick={handleUpdateQuestion}
                                  >
                                    Save
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex justify-between items-start">
                                <div>
                                  <p>{question.questionText}</p>
                                  <Badge variant="outline" className="mt-2">
                                    {question.estimatedTimeMinutes} mins
                                  </Badge>
                                  <Badge
                                    variant="outline"
                                    className="mt-2 ml-2"
                                  >
                                    {question.type
                                      .toLowerCase()
                                      .split("_")
                                      .map(
                                        (word) =>
                                          word.charAt(0).toUpperCase() +
                                          word.slice(1)
                                      )
                                      .join(" ")}
                                  </Badge>
                                </div>
                                <div className="flex space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      setEditingQuestion(
                                        question.interviewQuestionID
                                      )
                                    }
                                    className="h-8 w-8"
                                  >
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span className=" h-full w-fit flex items-center justify-center cursor-pointer">
                                            <RiInformation2Line className=" text-orange-500 h-4 w-4" />
                                            <span className="sr-only">
                                              Explanation
                                            </span>
                                          </span>
                                        </TooltipTrigger>
                                        <TooltipContent className="!bg-black p-4 rounded-lg !border-2 !border-gray-700">
                                          <p className=" w-[500px] text-gray-300">
                                            {question.explanation}
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                      setEditingQuestion(
                                        question.interviewQuestionID
                                      );
                                      setEditingQuestionDetails({
                                        interviewQuestionID: question.interviewQuestionID,
                                        questionText: question.questionText,
                                        estimatedTimeMinutes:
                                          question.estimatedTimeMinutes,
                                        type: question.type,
                                      });
                                    }}
                                    className="h-8 w-8"
                                  >
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleDeleteQuestion(
                                        question.interviewQuestionID
                                      )
                                    }
                                    className="h-8 w-8 text-destructive hover:text-destructive/90"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Delete</span>
                                  </Button>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}

                      {questionList?.length === 0 && (
                        <div className="text-center p-4 border border-dashed rounded-md">
                          <p className="text-muted-foreground">
                            No questions added yet. Add questions or generate
                            with AI.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  // <Alert>
                  //   <AlertCircleIcon className="h-4 w-4" />
                  //   <AlertTitle>Flexible Assessment</AlertTitle>
                  //   <AlertDescription>
                  //     You can generate technical test questions once the
                  //     interview session has been created.
                  //   </AlertDescription>
                  // </Alert>
                  <Alert>
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>Manual Assessment</AlertTitle>
                    <AlertDescription>
                      You&apos;ve chosen to assess technical expertise manually
                      during the interview. Prepare your own questions and
                      evaluation criteria based on the candidate&apos;s field.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Soft Skills</h2>
                  <Badge className="!bg-blue-500/20 !text-blue-600 px-4 py-1 border !border-blue-600">
                    {softSkillsPercentage}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Qualities to Assess</h3>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGenerateSoftSkills}
                      className="flex items-center gap-1  text-blue-500 !border-blue-500/50 hover:!text-blue-400 hover:!bg-blue-500/20"
                    >
                      {softSkillsLoading ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 text-blue-500" />
                          <span>Generate with AI</span>
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsAddingSoftSkill(true)}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Quality</span>
                    </Button>
                  </div>
                </div>
                {isAddingSoftSkill && (
                  <Card className="overflow-hidden border border-blue-500/20">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium">Add New Quality</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsAddingSoftSkill(false);
                            setNewSoftSkill({
                              name: "",
                              description: "",
                              percentage: 20,
                              subcategories: [],
                            });
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="new-skill-name">Quality Name</Label>
                          <Input
                            id="new-skill-name"
                            value={newSoftSkill.name}
                            onChange={(e) =>
                              setNewSoftSkill({
                                ...newSoftSkill,
                                name: e.target.value,
                              })
                            }
                            placeholder="e.g. Critical Thinking"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-skill-description">
                            Description
                          </Label>
                          <Textarea
                            id="new-skill-description"
                            value={newSoftSkill.description}
                            onChange={(e) =>
                              setNewSoftSkill({
                                ...newSoftSkill,
                                description: e.target.value,
                              })
                            }
                            placeholder="Describe what you're looking for in this quality"
                            className="min-h-[80px]"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="new-skill-percentage">Weight</Label>
                            <Badge className="!bg-blue-500/20 !text-blue-600 px-4 py-1 border !border-blue-600">
                              {newSoftSkill.percentage}%
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setNewSoftSkill({
                                  ...newSoftSkill,
                                  percentage: Math.max(
                                    5,
                                    newSoftSkill.percentage - 5
                                  ),
                                })
                              }
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                              disabled={newSoftSkill.percentage <= 5}
                            >
                              <span className="sr-only">Decrease</span>-
                            </Button>
                            <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-blue-500 h-full rounded-full"
                                style={{
                                  width: `${newSoftSkill.percentage}%`,
                                }}
                              ></div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setNewSoftSkill({
                                  ...newSoftSkill,
                                  percentage: Math.min(
                                    95,
                                    newSoftSkill.percentage + 5
                                  ),
                                })
                              }
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                              disabled={newSoftSkill.percentage >= 95}
                            >
                              <span className="sr-only">Increase</span>+
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Other qualities will be adjusted automatically to
                            maintain 100% total
                          </p>
                        </div>

                        <div className="flex justify-end space-x-2 mt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsAddingSoftSkill(false);
                              setNewSoftSkill({
                                name: "",
                                description: "",
                                percentage: 20,
                                subcategories: [],
                              });
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            onClick={handleAddSoftSkill}
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={
                              !newSoftSkill.name.trim() ||
                              !newSoftSkill.description.trim()
                            }
                          >
                            Add Quality
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Soft skills list */}
                <div className="space-y-3">
                  {softSkills.map((skill) => (
                    <Card key={skill.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        {editingSoftSkill === skill.id ? (
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <Label htmlFor={`edit-name-${skill.id}`}>
                                Quality Name
                              </Label>
                              <Input
                                id={`edit-name-${skill.id}`}
                                value={skill.name}
                                onChange={(e) =>
                                  handleEditSoftSkill(
                                    skill.id,
                                    e.target.value,
                                    skill.description
                                  )
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`edit-desc-${skill.id}`}>
                                Description
                              </Label>
                              <Textarea
                                id={`edit-desc-${skill.id}`}
                                value={skill.description}
                                onChange={(e) =>
                                  handleEditSoftSkill(
                                    skill.id,
                                    skill.name,
                                    e.target.value
                                  )
                                }
                                className="min-h-[80px]"
                              />
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label htmlFor={`edit-percentage-${skill.id}`}>
                                  Percentage of Soft Skills
                                </Label>
                                <Badge
                                  variant="outline"
                                  className="!bg-blue-500/20 !text-blue-600 px-4 py-1 border !border-blue-600"
                                >
                                  {Math.round(skill.percentage)}%
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleSoftSkillPercentageChange(
                                      skill.id,
                                      Math.max(5, skill.percentage - 5)
                                    )
                                  }
                                  className="h-8 w-8 p-0"
                                  disabled={skill.percentage <= 5}
                                >
                                  -
                                </Button>
                                <Input
                                  id={`edit-percentage-${skill.id}`}
                                  type="number"
                                  min="5"
                                  max="95"
                                  value={Math.round(skill.percentage)}
                                  onChange={() =>
                                    handleSoftSkillPercentageChange(
                                      skill.id,
                                      Math.min(
                                        95,
                                        Math.max(
                                          5,
                                          Number.parseInt(e.target.value) || 5
                                        )
                                      )
                                    )
                                  }
                                  className="w-16 text-center"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) =>
                                    handleSoftSkillPercentageChange(
                                      skill.id,
                                      Math.min(95, skill.percentage + 5)
                                    )
                                  }
                                  className="h-8 w-8 p-0"
                                  disabled={skill.percentage >= 95}
                                >
                                  +
                                </Button>
                              </div>
                              <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="bg-blue-500/40 h-full rounded-full"
                                  style={{
                                    width: `${skill.percentage}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => setEditingSoftSkill(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => setEditingSoftSkill(null)}
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center">
                                  <h4 className="font-medium">{skill.name}</h4>
                                  <Badge
                                    variant="outline"
                                    className="ml-2 !bg-blue-500/20 !text-blue-600 px-2 py-[1px] border !border-blue-600 !text-[12px]"
                                  >
                                    {Math.round(skill.percentage)}%
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {skill.description}
                                </p>

                                {/* Add percentage slider for each skill */}
                                <div className="mt-2">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-muted-foreground">
                                      Weight:
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          handleSoftSkillPercentageChange(
                                            skill.id,
                                            Math.max(5, skill.percentage - 5)
                                          )
                                        }
                                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                                        disabled={skill.percentage <= 5}
                                      >
                                        <span className="sr-only">
                                          Decrease
                                        </span>
                                        -
                                      </Button>
                                      <span className="text-xs font-medium w-8 text-center">
                                        {Math.round(skill.percentage)}%
                                      </span>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          handleSoftSkillPercentageChange(
                                            skill.id,
                                            Math.min(95, skill.percentage + 5)
                                          )
                                        }
                                        className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                                        disabled={skill.percentage >= 95}
                                      >
                                        <span className="sr-only">
                                          Increase
                                        </span>
                                        +
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="w-full bg-muted/90 h-1 mt-1 rounded-full overflow-hidden">
                                    <div
                                      className="bg-white/50 h-full rounded-full"
                                      style={{
                                        width: `${skill.percentage}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-1 ml-4">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleToggleExpand(skill.id)}
                                  className="h-8 w-8"
                                >
                                  {skill.expanded ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="h-4 w-4"
                                    >
                                      <path d="m18 15-6-6-6 6" />
                                    </svg>
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="16"
                                      height="16"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      className="h-4 w-4"
                                    >
                                      <path d="m6 9 6 6 6-6" />
                                    </svg>
                                  )}
                                  <span className="sr-only">
                                    {skill.expanded ? "Collapse" : "Expand"}
                                  </span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => setEditingSoftSkill(skill.id)}
                                  className="h-8 w-8"
                                >
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleDeleteSoftSkill(skill.id)
                                  }
                                  className="h-8 w-8 text-destructive hover:text-destructive/90"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </div>

                            {skill.expanded && (
                              <div className="mt-4 space-y-4 border-gray-500/40 border-t pt-4">
                                <div className="flex items-center justify-between">
                                  <h5 className="text-sm font-medium">
                                    Subcategories
                                  </h5>
                                  {/* <div className="flex space-x-2">
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              setCurrentSkillForSubcategories(
                                                skill.id
                                              );
                                              setIsSubcategoryPromptOpen(true);
                                            }}
                                            className="flex items-center gap-1  text-blue-500 !border-blue-500/50 hover:!text-blue-400 hover:!bg-blue-500/20 text-xs h-7"
                                          >
                                            <Sparkles className="h-3 w-3" />
                                            <span>Generate with AI</span>
                                          </Button>
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                              setNewSubcategory({
                                                skillId: skill.id,
                                                name: "",
                                                description: "",
                                                percentage: 25,
                                              });
                                              setIsAddingSubcategory(true);
                                            }}
                                            className="flex items-center gap-1 text-xs h-7"
                                          >
                                            <Plus className="h-3 w-3" />
                                            <span>Add Subcategory</span>
                                          </Button>
                                        </div> */}
                                </div>

                                {/* New subcategory input */}
                                {isAddingSubcategory &&
                                  newSubcategory.skillId === skill.id && (
                                    <div className="space-y-3 p-3 border border-gray-500/40 rounded-md bg-muted/20">
                                      <div className="space-y-2">
                                        <Label htmlFor="new-subcategory-name">
                                          Name
                                        </Label>
                                        <Input
                                          id="new-subcategory-name"
                                          value={newSubcategory.name}
                                          onChange={(e) =>
                                            setNewSubcategory({
                                              ...newSubcategory,
                                              name: e.target.value,
                                            })
                                          }
                                          placeholder="e.g. Active Listening"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="new-subcategory-description">
                                          Description
                                        </Label>
                                        <Textarea
                                          id="new-subcategory-description"
                                          value={newSubcategory.description}
                                          onChange={(e) =>
                                            setNewSubcategory({
                                              ...newSubcategory,
                                              description: e.target.value,
                                            })
                                          }
                                          placeholder="Describe this subcategory"
                                          className="min-h-[60px]"
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                          <Label htmlFor="new-subcategory-percentage">
                                            Percentage
                                          </Label>
                                          <Badge
                                            variant="outline"
                                            className="!bg-blue-500/20 !text-blue-600 px-2 py-[1px] border !border-blue-600 !text-[12px]"
                                          >
                                            {newSubcategory.percentage}%
                                          </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              setNewSubcategory({
                                                ...newSubcategory,
                                                percentage: Math.max(
                                                  1,
                                                  newSubcategory.percentage - 5
                                                ),
                                              })
                                            }
                                            className="h-8 w-8 p-0"
                                          >
                                            -
                                          </Button>
                                          <Input
                                            id="new-subcategory-percentage"
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={newSubcategory.percentage}
                                            onChange={(e) =>
                                              setNewSubcategory({
                                                ...newSubcategory,
                                                percentage: Math.min(
                                                  100,
                                                  Math.max(
                                                    1,
                                                    Number.parseInt(
                                                      e.target.value
                                                    ) || 1
                                                  )
                                                ),
                                              })
                                            }
                                            className="text-center"
                                          />
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                              setNewSubcategory({
                                                ...newSubcategory,
                                                percentage: Math.min(
                                                  100,
                                                  newSubcategory.percentage + 5
                                                ),
                                              })
                                            }
                                            className="h-8 w-8 p-0"
                                          >
                                            +
                                          </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                          Other subcategories will be adjusted
                                          automatically to maintain 100% total
                                        </p>
                                      </div>
                                      <div className="flex justify-end space-x-2 mt-2">
                                        <Button
                                          variant="outline"
                                          onClick={() => {
                                            setNewSubcategory({
                                              skillId: null,
                                              name: "",
                                              description: "",
                                              percentage: 25,
                                            });
                                            setIsAddingSubcategory(false);
                                          }}
                                        >
                                          Cancel
                                        </Button>
                                        <Button
                                          onClick={handleAddSubcategory}
                                          className="bg-blue-600 hover:bg-blue-700"
                                          disabled={
                                            !newSubcategory.name.trim() ||
                                            !newSubcategory.description.trim()
                                          }
                                        >
                                          Add Subcategory
                                        </Button>
                                      </div>
                                    </div>
                                  )}

                                {/* Subcategories list */}
                                <div className="space-y-2">
                                  {skill.subCategoryParameters.map(
                                    (subcategory, index) => (
                                      <div
                                        key={index}
                                        className="border border-gray-500/40 rounded-md p-3 bg-muted/10"
                                      >
                                        {editingSubcategory &&
                                          editingSubcategory.skillId ===
                                          skill.id &&
                                          editingSubcategory.subcategoryId ===
                                          subcategory.id ? (
                                          <div className="space-y-3">
                                            <div className="space-y-2">
                                              <Label
                                                htmlFor={`edit-sub-name-${subcategory.id}`}
                                              >
                                                Name
                                              </Label>
                                              <Input
                                                id={`edit-sub-name-${subcategory.id}`}
                                                value={subcategory.name}
                                                onChange={(e) =>
                                                  handleEditSubcategory(
                                                    skill.id,
                                                    subcategory.id,
                                                    e.target.value,
                                                    subcategory.description,
                                                    subcategory.percentage
                                                  )
                                                }
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <Label
                                                htmlFor={`edit-sub-desc-${subcategory.id}`}
                                              >
                                                Description
                                              </Label>
                                              <Textarea
                                                id={`edit-sub-desc-${subcategory.id}`}
                                                value={subcategory.description}
                                                onChange={(e) =>
                                                  handleEditSubcategory(
                                                    skill.id,
                                                    subcategory.id,
                                                    subcategory.name,
                                                    e.target.value,
                                                    subcategory.percentage
                                                  )
                                                }
                                                className="min-h-[60px]"
                                              />
                                            </div>
                                            <div className="space-y-2">
                                              <div className="flex items-center justify-between">
                                                <Label
                                                  htmlFor={`edit-sub-percentage-${subcategory.id}`}
                                                >
                                                  Percentage
                                                </Label>
                                                <Badge
                                                  variant="outline"
                                                  className="!bg-blue-500/20 !text-blue-600 px-2 py-[1px] border !border-blue-600 !text-[12px]"
                                                >
                                                  {subcategory.percentage}%
                                                </Badge>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <Button
                                                  type="button"
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    handleEditSubcategory(
                                                      skill.id,
                                                      subcategory.id,
                                                      subcategory.name,
                                                      subcategory.description,
                                                      Math.max(
                                                        1,
                                                        subcategory.percentage -
                                                        5
                                                      )
                                                    );
                                                  }}
                                                  className="h-8 w-8 p-0"
                                                >
                                                  -
                                                </Button>
                                                <Input
                                                  id={`edit-sub-percentage-${subcategory.id}`}
                                                  type="number"
                                                  min="1"
                                                  max="100"
                                                  value={subcategory.percentage}
                                                  onChange={(e) => {
                                                    e.preventDefault();
                                                    handleEditSubcategory(
                                                      skill.id,
                                                      subcategory.id,
                                                      subcategory.name,
                                                      subcategory.description,
                                                      Math.min(
                                                        100,
                                                        Math.max(
                                                          1,
                                                          Number.parseInt(
                                                            e.target.value
                                                          ) || 1
                                                        )
                                                      )
                                                    );
                                                  }}
                                                  className="text-center"
                                                />
                                                <Button
                                                  type="button"
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={(e) =>
                                                    handleEditSubcategory(
                                                      skill.id,
                                                      subcategory.id,
                                                      subcategory.name,
                                                      subcategory.description,
                                                      Math.min(
                                                        100,
                                                        subcategory.percentage +
                                                        5
                                                      )
                                                    )
                                                  }
                                                  className="h-8 w-8 p-0"
                                                >
                                                  +
                                                </Button>
                                              </div>
                                            </div>
                                            <div className="flex justify-end space-x-2">
                                              <Button
                                                variant="outline"
                                                onClick={() =>
                                                  setEditingSubcategory(null)
                                                }
                                              >
                                                Cancel
                                              </Button>
                                              <Button
                                                className="bg-blue-600 hover:bg-blue-700"
                                                onClick={() =>
                                                  setEditingSubcategory(null)
                                                }
                                              >
                                                Save
                                              </Button>
                                            </div>
                                          </div>
                                        ) : (
                                          <div>
                                            <div className="flex justify-between items-start">
                                              <div>
                                                <div className="flex items-center">
                                                  <h6 className="font-medium text-sm">
                                                    {subcategory.name}
                                                  </h6>
                                                  <Badge
                                                    variant="outline"
                                                    className="ml-2 !bg-blue-500/20 !text-blue-600 px-2 py-[1px] border !border-blue-600 !text-[12px]"
                                                  >
                                                    {subcategory.percentage}%
                                                  </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                  {subcategory.description}
                                                </p>
                                              </div>
                                              {/* <div className="flex space-x-1">
                                                      <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={(e) => {
                                                          e.preventDefault();
                                                          setEditingSubcategory(
                                                            {
                                                              skillId: skill.id,
                                                              subcategoryId:
                                                                subcategory.id,
                                                            }
                                                          );
                                                        }}
                                                        className="h-7 w-7"
                                                      >
                                                        <Edit className="h-3.5 w-3.5" />
                                                        <span className="sr-only">
                                                          Edit
                                                        </span>
                                                      </Button>
                                                      <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                          handleDeleteSubcategory(
                                                            skill.id,
                                                            subcategory.id
                                                          )
                                                        }
                                                        className="h-7 w-7 text-destructive hover:text-destructive/90"
                                                      >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                        <span className="sr-only">
                                                          Delete
                                                        </span>
                                                      </Button>
                                                    </div> */}
                                            </div>

                                            {/* Display percentage as a progress bar */}
                                            <div className="mt-2">
                                              <div className="w-full bg-muted/90 h-1 rounded-full overflow-hidden">
                                                <div
                                                  className="bg-gray-500/80 h-full rounded-full"
                                                  style={{
                                                    width: `${subcategory.percentage}%`,
                                                  }}
                                                ></div>
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    )
                                  )}

                                  {skill.subCategoryParameters.length === 0 && (
                                    <div className="text-center p-3 border border-dashed rounded-md">
                                      <p className="text-sm text-muted-foreground">
                                        No subcategories added yet
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  {softSkills.length === 0 && (
                    <div className="text-center p-4 border border-dashed rounded-md">
                      <p className="text-muted-foreground">
                        No soft skills added yet. Add qualities or generate with
                        AI.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">AI Analysis</h2>
                  <Button
                    type="button"
                    onClick={handleAnalyze}
                    className="flex items-center gap-1 !bg-transparent !text-blue-500 border !border-blue-500/50 hover:!bg-blue-500/20 hover:!text-blue-400"
                    disabled={showAnalysis}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Analyze & Suggest Improvements
                  </Button>
                </div>

                {showAnalysis && (
                  <Card className="border !border-blue-500/50 !bg-transparent">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-5 w-5 text-blue-500" />
                        <h3 className="text-lg font-medium">AI Suggestions</h3>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium">Recommended Weighting</h4>
                          <div className="flex items-center mt-2 space-x-4">
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="outline"
                                className="!text-blue-500 !font-bold"
                              >
                                Technical: {aiSuggestions.technicalPercentage}%
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {aiSuggestions.technicalPercentage >
                                  technicalPercentage
                                  ? "+"
                                  : ""}
                                {aiSuggestions.technicalPercentage -
                                  technicalPercentage}
                                %
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge
                                variant="outline"
                                className="!text-blue-500 !font-bold"
                              >
                                Soft Skills:{" "}
                                {aiSuggestions.softSkillsPercentage}%
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {aiSuggestions.softSkillsPercentage >
                                  softSkillsPercentage
                                  ? "+"
                                  : ""}
                                {aiSuggestions.softSkillsPercentage -
                                  softSkillsPercentage}
                                %
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* {aiSuggestions.addedQuestions.length > 0 && (
                                <div>
                                  <h4 className="font-medium">
                                    Suggested Questions to Add
                                  </h4>
                                  <ul className="mt-2 space-y-2">
                                    {aiSuggestions.addedQuestions.map(
                                      (q, i) => (
                                        <li
                                          key={i}
                                          className="flex items-start space-x-2"
                                        >
                                          <Plus className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                                          <div>
                                            <p>{q.text}</p>
                                            <Badge
                                              variant="outline"
                                              className="mt-1"
                                            >
                                              {q.marks} marks
                                            </Badge>
                                          </div>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              )} */}

                        {aiSuggestions.addedSoftSkills.length > 0 && (
                          <div>
                            <h4 className="font-medium">
                              Suggested Soft Skills to Add
                            </h4>
                            <ul className="mt-2 space-y-2">
                              {aiSuggestions.addedSoftSkills.map((s, i) => (
                                <li
                                  key={i}
                                  className="flex items-start space-x-2"
                                >
                                  <Plus className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                                  <div>
                                    <p className="font-medium">{s.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {s.description}
                                    </p>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div className="flex justify-end space-x-3 pt-2">
                          <Button
                            variant="outline"
                            onClick={() => setShowAnalysis(false)}
                          >
                            Ignore Suggestions
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
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* <div className=" bg-slate-600/10 w-full h-fit p-9 rounded-lg mt-5">
                <div className="flex space-x-4 bg-slate-600/20 w-fit p-1 md:p-2 mb-5 rounded-lg">
                  <button
                    onClick={() => setQuestionTab("technical")}
                    className={` text-xs md:text-sm py-2 px-4 md:px-6 rounded-lg ${questionTab === "technical" ? "bg-gray-800" : ""
                      } `}
                  >
                    Technical
                  </button>
                  {categoryList.length > 0 &&
                    categoryList
                      .filter(
                        (category) =>
                          category.catagory.toLowerCase() !== "technical"
                      )
                      .map((category, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuestionTabChange(category)}
                          className={`text-xs md:text-sm py-2 px-4 md:px-6 rounded-lg ${questionTab === category.catagory
                              ? "bg-gray-800"
                              : ""
                            }`}
                        >
                          {category.catagory}
                        </button>
                      ))}
                </div>
                {questionTab === "technical" ? (
                  <div>
                    <div className=" w-full  flex flex-col md:flex-row items-center justify-between">
                      <h1 className=" text-2xl font-semibold text-left w-full">
                        Technical Questions
                      </h1>
                      <div className=" w-full flex items-center justify-end">
                        <button
                          className=" h-11 min-w-[160px] mt-5 md:mt-0 px-5 mr-5 cursor-pointer bg-white rounded-lg text-center text-sm text-black font-semibold"
                          onClick={() => setGenerateModalOpen(true)}
                        >
                          Genarate questions
                        </button>
                        <button
                          onClick={() => setCreateModalOpen(true)}
                          className=" h-11 min-w-[160px] mt-5 md:mt-0 cursor-pointer bg-white text-black rounded-lg text-center text-sm font-semibold"
                        >
                          {" "}
                          + Add Question
                        </button>
                      </div>
                    </div>
                    {questionList?.length > 0 ? (
                      questionList.map((question, index) => (
                        <QuestionDisplayCard
                          forSession={false}
                          key={index}
                          index={index}
                          question={question}
                          isQuestionEdit={isQuestionEdit}
                          setIsQuestionEdit={setIsQuestionEdit}
                        />
                      ))
                    ) : (
                      <div className=" w-full min-h-[300px] flex items-center justify-center">
                        <p>No questions available.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <SubCategoryDisplayCard
                      selectedSubAssignment={selectedSubAssignment}
                    />
                  </div>
                )}
              </div> */}
            </TabsContent>

            <TabsContent value="sessions" className="p-0 border-none">
              <div className=" w-full h-fit rounded-lg mt-5">


                {/* Header with stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 my-6">
                  <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-sm text-muted-foreground">Total Sessions</p>
                        <p className="text-3xl font-bold">24</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-sm text-muted-foreground">Completed</p>
                        <p className="text-3xl font-bold text-green-500">18</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-sm text-muted-foreground">Ongoing</p>
                        <div className="flex items-center gap-2">
                          {/* <p className="text-3xl font-bold text-blue-500">{statusCounts.ongoing}</p> */}
                          {/* {statusCounts.ongoing > 0 && (
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                )} */}
                          <p className="text-3xl font-bold text-blue-500">2</p>
                          <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/50 border-border/50">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-sm text-muted-foreground">Upcoming</p>
                        <p className="text-3xl font-bold text-amber-500">4</p>
                        {/* <p className="text-3xl font-bold text-amber-500">{statusCounts.upcoming}</p> */}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Today's Sessions */}
                {/* {todaysSessions.length > 0 && (
        <Card className="border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              Today&apos;s Sessions
              {statusCounts.ongoing > 0 && (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
              )}
            </CardTitle>
            <CardDescription>
              {todaysSessions.length} session{todaysSessions.length !== 1 ? "s" : ""} scheduled for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todaysSessions.map((session) => (
                <Card
                  key={session.id}
                  className={`overflow-hidden ${
                    session.status === "Ongoing" ? "border-blue-500 shadow-[0_0_2px_#3b82f6,0_0_4px_#3b82f6]" : ""
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <Badge className={getStatusColor(session.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(session.status)}
                          <span>{session.status}</span>
                        </div>
                      </Badge>
                      <div className="text-sm font-medium">
                        {session.startTime} - {session.endTime}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3 space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={session.candidates[0].avatar} alt={session.candidates[0].name} />
                        <AvatarFallback>{session.candidates[0].name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-base">{session.candidates[0].name}</div>
                        <div className="text-sm text-muted-foreground">{session.candidates[0].email}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium ml-1">{session.type}</span>
                      </div>
                      {session.location && (
                        <div>
                          <span className="text-muted-foreground">Location:</span>
                          <span className="font-medium ml-1">{session.location}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 pb-4">
                    <div className="flex gap-2 w-full">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(session.meetingLink, "_blank")
                        }}
                      >
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        Rejoin
                      </Button>
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={(e) => handleEndSession(session.id, e)}
                      >
                        <StopCircle className="h-4 w-4 mr-2" />
                        End
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )} */}

                {/* Today's Sessions */}
                <Card className="border-blue-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                      Today&apos;s Sessions
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                      </span>
                    </CardTitle>
                    <CardDescription>
                      3 sessions scheduled for today
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Session 1 */}
                      <Card className="overflow-hidden border-blue-500 shadow-[0_0_2px_#3b82f6,0_0_4px_#3b82f6]">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <Badge className="!bg-blue-600  hover:bg-blue-100 !text-blue-950">
                              <div className="flex items-center gap-1">
                                <Hourglass size={12} />
                                <span>Ongoing</span>
                              </div>
                            </Badge>
                            <div className="text-sm font-medium">
                              10:00 - 11:00
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3 space-y-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sarah Johnson" />
                              <AvatarFallback>SJ</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-base">Sarah Johnson</div>
                              <div className="text-sm text-muted-foreground">sarah.johnson@example.com</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm min-h-10">
                            <div>
                              <span className="text-muted-foreground">Type:</span>
                              <span className="font-medium ml-1">Technical</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Location:</span>
                              <span className="font-medium ml-1">Zoom</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0 pb-4">
                          <div className="flex gap-2 w-full">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation()
                                window.open("https://zoom.us/j/123456789", "_blank")
                              }}
                            >
                              <ArrowUpRight className="h-4 w-4 mr-2" />
                              Rejoin
                            </Button>
                            <Button
                              className="flex-1 !bg-green-600 hover:bg-green-700"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <StopCircle className="h-4 w-4 mr-2" />
                              End
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>

                      {/* Session 2 */}
                      <Card className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <Badge className="!bg-[#39280a] hover:bg-amber-100 !text-[#d58a0b]">
                              <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                <span>Scheduled</span>
                              </div>
                            </Badge>
                            <div className="text-sm font-medium">
                              14:30 - 15:30
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3 space-y-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="https://randomuser.me/api/portraits/men/32.jpg" alt="Michael Chen" />
                              <AvatarFallback>MC</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-base">Michael Chen</div>
                              <div className="text-sm text-muted-foreground">michael.chen@example.com</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm min-h-10">
                            <div>
                              <span className="text-muted-foreground">Type:</span>
                              <span className="font-medium ml-1">Behavioral</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Location:</span>
                              <span className="font-medium ml-1">Conference</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0 pb-4">
                          <div className="flex gap-2 w-full">
                            <Button
                              variant="outline"
                              className="flex-1"
                            >
                              <ArrowUpRight className="h-4 w-4 mr-2" />
                              Join
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1"
                            >
                              Reschedule
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>

                      {/* Session 3 */}
                      <Card className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-center">
                            <Badge className="!bg-blue-600  hover:bg-blue-100 !text-blue-950">
                              <div className="flex items-center gap-1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clock"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                                <span>Ongoing</span>
                              </div>
                            </Badge>
                            <div className="text-sm font-medium">
                              16:00 - 17:00
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-3 space-y-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src="https://randomuser.me/api/portraits/women/68.jpg" alt="Emma Rodriguez" />
                              <AvatarFallback>ER</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-base">Emma Rodriguez</div>
                              <div className="text-sm text-muted-foreground">emma.rodriguez@example.com</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-sm min-h-10">
                            <div>
                              <span className="text-muted-foreground">Type:</span>
                              <span className="font-medium ml-1">Technical</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Location:</span>
                              <span className="font-medium ml-1">Google Meet</span>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0 pb-4">
                          <div className="flex gap-2 w-full">
                            <Button
                              variant="outline"
                              className="flex-1"
                            >
                              <ArrowUpRight className="h-4 w-4 mr-2" />
                              Join
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1"
                            >
                              Reschedule
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                <div className="my-6 border border-gray-200/20 rounded-lg p-6">
                  <h1 className=" text-2xl font-semibold">
                    Interview sessions
                  </h1>
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
                  <PaginationContent className="cursor-pointer">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePreviousPage()}
                      />
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
            </TabsContent>

            <TabsContent value="timeslots" className="p-0 border-none">
              <TimeSlotsTab interviewTimeSlotsTabel={interviewTimeSlotsTabel}/>

            </TabsContent>

            <TabsContent value="invitation" className="p-0 border-none">
              <>
                <Card
                  className="border-blue-500/20 overflow-hidden"
                //  onClick={() => setInviteModalOpen(true)}
                >
                  <CardHeader className="bg-blue-500/5 border-b border-blue-500/20 pb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-xl">
                          Invite Candidates
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Send interview invitations to candidates via email or
                          shareable link
                        </CardDescription>
                      </div>
                      <Dialog
                        open={isInviteDialogOpen}
                        onOpenChange={setIsInviteDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button className="bg-blue-600 hover:bg-blue-700">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Invite Candidates
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                          <DialogHeader>
                            <DialogTitle>Invite Candidates</DialogTitle>
                            <DialogDescription>
                              Send interview invitations to candidates for the
                              Software Engineer position
                            </DialogDescription>
                          </DialogHeader>

                          <Tabs
                            defaultValue="email"
                            className="mt-4"
                            onValueChange={(value) =>
                              setInterviewInviteTab(value)
                            }
                          >
                            <TabsList className="grid grid-cols-2 mb-4">
                              <TabsTrigger
                                value="email"
                                className="flex items-center gap-2"
                              >
                                <Mail className="h-4 w-4" />
                                <span>Email Invitation</span>
                              </TabsTrigger>
                              <TabsTrigger
                                value="link"
                                className="flex items-center gap-2"
                              >
                                <Share2 className="h-4 w-4" />
                                <span>Shareable Link</span>
                              </TabsTrigger>
                            </TabsList>

                            <TabsContent value="email" className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="emails">Candidate Emails</Label>
                                <Textarea
                                  type="email"
                                  placeholder="Canadidate's Email"
                                  name="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  required
                                  className="h-1"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="schedule">
                                  Interview Schedule
                                </Label>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      className="!bg-black w-full h-[45px] m-0 px-2 focus:outline-none outline-none"
                                      variant="outline"
                                    >
                                      {Object.values(interviewTimeSlots)
                                        .flat()
                                        .find(
                                          (slot) =>
                                            slot.scheduleID === selectedTimeSlot
                                        )?.startTime || "Select Time Slot"}
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>
                                      Available Time Slots
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuRadioGroup
                                      value={selectedTimeSlot}
                                      onValueChange={setSelectedTimeSlot}
                                    >
                                      {interviewTimeSlotsDates?.map((date) => (
                                        <div key={date}>
                                          <DropdownMenuLabel className="text-xs text-gray-400">
                                            {new Date(date).toLocaleDateString(
                                              undefined,
                                              {
                                                weekday: "short",
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                              }
                                            )}
                                          </DropdownMenuLabel>
                                          {interviewTimeSlots[date]?.map(
                                            (slot) => (
                                              <DropdownMenuRadioItem
                                                key={slot.scheduleID}
                                                value={slot.scheduleID}
                                                disabled={slot.isBooked}
                                              >
                                                <div className="flex justify-between items-center w-full">
                                                  <span>
                                                    {slot.startTime} -{" "}
                                                    {slot.endTime}
                                                  </span>
                                                  {slot.isBooked && (
                                                    <span className="text-red-500 text-xs ml-2">
                                                      Booked
                                                    </span>
                                                  )}
                                                </div>
                                              </DropdownMenuRadioItem>
                                            )
                                          )}
                                        </div>
                                      ))}
                                    </DropdownMenuRadioGroup>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TabsContent>

                            <TabsContent value="link" className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="invite-link">
                                  Shareable Invitation Link
                                </Label>
                                <div className="flex gap-2">
                                  <Input id="invite-link" value={inviteLink} readOnly className="flex-1" />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Share this link with candidates to allow them
                                  to schedule their interview
                                </p>
                              </div>
                            </TabsContent>
                          </Tabs>
                          <DialogFooter className="mt-6">
                            {interviewInviteTab === "email" ? (
                              <Button
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={handleInvitationSubmit}
                                disabled={loading} // Disable the button when loading
                              >
                                {loading ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Sending...
                                  </>
                                ) : (
                                  <>
                                    <Mail className="h-4 w-4 mr-2" />
                                    Send Invitations
                                  </>
                                )}
                              </Button>
                            ) : (
                              <Button
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={handleCopyLink}
                              >
                                {isCopied ? (
                                  <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy Link
                                  </>
                                )}
                              </Button>
                            )}
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Mail className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <h3 className="font-medium">Email Invitation</h3>
                            <p className="text-sm text-muted-foreground">
                              Send personalized email invitations to candidates
                            </p>
                          </div>
                        </div>
                        <ul className="space-y-2 text-sm pl-12">
                          <li className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                            <span>
                              Candidates receive email with interview details
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                            <span>
                              Automatic reminders before the interview
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                            <span>Track when invitations are viewed</span>
                          </li>
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Share2 className="h-5 w-5 text-blue-500" />
                          </div>
                          <div>
                            <h3 className="font-medium">Shareable Link</h3>
                            <p className="text-sm text-muted-foreground">
                              Create a link that candidates can use to schedule
                            </p>
                          </div>
                        </div>
                        <ul className="space-y-2 text-sm pl-12">
                          <li className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                            <span>
                              Candidates can select from available time slots
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                            <span>
                              Share via messaging apps or social media
                            </span>
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                            <span>No account required for candidates</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-blue-500/5 border-t border-blue-500/20 p-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      <span>
                        Ensure candidate email addresses are accurate before
                        sending invitations
                      </span>
                    </div>
                  </CardFooter>
                </Card>

                <InvitedCandidates
                  interviewId={interviewId}
                  inviteModalOpen={inviteModalOpen}
                />
              </>
            </TabsContent>

            <TabsContent value="candidates" className="p-0 border-none">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center justify-center h-full">
                      <p className="text-sm text-muted-foreground">Total Candidates</p>
                      <p className="text-3xl font-bold">{totalCandidates}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center justify-center h-full">
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-3xl font-bold text-green-500">{4}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center justify-center h-full">
                      <p className="text-sm text-muted-foreground">Ongoing</p>
                      <p className="text-3xl font-bold text-blue-500">{1}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center justify-center h-full">
                      <p className="text-sm text-muted-foreground">Scheduled</p>
                      <p className="text-3xl font-bold text-amber-500">{5}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center justify-center h-full">
                      <p className="text-sm text-muted-foreground">Today</p>
                      <p className="text-3xl font-bold text-purple-500">{todayCandidates}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className=" !bg-[#0a0a0a] w-full h-fit p-9 rounded-lg mt-5 border border-gray-500/30">
                <div>
                  <h1 className=" text-2xl font-semibold">Candidates</h1>
                  <div>
                    {loading ? (
                      <div>Loading interview sessions...</div>
                    ) : (
                      <CandidateDataTable
                        columns={candidatesTableColumns}
                        data={interviewCandidates}
                        interviewId={interviewId}
                      />
                    )}
                  </div>
                </div>
                <Pagination>
                  <PaginationContent className="cursor-pointer">
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => handlePreviousPage()}
                      />
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
            </TabsContent>

            <TabsContent value="analyze" className="p-0 border-none">
              <div className=" bg-slate-600/10 w-full h-fit  rounded-lg mt-1">
                <div className=" w-full ">
                  <CandidateAnalysisTab
                    categoryList={categoryList}
                    candidates={candidates}
                  />
                </div>
                <div className=" w-full  flex flex-col md:flex-row items-center justify-between mt-4">
                  <h1 className=" text-2xl font-semibold text-left w-full">
                    Candidate Analyze
                  </h1>
                  <div className=" w-full flex items-center justify-end gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          className={`!bg-[#32353b] w-full h-[45px] m-0 px-2 focus:outline-none outline-none`}
                          variant="outline"
                        >
                          {selectedSortCategory === "overall"
                            ? "Overall"
                            : categoryList.find(
                              (cat) => cat.key === selectedSortCategory
                            )?.catagory || "Select Category"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Category</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup
                          value={selectedSortCategory}
                          onValueChange={setSelectedSortCategory}
                        >
                          <DropdownMenuRadioItem value="overall">
                            Overall
                          </DropdownMenuRadioItem>
                          {categoryList.map((category) => (
                            <DropdownMenuRadioItem
                              key={category.key}
                              value={category.key}
                            >
                              {category.catagory}
                            </DropdownMenuRadioItem>
                          ))}
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <input
                      type="number"
                      placeholder="Limit (default 5)"
                      value={sortLimit}
                      onChange={(e) => setSortLimit(e.target.value)}
                      className="h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2"
                    />
                    <button
                      onClick={sortTopCandidates}
                      className=" h-11 min-w-[160px] mt-5 md:mt-0 px-5 mr-5 cursor-pointer bg-white rounded-lg text-center text-sm text-black font-semibold"
                    >
                      Sort Candidates
                    </button>
                  </div>
                </div>
                {candidates.length > 0 ? (
                  <div className="mt-5 flex flex-col gap-4 ">
                    {candidates.map((candidate, index) => (
                      <div
                        key={index}
                        className=" flex justify-between items-center p-4 rounded-lg border-2 border-gray-500/30 bg-gray-700/10 shadow-md"
                      >
                        <div className=" w-[90%] flex items-center justify-between">
                          <div>
                            <h3 className="text-2xl font-semibold">
                              {candidate.name}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {candidate.email}
                            </p>
                          </div>
                          <p className=" px-10 font-semibold text-3xl">
                            {parseInt(candidate.score).toFixed(2)}%
                          </p>
                        </div>
                        <div className="w-[5%]">
                          {index === 0 && (
                            <Image
                              src={goldTrophy}
                              alt="gold trophy"
                              width={30}
                              height={30}
                              className="mr-3"
                            />
                          )}
                          {index === 1 && (
                            <Image
                              src={silverTrophy}
                              alt="silver trophy"
                              width={30}
                              height={30}
                              className="mr-3"
                            />
                          )}
                          {index === 2 && (
                            <Image
                              src={brownzeTrophy}
                              alt="bronze trophy"
                              width={30}
                              height={30}
                              className="mr-3"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No candidates available.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="p-0 border-none">
              <div className="w-full bg-red-900/10 py-1  rounded-lg ">
                <Card className="border-red-200 dark:border-red-900">
                  <CardHeader>
                    <CardTitle className="text-red-500 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Danger Zone
                    </CardTitle>
                    <CardDescription>Destructive actions that cannot be undone</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-4 border border-red-200 dark:border-red-900 rounded-md">
                      <div>
                        <h3 className="font-medium">Reset to Defaults</h3>
                        <p className="text-sm text-muted-foreground">Reset all settings to their default values</p>
                      </div>
                      {/* <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="text-red-500 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
                          >
                            Reset
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reset to defaults?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will reset all settings to their default values. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleResetToDefaults}>
                              Reset
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog> */}
                    </div>

                    <div className="flex justify-between items-center p-4 border border-red-200 dark:border-red-900 rounded-md">
                      <div>
                        <h3 className="font-medium">Delete Interview</h3>
                        <p className="text-sm text-muted-foreground">Permanently delete this interview and all associated data</p>
                      </div>
                      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="text-red-500 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
                          >
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the interview and all associated data
                              including sessions, recordings, and candidate evaluations.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={handleDeleteInterview}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
                {/* <div className=" w-full flex items-center justify-between">
                  <div>
                    <h1 className=" text-2xl font-semibold">
                      Delete Interview
                    </h1>
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
                </div> */}
              </div>
            </TabsContent>
          </Tabs>
          {/* <div className=" w-full flex flex-col md:flex-row justify-between md:items-center">
            <h1 className=" text-4xl font-semibold">
              {interviewDetail.jobTitle} - Interview
            </h1>
            {interviewDetail.status !== "ACTIVE" ? (
              <AlertDialog>
                <AlertDialogTrigger>
                  <span
                    className={` ${tab === "edit" || tab === "settings" ? "hidden" : "block"
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
                    className={` ${tab === "edit" || tab === "settings" ? "hidden" : "block"
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
          </div> */}
          {/* <div className=" w-full mt-5">
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
                onClick={() => setTab("questions")}
                className={` text-xs md:text-sm py-2 px-4 md:px-6 rounded-lg ${
                  tab === "questions" ? "bg-gray-800" : ""
                } `}
              >
                Insights
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
                onClick={() => setTab("candidates")}
                className={` text-xs md:text-sm py-2 px-4 md:px-6 rounded-lg ${
                  tab === "candidates" ? "bg-gray-800" : ""
                } `}
              >
                Candidates
              </button>
              <button
                onClick={() => setTab("candidateAnalyze")}
                className={` text-xs md:text-sm py-2 px-4 md:px-6 rounded-lg ${
                  tab === "candidateAnalyze" ? "bg-gray-800" : ""
                } `}
              >
                Analyze
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
          </div> */}

          {/* {tab === "overview" && (
            <div className=" w-full h-full md:p-9 md:pb-0 rounded-lg mt-5">
              <div className=" w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5">
                <div className=" bg-slate-600/10 rounded-lg px-6 py-5 w-full">
                  <h1 className=" text-lg md:text-2xl font-semibold">
                    Highest Mark
                  </h1>
                  <h1 className=" text-2xl md:text-5xl lg:text-7xl font-semibold pt-6 px-5">
                    {parseFloat(interviewOverview?.maxScore).toFixed(2) || 0}
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
              <div className=" mt-5 mb-10 w-full">
                <div className=" mx-auto w-full flex flex-col md:flex-row items-center space-x-5 justify-around">
                  <div className=" w-full bg-slate-600/10 px-6 py-5 rounded-lg md:w-[50%]">
                    <h1 className=" w-full text-left text-2xl font-semibold">
                      Bookings Overview
                    </h1>
                    <Doughnut
                      className=" mx-auto mt-5 w-full max-h-[400px]"
                      data={chartData}
                      options={{ responsive: true }}
                    />
                  </div>
                  <div className="  w-full bg-slate-600/10 px-6 py-5 rounded-lg md:w-[50%]">
                    <h1 className=" w-full text-left text-2xl font-semibold">
                      Sessions Overview
                    </h1>
                    <Pie
                      className=" mx-auto mt-5 w-full max-h-[400px]"
                      data={pieChartData}
                      options={{ responsive: true }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )} */}

          {/* {tab === "edit" && (
            <div className="w-full">
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
                    <div
                      className={` ${
                        editDetails ? "hidden" : "block"
                      } text-justify w-full bg-transparent rounded-lg description`}
                      dangerouslySetInnerHTML={{ __html: description }}
                    />

                    {editDetails && (
                      <QuillEditor
                        editorId={"description"}
                        value={description}
                        placeholder="Enter job description..."
                        onChange={handleOnChange}
                      />
                    )}

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
                      <div className="w-52 aspect-square mx-auto mt-8 md:mt-0">
                        {categoryList.length > 0 ? (
                          <Pie data={categoryChartData} options={options} />
                        ) : (
                          <p className="text-gray-500">loading data...</p>
                        )}
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
          )} */}
          {/* {tab === "candidates" && (
            <div className=" bg-slate-600/10 w-full h-fit p-9 rounded-lg mt-5">
              <div>
                <h1 className=" text-2xl font-semibold">Candidates</h1>
                <div>
                  {loading ? (
                    <div>Loading interview sessions...</div>
                  ) : (
                    <CandidateDataTable
                      columns={candidatesTableColumns}
                      data={interviewCandidates}
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
          )} */}

          {/* {tab === "questions" && (
            <div className=" bg-slate-600/10 w-full h-fit p-9 rounded-lg mt-5">
              <div className="flex space-x-4 bg-slate-600/20 w-fit p-1 md:p-2 mb-5 rounded-lg">
                <button
                  onClick={() => setQuestionTab("technical")}
                  className={` text-xs md:text-sm py-2 px-4 md:px-6 rounded-lg ${
                    questionTab === "technical" ? "bg-gray-800" : ""
                  } `}
                >
                  Technical
                </button>
                {categoryList.length > 0 &&
                  categoryList
                    .filter(
                      (category) =>
                        category.catagory.toLowerCase() !== "technical"
                    )
                    .map((category, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuestionTabChange(category)}
                        className={`text-xs md:text-sm py-2 px-4 md:px-6 rounded-lg ${
                          questionTab === category.catagory ? "bg-gray-800" : ""
                        }`}
                      >
                        {category.catagory}
                      </button>
                    ))}
              </div>
              {questionTab === "technical" ? (
                <div>
                  <div className=" w-full  flex flex-col md:flex-row items-center justify-between">
                    <h1 className=" text-2xl font-semibold text-left w-full">
                      Technical Questions
                    </h1>
                    <div className=" w-full flex items-center justify-end">
                      <button
                        className=" h-11 min-w-[160px] mt-5 md:mt-0 px-5 mr-5 cursor-pointer bg-white rounded-lg text-center text-sm text-black font-semibold"
                        onClick={() => setGenerateModalOpen(true)}
                      >
                        Genarate questions
                      </button>
                      <button
                        onClick={() => setCreateModalOpen(true)}
                        className=" h-11 min-w-[160px] mt-5 md:mt-0 cursor-pointer bg-white text-black rounded-lg text-center text-sm font-semibold"
                      >
                        {" "}
                        + Add Question
                      </button>
                    </div>
                  </div>
                  {questionList?.length > 0 ? (
                    questionList.map((question, index) => (
                      <QuestionDisplayCard
                        forSession={false}
                        key={index}
                        index={index}
                        question={question}
                        isQuestionEdit={isQuestionEdit}
                        setIsQuestionEdit={setIsQuestionEdit}
                      />
                    ))
                  ) : (
                    <div className=" w-full min-h-[300px] flex items-center justify-center">
                      <p>No questions available.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <SubCategoryDisplayCard
                    selectedSubAssignment={selectedSubAssignment}
                  />
                </div>
              )}
            </div>
          )} */}

          {/* {tab === "sessions" && (
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
          )} */}

          {/* {tab === "settings" && (
            <div className="w-full bg-red-900/10 py-5 px-7 rounded-lg mt-5 border-2 border-red-700">
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
          )} */}
          {/* {tab === "invitation" && (
            <>
              <div className="w-full bg-yellow-900/10 py-5 px-7 rounded-lg mt-5 border-2 border-yellow-600">
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
          )} */}
          {/* {tab === "candidateAnalyze" && (
            <div className=" bg-slate-600/10 w-full h-fit p-9 rounded-lg mt-5">
              <div className=" w-full  flex flex-col md:flex-row items-center justify-between">
                <h1 className=" text-2xl font-semibold text-left w-full">
                  Candidate Analyze
                </h1>
                <div className=" w-full flex items-center justify-end gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className={`!bg-[#32353b] w-full h-[45px] m-0 px-2 focus:outline-none outline-none`}
                        variant="outline"
                      >
                        {selectedSortCategory === "overall"
                          ? "Overall"
                          : categoryList.find(
                              (cat) => cat.key === selectedSortCategory
                            )?.catagory || "Select Category"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Category</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuRadioGroup
                        value={selectedSortCategory}
                        onValueChange={setSelectedSortCategory}
                      >
                        <DropdownMenuRadioItem value="overall">
                          Overall
                        </DropdownMenuRadioItem>
                        {categoryList.map((category) => (
                          <DropdownMenuRadioItem
                            key={category.key}
                            value={category.key}
                          >
                            {category.catagory}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <input
                    type="number"
                    placeholder="Limit (default 5)"
                    value={sortLimit}
                    onChange={(e) => setSortLimit(e.target.value)}
                    className="h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2"
                  />
                  <button
                    onClick={sortTopCandidates}
                    className=" h-11 min-w-[160px] mt-5 md:mt-0 px-5 mr-5 cursor-pointer bg-white rounded-lg text-center text-sm text-black font-semibold"
                  >
                    Sort Candidates
                  </button>
                </div>
              </div>
              {candidates.length > 0 ? (
                <div className="mt-5 flex flex-col gap-4 ">
                  {candidates.map((candidate, index) => (
                    <div
                      key={index}
                      className=" flex justify-between items-center p-4 rounded-lg border-2 border-gray-500/30 bg-gray-700/10 shadow-md"
                    >
                      <div className=" w-[90%] flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl font-semibold">
                            {candidate.name}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {candidate.email}
                          </p>
                        </div>
                        <p className=" px-10 font-semibold text-3xl">
                          {parseInt(candidate.score).toFixed(2)}%
                        </p>
                      </div>
                      <div className="w-[5%]">
                        {index === 0 && (
                          <Image
                            src={goldTrophy}
                            alt="gold trophy"
                            width={30}
                            height={30}
                            className="mr-3"
                          />
                        )}
                        {index === 1 && (
                          <Image
                            src={silverTrophy}
                            alt="silver trophy"
                            width={30}
                            height={30}
                            className="mr-3"
                          />
                        )}
                        {index === 2 && (
                          <Image
                            src={brownzeTrophy}
                            alt="bronze trophy"
                            width={30}
                            height={30}
                            className="mr-3"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No candidates available.</p>
              )} 
            </div>
          )}*/}
        </div>
      </SidebarInset>
      {inviteModalOpen && (
        <InviteCandidateModal
          setInviteModalOpen={setInviteModalOpen}
          interviewId={interviewId}
        />
      )}
      {createModalOpen && (
        <CreateQuestionModal
          forSession={false}
          id={interviewId}
          setCreateModalOpen={setCreateModalOpen}
        />
      )}
      {generateModalOpen && (
        <GenerateQuestionModal
          forSession={false}
          details={interviewDetail}
          setGenerateModalOpen={setGenerateModalOpen}
        />
      )}
    </div>
  );
}
