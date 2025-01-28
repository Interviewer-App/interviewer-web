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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MdEdit } from "react-icons/md";
import dynamic from "next/dynamic";
import CreateTeamModal from "@/components/company/create-team-modal";
import { getCompanyTeams } from "@/lib/api/user-team";
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
  const [discordUrl, setDiscordUrl] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [teams, setTeams] = useState([]);
  const [totalTeams, setTotalTeams] = useState(0);
  const [companyDetails, setCompanyDetails] = useState({
    companyName: "Company1",
    email: "company@gmail.com",
    contactNo: "0771234567",
    linkedinUrl: "",
    githubUrl: "",
    facebookUrl: "",
    twitterUrl: "",
    discordUrl: "",
    role: "COMPANY",
    companyDescription:
      "<p>As a <strong>software engineer</strong>, I have expertise in developing <em>scalable</em> and <em>user-centric</em> applications using modern technologies. I specialize in <strong>full-stack development</strong> with the <strong>MERN stack</strong>, creating dynamic web solutions with seamless <em>client-server</em> integration. My experience includes building cross-platform mobile applications with <strong>React Native</strong> and <strong>Expo</strong>, focusing on intuitive <em>user interfaces</em> and <em>real-time features</em>. Additionally, I have a strong grasp of backend technologies like <strong>Firebase</strong> and <strong>MongoDB</strong>, ensuring efficient data management. My problem-solving skills and ability to collaborate in <em>Agile environments</em> enable me to deliver high-quality software that meets project goals effectively.</p>",
  });

  useEffect(() => {
    setDescription(companyDetails.companyDescription);
    setLinkedinUrl(companyDetails.linkedinUrl);
    setGithubUrl(companyDetails.githubUrl);
    setFacebookUrl(companyDetails.facebookUrl);
    setTwitterUrl(companyDetails.twitterUrl);
    setDiscordUrl(companyDetails.discordUrl);
    setContactNo(companyDetails.contactNo);
    setEmail(companyDetails.email);
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

    fetchTeamData();
  }, [page, limit, modalOpen]);

  const handleNextPage = () => {
    if (page * limit < totalTeams) {
      setPage(page + 1);
    }
  };

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

  const handleSaveChanges = () => {
    setIsEdit(false);
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
                <BreadcrumbItem>
                  <BreadcrumbPage>Company Profile</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="w-[90%] max-w-[1500px] mx-auto h-full p-6 relative">
          <h1 className=" text-3xl font-semibold">Company Profile</h1>
          <div className=" w-full flex flex-col md:flex-row justify-center md:justify-start items-center mt-9">
            <Avatar className=" h-28 w-28 md:h-40 md:w-40 ">
              <AvatarFallback className="text-4xl md:text-6xl">
                {companyDetails?.companyName
                  ? companyDetails?.companyName.charAt(0)
                  : ""}
                {companyDetails?.companyName
                  ? companyDetails?.companyName.charAt(1)
                  : ""}
              </AvatarFallback>
            </Avatar>
            <div className=" ml-5 mt-5 md:mt-0">
              <p className=" text-2xl md:text-5xl md:text-left text-center py-1">
                {companyDetails?.companyName || "Company"}{" "}
              </p>
              <p className=" text-lg md:text-xl md:text-left text-center text-gray-500">
                {companyDetails?.email}
              </p>
              <p className=" mx-auto md:mx-0 text-xs mt-3 rounded-full bg-blue-500/50 boeder-2 border-blue-700 text-blue-300 py-1 px-4 w-fit">
                {companyDetails?.role || "Candidate"}
              </p>
            </div>
          </div>
          <div className=" w-full flex justify-between items-center mt-10 ml-md mb-8">
            <div className="flex space-x-4 bg-slate-600/20 w-fit p-1 md:p-2 rounded-lg">
              <button
                onClick={() => setTab("Details")}
                className={` text-xs md:text-sm py-2 px-4 md:px-6 rounded-lg ${
                  Tab === "Details" ? "bg-gray-800" : ""
                } `}
              >
                Details
              </button>
              <button
                onClick={() => setTab("Team")}
                className={` text-xs md:text-sm py-2 px-4 md:px-6 rounded-lg ${
                  Tab === "Team" ? "bg-gray-800" : ""
                } `}
              >
                Team
              </button>
            </div>
            <div className={` ${Tab !== "Details" ? "hidden" : "block"} `}>
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
                  <div className="bg-blue-700/5 text-blue-500 border-2 border-blue-900 px-8 py-5 rounded-lg">
                    <h1 className=" text-xl font-semibold">Description</h1>
                    <div
                      className={` ${
                        isEdit ? "hidden" : "block"
                      } text-justify w-full text-gray-500 bg-transparent rounded-lg mt-1 py-2`}
                      dangerouslySetInnerHTML={{
                        __html: description || "No Description",
                      }}
                    />
                    <div
                      className={`${
                        isEdit ? "block" : "hidden"
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
                  <div className="bg-gray-700/20 text-gray-400 border-2 border-gray-700 px-8 py-5 rounded-lg">
                    <h2 className=" text-xl font-semibold">Company Details</h2>
                    <div className=" w-full mt-5">
                      <p className=" text-base text-gray-500">Company Name</p>
                      <p className=" text-md">
                        {companyDetails.companyName || "Company Name"}
                      </p>
                    </div>
                    <div className=" w-full mt-5">
                      <p className=" text-base text-gray-500">Email</p>
                      <p className=" text-md">{email}</p>
                    </div>
                    <div className=" w-full mt-5">
                      <p className=" text-base text-gray-500">Contact No</p>
                      <input
                        type="text"
                        readOnly={!isEdit}
                        value={contactNo || "Contact No"}
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
                      <input
                        type="text"
                        readOnly={!isEdit}
                        value={linkedinUrl || "Linkedin URL"}
                        onChange={(e) => setLinkedinUrl(e.target.value)}
                        className={` focus:outline-none rounded-lg ${
                          isEdit ? "bg-[#32353b] py-3 px-4" : "bg-transparent"
                        } w-full text-sm `}
                      />
                    </div>
                    <div className=" w-full mt-5 flex justify-start items-center gap-2">
                      <FaGithub className=" text-3xl" />
                      <input
                        type="text"
                        readOnly={!isEdit}
                        value={githubUrl || "Github URL"}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        className={` focus:outline-none rounded-lg ${
                          isEdit ? "bg-[#32353b] py-3 px-4" : "bg-transparent"
                        } w-full text-sm `}
                      />
                    </div>
                    <div className=" w-full mt-5 flex justify-start items-center gap-2">
                      <FaFacebookSquare className=" text-3xl" />
                      <input
                        type="text"
                        readOnly={!isEdit}
                        value={facebookUrl || "Facebook URL"}
                        onChange={(e) => setFacebookUrl(e.target.value)}
                        className={` focus:outline-none rounded-lg ${
                          isEdit ? "bg-[#32353b] py-3 px-4" : "bg-transparent"
                        } w-full text-sm `}
                      />
                    </div>
                    <div className=" w-full mt-5 flex justify-start items-center gap-2">
                      <FaXTwitter className=" text-3xl" />
                      <input
                        type="text"
                        readOnly={!isEdit}
                        value={twitterUrl || "Twitter URL"}
                        onChange={(e) => setTwitterUrl(e.target.value)}
                        className={` focus:outline-none rounded-lg ${
                          isEdit ? "bg-[#32353b] py-3 px-4" : "bg-transparent"
                        } w-full text-sm `}
                      />
                    </div>
                    <div className=" w-full mt-5 flex justify-start items-center gap-2">
                      <FaDiscord className=" text-3xl" />
                      <input
                        type="text"
                        readOnly={!isEdit}
                        value={discordUrl || "Discord URL"}
                        onChange={(e) => setDiscordUrl(e.target.value)}
                        className={` focus:outline-none rounded-lg ${
                          isEdit ? "bg-[#32353b] py-3 px-4" : "bg-transparent"
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

export default InterviewCategoryPage;
