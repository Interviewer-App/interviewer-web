'use client'
import React, { use, useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { fetchDocumet, getCandidateById } from "@/lib/api/users";
import { FaDiscord, FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, Percent, WandSparkles, LoaderCircle, User, Mail, Phone, Linkedin, Github, Facebook, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";

function CandidateDetailsProfile() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathParam = useParams()
    const searchParams = useSearchParams();
    const candidateId = searchParams.get("candidateId");
    const [candidateDetails, setCandidateDetails] = useState({});
    const [documentUrl, setDocumentUrl] = useState("");
    const [age, setAge] = useState(0);
    const { toast } = useToast();
    const [experiences, setExperiences] = useState([]);
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        const fetchCandidateDetails = async () => {
            try {
                const response = await getCandidateById(candidateId);
                if (response.data) {
                    const parsedExperiences = response.data?.experience
                        ? JSON.parse(response.data.experience)
                        : [];

                    const parsedSkills = response.data?.skillHighlights
                        ? JSON.parse(response.data?.skillHighlights)
                        : [];
                    setCandidateDetails(response.data);
                    setExperiences(parsedExperiences);
                    setSkills(parsedSkills)
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
    }, [candidateId]);

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
    }, [candidateId]);

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
                                    <BreadcrumbLink
                                        href={`/interviews/${encodeURIComponent(pathParam.id)}`}
                                        className=" cursor-pointer"
                                    >
                                        Interview details
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem className="hidden md:block cursor-pointer">
                                    <BreadcrumbPage>Candidate details</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className=" w-[90%] max-w-[1500px] bg-black mx-auto h-full p-6 relative">
                    <h1 className=" text-3xl font-semibold">Candidate Details</h1>
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
                            <p className=" mx-auto md:mx-0 text-xs mt-3 rounded-full bg-blue-500/50 boeder-2 border-blue-700 text-blue-300 py-1 px-4 w-fit">
                                {candidateDetails?.user?.role || "Candidate"}
                            </p>
                        </div>
                    </div>
                    <div className=" flex flex-col md:flex-row justify-between items-start w-full mt-8">
                        <div className=" w-full md:w-[70%] md:border-r-2 border-gray-500/20 md:pr-8">
                            {/* <div className="bg-blue-700/5 text-blue-500 border-2 border-blue-900 px-8 py-5 rounded-lg">
                                <h1 className=" text-xl font-semibold">Experiences</h1>
                                <div
                                    className="text-justify w-full text-gray-500 bg-transparent rounded-lg mt-3"
                                    dangerouslySetInnerHTML={{
                                        __html: candidateDetails?.experience || "No Experiences",
                                    }}
                                />
                            </div> */}
                            <Card className=" border-2 !bg-[#1b1d23] !border-blue-600/30">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-semibold text-blue-600">
                                                Experiences
                                            </h3>

                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {experiences.map((experience, index) => (
                                            <div
                                                key={index}
                                                className={`border-l-2 border-border pl-4 py-2 `}
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
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                            {/* <div className="bg-yellow-700/5 text-yellow-800 border-2 border-yellow-900 px-8 py-5 rounded-lg mt-5">
                                <h1 className=" text-xl font-semibold">Skill Highlights</h1>
                                <div
                                    className="text-justify text-gray-500 w-full bg-transparent rounded-lg mt-3"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            candidateDetails?.skillHighlights || "No Skill Highlight",
                                    }}
                                />
                            </div> */}
                            <Card className="border-2 !bg-[#1b1d23] !border-orange-400/20 mt-5">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-xl font-semibold text-orange-400">
                                                Skill Highlights
                                            </h3>

                                        </div>

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

                                            </div>
                                        ))}
                                    </div>


                                </CardContent>
                            </Card>
                            <div className=" w-full rounded-lg mt-5 px-8 py-5 bg-gray-700/20 border-2 border-gray-700 p-0 overflow-x-hidden">
                                <h2 className=" text-xl font-semibold">Resume</h2>
                                {documentUrl.url ? (
                                    <iframe
                                        src={`${documentUrl.url}`}
                                        className=" overflow-x-hidden rounded-lg mt-5"
                                        width="100%"
                                        height="500px"
                                        style={{ border: "none" }}
                                        title="PDF Viewer"
                                    />
                                ) : (
                                    <div className="bg-gray-700/20 text-gray-400 border-2 border-gray-700 px-8 py-5 rounded-lg flex flex-col items-center justify-center min-h-[500px]">
                                        <h1 className=" text-xl font-semibold">No Document Found</h1>
                                        {/* <p className=" text-xs italic text-center w-[80%] py-2 mx-auto text-gray-600">
                                            {
                                                "Please upload your CV in PDF format. Ensure the file is properly named (e.g., YourName_CV.pdf) and does not exceed the size limit. Supported format: .pdf."
                                            }
                                        </p> */}

                                    </div>
                                )}
                            </div>
                            {documentUrl.url && (
                                <div className=" w-full min-h-[500px] bg-gray-700/20 text-gray-400 border-2 boeder-2 border-[#b378ff] px-8 py-5 rounded-lg mt-5">
                                    <h1 className=" text-2xl font-semibold h-full text-[#b378ff] flex justify-between">Resume Analiyze <WandSparkles /></h1>

                                    <h5 className=" text-2xl font-semibold h-full mt-5">Summary</h5>
                                    <p>{documentUrl.summary}</p>

                                    <h5 className=" text-2xl font-semibold h-full mt-5">Education</h5>
                                    {documentUrl?.education?.map((edu, index) => (
                                        <span
                                            key={index}
                                            className="inline-block bg-gray-200/10 rounded-lg px-4 py-2 text-sm text-gray-500 mr-2 mb-2"
                                        >
                                            {edu}
                                        </span>))}

                                    <h5 className=" text-2xl font-semibold h-full mt-5">Experience</h5>
                                    {documentUrl?.experience?.map((exp, index) => (
                                        <span
                                            key={index}
                                            className="inline-block bg-gray-200/10 rounded-lg px-4 py-2 text-sm text-gray-500 mr-2 mb-2"
                                        >
                                            {exp}
                                        </span>))}


                                    <h5 className=" text-2xl font-semibold h-full mt-5">Skills</h5>
                                    {documentUrl?.skills?.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="inline-block bg-gray-200/10 rounded-full px-3 py-1 text-sm text-gray-500 mr-2 mb-2"
                                        >
                                            {skill}
                                        </span>))}

                                    <h5 className=" text-2xl font-semibold h-full mt-5">Contact Info</h5>
                                    <p>Email - {documentUrl?.contactInfo?.email}</p>
                                    <p>Phone - {documentUrl?.contactInfo?.phone}</p>
                                </div>
                            )}

                        </div>
                        <div className=" w-full md:w-[40%] md:px-8 md:mt-0 mt-5">
                            <Card className="border-border !bg-[#1b1d23]">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-semibold">
                                            Personal Details
                                        </h3>

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
                                                    <p>
                                                        {new Date(candidateDetails?.user?.dob).toLocaleDateString("en-GB", {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        })}
                                                    </p>
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
                                                    <p>
                                                        {candidateDetails?.user?.gender
                                                            ? candidateDetails?.user?.gender.charAt(0).toUpperCase() +
                                                            candidateDetails?.user?.gender.slice(1).toLowerCase()
                                                            : "not specified"}
                                                    </p>
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
                                                    <p>{candidateDetails?.user?.email}</p>
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
                                                    <p>{candidateDetails?.user?.contactNo}</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            {/* <div className="bg-gray-700/20 text-gray-400 border-2 border-gray-700 px-8 py-5 rounded-lg">
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
                                    <p className=" text-md">{candidateDetails?.user?.gender}</p>
                                </div>
                                <div className=" w-full mt-5">
                                    <p className=" text-base text-gray-500">Date of Birth</p>
                                    <p className=" text-md">
                                        {new Date(candidateDetails?.user?.dob).toLocaleDateString(
                                            "en-GB",
                                            {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            }
                                        )}
                                    </p>
                                </div>
                                <div className=" w-full mt-5">
                                    <p className=" text-base text-gray-500">Email</p>
                                    <p className=" text-md">{candidateDetails?.user?.email}</p>
                                </div>
                                <div className=" w-full mt-5">
                                    <p className=" text-base text-gray-500">Phone</p>
                                    <p className=" text-md">{candidateDetails?.user?.contactNo}</p>
                                </div>
                            </div> */}

                            <Card className="border-border !bg-[#1b1d23] mt-5">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-semibold">Social Media</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div
                                                className={`flex items-center gap-3`}
                                            >
                                                <div className="bg-[#b3b3b31a] rounded-md p-2">
                                                    <Linkedin size={16} />
                                                </div>
                                                <div className="w-full">
                                                    <p className="text-sm font-medium">LinkedIn</p>
                                                    <p className="text-xs text-[#b3b3b3] max-w-[80%] whitespace-nowrap overflow-hidden text-ellipsis">
                                                        {candidateDetails?.linkedInUrl
                                                            ? candidateDetails?.linkedInUrl.replace(
                                                                /^https?:\/\/(www\.)?/i,
                                                                ""
                                                            )
                                                            : "linkedin.com/in/username"}
                                                    </p>
                                                </div>
                                            </div>
                                            {candidateDetails?.linkedInUrl && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-accent"
                                                    asChild
                                                >
                                                    <a
                                                        href={candidateDetails?.linkedInUrl }
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
                                                className={`flex items-center gap-3 w-[80%]`}
                                            >
                                                <div className="bg-[#b3b3b31a] rounded-md p-2">
                                                    <Github size={16} />
                                                </div>
                                                <div className="w-full">
                                                    <p className="text-sm font-medium">Github</p>
                                                    <p className="text-xs text-[#b3b3b3] max-w-[80%] whitespace-nowrap overflow-hidden text-ellipsis">
                                                        {candidateDetails?.githubUrl
                                                            ? candidateDetails?.githubUrl.replace(
                                                                /^https?:\/\/(www\.)?/i,
                                                                ""
                                                            )
                                                            : "github.com/username"}
                                                    </p>
                                                </div>
                                            </div>
                                            {candidateDetails?.githubUrl && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-accent"
                                                    asChild
                                                >
                                                    <a
                                                        href={candidateDetails?.githubUrl}
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
                                                className={`flex items-center gap-3 w-[80%]`}
                                            >
                                                <div className="bg-[#b3b3b31a] rounded-md p-2">
                                                    <Facebook size={16} />
                                                </div>
                                                <div className=" w-full">
                                                    <p className="text-sm font-medium">Facebook</p>
                                                    <p className="text-xs text-[#b3b3b3] max-w-[80%] whitespace-nowrap overflow-hidden text-ellipsis">
                                                        {candidateDetails?.facebookUrl
                                                            ? candidateDetails?.facebookUrl.replace(
                                                                /^https?:\/\/(www\.)?/i,
                                                                ""
                                                            )
                                                            : "facebook username"}
                                                    </p>
                                                </div>
                                            </div>
                                            {candidateDetails?.facebookUrl && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-accent"
                                                    asChild
                                                >
                                                    <a
                                                        href={candidateDetails?.facebookUrl}
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
                                                className={`flex items-center gap-3 w-[80%]`}
                                            >
                                                <div className="bg-[#b3b3b31a] rounded-md p-2">
                                                    <FaXTwitter size={16} />
                                                </div>
                                                <div className="w-full">
                                                    <p className="text-sm font-medium">X</p>
                                                    <p className="text-xs text-[#b3b3b3] max-w-[80%] whitespace-nowrap overflow-hidden text-ellipsis">
                                                        {candidateDetails?.twitterUrl
                                                            ? candidateDetails?.twitterUrl.replace(
                                                                /^https?:\/\/(www\.)?/i,
                                                                ""
                                                            )
                                                            : "x.com/username"}
                                                    </p>
                                                </div>
                                            </div>
                                            {candidateDetails?.twitterUrl && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-accent"
                                                    asChild
                                                >
                                                    <a
                                                        href={candidateDetails?.twitterUrl}
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
                                                className={`flex items-center gap-3 w-[80%]`}
                                            >
                                                <div className="bg-[#b3b3b31a] rounded-md p-2">
                                                    <FaDiscord size={16} />
                                                </div>
                                                <div className="w-full">
                                                    <p className="text-sm font-medium">Discord</p>
                                                    <p className="text-xs text-[#b3b3b3] max-w-[80%] whitespace-nowrap overflow-hidden text-ellipsis">
                                                        {candidateDetails?.discordUrl
                                                            ? candidateDetails?.discordUrl.replace(
                                                                /^https?:\/\/(www\.)?/i,
                                                                ""
                                                            )
                                                            : "discord.com/username"}
                                                    </p>
                                                </div>
                                            </div>
                                            {candidateDetails?.discordUrl && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-accent"
                                                    asChild
                                                >
                                                    <a
                                                        href={candidateDetails?.discordUrl}
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
                                    
                                </CardContent>
                            </Card>

                            {/* <div className="bg-gray-700/20 text-gray-400 border-2 border-gray-700 px-8 py-5 rounded-lg mt-5">
                                <h2 className=" text-xl font-semibold">Social Media</h2>
                                <div className=" w-full mt-5 flex justify-start items-center gap-2">
                                    <FaLinkedin className=" text-3xl" />
                                    <p
                                        type="text"
                                        className={` focus:outline-none bg-transparent rounded-lg w-full text-sm py-1.5 px-2`}
                                    >
                                        {candidateDetails?.linkedInUrl}
                                    </p>
                                </div>
                                <div className=" w-full mt-5 flex justify-start items-center gap-2">
                                    <FaGithub className=" text-3xl" />
                                    <p
                                        type="text"
                                        className={` focus:outline-none bg-transparent rounded-lg w-full text-sm py-1.5 px-2`}
                                    >
                                        {candidateDetails?.githubUrl}
                                    </p>
                                </div>
                                <div className=" w-full mt-5 flex justify-start items-center gap-2">
                                    <FaFacebookSquare className=" text-3xl" />
                                    <p
                                        type="text"
                                        className={` focus:outline-none bg-transparent rounded-lg w-full text-sm py-1.5 px-2`}
                                    >
                                        {candidateDetails?.facebookUrl}
                                    </p>
                                </div>
                                <div className=" w-full mt-5 flex justify-start items-center gap-2">
                                    <FaXTwitter className=" text-3xl" />
                                    <p
                                        type="text"
                                        className={` focus:outline-none bg-transparent rounded-lg w-full text-sm py-1.5 px-2`}
                                    >
                                        {candidateDetails?.twitterUrl}
                                    </p>
                                </div>
                                <div className=" w-full mt-5 flex justify-start items-center gap-2">
                                    <FaDiscord className=" text-3xl" />
                                    <p
                                        type="text"
                                        className={` focus:outline-none bg-transparent rounded-lg w-full text-sm py-1.5 px-2`}
                                    >
                                        {candidateDetails?.discordUrl}
                                    </p>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>

            </SidebarInset>
        </div>
    );
}

export default CandidateDetailsProfile;