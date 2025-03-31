"use client";
import React, { use, useCallback, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  CalendarIcon,
  Percent,
  WandSparkles,
  LoaderCircle,
  User,
  Mail,
  Phone,
  Linkedin,
  Github,
  Facebook,
  ExternalLink,
  ArrowLeft,
  Star,
  FileText,
  Wand2,
  Calendar,
  Briefcase,
  Clock,
  Download,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider } from "@/components/ui/tooltip";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@radix-ui/react-tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function CandidateDetailsProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathParam = useParams();
  const searchParams = useSearchParams();
  const candidateId = searchParams.get("candidateId");
  const [candidateDetails, setCandidateDetails] = useState({});
  const [documentUrl, setDocumentUrl] = useState("");
  const [age, setAge] = useState(0);
  const { toast } = useToast();
  const [experiences, setExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [activeTab, setActiveTab] = useState("details");
  const [questionsGenerated, setQuestionsGenerated] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

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
          setSkills(parsedSkills);
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

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-500";
    if (score >= 80) return "text-blue-500";
    if (score >= 70) return "text-amber-500";
    return "text-red-500";
  };

  // Get background color based on score
  const getScoreBgColor = (score) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-blue-500";
    if (score >= 70) return "bg-amber-500";
    return "bg-red-500";
  };

  const handleGenerateQuestions = useCallback(() => {
    setIsGenerating(true);

    // Simulate AI processing
    setTimeout(() => {
      setIsGenerating(false);
      setQuestionsGenerated(true);
    }, 3000);
  }, []);

  const generatedQuestions = [
    {
      category: "Technical Skills",
      questions: [
        "Can you explain how you've used the MERN stack in your previous projects?",
        "What challenges did you face when developing mobile applications with Flutter, and how did you overcome them?",
        "How have you implemented AI-driven solutions using Python in your projects?",
        "Can you walk me through your approach to ensuring code modularity and maintainability?",
        "What TypeScript features do you find most valuable for ensuring code quality?",
      ],
    },
    {
      category: "Project Experience",
      questions: [
        "As a Team Leader for the Smart Administrative System, what methodologies did you use to manage your team?",
        "What were the key features of the Finance data tracking mobile app you developed for MoneyBestro?",
        "How did you approach the development of your Python Voice Assistant project?",
        "What database design considerations did you make for the CRUD application for teacher data management?",
        "Can you elaborate on the Stock Management System you're developing for Metrocon Constructors?",
      ],
    },
    {
      category: "Soft Skills & Leadership",
      questions: [
        "How do you approach solving complex problems in fast-paced environments?",
        "Can you give an example of a situation where you had to lead a team through a challenging project phase?",
        "How do you ensure effective communication within your development team?",
        "What strategies do you use to balance multiple ongoing projects simultaneously?",
        "How do you handle feedback and criticism on your work or leadership style?",
      ],
    },
    {
      category: "Education & Learning",
      questions: [
        "How has your education at CINEC campus prepared you for real-world software engineering challenges?",
        "What additional skills have you gained through the certificate courses at Wellington College?",
        "How do you stay updated with the latest technologies and programming practices?",
        "What learning resources do you find most valuable for continuing your professional development?",
        "How do you apply theoretical knowledge from your education to practical software development?",
      ],
    },
  ];

  const candidateData = {
    // id: params.candidateId,
    name: "Ushan Sankalpa",
    email: "ushansankalpa95@gmail.com",
    phone: "+94 77 123 4567",
    avatar: "/placeholder.svg?height=128&width=128",
    interviewDate: new Date(2025, 4, 3),
    startTime: "10:00 AM",
    endTime: "11:30 AM",
    status: "Scheduled",
    dateOfBirth: new Date(2025, 2, 28),
    gender: "not specified",
    socialMedia: {
      linkedin: "linkedin.com/in/ushansankalpa",
      github: "github.com/username",
      facebook: "facebook.username",
    },
    resumeSummary:
      "A highly motivated Software Engineering undergraduate passionate about designing and developing innovative applications. Skilled in web and mobile development. Experience in HTML, CSS, JavaScript, the MERN stack, Flutter, and AI-driven solutions using Python. Strong understanding of Object-Oriented Programming (OOP), applying modular and maintainable coding practices. Experienced in leading teams and solving complex problems in fast-paced environments. Committed to building scalable software that enhances user experiences and transforms industries",
    education: [
      {
        institution: "Pushpadana Girls' College Kandy",
        period: "2013-2021",
        degree: "School",
      },
      {
        institution: "CINEC campus (Pvt) Ltd",
        period: "2022-Present",
        degree: "BSc (Hons) Software Engineering",
      },
      {
        institution: "Wellington College Kandy",
        period: "2024-Present",
        degree: "Certificate Courses",
      },
    ],
    experience: [
      {
        role: "Team Leader",
        company: "Mahaweli Authority of Sri Lanka",
        project: "Smart Administrative System",
        status: "Ongoing",
      },
      {
        role: "",
        company: "CarZone Lanka (Pvt) Ltd",
        project: "Auction Data Management website",
        status: "Ongoing",
      },
      {
        role: "",
        company: "Metrocon Constructors (Pvt) Ltd",
        project: "Stock Management System",
        status: "Ongoing",
      },
      {
        role: "",
        company: "Zenride",
        project: "Zenride' Mini Mobile Game",
        status: "Completed",
      },
      {
        role: "",
        company: "PACMAN",
        project: "Whack a Mole, PAC Man-Inspired Games",
        status: "Completed",
      },
      {
        role: "",
        company: "MLmodels",
        project: "Python Machine Learning Models",
        status: "Completed",
      },
      {
        role: "",
        company: "Assistant",
        project: "Python Voice Assistant",
        status: "Completed",
      },
      {
        role: "",
        company: "CRUD",
        project: "CRUD application for teacher data management",
        status: "Completed",
      },
      {
        role: "",
        company: "MoneyBestro",
        project: "Finance data tracking mobile app for a Financial field Worker",
        status: "Completed",
      },
      {
        role: "Team Leader",
        company: "ZenFlow",
        project: "Website for Mind Relaxation",
        status: "Completed",
      },
    ],
    skills: ["HTML", "CSS", "JavaScript", "TypeScript", "PHP", "SQL", "Flutter", "Python", "Java", "C#"],
    technicalSkills: [
      { name: "React", score: 85, maxScore: 100, notes: "Good understanding of React hooks and component lifecycle." },
      {
        name: "TypeScript",
        score: 90,
        maxScore: 100,
        notes: "Excellent knowledge of TypeScript types and interfaces.",
      },
      {
        name: "Node.js",
        score: 75,
        maxScore: 100,
        notes: "Solid foundation but lacks experience with advanced concepts.",
      },
    ],
    softSkills: [
      { name: "Communication", score: 90, maxScore: 100, notes: "Articulates ideas clearly and concisely." },
      {
        name: "Teamwork",
        score: 85,
        maxScore: 100,
        notes: "Shows good collaboration skills and willingness to help others.",
      },
      {
        name: "Problem Solving",
        score: 95,
        maxScore: 100,
        notes: "Excellent analytical thinking and creative problem-solving approach.",
      },
    ],
    notes:
      "Ushan demonstrated strong technical skills, particularly in web development. Their problem-solving approach was methodical and effective. Would be a good fit for the frontend development team.",
    interviewer: {
      name: "Jennifer Smith",
      position: "Senior Engineering Manager",
      avatar: "/placeholder.svg?height=40&width=40",
    },
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Candidate Details</h1>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => router.push(`/interviews/${params.id}`)}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Interview
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="md:col-span-1 !bg-transparent">
              <CardHeader className="pb-2">
                <CardTitle>Candidate Profile</CardTitle>
                <CardDescription>Interview results and details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage
                      src={candidateDetails.avatar}
                      alt={candidateDetails.name}
                    />
                    <AvatarFallback className="text-2xl">
                      {candidateDetails?.user?.firstName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">
                    {candidateDetails?.user?.firstName}{" "}
                    {candidateDetails?.user?.lastName}
                  </h2>
                  <Badge className="mt-1 !bg-green-500/20 !text-green-500">
                    Completed
                  </Badge>
                </div>

                <div className="space-y-3 pt-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span>{candidateDetails?.user?.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span>{candidateDetails?.user?.contactNo}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <span>
                      {new Date(candidateDetails?.user?.dob).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>
                      10:00 AM - 11:00 AM
                      {/* {candidateDetails.startTime} - {candidateDetails.endTime} */}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">Interviewer</h3>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      {/* <AvatarImage src={candidateDetails.interviewer.avatar} alt={candidateDetails.interviewer.name} /> */}
                      <AvatarFallback>
                        {/* {candidateDetails?.user?.firstName.charAt(0)} */}
                        {("Ushan").charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {"Ushan Sankalpa"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {"Senior Engineering Manager"}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 !bg-transparent">
              <CardHeader>
                <CardTitle>Interview Results</CardTitle>
                <CardDescription>
                  Completed on{" "}
                  {candidateDetails.completedAt?.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  at{" "}
                  {candidateDetails.completedAt?.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
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
                        stroke={
                          candidateDetails.overallScore >= 90
                            ? "#10b981"
                            : candidateDetails.overallScore >= 80
                            ? "#3b82f6"
                            : candidateDetails.overallScore >= 70
                            ? "#f59e0b"
                            : "#ef4444"
                        }
                        strokeWidth="10"
                        strokeDasharray={`${
                          (2 * Math.PI * 45 * candidateDetails.overallScore) /
                          100
                        } ${
                          2 *
                          Math.PI *
                          45 *
                          (1 - candidateDetails.overallScore / 100)
                        }`}
                        strokeDashoffset={2 * Math.PI * 45 * 0.25}
                        transform="rotate(-90 50 50)"
                        strokeLinecap="round"
                      />
                      {/* Percentage text */}
                      <text
                        x="50"
                        y="45"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fontSize="24"
                        fontWeight="bold"
                        fill="currentColor"
                        className={getScoreColor(candidateDetails.overallScore)}
                      >
                        {candidateDetails.overallScore}
                      </text>
                      <text
                        x="50"
                        y="60"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        fontSize="14"
                        fill="currentColor"
                      >
                        Overall Score
                      </text>
                    </svg>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Technical Skills</h3>
                      {/* <span className={`font-bold ${getScoreColor(avgTechnicalScore)}`}>
                        {avgTechnicalScore.toFixed(1)}
                      </span> */}
                    </div>
                    {/* <Progress
                      value={avgTechnicalScore}
                      className="h-2"
                      indicatorClassName={getScoreBgColor(avgTechnicalScore)}
                    /> */}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Soft Skills</h3>
                      {/* <span className={`font-bold ${getScoreColor(avgSoftScore)}`}>{avgSoftScore.toFixed(1)}</span> */}
                    </div>
                    {/* <Progress value={avgSoftScore} className="h-2" indicatorClassName={getScoreBgColor(avgSoftScore)} /> */}
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="font-medium mb-3">Interviewer Notes</h3>
                  <div className="p-4 bg-muted/30 rounded-md">
                    <p>{candidateDetails.notes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex items-center gap-6">
              <Avatar className="h-32 w-32 text-5xl">
                <AvatarImage
                  src={candidateDetails?.user?.avatar}
                  alt={candidateDetails?.user?.firstName}
                />
                <AvatarFallback className="text-4xl md:text-6xl">
                  {candidateDetails?.user?.firstName
                    ? candidateDetails?.user?.firstName.charAt(0)
                    : ""}
                  {candidateDetails?.user?.lastName
                    ? candidateDetails?.user?.lastName.charAt(0)
                    : ""}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-3xl font-bold">
                  {candidateDetails?.user?.firstName}{" "}
                  {candidateDetails?.user?.lastName}
                </h2>
                <p className="text-lg text-muted-foreground mb-2">
                  {candidateDetails?.user?.email}
                </p>
                <Badge className="!bg-blue-600">
                  {candidateDetails?.user?.role}
                </Badge>
              </div>
            </div>
          </div> */}

          <Card className="!bg-transparent">
            <CardHeader>
              <CardTitle>Detailed Assessment</CardTitle>
              <CardDescription>
                Breakdown of candidate's performance in different skill areas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger
                    value="details"
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Candidate Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="assessment"
                    className="flex items-center gap-2"
                  >
                    <Star className="h-4 w-4" />
                    Assessment
                  </TabsTrigger>
                  <TabsTrigger
                    value="resume"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Resume & Questions
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column - Experience and Skills */}
                    <div className="md:col-span-2 space-y-6">
                      <Card className="!bg-transparent">
                        <CardHeader>
                          <CardTitle className="text-blue-400">
                            Experiences
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {experiences.map((exp, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                              <div>
                                <div className="font-medium">{exp.title}</div>
                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                  {/* <span>{exp.company}</span> */}
                                  {exp.company && (
                                    <>
                                      <span>{exp.company}</span>
                                      <span className="w-1 h-1 rounded-full bg-muted-foreground inline-block"></span>
                                    </>
                                  )}
                                  <Badge
                                    variant="outline"
                                    className={
                                      new Date(exp.endDate) > new Date()
                                        ? "!text-blue-400 !border-blue-400"
                                        : "!text-green-400 !border-green-400"
                                    }
                                  >
                                    {new Date(exp.endDate) > new Date()
                                      ? "Ongoing"
                                      : "Completed"}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>

                      <Card className="!bg-transparent">
                        <CardHeader>
                          <CardTitle className="text-orange-400">
                            Skill Highlights
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {skills.map((skill, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="px-3 py-1 text-sm"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Right Column - Personal Details and Social Media */}
                    <div className="space-y-6">
                      <Card className="!bg-transparent">
                        <CardHeader>
                          <CardTitle>Personal Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <User className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div className="text-sm text-muted-foreground">
                                  Full Name
                                </div>
                                <div className="font-medium">
                                  {candidateDetails?.user?.firstName}{" "}
                                  {candidateDetails?.user?.lastName}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <Calendar className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div className="text-sm text-muted-foreground">
                                  Date of Birth
                                </div>
                                <div className="font-medium">
                                  {new Date(
                                    candidateDetails?.user?.dob
                                  ).toLocaleDateString("en-US", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })}
                                  <span className="text-sm text-muted-foreground ml-2">
                                    ({age} Years old)
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <User className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div className="text-sm text-muted-foreground">
                                  Gender
                                </div>
                                <div className="font-medium">
                                  {candidateDetails?.user?.gender
                                    ? candidateDetails?.user?.gender
                                        .charAt(0)
                                        .toUpperCase() +
                                      candidateDetails?.user?.gender
                                        .slice(1)
                                        .toLowerCase()
                                    : "not specified"}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <Mail className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div className="text-sm text-muted-foreground">
                                  Email
                                </div>
                                <div className="font-medium">
                                  {candidateDetails?.user?.email}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <Phone className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div className="text-sm text-muted-foreground">
                                  Phone
                                </div>
                                <div className="font-medium">
                                  {candidateDetails?.user?.contactNo
                                    ? candidateDetails?.user?.contactNo
                                    : "Not Provided"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="!bg-transparent">
                        <CardHeader>
                          <CardTitle>Social Media</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className={`flex items-center gap-3`}>
                                <div className="bg-[#b3b3b31a] rounded-md p-2">
                                  <Linkedin size={16} />
                                </div>
                                <div className="w-full">
                                  <p className="text-sm font-medium">
                                    LinkedIn
                                  </p>
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
                                  className="text-accent relative"
                                  asChild
                                >
                                  <a
                                    href={candidateDetails?.linkedInUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink
                                      size={14}
                                      className=" text-yellow-400 absolute top-1/2 right-0 transform -translate-y-1/2"
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
                                  className="text-accent relative"
                                  asChild
                                >
                                  <a
                                    href={candidateDetails?.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink
                                      size={14}
                                      className=" text-yellow-400 absolute top-1/2 right-0 transform -translate-y-1/2"
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
                                  <p className="text-sm font-medium">
                                    Facebook
                                  </p>
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
                                  className="text-accent relative"
                                  asChild
                                >
                                  <a
                                    href={candidateDetails?.facebookUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink
                                      size={14}
                                      className=" text-yellow-400 absolute top-1/2 right-0 transform -translate-y-1/2"
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
                                  className="text-accent relative"
                                  asChild
                                >
                                  <a
                                    href={candidateDetails?.twitterUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink
                                      size={14}
                                      className=" text-yellow-400 absolute top-1/2 right-0 transform -translate-y-1/2"
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
                                  className="text-accent relative"
                                  asChild
                                >
                                  <a
                                    href={candidateDetails?.discordUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExternalLink
                                      size={14}
                                      className=" text-yellow-400 absolute top-1/2 right-0 transform -translate-y-1/2"
                                    />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="assessment" className="space-y-6">
                  <Card className="!bg-transparent">
                    <CardHeader>
                      <CardTitle>Interview Results</CardTitle>
                      {candidateData.status === "Completed" ? (
                        <CardDescription>
                          Completed on{" "}
                          {candidateData.interviewDate.toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </CardDescription>
                      ) : (
                        <CardDescription>
                          Scheduled for{" "}
                          {candidateDetails.interviewDate?.toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}{" "}
                          at {candidateDetails.startTime}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {candidateDetails.status === "Completed" ? (
                        <>
                          <div className="flex flex-col items-center">
                            <div className="relative w-40 h-40">
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
                                  stroke="#3b82f6"
                                  strokeWidth="10"
                                  strokeDasharray={`${
                                    (2 * Math.PI * 45 * 87) / 100
                                  } ${2 * Math.PI * 45 * (1 - 87 / 100)}`}
                                  strokeDashoffset={2 * Math.PI * 45 * 0.25}
                                  transform="rotate(-90 50 50)"
                                  strokeLinecap="round"
                                />
                                {/* Percentage text */}
                                <text
                                  x="50"
                                  y="45"
                                  dominantBaseline="middle"
                                  textAnchor="middle"
                                  fontSize="24"
                                  fontWeight="bold"
                                  fill="currentColor"
                                  className="text-blue-500"
                                >
                                  87
                                </text>
                                <text
                                  x="50"
                                  y="60"
                                  dominantBaseline="middle"
                                  textAnchor="middle"
                                  fontSize="14"
                                  fill="currentColor"
                                >
                                  Overall Score
                                </text>
                              </svg>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <h3 className="font-medium">
                                  Technical Skills
                                </h3>
                                <span className="font-bold text-blue-500">
                                  83.3
                                </span>
                              </div>
                              <Progress
                                value={83.3}
                                className="h-2"
                                indicatorClassName="bg-blue-500"
                              />
                            </div>

                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <h3 className="font-medium">Soft Skills</h3>
                                <span className="font-bold text-blue-500">
                                  90.0
                                </span>
                              </div>
                              <Progress
                                value={90.0}
                                className="h-2"
                                indicatorClassName="bg-green-500"
                              />
                            </div>
                          </div>

                          <div className="pt-4">
                            <h3 className="font-medium mb-3">
                              Interviewer Notes
                            </h3>
                            <div className="p-4 bg-muted/30 rounded-md">
                              <p>{candidateDetails.notes}</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                          <h3 className="text-xl font-medium mb-2">
                            Interview Not Yet Completed
                          </h3>
                          <p className="text-muted-foreground max-w-md">
                            The assessment results will be available once the
                            interview is completed. The interview is scheduled
                            for{" "}
                            {candidateDetails.interviewDate?.toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}{" "}
                            at {candidateDetails.startTime}.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {candidateDetails.status === "Completed" && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Detailed Assessment</CardTitle>
                        <CardDescription>
                          Breakdown of candidate's performance in different
                          skill areas
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="technical" className="w-full">
                          <TabsList className="grid grid-cols-2 mb-6">
                            <TabsTrigger
                              value="technical"
                              className="flex items-center gap-2"
                            >
                              <Star className="h-4 w-4" />
                              Technical Skills
                            </TabsTrigger>
                            <TabsTrigger
                              value="soft"
                              className="flex items-center gap-2"
                            >
                              <User className="h-4 w-4" />
                              Soft Skills
                            </TabsTrigger>
                          </TabsList>

                          <TabsContent value="technical" className="space-y-6">
                            {candidateDetails.technicalSkills.map(
                              (skill, index) => (
                                <div key={index} className="space-y-3">
                                  <div className="flex justify-between items-center">
                                    <h3 className="font-medium">
                                      {skill.name}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                      <span
                                        className={`font-bold ${getScoreColor(
                                          skill.score
                                        )}`}
                                      >
                                        {skill.score}
                                      </span>
                                      <span className="text-muted-foreground">
                                        / {skill.maxScore}
                                      </span>
                                    </div>
                                  </div>
                                  <Progress
                                    value={(skill.score / skill.maxScore) * 100}
                                    className="h-2"
                                    indicatorClassName={getScoreBgColor(
                                      skill.score
                                    )}
                                  />
                                  <div className="p-3 bg-muted/30 rounded-md">
                                    <div className="flex items-start gap-2">
                                      <Check className="h-4 w-4 mt-1 text-muted-foreground" />
                                      <p className="text-sm">{skill.notes}</p>
                                    </div>
                                  </div>
                                </div>
                              )
                            )}
                          </TabsContent>

                          <TabsContent value="soft" className="space-y-6">
                            {candidateDetails.softSkills.map((skill, index) => (
                              <div key={index} className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <h3 className="font-medium">{skill.name}</h3>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`font-bold ${getScoreColor(
                                        skill.score
                                      )}`}
                                    >
                                      {skill.score}
                                    </span>
                                    <span className="text-muted-foreground">
                                      / {skill.maxScore}
                                    </span>
                                  </div>
                                </div>
                                <Progress
                                  value={(skill.score / skill.maxScore) * 100}
                                  className="h-2"
                                  indicatorClassName={getScoreBgColor(
                                    skill.score
                                  )}
                                />
                                <div className="p-3 bg-muted/30 rounded-md">
                                  <div className="flex items-start gap-2">
                                    <Check className="h-4 w-4 mt-1 text-muted-foreground" />
                                    <p className="text-sm">{skill.notes}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="resume" className="space-y-6">
                  <Card className="!bg-transparent">
                    <CardHeader>
                      <CardTitle>Resume</CardTitle>
                      <CardDescription>
                        Upload and view candidate's resume
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {documentUrl.url ? (
                        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                          <h3 className="text-xl font-medium mb-2">
                            No Resume Uploaded
                          </h3>
                          <p className="text-muted-foreground text-center max-w-md mb-6">
                            Upload the candidate's resume to view it here and
                            generate AI-powered interview questions.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-medium">
                              Resume Analyze
                            </h3>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </div>

                          <div className="border border-border rounded-lg overflow-hidden">
                            <div className="bg-muted p-4 flex justify-between items-center border-b border-border">
                              <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                <span>{candidateDetails?.user?.firstName}_resume.pdf</span>
                              </div>
                              {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>2 / 2</span>
                                <span>63%</span>
                              </div> */}
                            </div>
                            <div className="aspect-[3/4] bg-black/90 flex items-center justify-center p-4">
                              {documentUrl.url && (
                                <iframe
                                  src={`${documentUrl.url}`}
                                  className=" overflow-x-hidden rounded-lg mt-5"
                                  width="100%"
                                  height="500px"
                                  style={{ border: "none" }}
                                  title="PDF Viewer"
                                />
                              )}
                            </div>
                          </div>

                          <Card className="!bg-purple-500/5 !border-purple-500/30">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-purple-400 flex items-center gap-2">
                                <Wand2 className="h-5 w-5" />
                                Resume Analysis
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                              <div>
                                <h4 className="text-lg font-medium mb-2">
                                  Summary
                                </h4>
                                <p className="text-muted-foreground">
                                  {candidateData.resumeSummary}
                                </p>
                              </div>

                              <div>
                                <h4 className="text-lg font-medium mb-2">
                                  Education
                                </h4>
                                <div className="space-y-2">
                                  {candidateData.education.map((edu, index) => (
                                <div key={index} className="flex items-start gap-3">
                                  <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                                  <div>
                                    <div className="font-medium">
                                      {edu.degree}: {edu.institution}
                                    </div>
                                    <div className="text-sm text-muted-foreground">{edu.period}</div>
                                  </div>
                                </div>
                              ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="text-lg font-medium mb-2">
                                  Experience
                                </h4>
                                <div className="space-y-3">
                                  {candidateData.experience.slice(0, 5).map((exp, index) => (
                                <div key={index} className="flex items-start gap-3">
                                  <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                                  <div>
                                    <div className="font-medium">{exp.project}</div>
                                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                                      <span>{exp.company}</span>
                                      {exp.role && (
                                        <>
                                          <span className="w-1 h-1 rounded-full bg-muted-foreground inline-block"></span>
                                          <span>{exp.role}</span>
                                        </>
                                      )}
                                      <Badge
                                        variant="outline"
                                        className={
                                          exp.status === "Ongoing"
                                            ? "!text-blue-400 !border-blue-400"
                                            : "!text-green-400 !border-green-400"
                                        }
                                      >
                                        {exp.status}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="text-lg font-medium mb-2">
                                  Skills
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {candidateData.skills.map((skill, index) => (
                                <Badge key={index} variant="secondary" className="px-3 py-1 text-sm">
                                  {skill}
                                </Badge>
                              ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {!questionsGenerated ? (
                            <div className="flex justify-center">
                              <Button
                                variant="outline"
                                onClick={handleGenerateQuestions}
                                disabled={isGenerating}
                                className="flex items-center gap-1  text-blue-500 !border-blue-500/50 hover:!text-blue-400 hover:!bg-blue-500/20"
                              >
                                {isGenerating ? (
                                  <>
                                     <LoaderCircle className="animate-spin" />
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="h-4 w-4 text-blue-500" />
                                    Generate Interview Questions
                                  </>
                                )}
                              </Button>
                            </div>
                          ) : (
                            <Card className="mt-8 border-purple-500/20">
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <Wand2 className="h-5 w-5 text-purple-400" />
                                  AI-Generated Interview Questions
                                </CardTitle>
                                <CardDescription>
                                  Questions tailored to the candidate's profile
                                  based on their resume
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-8">
                                  {generatedQuestions.map((category, index) => (
                                    <div key={index} className="space-y-4">
                                      <h3 className="text-lg font-medium flex items-center gap-2">
                                        {index === 0 && (
                                          <Star className="h-5 w-5 text-blue-400" />
                                        )}
                                        {index === 1 && (
                                          <Briefcase className="h-5 w-5 text-green-400" />
                                        )}
                                        {index === 2 && (
                                          <User className="h-5 w-5 text-amber-400" />
                                        )}
                                        {index === 3 && (
                                          <GraduationCap className="h-5 w-5 text-purple-400" />
                                        )}
                                        {category.category}
                                      </h3>
                                      <div className="space-y-3 pl-7">
                                        {category.questions.map(
                                          (question, qIndex) => (
                                            <div key={qIndex} className="group">
                                              <div className="flex items-start gap-3 p-3 rounded-md hover:bg-accent/50 transition-colors">
                                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                                                  {qIndex + 1}
                                                </div>
                                                <div className="flex-1">
                                                  <p>{question}</p>
                                                </div>
                                                <Dialog>
                                                  <DialogTrigger asChild>
                                                    <Button
                                                      variant="ghost"
                                                      size="icon"
                                                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
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
                                                        className="lucide lucide-pencil"
                                                      >
                                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                                        <path d="m15 5 4 4" />
                                                      </svg>
                                                    </Button>
                                                  </DialogTrigger>
                                                  <DialogContent>
                                                    <DialogHeader>
                                                      <DialogTitle>
                                                        Edit Question
                                                      </DialogTitle>
                                                      <DialogDescription>
                                                        Modify this question to
                                                        better suit your
                                                        interview needs.
                                                      </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4 py-4">
                                                      <div className="space-y-2">
                                                        <Label htmlFor="question">
                                                          Question
                                                        </Label>
                                                        <Textarea
                                                          id="question"
                                                          defaultValue={
                                                            question
                                                          }
                                                          rows={4}
                                                        />
                                                      </div>
                                                      <div className="space-y-2">
                                                        <Label htmlFor="notes">
                                                          Notes (for interviewer
                                                          only)
                                                        </Label>
                                                        <Textarea
                                                          id="notes"
                                                          placeholder="Add any notes or expected answers here..."
                                                          rows={3}
                                                        />
                                                      </div>
                                                    </div>
                                                    <DialogFooter>
                                                      <Button type="submit">
                                                        Save Changes
                                                      </Button>
                                                    </DialogFooter>
                                                  </DialogContent>
                                                </Dialog>
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  ))}

                                  <div className="flex justify-between pt-4 border-t">
                                    <Button variant="outline" className="gap-2">
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
                                        className="lucide lucide-plus"
                                      >
                                        <path d="M5 12h14" />
                                        <path d="M12 5v14" />
                                      </svg>
                                      Add Custom Question
                                    </Button>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        className="gap-2"
                                      >
                                        <Download className="h-4 w-4" />
                                        Export Questions
                                      </Button>
                                      <Button className="gap-2">
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
                                          className="lucide lucide-save"
                                        >
                                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                          <polyline points="17 21 17 13 7 13 7 21" />
                                          <polyline points="7 3 7 8 15 8" />
                                        </svg>
                                        Save to Interview
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* <TabsContent
                  value="technical"
                  className="space-y-6"
                ></TabsContent>

                <TabsContent value="soft" className="space-y-6"></TabsContent> */}
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-6">
              <Button
                variant="outline"
                onClick={() => router.push(`/interviews/${params.id}`)}
              >
                Back to Candidates
              </Button>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Assessment
                </Button>
                <Button>Move to Hiring</Button>
              </div>
            </CardFooter>
          </Card>

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
                          <h4 className="font-medium">{experience.title}</h4>
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
                    <h1 className=" text-xl font-semibold">
                      No Document Found
                    </h1>
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
                  <h1 className=" text-2xl font-semibold h-full text-[#b378ff] flex justify-between">
                    Resume Analiyze <WandSparkles />
                  </h1>

                  <h5 className=" text-2xl font-semibold h-full mt-5">
                    Summary
                  </h5>
                  <p>{documentUrl.summary}</p>

                  <h5 className=" text-2xl font-semibold h-full mt-5">
                    Education
                  </h5>
                  {documentUrl?.education?.map((edu, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-200/10 rounded-lg px-4 py-2 text-sm text-gray-500 mr-2 mb-2"
                    >
                      {edu}
                    </span>
                  ))}

                  <h5 className=" text-2xl font-semibold h-full mt-5">
                    Experience
                  </h5>
                  {documentUrl?.experience?.map((exp, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-200/10 rounded-lg px-4 py-2 text-sm text-gray-500 mr-2 mb-2"
                    >
                      {exp}
                    </span>
                  ))}

                  <h5 className=" text-2xl font-semibold h-full mt-5">
                    Skills
                  </h5>
                  {documentUrl?.skills?.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-block bg-gray-200/10 rounded-full px-3 py-1 text-sm text-gray-500 mr-2 mb-2"
                    >
                      {skill}
                    </span>
                  ))}

                  <h5 className=" text-2xl font-semibold h-full mt-5">
                    Contact Info
                  </h5>
                  <p>Email - {documentUrl?.contactInfo?.email}</p>
                  <p>Phone - {documentUrl?.contactInfo?.phone}</p>
                </div>
              )}
            </div>
            <div className=" w-full md:w-[40%] md:px-8 md:mt-0 mt-5">
              <Card className="border-border !bg-[#1b1d23]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Personal Details</h3>
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
                            {new Date(
                              candidateDetails?.user?.dob
                            ).toLocaleDateString("en-GB", {
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
                              ? candidateDetails?.user?.gender
                                  .charAt(0)
                                  .toUpperCase() +
                                candidateDetails?.user?.gender
                                  .slice(1)
                                  .toLowerCase()
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
                          <p className="text-muted-foreground text-xs">Email</p>
                          <p>{candidateDetails?.user?.email}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Phone
                          size={16}
                          className="text-muted-foreground mt-0.5"
                        />
                        <div className=" w-full">
                          <p className="text-muted-foreground text-xs">Phone</p>
                          <p>
                            {candidateDetails?.user?.contactNo
                              ? candidateDetails?.user?.contactNo
                              : "Not Provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border !bg-[#1b1d23] mt-5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold">Social Media</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-3`}>
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
                            href={candidateDetails?.linkedInUrl}
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
                      <div className={`flex items-center gap-3 w-[80%]`}>
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
                      <div className={`flex items-center gap-3 w-[80%]`}>
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
                      <div className={`flex items-center gap-3 w-[80%]`}>
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
                      <div className={`flex items-center gap-3 w-[80%]`}>
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
