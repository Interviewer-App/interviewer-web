"use client";
import * as React from "react";
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
import { useEffect, useRef, useState } from "react";
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
  CalendarIcon,
  Camera,
  Mail,
  Pencil,
  Phone,
  User,
  Calendar as CalenderIcon1,
  ExternalLink,
  Linkedin,
  Github,
  facebook,
  Facebook,
  Trash2,
  LucideCircleCheckBig,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DataTable } from "@/components/ui/InterviewCategory-DataTable/Datatable";
import { interviewSessionTableColumns } from "@/components/ui/InterviewDataTable/column";
import InterviewCategoryModal from "../../../components/interviews/interviewCategoryModal";
import { fetchInterCategories } from "@/lib/api/interview-category";
import { columns } from "@/components/ui/InterviewCategory-DataTable/column";
import Loading from "@/app/loading";
import { usePathname, useRouter, redirect } from "next/navigation";
import { useSession, getSession } from "next-auth/react";
import ContactFormPreview from "@/components/ui/userDetailsForm";
import {
  deleteUserByEmail,
  fetchDocumet,
  generatePdfPage,
  getCandidateById,
  updateCandidateById,
} from "@/lib/api/users";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FaDiscord } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import dynamic from "next/dynamic";
import UploadDocumentModal from "@/components/candidate/upload-document-modal";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
const QuillEditor = dynamic(() => import("@/components/quillEditor"), {
  ssr: false,
});
import { Download, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import ProfileHeader from "@/components/profileHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddExperienceDialog } from "@/components/candidate/AddExperienceDialog";
import { AddSkillDialog } from "@/components/candidate/AddSkillDialog";
import { PhoneInput } from "@/components/phone-number-input";
import { Input } from "@/components/ui/input";

const UserProfile = () => {
  const [Tab, setTab] = useState("details");
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [totalsessions, setTotalSessions] = useState(0);
  const [loading, setLoading] = useState(false);
  const [interviewSessionsSort, setInterviewSessionsSort] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [candidateDetails, setCandidateDetails] = useState({});
  const [candidateId, setCandidateId] = useState("");
  const [age, setAge] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [experience, setExperience] = useState("");
  const [skillHighlights, setSkillHighlights] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [discordUrl, setDiscordUrl] = useState("");
  const [dob, setDob] = useState(new Date());
  const [gender, setGender] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const pdfRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [isExperienceEdit, setIsExperienceEdit] = useState(false);
  const [isSkillEdit, setIsSkillEdit] = useState(false);
  const [isPersonalDetailsEdit, setIsPersonalDetailsEdit] = useState(false);
  const [isSocialMediaEdit, setIsSocialMediaEdit] = useState(false);
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchCandidateId = async () => {
      try {
        const session = await getSession();
        const candidateId = session?.user?.candidateID;
        if (candidateId) {
          setCandidateId(candidateId);
        }
      } catch (err) {
        if (err.response) {
          const { data } = err.response;

          if (data && data.message) {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: `Candidate Details Fetching Faild: ${data.message}`,
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

    fetchCandidateId();
  }, []);

  useEffect(() => {
    if (candidateDetails) {
      setFirstName(candidateDetails?.user?.firstName);
      setLastName(candidateDetails?.user?.lastName);
      setEmail(candidateDetails?.user?.email);
      setContactNo(candidateDetails?.user?.contactNo);
      setExperience(candidateDetails?.experience);
      setSkillHighlights(candidateDetails?.skillHighlights);
      setLinkedinUrl(candidateDetails?.linkedInUrl);
      setGithubUrl(candidateDetails?.githubUrl);
      setFacebookUrl(candidateDetails?.facebookUrl);
      setTwitterUrl(candidateDetails?.twitterUrl);
      setDiscordUrl(candidateDetails?.discordUrl);
      setGender(candidateDetails?.user?.gender);
      setDob(candidateDetails?.user?.dob);
      try {
        const parsedExperiences = candidateDetails?.experience
          ? JSON.parse(candidateDetails.experience)
          : [];
        const parsedSkills = candidateDetails?.skillHighlights
          ? JSON.parse(candidateDetails.skillHighlights)
          : [];
        setExperiences(
          Array.isArray(parsedExperiences) ? parsedExperiences : []
        );
        setSkills(Array.isArray(parsedSkills) ? parsedSkills : []);
      } catch (error) {
        console.error("Error parsing experiences or skills:", error);
        setExperiences([]);
      }
    }
  }, [candidateDetails]);

  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        const response = await getCandidateById(candidateId);
        if (response.data) {
          setCandidateDetails(response.data);
        }
      } catch (err) {
        if (err.response) {
          const { data } = err.response;

          if (data && data.message) {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: `Candidate Details Fetching Faild: ${data.message}`,
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

    if (candidateId) fetchCandidateDetails();
  }, [candidateId, isEdit]);

  useEffect(() => {
    const fetchdocument = async () => {
      try {
        const response = await fetchDocumet(candidateId);
        if (response.data) {
          setDocumentUrl(response.data);
        }
      } catch (err) {
        if (err.response) {
          const { data } = err.response;

          if (data && data.message) {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: `documents Fetching Faild: ${data.message}`,
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

    if (candidateId) fetchdocument();
  }, [candidateId, modalOpen]);

  useEffect(() => {
    if (candidateDetails?.user?.dob) {
      calculateAge(candidateDetails?.user?.dob);
    }
  }, [candidateDetails]);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    setAge(age);
  };

  const handleOnExperienceChange = (content) => {
    setExperience(content);
  };

  const handleOnSkillHighlightsChange = (content) => {
    setSkillHighlights(content);
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const response = await updateCandidateById(candidateId, {
        experience,
        skillHighlights,
        linkedInUrl: linkedinUrl,
        githubUrl,
        facebookUrl,
        twitterUrl,
        discordUrl,
        contactNo,
        gender,
        dob,
      });

      if (response) {
        toast({
          variant: "success",
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
        setIsEdit(false);
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Profile update failed: ${data.message}`,
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

  const deleteAccountHandler = async () => {
    try {
      const response = await deleteUserByEmail(email);
      if (response) {
        toast({
          variant: "success",
          title: "Account Deleted",
          description: "Your account has been successfully deleted.",
        });
        router.push("/login");
      }
    } catch (err) {
      if (err.response) {
        const { data } = err.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `error while deleting user account: ${data.message}`,
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

  const downloadPdf = () => {
    const input = pdfRef.current;

    setIsLoading(true);

    const options = {
      scale: 2,
      useCORS: true,
      logging: true,
      backgroundColor: null,
      windowWidth: input.scrollWidth,
      windowHeight: input.scrollHeight,
    };

    document.fonts.ready
      .then(() => {
        html2canvas(input, options).then((canvas) => {
          const imgData = canvas.toDataURL("image/jpeg", 1.0);
          const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
            putOnlyUsedFonts: true,
          });

          // Calculate dimensions
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const imgRatio = canvas.width / canvas.height;

          let imgWidth = pageWidth;
          let imgHeight = pageWidth / imgRatio;

          // Adjust height if content is longer than page
          if (imgHeight > pageHeight) {
            imgWidth = pageHeight * imgRatio;
            imgHeight = pageHeight;
          }

          // Add image to PDF
          pdf.addImage({
            imageData: imgData,
            format: "JPEG",
            x: (pageWidth - imgWidth) / 2,
            y: 20,
            width: imgWidth,
            height: imgHeight,
            compression: "FAST", // or 'NONE' for better quality
          });

          // Save PDF
          pdf.save(`${candidateId}_profile.pdf`);
          setIsLoading(false);
        });
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        setIsLoading(false);
      });
  };

  const handleAddExperience = (newExperience) => {
    setExperiences([...experiences, newExperience]);
  };

  const getSkillColor = (level) => {
    switch (level) {
      case "Beginner":
        return " !bg-yellow-400/10 !text-yellow-400 !border-yellow-400/20";
      case "Intermediate":
        return "!bg-blue-400/10 !text-blue-400 !border-blue-400/20";
      case "Advanced":
        return "!bg-purple-400/10 !text-purple-400 !border-purple-400/20";
      case "Expert":
        return "!bg-green-400/10 !text-green-400 !border-green-400/20";
      default:
        return "!bg-gray-400/10 !text-gray-400 !border-gray-400/20";
    }
  };

  const handleAddSkill = (newSkill) => {
    setSkills([...skills, newSkill]);
  };

  const handleSaveSkills = async (e) => {
    e.preventDefault();
    try {
      const response = await updateCandidateById(candidateId, {
        skillHighlights: JSON.stringify(skills),
      });

      if (response) {
        toast({
          variant: "success",
          title: "Skills Updated",
          description: "Your Skills has been successfully updated.",
        });
        setIsSkillEdit(false);
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Skills update failed: ${data.message}`,
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

  const handleDeleteSkill = (index) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };

  const handleSaveExperience = async (e) => {
    e.preventDefault();
    try {
      const response = await updateCandidateById(candidateId, {
        experience: JSON.stringify(experiences),
      });

      if (response) {
        toast({
          variant: "success",
          title: "Experiences Updated",
          description: "Your Experiences has been successfully updated.",
        });
        setIsExperienceEdit(false);
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Experiences update failed: ${data.message}`,
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

  const handleDeleteExperience = (index) => {
    const newExperiences = [...experiences];
    newExperiences.splice(index, 1);
    setExperiences(newExperiences);
  };

  useEffect(() => {
    console.log("contactNo", contactNo);
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await updateCandidateById(candidateId, {
        contactNo,
        gender,
        dob,
      });

      if (response) {
        toast({
          variant: "success",
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
        setIsPersonalDetailsEdit(false);
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Profile update failed: ${data.message}`,
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

  const handleSaveSocialMedia = async (e) => {
    e.preventDefault();
    try {
      const response = await updateCandidateById(candidateId, {
        linkedInUrl: linkedinUrl,
        githubUrl,
        facebookUrl,
        twitterUrl,
        discordUrl,
      });

      if (response) {
        toast({
          variant: "success",
          title: "Profile Updated",
          description: "Your profile has been successfully updated.",
        });
        setIsSocialMediaEdit(false);
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Profile update failed: ${data.message}`,
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
    <>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block cursor-pointer">
                  <BreadcrumbPage>User Profile</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div
          ref={pdfRef}
          className="w-[90%] max-w-[1500px] mx-auto h-full p-6 relative"
        >
          <Card className="border-border !bg-[#1b1d23] overflow-hidden mb-6">
            <div className="h-32 bg-gradient-to-r from-yellow-400/20 to-yellow-400/5"></div>
            <div className="px-6 pb-6 relative">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className=" w-fit relative">
                  <Avatar className="h-24 w-24 border-4 border-black mt-[-3rem] bg-background">
                    <AvatarFallback className="text-3xl">
                      {candidateDetails?.user?.firstName
                        ? candidateDetails?.user?.firstName.charAt(0)
                        : ""}
                      {candidateDetails?.user?.lastName
                        ? candidateDetails?.user?.lastName.charAt(0)
                        : ""}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute !z-[999] bottom-0 right-0 rounded-full h-8 w-8 bg-background"
                  >
                    <Camera size={14} />
                  </Button>
                </div>

                <div className="flex flex-col items-start mt-4 md:mt-2">
                  <h1 className="text-3xl font-bold">
                    {candidateDetails?.user?.firstName || "Candidate"}{" "}
                    {candidateDetails?.user?.lastName || ""}
                  </h1>
                  <div className="flex items-center mt-1 gap-2">
                    <Mail size={14} className="text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">{email}</p>
                  </div>
                  <div className="flex items-center mt-1 gap-2">
                    <Phone size={14} className="text-muted-foreground" />
                    <p className="text-muted-foreground text-sm">{contactNo}</p>
                  </div>
                  <div className="flex items-center mt-3 space-x-3">
                    <Badge
                      variant="secondary"
                      className="bg-accent text-accent-foreground uppercase"
                    >
                      {session?.user?.role || "Candidate"}
                    </Badge>
                  </div>
                </div>

                <div className="ml-auto flex flex-col sm:flex-row gap-2 mt-4 md:mt-4">
                  <Button
                    onClick={downloadPdf}
                    className="flex items-center gap-2"
                  >
                    <Download size={16} /> Download PDF
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="!bg-[#1b1d23] border border-border w-auto inline-flex mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  <Card className=" border-2 !bg-[#1b1d23] !border-blue-600/30">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold text-blue-600">
                            Experiences
                          </h3>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-blue-500 hover:text-blue-700 cursor-pointer" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-800 text-white p-2 rounded-md text-sm max-w-[200px] text-center">
                                Add details about your professional experiences
                                here.
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        {isExperienceEdit ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSaveExperience}
                            className="flex items-center gap-2 !bg-green-700"
                          >
                            <LucideCircleCheckBig size={16} /> Save
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsExperienceEdit(true)}
                            className="flex items-center gap-2"
                          >
                            <Pencil size={16} /> Edit
                          </Button>
                        )}
                      </div>

                      <div className="space-y-6">
                        {experiences.map((experience, index) => (
                          <div
                            key={index}
                            className={`border-l-2 border-border pl-4 py-2 ${
                              isExperienceEdit
                                ? "bg-[#b3b3b309] rounded-lg px-4"
                                : ""
                            }`}
                          >
                            <div className="flex justify-between w-full">
                              <h4 className="font-medium">
                                {experience.title}
                              </h4>
                              <span className="text-sm text-[#b3b3b3]">
                                {new Date(experience.startDate).getFullYear()} -{" "}
                                {experience.endDate === ""
                                  ? "Present"
                                  : new Date(experience.endDate).getFullYear()}
                              </span>
                            </div>

                            <div className="flex justify-between w-full">
                              <p className="text-sm text-[#b3b3b3]">
                                {experience.company}
                              </p>
                            </div>

                            <div className="flex justify-between w-full">
                              <p className="text-sm mt-2">
                                {experience.description}
                              </p>
                              {isExperienceEdit && (
                                <div
                                  onClick={(e) => handleDeleteExperience(index)}
                                  className=" p-1 rounded-md flex justify-start items-center hover:bg-red-900/20 cursor-pointer text-red-800 text-xs "
                                >
                                  <Trash2 className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {isExperienceEdit && (
                        <AddExperienceDialog
                          onAddExperience={handleAddExperience}
                        />
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-2 !bg-[#1b1d23] !border-orange-400/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold text-orange-400">
                            Skill Highlights
                          </h3>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Info className="w-4 h-4 text-orange-400 hover:text-orange-600 cursor-pointer" />
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-800 text-white p-2 rounded-md text-sm max-w-[200px] text-center">
                                Highlight your key skills and expertise here
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        {isSkillEdit ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSaveSkills}
                            className="flex items-center !bg-green-700 gap-2"
                          >
                            <LucideCircleCheckBig size={16} /> Save
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsSkillEdit(true)}
                            className="flex items-center gap-2"
                          >
                            <Pencil size={16} /> Edit
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                        {skills.map((skill, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded-md bg-[#b3b3b309]"
                          >
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`text-xs py-1 px-3 ${getSkillColor(
                                  skill.level
                                )}`}
                              >
                                {skill.level}
                              </Badge>
                              <span className="text-sm font-medium">
                                {skill.name}
                              </span>
                            </div>
                            {isSkillEdit && (
                              <div
                                onClick={(e) => handleDeleteSkill(index)}
                                className=" p-1 rounded-md hover:bg-red-900/20 cursor-pointer"
                              >
                                <Trash2 className="h-4 w-4 text-red-800" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {isSkillEdit && (
                        <AddSkillDialog onAddSkill={handleAddSkill} />
                      )}
                    </CardContent>
                  </Card>
                </div>
                <div className=" space-y-6">
                  <Card className="border-border !bg-[#1b1d23]">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold">
                          Personal Details
                        </h3>
                        {!isPersonalDetailsEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsPersonalDetailsEdit(true)}
                            className="flex items-center gap-2"
                          >
                            <Pencil size={16} /> Edit
                          </Button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <User
                            size={16}
                            className="text-muted-foreground mt-0.5"
                          />
                          <div>
                            <p className="text-muted-foreground text-xs">
                              Full Name
                            </p>
                            <p className="font-medium">
                              {candidateDetails?.user?.firstName}{" "}
                              {candidateDetails?.user?.lastName}
                            </p>
                          </div>
                        </div>

                        <Separator className="my-2" />

                        <div className="grid grid-cols-1 gap-4">
                          <div className="flex items-start gap-3">
                            <CalendarIcon
                              size={16}
                              className="text-muted-foreground mt-0.5"
                            />
                            <div className="w-full">
                              <p className="text-muted-foreground text-xs">
                                Date of Birth
                              </p>
                              {isPersonalDetailsEdit ? (
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "flex w-full justify-start text-left font-normal my-1",
                                        !dob && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon />
                                      {dob ? (
                                        new Date(dob).toLocaleDateString(
                                          "en-GB",
                                          {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                          }
                                        )
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={dob}
                                      onSelect={setDob}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              ) : (
                                <p>
                                  {new Date(dob).toLocaleDateString("en-GB", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })}
                                </p>
                              )}
                              <p className="text-sm text-muted-foreground">
                                ({age} years old)
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <User
                              size={16}
                              className="text-muted-foreground mt-0.5"
                            />
                            <div className="w-full">
                              <p className="text-muted-foreground text-xs">
                                Gender
                              </p>
                              {isPersonalDetailsEdit ? (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      className={`w-full my-1`}
                                      variant="outline"
                                    >
                                      {gender
                                        ? gender.charAt(0).toUpperCase() +
                                          gender.slice(1).toLowerCase()
                                        : "Select Gender"}
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="w-56">
                                    <DropdownMenuLabel>
                                      Gender Catagory
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuRadioGroup
                                      value={gender}
                                      onValueChange={setGender}
                                    >
                                      <DropdownMenuRadioItem value="MALE">
                                        Male
                                      </DropdownMenuRadioItem>
                                      <DropdownMenuRadioItem value="FEMALE">
                                        Female
                                      </DropdownMenuRadioItem>
                                      <DropdownMenuRadioItem value="OTHER">
                                        Other
                                      </DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              ) : (
                                <p>
                                  {gender
                                    ? gender.charAt(0).toUpperCase() +
                                      gender.slice(1).toLowerCase()
                                    : "not specified"}
                                </p>
                              )}
                            </div>
                          </div>

                          <Separator className="my-2" />

                          <div className="flex items-start gap-3">
                            <Mail
                              size={16}
                              className="text-muted-foreground mt-0.5"
                            />
                            <div>
                              <p className="text-muted-foreground text-xs">
                                Email
                              </p>
                              <p>{email}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Phone
                              size={16}
                              className="text-muted-foreground mt-0.5"
                            />
                            <div className=" w-full">
                              <p className="text-muted-foreground text-xs">
                                Phone
                              </p>
                              {isPersonalDetailsEdit ? (
                                <PhoneInput
                                  value={contactNo}
                                  onChange={setContactNo}
                                  className=" my-1"
                                />
                              ) : (
                                <p>{contactNo}</p>
                              )}
                            </div>
                          </div>
                          {isPersonalDetailsEdit && (
                            <div className=" w-full">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSaveProfile}
                                className="flex w-full items-center !bg-green-700 gap-2"
                              >
                                <LucideCircleCheckBig size={16} /> Save
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border !bg-[#1b1d23]">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold">Social Media</h3>
                        {!isSocialMediaEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsSocialMediaEdit(true)}
                            className="flex items-center gap-2"
                          >
                            <Pencil size={16} /> Edit
                          </Button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div
                            className={`flex items-center gap-3 ${
                              isSocialMediaEdit ? "w-full" : "w-[80%]"
                            }`}
                          >
                            <div className="bg-[#b3b3b31a] rounded-md p-2">
                              <Linkedin size={16} />
                            </div>
                            <div className="w-full">
                              <p className="text-sm font-medium">LinkedIn</p>
                              {isSocialMediaEdit ? (
                                <Input
                                  value={linkedinUrl}
                                  onChange={(e) =>
                                    setLinkedinUrl(e.target.value)
                                  }
                                  placeholder="your linkedin profile url"
                                  className="!text-xs w-full outline-none focus:outline-none"
                                />
                              ) : (
                                <p className="text-xs text-[#b3b3b3] max-w-[80%] whitespace-nowrap overflow-hidden text-ellipsis">
                                  {linkedinUrl
                                    ? linkedinUrl.replace(
                                        /^https?:\/\/(www\.)?/i,
                                        ""
                                      )
                                    : "linkedin.com/in/username"}
                                </p>
                              )}
                            </div>
                          </div>
                          {!isSocialMediaEdit && linkedinUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-accent"
                              asChild
                            >
                              <a
                                href={linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink
                                  size={14}
                                  className=" text-yellow-400"
                                />
                              </a>
                            </Button>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div
                            className={`flex items-center gap-3 ${
                              isSocialMediaEdit ? "w-full" : "w-[80%]"
                            }`}
                          >
                            <div className="bg-[#b3b3b31a] rounded-md p-2">
                              <Github size={16} />
                            </div>
                            <div className="w-full">
                              <p className="text-sm font-medium">Github</p>
                              {isSocialMediaEdit ? (
                                <Input
                                  value={githubUrl}
                                  onChange={(e) => setGithubUrl(e.target.value)}
                                  placeholder="your github profile url"
                                  className="!text-xs w-full outline-none focus:outline-none"
                                />
                              ) : (
                                <p className="text-xs text-[#b3b3b3] max-w-[80%] whitespace-nowrap overflow-hidden text-ellipsis">
                                  {githubUrl
                                    ? githubUrl.replace(
                                        /^https?:\/\/(www\.)?/i,
                                        ""
                                      )
                                    : "github.com/username"}
                                </p>
                              )}
                            </div>
                          </div>
                          {!isSocialMediaEdit && githubUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-accent"
                              asChild
                            >
                              <a
                                href={githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink
                                  size={14}
                                  className=" text-yellow-400"
                                />
                              </a>
                            </Button>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div
                            className={`flex items-center gap-3 ${
                              isSocialMediaEdit ? "w-full" : "w-[80%]"
                            }`}
                          >
                            <div className="bg-[#b3b3b31a] rounded-md p-2">
                              <Facebook size={16} />
                            </div>
                            <div className=" w-full">
                              <p className="text-sm font-medium">Facebook</p>
                              {isSocialMediaEdit ? (
                                <Input
                                  value={facebookUrl}
                                  onChange={(e) =>
                                    setFacebookUrl(e.target.value)
                                  }
                                  placeholder="your facebook profile url"
                                  className="!text-xs w-full outline-none focus:outline-none"
                                />
                              ) : (
                                <p className="text-xs text-[#b3b3b3] max-w-[80%] whitespace-nowrap overflow-hidden text-ellipsis">
                                  {facebookUrl
                                    ? facebookUrl.replace(
                                        /^https?:\/\/(www\.)?/i,
                                        ""
                                      )
                                    : "linkedin username"}
                                </p>
                              )}
                            </div>
                          </div>
                          {!isSocialMediaEdit && facebookUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-accent"
                              asChild
                            >
                              <a
                                href={facebookUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink
                                  size={14}
                                  className=" text-yellow-400"
                                />
                              </a>
                            </Button>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div
                            className={`flex items-center gap-3 ${
                              isSocialMediaEdit ? "w-full" : "w-[80%]"
                            }`}
                          >
                            <div className="bg-[#b3b3b31a] rounded-md p-2">
                              <FaXTwitter size={16} />
                            </div>
                            <div className="w-full">
                              <p className="text-sm font-medium">X</p>
                              {isSocialMediaEdit ? (
                                <Input
                                  value={twitterUrl}
                                  onChange={(e) =>
                                    setTwitterUrl(e.target.value)
                                  }
                                  placeholder="your twitter profile url"
                                  className="!text-xs w-full outline-none focus:outline-none"
                                />
                              ) : (
                                <p className="text-xs text-[#b3b3b3] max-w-[80%] whitespace-nowrap overflow-hidden text-ellipsis">
                                  {twitterUrl
                                    ? twitterUrl.replace(
                                        /^https?:\/\/(www\.)?/i,
                                        ""
                                      )
                                    : "x.com/username"}
                                </p>
                              )}
                            </div>
                          </div>
                          {!isSocialMediaEdit && twitterUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-accent"
                              asChild
                            >
                              <a
                                href={twitterUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink
                                  size={14}
                                  className=" text-yellow-400"
                                />
                              </a>
                            </Button>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div
                            className={`flex items-center gap-3 ${
                              isSocialMediaEdit ? "w-full" : "w-[80%]"
                            }`}
                          >
                            <div className="bg-[#b3b3b31a] rounded-md p-2">
                              <FaDiscord size={16} />
                            </div>
                            <div className="w-full">
                              <p className="text-sm font-medium">Discord</p>
                              {isSocialMediaEdit ? (
                                <Input
                                  value={discordUrl}
                                  onChange={(e) =>
                                    setDiscordUrl(e.target.value)
                                  }
                                  placeholder="your discord profile url"
                                  className="!text-xs w-full outline-none focus:outline-none"
                                />
                              ) : (
                                <p className="text-xs text-[#b3b3b3] max-w-[80%] whitespace-nowrap overflow-hidden text-ellipsis">
                                  {discordUrl
                                    ? discordUrl.replace(
                                        /^https?:\/\/(www\.)?/i,
                                        ""
                                      )
                                    : "discord.com/username"}
                                </p>
                              )}
                            </div>
                          </div>
                          {!isSocialMediaEdit && discordUrl && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-accent"
                              asChild
                            >
                              <a
                                href={discordUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink
                                  size={14}
                                  className=" text-yellow-400"
                                />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                      {isSocialMediaEdit && (
                        <div className=" mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSaveSocialMedia}
                            className="flex w-full items-center !bg-green-700 gap-2"
                          >
                            <LucideCircleCheckBig size={16} /> Save
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="mt-0">
              <Card className="border-border !bg-[#1b1d23]">
                <CardContent className="pt-6 flex flex-col items-center justify-center">
                  <h3 className="text-xl font-semibold mb-4 w-full">
                    Your Documents
                  </h3>
                  <div className="text-[#b3b3b3] text-center py-12 w-full rounded-md border border-border">
                    <div className="flex flex-col items-center gap-2">
                      <Download
                        size={24}
                        className="text-muted-foreground mb-2"
                      />
                      <p>No documents uploaded yet</p>
                      <p className="text-sm text-muted-foreground">
                        Upload your resume, certificates, or other relevant
                        documents
                      </p>
                    </div>
                  </div>
                  <Button className=" mt-4 w-[40%] max-w-[250px] mx-auto"
                  onClick={() => setModalOpen(true)}>
                    Upload Document
                  </Button>
                </CardContent>
              </Card>

              {modalOpen && (
                  <UploadDocumentModal
                    setModalOpen={setModalOpen}
                    isUpdated={false}
                  />
                )}
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <Card className="border-border !bg-[#1b1d23]">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Account Settings
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-colors">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about your interview activity
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="min-w-[100px]"
                      >
                        Enable
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-colors">
                      <div>
                        <h3 className="font-medium">
                          Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="min-w-[100px]"
                      >
                        Setup
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-secondary/5 hover:bg-secondary/10 transition-colors">
                      <div>
                        <h3 className="font-medium">Delete Account</h3>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all data
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={deleteAccountHandler}
                        className="min-w-[100px]"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* <div
          className="w-[90%] max-w-[1500px] mx-auto h-full p-6 relative"
          ref={pdfRef}
        >
          <h1 className=" text-3xl font-semibold">Candidate Profile</h1>
          <div className=" w-full flex flex-col md:flex-row justify-center md:justify-start items-center mt-9">
            <Avatar className=" h-28 w-28 md:h-40 md:w-40 ">
              <AvatarFallback className="text-4xl md:text-6xl">
                {candidateDetails?.user?.firstName
                  ? candidateDetails?.user?.firstName.charAt(0)
                  : ""}
                {candidateDetails?.user?.lastName
                  ? candidateDetails?.user?.lastName.charAt(0)
                  : ""}
              </AvatarFallback>
            </Avatar>
            <div className=" ml-5 mt-5 md:mt-0">
              <p className=" text-3xl font-bold md:text-left text-center py-1">
                {candidateDetails?.user?.firstName || "Candidate"}{" "}
                {candidateDetails?.user?.lastName || ""}
              </p>
              <div className="flex items-center mt-1 gap-2">
                <Mail size={14} className="text-muted-foreground" />
                <p className="text-muted-foreground text-sm">{session?.user?.email || 'user@example.com'}</p>
              </div>
              <div className="flex items-center mt-1 gap-2">
                <Phone size={14} className="text-muted-foreground" />
                <p className="text-muted-foreground text-sm">+1 (555) 000-0000</p>
              </div>
              <div className="flex items-center mt-3 space-x-3">
                <Badge variant="secondary" className="bg-accent text-accent-foreground uppercase">
                  {session?.user?.role || 'Candidate'}
                </Badge>
              </div>
            </div>
          </div> */}

          {/* <div className=" flex justify-between items-center w-full mt-8 ml-md mb-12">
            <div className="flex space-x-4 bg-slate-600/20 w-fit p-1 md:p-2 rounded-lg">
              <button
                onClick={() => setTab("details")}
                className={` text-xs md:text-sm py-2 px-4 md:px-6 rounded-lg ${
                  Tab === "details" ? "bg-gray-800" : ""
                } `}
              >
                Details
              </button>
              <button
                onClick={() => setTab("document")}
                className={` text-xs md:text-sm py-2 px-4 md:px-6 rounded-lg ${
                  Tab === "document" ? "bg-gray-800" : ""
                } `}
              >
                Documents
              </button>
              <button
                onClick={() => setTab("settings")}
                className={` text-xs md:text-sm py-2 px-4 md:px-6 rounded-lg ${
                  Tab === "settings" ? "bg-gray-800" : ""
                } `}
              >
                Settings
              </button>
            </div>
            <div className={` ${Tab !== "details" ? "hidden" : "block"} `}>
              <button
                onClick={() => setIsEdit(true)}
                className={` ${
                  isEdit ? "hidden" : "block"
                } rounded-lg text-sm font-semibold bg-white flex justify-start items-center text-black h-11 px-5`}
              >
                <MdEdit className=" text-base mr-2" />{" "}
                <span className=" inline-block">Edit Profile</span>
              </button>
              <button
                onClick={handleSaveChanges}
                className={` ${
                  isEdit ? "block" : "hidden"
                } rounded-lg text-sm font-semibold bg-darkred text-white h-11 px-5`}
              >
                Save Changes
              </button>
            </div>
          </div> */}
          {/* <div className=" w-full mt-8"> */}
          {/* {Tab === "settings" && (
              <div className="w-full h-fit bg-red-900/10 py-5 px-7 rounded-lg mt-5 border-2 border-red-700">
                <div className=" w-full flex items-center justify-between">
                  <div>
                    <h1 className=" text-2xl font-semibold">
                      Delete User Account
                    </h1>
                    <p className=" text-sm text-gray-500 py-3">
                      Once this action is performed, your Account will be
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
                          Are you sure you want to delete this Account?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={deleteAccountHandler}
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
          {/* {Tab === "document" && (
              <div className=" w-full">
                <div className="flex items-center justify-between mb-5">
                  <h1 className="text-2xl font-semibold">Documents</h1>

                  {documentUrl.url && (
                    <button
                      onClick={() => setModalOpen(true)}
                      className="rounded-full text-3xl font-semibold bg-white text-black h-12 aspect-square"
                    >
                      +
                    </button>
                  )}
                </div>

                <div className=" flex items-start justify-between mb-5 w-full">
                  <div className=" w-[68%] rounded-lg bg-gray-700/20 border-2 border-gray-700 p-0 overflow-x-hidden">
                    {documentUrl.url ? (
                      <iframe
                        src={`${documentUrl.url}#toolbar=0`}
                        className=" overflow-x-hidden rounded-lg "
                        width="100%"
                        height="500px"
                        style={{ border: "none" }}
                        title="PDF Viewer"
                      />
                    ) : (
                      <div className="bg-gray-700/20 text-gray-400 border-2 border-gray-700 px-8 py-5 rounded-lg flex flex-col items-center justify-center min-h-[500px]">
                        <h1 className=" text-xl font-semibold">
                          No Document Found
                        </h1>
                        <p className=" text-xs italic text-center w-[80%] py-2 mx-auto text-gray-600">
                          {
                            "Please upload your CV in PDF format. Ensure the file is properly named (e.g., YourName_CV.pdf) and does not exceed the size limit. Supported format: .pdf."
                          }
                        </p>
                        <button
                          onClick={() => setModalOpen(true)}
                          className="rounded-lg px-4 text-xs font-semibold bg-white text-black h-9 mt-2"
                        >
                          Upload document
                        </button>
                      </div>
                    )}
                  </div>
                  <div className=" w-[30%] min-h-[500px] bg-gray-700/20 text-gray-400 border-2 border-[#b378ff] px-8 py-5 rounded-lg">
                    <h1 className=" text-2xl font-semibold h-full text-[#b378ff] mb-5">
                      Skills
                    </h1>
                    <p className=" w-full text-left">
                      {documentUrl.skills?.map((skils, index) => {
                        return (
                          <span
                            key={index}
                            className="inline-block bg-gray-200/10 rounded-full px-3 py-1 text-sm text-gray-500 mr-2 mb-2"
                          >
                            {skils}
                          </span>
                        );
                      })}
                    </p>
                  </div>
                </div>

                {modalOpen && (
                  <UploadDocumentModal
                    setModalOpen={setModalOpen}
                    isUpdated={false}
                  />
                )}
              </div>
            )} */}
          {/* {Tab === "details" && (
              <div className=" flex flex-col md:flex-row justify-between items-start w-full mt-8">
                <div className=" w-full md:w-[70%] md:border-r-2 border-gray-500/20 md:pr-8">
                  <div className="bg-blue-700/5 text-blue-500 border-2 border-blue-900 px-8 py-5 rounded-lg">
                    <div className="flex flex-row items-center space-x-1">
                      <h1 className=" text-xl font-semibold">Experiences</h1>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-blue-500 hover:text-blue-700 cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 text-white p-2 rounded-md text-sm max-w-[200px] text-center">
                            Add details about your professional experiences
                            here.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div
                      className={` ${
                        isEdit ? "hidden" : "block"
                      } text-justify w-full text-gray-500 bg-transparent rounded-lg mt-3 description`}
                      dangerouslySetInnerHTML={{
                        __html: experience || "No Experiences",
                      }}
                    />
                    <div
                      className={`${
                        isEdit ? "block" : "hidden"
                      } mt-5 text-gray-500`}
                    >
                      <QuillEditor
                        editorId={"experience"}
                        value={experience}
                        placeholder="Write about experience here..."
                        onChange={handleOnExperienceChange}
                      />
                    </div>
                  </div>
                  <div className="bg-yellow-700/5 text-yellow-800 border-2 border-yellow-900 px-8 py-5 rounded-lg mt-5">
                    <div className="flex flex-row items-center space-x-1">
                      <h1 className=" text-xl font-semibold">
                        Skill Highlights
                      </h1>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-yellow-800 hover:text-yellow-600 cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 text-white p-2 rounded-md text-sm max-w-[200px] text-center">
                            Highlight your key skills and expertise here
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div
                      className={`${
                        isEdit ? "hidden" : "block"
                      } text-justify text-gray-500 w-full bg-transparent rounded-lg mt-3 description`}
                      dangerouslySetInnerHTML={{
                        __html: skillHighlights || "No Skill Highlight",
                      }}
                    />
                    <div
                      className={`${
                        isEdit ? "block" : "hidden"
                      } mt-5 text-gray-500`}
                    >
                      <QuillEditor
                        editorId={"skillHighlights"}
                        value={skillHighlights}
                        placeholder="About Skill Highlights here..."
                        onChange={handleOnSkillHighlightsChange}
                      />
                    </div>
                  </div>
                </div>
                <div className=" w-full md:w-[40%] md:px-8 md:mt-0 mt-5">
                  <div className="bg-gray-700/20 text-gray-400 border-2 border-gray-700 px-8 py-5 rounded-lg">
                    <h2 className=" text-xl font-semibold">Personal Details</h2>
                    <div className=" w-full mt-5">
                      <p className=" text-base text-gray-500">Full Name</p>
                      <p className=" text-md">
                        {candidateDetails?.user?.firstName}{" "}
                        {candidateDetails?.user?.lastName}
                      </p>
                    </div>
                    <div className=" w-full mt-5">
                      <p className=" text-base text-gray-500">Age</p>
                      <p className=" text-md">{age} years</p>
                    </div>
                    <div className=" w-full mt-5">
                      <p className=" text-base text-gray-500">Gender</p>
                      <p className={` ${isEdit ? "hidden" : "block"} text-md`}>
                        {gender}
                      </p>
                      <div className={` ${isEdit ? "block" : "hidden"}`}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              className={`!bg-[#32353b] w-full h-[45px] m-0 px-2 focus:outline-none outline-none`}
                              variant="outline"
                            >
                              {gender
                                ? gender.toLocaleLowerCase()
                                : "Select Gender"}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>
                              Gender Catagory
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup
                              value={gender}
                              onValueChange={setGender}
                            >
                              <DropdownMenuRadioItem value="MALE">
                                Male
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="FEMALE">
                                Female
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="OTHER">
                                Other
                              </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className=" w-full mt-5">
                      <p className=" text-base text-gray-500">Date of Birth</p>
                      <p className={` ${isEdit ? "hidden" : "block"} text-md`}>
                        {new Date(dob).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <div className={` ${isEdit ? "block" : "hidden"}`}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            value={dayjs(dob)}
                            onChange={(newValue) => setDob(dayjs(newValue))}
                            sx={{
                              width: "100%",
                              backgroundColor: "#32353b",
                              border: "none",
                              color: "white !important",
                              borderRadius: "5px",
                              padding: "0",
                              margin: "0",
                            }}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                    <div className=" w-full mt-5">
                      <p className=" text-base text-gray-500">Email</p>
                      <p className=" text-md">{email}</p>
                    </div>
                    <div className=" w-full mt-5">
                      <p className=" text-base text-gray-500">Phone</p>
                      <input
                        type="text"
                        readOnly={!isEdit}
                        value={contactNo || ""}
                        placeholder="+94 xx xxx xxxx"
                        onChange={(e) => setContactNo(e.target.value)}
                        className={` focus:outline-none rounded-lg ${
                          isEdit ? "bg-[#32353b] py-3 px-4" : "bg-transparent"
                        } w-full text-sm `}
                      />
                    </div>
                  </div>
                  <div className="bg-gray-700/20 text-gray-400 border-2 border-gray-700 px-8 py-5 rounded-lg mt-5">
                    <h2 className=" text-xl font-semibold">Social Media</h2>
                    <div className=" w-full mt-5 flex justify-start items-center gap-2">
                      <FaLinkedin className=" text-3xl" />
                      {isEdit ? (
                        <input
                          type="text"
                          readOnly={!isEdit}
                          value={linkedinUrl || ""}
                          placeholder="Linkedin URL"
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                          className={` focus:outline-none rounded-lg ${
                            isEdit ? "bg-[#32353b] py-3 px-4" : "bg-transparent"
                          } w-full text-sm `}
                        />
                      ) : (
                        <a
                          href={linkedinUrl || "#"}
                          target="_blank"
                          className={` text-sm ${
                            !linkedinUrl
                              ? "text-gray-400 pointer-events-none"
                              : "text-blue-500"
                          }`}
                        >
                          {linkedinUrl || "Linkedin URL"}
                        </a>
                      )}
                    </div>
                    <div className=" w-full mt-5 flex justify-start items-center gap-2">
                      <FaGithub className=" text-3xl" />
                      {isEdit ? (
                        <input
                          type="text"
                          readOnly={!isEdit}
                          value={githubUrl || ""}
                          placeholder="Github URL"
                          onChange={(e) => setGithubUrl(e.target.value)}
                          className={` focus:outline-none rounded-lg ${
                            isEdit ? "bg-[#32353b] py-3 px-4" : "bg-transparent"
                          } w-full text-sm `}
                        />
                      ) : (
                        <a
                          href={githubUrl || "#"}
                          target="_blank"
                          className={` text-sm ${
                            !githubUrl
                              ? "text-gray-400 pointer-events-none"
                              : "text-blue-500"
                          }`}
                        >
                          {githubUrl || "Github URL"}
                        </a>
                      )}
                    </div>
                    <div className=" w-full mt-5 flex justify-start items-center gap-2">
                      <FaFacebookSquare className=" text-3xl" />
                      {isEdit ? (
                        <input
                          type="text"
                          readOnly={!isEdit}
                          value={facebookUrl || ""}
                          placeholder="Facebook URL"
                          onChange={(e) => setFacebookUrl(e.target.value)}
                          className={` focus:outline-none rounded-lg ${
                            isEdit ? "bg-[#32353b] py-3 px-4" : "bg-transparent"
                          } w-full text-sm `}
                        />
                      ) : (
                        <a
                          href={facebookUrl || "#"}
                          target="_blank"
                          className={` text-sm ${
                            !facebookUrl
                              ? "text-gray-400 pointer-events-none"
                              : "text-blue-500"
                          }`}
                        >
                          {facebookUrl || "Facebook URL"}
                        </a>
                      )}
                    </div>
                    <div className=" w-full mt-5 flex justify-start items-center gap-2">
                      <FaXTwitter className=" text-3xl" />
                      {isEdit ? (
                        <input
                          type="text"
                          readOnly={!isEdit}
                          value={twitterUrl || ""}
                          placeholder="X URL"
                          onChange={(e) => setTwitterUrl(e.target.value)}
                          className={` focus:outline-none rounded-lg ${
                            isEdit ? "bg-[#32353b] py-3 px-4" : "bg-transparent"
                          } w-full text-sm `}
                        />
                      ) : (
                        <a
                          href={twitterUrl || "#"}
                          target="_blank"
                          className={` text-sm ${
                            !twitterUrl
                              ? "text-gray-400 pointer-events-none"
                              : "text-blue-500"
                          }`}
                        >
                          {twitterUrl || "X URL"}
                        </a>
                      )}
                    </div>
                    <div className=" w-full mt-5 flex justify-start items-center gap-2">
                      <FaDiscord className=" text-3xl" />
                      {isEdit ? (
                        <input
                          type="text"
                          readOnly={!isEdit}
                          value={discordUrl || ""}
                          placeholder="Discord URL"
                          onChange={(e) => setDiscordUrl(e.target.value)}
                          className={` focus:outline-none rounded-lg ${
                            isEdit ? "bg-[#32353b] py-3 px-4" : "bg-transparent"
                          } w-full text-sm `}
                        />
                      ) : (
                        <a
                          href={discordUrl || "#"}
                          target="_blank"
                          className={` text-sm ${
                            !discordUrl
                              ? "text-gray-400 pointer-events-none"
                              : "text-blue-500"
                          }`}
                        >
                          {discordUrl || "Discord URL"}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )} */}
          {/* </div> */}
        </div>
      </SidebarInset>
    </>
  );
};

export default UserProfile;
