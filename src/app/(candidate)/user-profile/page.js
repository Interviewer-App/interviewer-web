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
import { CalendarIcon } from "lucide-react";
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
import { Download, Loader2 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const pdfRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
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

    // Add loading state
    setIsLoading(true);

    // Configure options for better rendering
    const options = {
      scale: 2, // Increase for better resolution
      useCORS: true, // Enable cross-origin images
      logging: true, // Helpful for debugging
      backgroundColor: null, // Keep original background
      windowWidth: input.scrollWidth,
      windowHeight: input.scrollHeight
    };

    // Wait for fonts to load
    document.fonts.ready.then(() => {
      html2canvas(input, options).then((canvas) => {
        const imgData = canvas.toDataURL("image/jpeg", 1.0);
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4',
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
          format: 'JPEG',
          x: (pageWidth - imgWidth) / 2,
          y: 20,
          width: imgWidth,
          height: imgHeight,
          compression: 'FAST' // or 'NONE' for better quality
        });

        // Save PDF
        pdf.save(`${candidateId}_profile.pdf`);
        setIsLoading(false);
      });
    }).catch((error) => {
      console.error('Error generating PDF:', error);
      setIsLoading(false);
    });
  };



  // const handleDownload = async () => {
  //   try {
  //     setIsLoading(true);

  //     // Get the current URL
  //     const currentURL = window.location.href;

  //     const data = {
  //       url: currentURL,
  //     }

  //     // Make the API request
  //     // const res = await generatePdfPage(data)
  //     // debugger
  //     // const response = res.data
  //     const response = await fetch('http://localhost:3333/api/v1/ai/generate', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(data),
  //     });

  //     debugger

  //     if (!response) {
  //       throw new Error('PDF generation failed');
  //     }
  //     // const arrayBuffer = await response.arrayBuffer();
  //     const blob = await response.body.blob();

  //     // Convert ArrayBuffer to Blob
  //     // const blob = new Blob([arrayBuffer], { type: 'application/pdf' });

  //     // Create download link
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = 'download.pdf';
  //     document.body.appendChild(a);
  //     a.click();

  //     // Cleanup
  //     window.URL.revokeObjectURL(url);
  //     document.body.removeChild(a);

  //   } catch (error) {
  //     debugger
  //     console.error('Download error:', error);
  //     alert('Error downloading PDF');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

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

        <div className="w-[90%] max-w-[1500px] mx-auto h-full p-6 relative" ref={pdfRef}>
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
              <p className=" text-2xl md:text-5xl md:text-left text-center py-1">
                {candidateDetails?.user?.firstName || "Candidate"}{" "}
                {candidateDetails?.user?.lastName || ""}
              </p>
              <p className=" text-lg md:text-xl md:text-left text-center text-gray-500">
                {candidateDetails?.user?.email}
              </p>
              <div className="flex items-center justify-center gap-6 md:justify-start mt-3">
              <p className=" mx-auto md:mx-0 text-xs mt-3 rounded-full bg-blue-500/50 boeder-2 border-blue-700 text-blue-300 py-1 px-4 w-fit">
                {candidateDetails?.user?.role || "Candidate"}
              </p>
              <Button
                onClick={downloadPdf}
                disabled={isLoading}
                variant="default"
                className="gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Download PDF
                  </>
                )}
              </Button>
              </div>
            </div>
          </div>
          <div className=" flex justify-between items-center w-full mt-8 ml-md mb-12">
            <div className="flex space-x-4 bg-slate-600/20 w-fit p-1 md:p-2 rounded-lg">
              <button
                onClick={() => setTab("details")}
                className={` text-xs md:text-sm py-2 px-4 md:px-6 rounded-lg ${Tab === "details" ? "bg-gray-800" : ""
                  } `}
              >
                Details
              </button>
              <button
                onClick={() => setTab("document")}
                className={` text-xs md:text-sm py-2 px-4 md:px-6 rounded-lg ${Tab === "document" ? "bg-gray-800" : ""
                  } `}
              >
                Documents
              </button>
              <button
                onClick={() => setTab("settings")}
                className={` text-xs md:text-sm py-2 px-4 md:px-6 rounded-lg ${Tab === "settings" ? "bg-gray-800" : ""
                  } `}
              >
                Settings
              </button>
            </div>
            <div className={` ${Tab !== "details" ? "hidden" : "block"} `}>
              <button
                onClick={() => setIsEdit(true)}
                className={` ${isEdit ? "hidden" : "block"
                  } rounded-lg text-sm font-semibold bg-white flex justify-start items-center text-black h-11 px-5`}
              >
                <MdEdit className=" text-base mr-2" />{" "}
                <span className=" inline-block">Edit Profile</span>
              </button>
              <button
                onClick={handleSaveChanges}
                className={` ${isEdit ? "block" : "hidden"
                  } rounded-lg text-sm font-semibold bg-darkred text-white h-11 px-5`}
              >
                Save Changes
              </button>
            </div>
          </div>
          <div className=" w-full mt-8">
            {Tab === "settings" && (
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
            )}
            {Tab === "document" && (
              <div className=" w-full">
                <div className="flex items-center justify-between mb-5">
                  <h1 className="text-2xl font-semibold">Documents</h1>

                  {/* Add Category Button */}
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
                    <h1 className=" text-2xl font-semibold h-full text-[#b378ff] mb-5">Summary</h1>
                    <p>{documentUrl.summary}</p>
                  </div>
                </div>

                {modalOpen && (
                  <UploadDocumentModal
                    setModalOpen={setModalOpen}
                    isUpdated={false}
                  />
                )}
              </div>
            )}
            {Tab === "details" && (
              <div className=" flex flex-col md:flex-row justify-between items-start w-full mt-8">
                <div className=" w-full md:w-[70%] md:border-r-2 border-gray-500/20 md:pr-8">
                  <div className="bg-blue-700/5 text-blue-500 border-2 border-blue-900 px-8 py-5 rounded-lg">
                    <h1 className=" text-xl font-semibold">Experiences</h1>
                    <div
                      className={` ${isEdit ? "hidden" : "block"
                        } text-justify w-full text-gray-500 bg-transparent rounded-lg mt-3 description`}
                      dangerouslySetInnerHTML={{
                        __html: experience || "No Experiences",
                      }}
                    />
                    <div
                      className={`${isEdit ? "block" : "hidden"
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
                    <h1 className=" text-xl font-semibold">Skill Highlights</h1>
                    <div
                      className={`${isEdit ? "hidden" : "block"
                        } text-justify text-gray-500 w-full bg-transparent rounded-lg mt-3 description`}
                      dangerouslySetInnerHTML={{
                        __html: skillHighlights || "No Skill Highlight",
                      }}
                    />
                    <div
                      className={`${isEdit ? "block" : "hidden"
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
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start !bg-[#32353b] h-[45px] text-left font-normal",
                                !dob && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon />
                              {dob
                                ? new Date(dob).toLocaleDateString()
                                : "Date of Birth"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={dob}
                              onSelect={setDob}
                              initialFocus
                              fromYear={1900}
                              toYear={new Date().getFullYear()}
                              disabled={(date) => date > new Date()}
                            />
                          </PopoverContent>
                        </Popover>
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
                        placeholder="Contact Number"
                        onChange={(e) => setContactNo(e.target.value)}
                        className={` focus:outline-none rounded-lg ${isEdit ? "bg-[#32353b] py-3 px-4" : "bg-transparent"
                          } w-full text-sm `}
                      />
                    </div>
                  </div>
                  <div className="bg-gray-700/20 text-gray-400 border-2 border-gray-700 px-8 py-5 rounded-lg mt-5">
                    <h2 className=" text-xl font-semibold">Social Media</h2>
                    <div className=" w-full mt-5 flex justify-start items-center gap-2">
                      <FaLinkedin className=" text-3xl" />
                      <input
                        type="text"
                        readOnly={!isEdit}
                        value={linkedinUrl || ""}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        className={` focus:outline-none rounded-lg ${isEdit ? "bg-[#32353b] py-3 px-4" : "bg-transparent"
                          } w-full text-sm `}
                      />
                    </div>
                    <div className=" w-full mt-5 flex justify-start items-center gap-2">
                      <FaGithub className=" text-3xl" />
                      <input
                        type="text"
                        readOnly={!isEdit}
                        value={githubUrl || ""}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        className={` focus:outline-none rounded-lg ${isEdit ? "bg-[#32353b] py-3 px-4" : "bg-transparent"
                          } w-full text-sm `}
                      />
                    </div>
                    <div className=" w-full mt-5 flex justify-start items-center gap-2">
                      <FaFacebookSquare className=" text-3xl" />
                      <input
                        type="text"
                        readOnly={!isEdit}
                        value={facebookUrl || ""}
                        onChange={(e) => setFacebookUrl(e.target.value)}
                        className={` focus:outline-none rounded-lg ${isEdit ? "bg-[#32353b] py-3 px-4" : "bg-transparent"
                          } w-full text-sm `}
                      />
                    </div>
                    <div className=" w-full mt-5 flex justify-start items-center gap-2">
                      <FaXTwitter className=" text-3xl" />
                      <input
                        type="text"
                        readOnly={!isEdit}
                        value={twitterUrl || ""}
                        onChange={(e) => setTwitterUrl(e.target.value)}
                        className={` focus:outline-none rounded-lg ${isEdit ? "bg-[#32353b] py-3 px-4" : "bg-transparent"
                          } w-full text-sm `}
                      />
                    </div>
                    <div className=" w-full mt-5 flex justify-start items-center gap-2">
                      <FaDiscord className=" text-3xl" />
                      <input
                        type="text"
                        readOnly={!isEdit}
                        value={discordUrl || ""}
                        onChange={(e) => setDiscordUrl(e.target.value)}
                        className={` focus:outline-none rounded-lg ${isEdit ? "bg-[#32353b] py-3 px-4" : "bg-transparent"
                          } w-full text-sm `}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </>
  );
};

export default UserProfile;
