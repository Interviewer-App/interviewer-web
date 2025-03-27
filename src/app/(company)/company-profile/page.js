"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DataTable } from "@/components/ui/companyProfile-DataTable/Datatable";
import { columns } from "@/components/ui/companyProfile-DataTable/column";
import Loading from "@/app/loading";
import { usePathname, useRouter, redirect } from "next/navigation";
import { useSession, getSession } from "next-auth/react";
import { FaDiscord } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { TbWorldWww } from "react-icons/tb";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MdEdit } from "react-icons/md";
import dynamic from "next/dynamic";
import CreateTeamModal from "@/components/company/create-team-modal";
import { getCompanyTeams } from "@/lib/api/user-team";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { getCompanyById, updateCompanyById } from "@/lib/api/users";
import { Building2, ExternalLink, Facebook, Github, Info, Mail, Phone, Save } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Linkedin } from "react-feather";
const QuillEditor = dynamic(() => import("@/components/quillEditor"), {
  ssr: false,
});

const InterviewCategoryPage = () => {
  const [Tab, setTab] = useState("Details");
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [discordUrl, setDiscordUrl] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [teams, setTeams] = useState([]);
  const [totalTeams, setTotalTeams] = useState(0);
  const [companyId, setCompanyId] = useState("");
  const [companyDetails, setCompanyDetails] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    setDescription(companyDetails.companyDescription || "");
    setLinkedinUrl(companyDetails.linkedInUrl || "");
    setGithubUrl(companyDetails.githubUrl || "");
    setFacebookUrl(companyDetails.facebookUrl || "");
    setTwitterUrl(companyDetails.twitterUrl || "");
    setDiscordUrl(companyDetails.discordUrl || "");
    setWebsiteUrl(companyDetails.websiteURL || "");
    setContactNo(companyDetails?.adminUser?.[0]?.contactNo || "");
    setCompanyName(companyDetails.companyName || "");
    setEmail(companyDetails?.adminUser?.[0]?.email);
  }, [companyDetails]);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const session = await getSession();
        const companyId = session?.user?.companyID;
        const response = await getCompanyTeams(companyId, page, limit);
        if (response) {
          setTeams(response.data.team);
          setTotalTeams(response.data.total);
        }
      } catch (error) {
        console.log("Error fetching teams:", error);
      }
    };

    if (Tab === "Team") fetchTeamData();
  }, [Tab, page, limit]);

  const handleNextPage = () => {
    if (page * limit < totalTeams) {
      setPage(page + 1);
    }
  };

  useEffect(() => {
    const fetchCompanyId = async () => {
      try {
        const session = await getSession();
        const companyId = session?.user?.companyID;
        if (companyId) {
          setCompanyId(companyId);
        }
      } catch (err) {
        if (err.response) {
          const { data } = err.response;

          if (data && data.message) {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: `Company Details Fetching Faild: ${data.message}`,
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

    fetchCompanyId();
  }, []);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await getCompanyById(companyId);
        if (response.data) {
          setCompanyDetails(response.data);
        }
      } catch (err) {
        if (err.response) {
          const { data } = err.response;

          if (data && data.message) {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: `Company Details Fetching Faild: ${data.message}`,
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

    if (companyId) {
      fetchCompanyDetails();
    }
  }, [companyId, isEdit]);

  const handlePage = (page) => {
    if (page > 0 && page <= Math.ceil(totalTeams / limit)) {
      setPage(page);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  if (status === "loading") {
    return <Loading />;
  } else {
    if (session.user.role !== "COMPANY") {
      const loginURL = `/login?redirect=${encodeURIComponent(pathname)}`;
      redirect(loginURL);
    }
  }

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const response = await updateCompanyById(companyId, {
        companyDescription: description,
        contactNo: contactNo,
        companyName,
        websiteUrl: websiteUrl,
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

  return (
    <>
      <SidebarInset>
        <header className="flex h-16 bg-black  shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Company Profile</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="w-[90%] max-w-[1500px] mx-auto h-full p-6 relative">
          {/* <h1 className=" text-3xl font-semibold">Company Profile</h1> */}
          <div className=" w-full flex flex-col md:flex-row justify-center md:justify-start items-center mt-9 bg-[#1b1d23] p-6 rounded-2xl">
            <Avatar className=" h-28 w-28 md:h-40 md:w-40 ">
              <AvatarFallback className="text-4xl md:text-6xl">
                {companyDetails?.companyName
                  ? companyDetails?.companyName.charAt(0).toUpperCase()
                  : ""}
                {companyDetails?.companyName
                  ? companyDetails?.companyName.charAt(1).toUpperCase()
                  : ""}
              </AvatarFallback>
            </Avatar>
            <div className=" md:ml-5 md:mt-5 ml-0 mt-0">
              <p className=" text-2xl md:text-5xl md:text-left text-center py-1 font-semibold">
                {companyDetails?.companyName || "Company"}{" "}
              </p>
              <p className=" text-lg md:text-xl md:text-left text-center text-gray-500 flex items-center ">
                <Mail size={16} className="mr-1" />
                {email}
              </p>
              <p className=" mx-auto md:mx-0 text-xs mt-3 rounded-full bg-[#262626] boeder text-white py-1 px-4 w-fit border-gray-500/20">
                {companyDetails?.adminUser?.[0]?.role || "Candidate"}
              </p>
            </div>
          </div>
          <div className=" w-full flex justify-between items-center mt-10 ml-md mb-8">
            <div className="flex space-x-4 bg-slate-600/20 w-fit p-1 md:p-2 rounded-lg">
              <button
                onClick={() => setTab("Details")}
                className={` text-xs md:text-sm py-2 px-4 md:px-6 rounded-lg ${Tab === "Details" ? "bg-gray-800" : ""
                  } `}
              >
                Details
              </button>
              <button
                onClick={() => setTab("Team")}
                className={` text-xs md:text-sm py-2 px-4 md:px-6 rounded-lg ${Tab === "Team" ? "bg-gray-800" : ""
                  } `}
              >
                Team
              </button>
            </div>
            <div className={` ${Tab !== "Details" ? "hidden" : "block"} `}>
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
                  } rounded-lg text-sm font-semibold bg-darkred text-black h-11 px-5 bg-white border border-black`}
              >
                <div className="flex flex-row items-center space-x-2">
                  <Save />
                  Save Changes
                </div>
              </button>
            </div>
          </div>

          <div className="w-full h-fit rounded-lg mt-5">
            {Tab === "Team" ? (
              <>
                <div className="flex items-center justify-between px-5 mb-5">
                  <h1 className="text-2xl font-semibold">Team</h1>

                  <button
                    onClick={() => setModalOpen(true)}
                    className="rounded-lg bg-white text-sm font-semibold text-black px-5 py-2"
                  >
                    +Add Team
                  </button>
                </div>

                <div>
                  <DataTable columns={columns} data={teams} />
                </div>

                {modalOpen && (
                  <CreateTeamModal
                    isUpdate={false}
                    setModalOpen={setModalOpen}
                    companyTeam={{}}
                  />
                )}

                <Pagination>
                  <PaginationContent>
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
              </>
            ) : (
              <div className=" flex flex-col md:flex-row justify-between items-start w-full mt-8">
                <div className=" w-full md:w-[70%] md:border-r-2 border-gray-500/20 md:pr-8">
                  <div className="bg-[#1b1d23] text-blue-500 border-2 border-blue-900 px-8 py-5 rounded-lg">
                    <div className="flex flex-row items-center space-x-2">
                      <h1 className=" text-xl font-semibold">Description</h1>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 text-blue-500 hover:text-blue-800 cursor-pointer" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 text-white p-2 rounded-md text-sm max-w-[200px] text-center">
                            Provide a brief description of your company, highlighting key details.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div
                      className={` ${isEdit ? "hidden" : "block"
                        } text-justify w-full text-gray-500 bg-transparent rounded-lg mt-1 py-2 description`}
                      dangerouslySetInnerHTML={{
                        __html: description || "Not Available",
                      }}
                    />
                    <div
                      className={`${isEdit ? "block" : "hidden"
                        } mt-2 text-gray-500`}
                    >
                      <QuillEditor
                        editorId={"description"}
                        value={description}
                        placeholder="Write about Your Company here..."
                        onChange={setDescription}
                      />
                    </div>
                  </div>
                </div>
                <div className=" w-full md:w-[40%] md:px-8 md:mt-0 mt-5">
                  <div className="bg-[#1b1d23] text-gray-400 border-2 border-gray-700 px-6 py-5 rounded-lg">
                    <h2 className=" text-xl font-semibold text-white">Company Details</h2>
                    <div className=" w-full mt-5 flex flex-row gap-2">
                      <Building2 />
                      <div>
                        <p className=" text-base text-muted-foreground mb-1">Company Name</p>
                        <input
                          type="text"
                          readOnly={!isEdit}
                          value={companyName || ""}
                          placeholder="Company Name"
                          onChange={(e) => setCompanyName(e.target.value)}
                          className={` focus:outline-none rounded-lg text-white ${isEdit ? "bg-black py-3 px-4" : "bg-transparent"
                            } w-full text-sm `}
                        />
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="w-full mt-5 flex flex-col">
                      <div className="flex flex-row gap-2">
                        <Mail />
                        <p className=" text-base text-muted-foreground">Email</p>
                      </div>
                      <p className=" text-md ml-8 text-white">{email}</p>
                    </div>
                    <Separator className="my-2" />
                    <div className=" w-full mt-5 flex flex-col">
                      <div className="flex flex-row gap-2">
                        <Phone size={18} />
                        <p className=" text-base text-muted-foreground mb-1">Contact No</p>
                      </div>
                      <input
                        type="text"
                        readOnly={!isEdit}
                        placeholder="Contact No"
                        value={contactNo}
                        onChange={(e) => setContactNo(e.target.value)}
                        className={` ml-8 !text-white focus:outline-none rounded-lg ${isEdit ? "bg-black py-3 px-4" : "bg-transparent"
                          } text-sm text-w`}
                      />
                    </div>
                  </div>
                  <div className="bg-[#1b1d23] text-gray-400 border-2 border-gray-700 px-8 py-5 rounded-lg mt-5">
                    <h2 className=" text-xl font-semibold text-white">Social Media</h2>
                    <div className=" w-full mt-5 flex justify-start items-center gap-2">
                      <div className="bg-[#b3b3b31a] rounded-md p-2">
                        <TbWorldWww className=" text-3xl" />
                      </div>

                      {isEdit ? (
                        <input
                          type="text"
                          readOnly={!isEdit}
                          value={websiteUrl || ""}
                          placeholder="Website URL"
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                          className={` focus:outline-none rounded-lg placeholder:text-white ${isEdit ? "bg-black py-3 px-4" : "bg-transparent"
                            } w-full text-sm `}
                        />
                      ) : (
                        <div className="flex justify-between items-center w-full">
                          <a
                            href={websiteUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm ${!websiteUrl ? "text-gray-400 pointer-events-none" : "text-blue-500"
                              }`}
                          >
                            {websiteUrl ? new URL(websiteUrl).hostname + "..." : "Website URL"}
                          </a>
                          {websiteUrl && (
                            <ExternalLink
                              size={20}  // Icon size set to 20
                              className="text-yellow-400 inline-block mr-1 cursor-pointer"
                              onClick={() => window.open(websiteUrl, "_blank")}
                            />
                          )}
                        </div>

                      )}
                    </div>
                    <div className=" w-full mt-5 flex justify-start items-center gap-2">
                      <div className="bg-[#b3b3b31a] rounded-md p-2">
                        <Linkedin />
                      </div>
                      {isEdit ? (
                        <input
                          type="text"
                          readOnly={!isEdit}
                          value={linkedinUrl || ""}
                          placeholder="Linkedin URL"
                          onChange={(e) => setLinkedinUrl(e.target.value)}
                          className={` focus:outline-none rounded-lg ${isEdit ? "bg-black py-3 px-4 placeholder:text-white" : "bg-transparent"
                            } w-full text-sm `}
                        />
                      ) : (
                        <div className="flex justify-between items-center w-full">
                          <a
                            href={linkedinUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm ${!linkedinUrl ? "text-gray-400 pointer-events-none" : "text-blue-500"}`}
                          >
                            {linkedinUrl ? new URL(linkedinUrl).hostname + "..." : "Linkedin URL"}
                          </a>
                          {linkedinUrl && (
                            <ExternalLink
                              size={20}
                              className="text-yellow-400 inline-block mr-1 cursor-pointer"
                              onClick={() => window.open(linkedinUrl, "_blank")}
                            />
                          )}
                        </div>

                      )}
                    </div>
                    <div className=" w-full mt-5 flex justify-start items-center gap-2">
                      <div className="bg-[#b3b3b31a] rounded-md p-2">
                        <Github />
                      </div>
                      {isEdit ? (
                        <input
                          type="text"
                          readOnly={!isEdit}
                          value={githubUrl || ""}
                          placeholder="Github URL"
                          onChange={(e) => setGithubUrl(e.target.value)}
                          className={` focus:outline-none rounded-lg ${isEdit ? "bg-black py-3 px-4 placeholder:text-white" : "bg-transparent"
                            } w-full text-sm `}
                        />
                      ) : (
                        <div className="flex justify-between items-center w-full">
                          <a
                            href={githubUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm ${!githubUrl ? "text-gray-400 pointer-events-none" : "text-blue-500"
                              }`}
                          >
                            {githubUrl ? new URL(githubUrl).hostname + "..." : "Github URL"}
                          </a>
                          {githubUrl && (
                            <ExternalLink
                              size={20}
                              className="text-yellow-400 inline-block mr-1 cursor-pointer"
                              onClick={() => window.open(githubUrl, "_blank")}
                            />
                          )}
                        </div>
                      )}
                    </div>
                    <div className=" w-full mt-5 flex justify-start items-center gap-2">
                      <div className="bg-[#b3b3b31a] rounded-md p-2">
                        <Facebook />

                      </div>
                      {isEdit ? (
                        <input
                          type="text"
                          readOnly={!isEdit}
                          value={facebookUrl || ""}
                          placeholder="Facebook URL"
                          onChange={(e) => setFacebookUrl(e.target.value)}
                          className={` focus:outline-none rounded-lg ${isEdit ? "bg-black py-3 px-4 placeholder:text-white" : "bg-transparent"
                            } w-full text-sm `}
                        />
                      ) : (
                        <div className="flex justify-between items-center w-full">
                          <a
                            href={facebookUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm ${!facebookUrl ? "text-gray-400 pointer-events-none" : "text-blue-500"
                              }`}
                          >
                            {facebookUrl ? new URL(facebookUrl).hostname + "..." : "Facebook URL"}
                          </a>
                          {facebookUrl && (
                            <ExternalLink
                              size={20}
                              className="text-yellow-400 inline-block mr-1 cursor-pointer"
                              onClick={() => window.open(facebookUrl, "_blank")}
                            />
                          )}
                        </div>

                      )}
                    </div>
                    <div className=" w-full mt-5 flex justify-start items-center gap-2">
                      <div className="bg-[#b3b3b31a] rounded-md p-2">
                        <FaXTwitter className=" text-3xl" />
                      </div>

                      {isEdit ? (
                        <input
                          type="text"
                          readOnly={!isEdit}
                          value={twitterUrl || ""}
                          placeholder="X URL"
                          onChange={(e) => setTwitterUrl(e.target.value)}
                          className={` focus:outline-none rounded-lg ${isEdit ? "bg-black py-3 px-4 placeholder:text-white" : "bg-transparent"
                            } w-full text-sm `}
                        />
                      ) : (
                        <div className="flex justify-between items-center w-full">
                          <a
                            href={twitterUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm ${!twitterUrl ? "text-gray-400 pointer-events-none" : "text-blue-500"
                              }`}
                          >
                            {twitterUrl ? new URL(twitterUrl).hostname + "..." : "X URL"}
                          </a>
                          {twitterUrl && (
                            <ExternalLink
                              size={20}  // Set icon size to 20
                              className="text-yellow-400 inline-block mr-1 cursor-pointer"
                              onClick={() => window.open(twitterUrl, "_blank")}
                            />
                          )}
                        </div>

                      )}
                    </div>
                    <div className=" w-full mt-5 flex justify-start items-center gap-2">
                      <div className="bg-[#b3b3b31a] rounded-md p-2">
                        <FaDiscord className=" text-3xl" />
                      </div>
                      {isEdit ? (
                        <input
                          type="text"
                          readOnly={!isEdit}
                          value={discordUrl || ""}
                          placeholder="Discord URL"
                          onChange={(e) => setDiscordUrl(e.target.value)}
                          className={` focus:outline-none rounded-lg ${isEdit ? "bg-black py-3 px-4 placeholder:text-white" : "bg-transparent"
                            } w-full text-sm `}
                        />
                      ) : (
                        <div className="flex justify-between items-center w-full">
                          <a
                            href={twitterUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-sm ${!twitterUrl ? "text-gray-400 pointer-events-none" : "text-blue-500"
                              }`}
                          >
                            {twitterUrl ? new URL(twitterUrl).hostname + "..." : "X URL"}
                          </a>
                          {twitterUrl && (
                            <ExternalLink
                              size={20}  // Icon size set to 20
                              className="text-yellow-400 inline-block mr-1 cursor-pointer"
                              onClick={() => window.open(twitterUrl, "_blank")}
                            />
                          )}
                        </div>

                      )}
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

export default InterviewCategoryPage;
