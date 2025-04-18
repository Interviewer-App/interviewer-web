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
import React from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComboboxDemo } from "@/components/ui/comboxDemo";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { getInterviews } from "@/lib/api/interview";
import { useSession, getSession } from "next-auth/react";
import { getCompletedSessionComparision, getCompletedSessions } from "@/lib/api/interview-session";
import { Plus, LoaderCircle, Info, BarChart3, LineChart, PieChart, Loader2 } from "lucide-react";

import { Pie } from "react-chartjs-2";
import { Doughnut } from "react-chartjs-2";
import { Bar,Radar  } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
} from "chart.js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CandidateProfileCard from "@/components/CandidateProfileCard";
import ComparisonCharts from "@/components/ComparisonCharts";

// Register chart components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const InterviewComparision = () => {
  const { toast } = useToast();
  const [interviews, setInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(""); // State to store selected interview
  const [firstSessionId, setFirstSessionId] = useState(null);
  const [secondSessionId, setSecondSessionId] = useState(null);
  const [comparisonResult, setComparisonResult] = useState({});
  const [isComparePressed, setIsComparePressed] = useState(false);
  const [firstCandidateName, setFirstCandidateName] = useState("");
  const [secondCandidateName, setSecondCandidateName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);

  // Hardcoded comparison result
  // const hardcodedComparisonResult = {
  //   overall: {
  //     score: {
  //       c1: 48.17,
  //       c2: 24.25,
  //       diff: "23.92",
  //     },
  //     time: {
  //       c1: "0",
  //       c2: "0",
  //       diff: "0",
  //     },
  //   },
  //   categories: [
  //     {
  //       name: "CultureFit",
  //       score: {
  //         c1: 69,
  //         c2: 39,
  //         diff: "30",
  //       },
  //       metrics: [],
  //     },
  //     {
  //       name: "Behavioral",
  //       score: {
  //         c1: 72,
  //         c2: 48,
  //         diff: "24",
  //       },
  //       metrics: [],
  //     },
  //     {
  //       name: "Technical",
  //       score: {
  //         c1: 25.83333333333333,
  //         c2: 5,
  //         diff: "20.833333333333332",
  //       },
  //       metrics: [],
  //     },
  //     {
  //       name: "dsdsdsds",
  //       score: {
  //         c1: 25.83333333333333,
  //         c2: 5,
  //         diff: "20.833333333333332",
  //       },
  //       metrics: [],
  //     },
  //   ],
  //   strengths: {
  //     c1: {
  //       strengths: [
  //         "Strong understanding of Java fundamentals",
  //         "Good problem-solving approach",
  //         "Good communication skills",
  //       ],
  //       weaknesses: ["bad communitcation skills", "bad programming knowlegde"],
  //     },
  //     c2: {
  //       strengths: ["Good communication skills"],
  //       weaknesses: ["Lacks technical skills", "Poor problem-solving approach"],
  //     },
  //   },
  //   experience: {
  //     projects: {
  //       c1: null,
  //       c2: null,
  //       comparison: null,
  //     },
  //     education: {
  //       c1: null,
  //       c2: null,
  //       relevance: null,
  //     },
  //   },
  //   recommendation: {
  //     best: "c1",
  //     reason:
  //       "Overall, candidate 1 has a stronger technical background, better problem-solving skills, and better communication skills than candidate 2.",
  //     factors: [],
  //     confidence: "med",
  //   },
  //   summary: {
  //     technical:
  //       "Candidate 1 has a strong technical background, while candidate 2 is lacking in this area.",
  //     culture:
  //       "Both candidates have good communication skills and would be a good fit for the company's culture.",
  //     growth:
  //       "Both candidates have the potential to grow and develop in their careers.",
  //   },
  // };

  const generateChartData = () => {
    if (!comparisonResult?.categories) return { labels: [], datasets: [] };

    const labels = comparisonResult.categories.map((cat) => cat.name);
    const c1Scores = comparisonResult.categories.map(
      (cat) => cat.score?.c1 || 0
    );
    const c2Scores = comparisonResult.categories.map(
      (cat) => cat.score?.c2 || 0
    );

    return {
      labels,
      datasets: [
        {
          label: firstCandidateName,
          data: c1Scores,
          backgroundColor: "rgba(54, 162, 235, 0.3)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
        {
          label: secondCandidateName,
          data: c2Scores,
          backgroundColor: "rgba(234, 179, 8, 0.3)",
          borderColor: "rgba(234, 179, 8, 1)",
          borderWidth: 1,
        },
      ],
    };
  };
  
  const generateRadarChartData = () => {
    if (!comparisonResult?.categories) return { labels: [], datasets: [] };
  

    const softCategory = comparisonResult.categories.find(cat => cat.subCategories && cat.subCategories.length > 0);
    
    if (!softCategory || !softCategory.subCategories) {
      return { labels: [], datasets: [] };
    }
  
    const labels = softCategory.subCategories.map(subCat => subCat.name);
    const c1Scores = softCategory.subCategories.map(subCat => subCat.score?.c1 || 0);
    const c2Scores = softCategory.subCategories.map(subCat => subCat.score?.c2 || 0);
  
    return {
      labels,
      datasets: [
        {
          label: firstCandidateName,
          data: c1Scores,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
   
        },
        {
          label: secondCandidateName,
          data: c2Scores,
          backgroundColor: "rgba(234, 179, 8, 0.2)",
          borderColor: "rgba(234, 179, 8, 1)",
   
        },
      ],
    };
  };
  

  const doughnutChartData = {
    labels: ["Strengths", "Weaknesses"], // The labels for each section
    datasets: [
      {
        label: firstCandidateName,
        data: [
          comparisonResult?.strengths?.c1?.strengths.length || 0, // Number of strengths for Candidate 1
          comparisonResult?.strengths?.c1?.weaknesses.length || 0, // Number of weaknesses for Candidate 1
        ],
        backgroundColor: ["rgba(54, 162, 235, 0.2)", "rgba(234, 179, 8, 0.2)"], // Blue for strengths, Red for weaknesses
        borderColor: ["rgba(54, 162, 235, 1)", "rgba(234, 179, 8, 1)"], // Same color border for the sections
        borderWidth: 1,
      },
      {
        label: secondCandidateName,
        data: [
          comparisonResult?.strengths?.c2?.strengths.length || 0, // Number of strengths for Candidate 2
          comparisonResult?.strengths?.c2?.weaknesses.length || 0, // Number of weaknesses for Candidate 2
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(234, 179, 8, 0.2)",
        ], // Green for strengths, Purple for weaknesses
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(234, 179, 8, 1)"], // Same color border for the sections
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const session = await getSession();
        const companyId = session?.user?.companyID;
        const response = await getInterviews(companyId);
        setInterviews(response.data);
        // console.log(response)
      } catch (error) {
        // Check if the error is a 404 (no interviews found)
        if (error.response && error.response.status === 404) {
          // No interviews found, set state accordingly
          setInterviews([]);
        } else {
          // Handle other errors
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Error fetching interviews: ${error}`,
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }
      }
    };
    fetchInterviews();
  }, []);

  useEffect(() => {
    const fetchCompletedSessions = async () => {
      try {
        const response = await getCompletedSessions(selectedInterview)

        setCandidates(response.data)
        console.log(response.data)
      } catch (error) {
        console.log("Error fetching completed sessions:", error)
      }
    }

    if (selectedInterview) {
      fetchCompletedSessions();
    }

  }, [selectedInterview])

  const handleCompareInterviews = async () => {
    if (firstSessionId && secondSessionId) {
      setIsLoading(true);
      try {
        const data = {
          sessionId1: firstSessionId,
          sessionId2: secondSessionId,
        };
        const response = await getCompletedSessionComparision(data);
        setIsComparePressed(true);
        setComparisonResult(response.data); // Store the comparison result
        // console.log("Comparison Result:", response.data);

        // Display success toast
        toast({
          title: "Comparison Successful",
          description: "The comparison was completed successfully.",
        });
        setIsLoading(false);
      } catch (error) {
        console.error("Error comparing sessions:", error);
        setIsLoading(false);
        // Display error toast
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Error comparing sessions: ${error.message}`,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Please select both candidates to compare",
      });
    }
  };

  //for the testing purpose you can use this handleCompareInterviews function.those values are fetching from the harcoded string not from the API.(Due to GEMINI API )
  // const handleCompareInterviews = async () => {
  //   // Check if both session IDs are selected
  //   if (!firstSessionId || !secondSessionId) {
  //     toast({
  //       variant: "destructive",
  //       title: "Selection Incomplete",
  //       description: "Please select both candidates to compare.",
  //       action: <ToastAction altText="Try again">Try again</ToastAction>,
  //     });
  //     return; // Exit the function if validation fails
  //   }

  //   // Set the hardcoded comparison result
  //   setIsComparePressed(true);
  //   setComparisonResult(hardcodedComparisonResult);

  //   // Display success toast
  //   toast({
  //     title: "Comparison Successful",
  //     description: "The comparison was completed successfully.",
  //   });
  // };



  return (
    <>
      <SidebarInset>
        <header className="flex bg-black  h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Interview Comparision</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="w-[90%] max-w-[1500px] mx-auto p-6 relative">
          <div className="flex items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-100">Candidate Comparison</h1>
            <div className="ml-4 px-3 py-1 bg-gray-800 rounded-full text-xs font-medium text-gray-300">
              Find the best match
            </div>
          </div>
          {/* <h1 className=" text-3xl font-semibold">Candidate comparision</h1> */}
          <div className="bg-slate-600/10 w-full h-fit rounded-lg mt-5">

            <Card className="mb-8 bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="text-xl text-gray-100">Compare Candidates</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Select Interview</label>
                    <Select onValueChange={setSelectedInterview}>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                        <SelectValue placeholder="Select a Interview" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectGroup>
                          <SelectLabel>Select Interviews</SelectLabel>
                          {interviews.map((interview) => (
                            <SelectItem
                              key={interview.interviewID}
                              value={interview.interviewID}
                            >
                              {interview.jobTitle.replace(/<[^>]+>/g, "")}{" "}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">First Candidate</label>
                    {/* <ComboboxDemo
                      selectedInterview={selectedInterview}
                      onSelect={(sessionId, candidateName) => {
                        setFirstSessionId(sessionId);
                        setFirstCandidateName(candidateName);
                      }}
                      disabledEmail={secondCandidateName}
                    /> */}
                    <Select
                      value={firstCandidateName}
                      onValueChange={(value) => {
                        const selectedCandidate = candidates.find(candidate => candidate.candidate.user.email === value);
                        setFirstCandidateName(value);
                        setFirstSessionId(selectedCandidate?.sessionId || "");
                      }}
                      disabled={!selectedInterview}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                        <SelectValue placeholder="Select candidate" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectGroup>
                          <SelectLabel className="text-gray-400">Candidates</SelectLabel>
                          {candidates?.filter((candidate) => candidate.candidate.user.email != secondCandidateName).map((candidate) => (
                            <SelectItem key={candidate.sessionId} value={candidate.candidate.user.email} className="text-gray-200">
                              {candidate.candidate.user.email}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">Second Candidate</label>
                    <Select
                      value={secondCandidateName}
                      onValueChange={(value) => {
                        const selectedCandidate = candidates.find(candidate => candidate.candidate.user.email === value);
                        setSecondCandidateName(value);
                        setSecondSessionId(selectedCandidate?.sessionId || "");
                      }}
                      disabled={!selectedInterview}
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-gray-200">
                        <SelectValue placeholder="Select candidate" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        <SelectGroup>
                          <SelectLabel className="text-gray-400">Candidates</SelectLabel>
                          {candidates?.filter((candidate) => candidate.candidate.user.email != firstCandidateName).map((candidate) => (
                            <SelectItem key={candidate.sessionId} value={candidate.candidate.user.email} className="text-gray-200">
                              {candidate.candidate.user.email}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleCompareInterviews}
                    disabled={!firstCandidateName || !secondCandidateName}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Compare Candidates
                  </Button>
                </div>
              </CardContent>
            </Card>
            {/* <div className="flex items-center justify-between gap-5 flex-col md:flex-row ">
              <div className=" w-full md:w-1/4">
                <Select onValueChange={setSelectedInterview}>
                  <SelectTrigger className=" w-full !bg-[#32353b]">
                    <SelectValue placeholder="Select a Interview" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select Interviews</SelectLabel>
                      {interviews.map((interview) => (
                        <SelectItem
                          key={interview.interviewID}
                          value={interview.interviewID}
                        >
                          {interview.jobTitle.replace(/<[^>]+>/g, "")}{" "}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className=" w-full md:w-1/4">
                <ComboboxDemo
                  selectedInterview={selectedInterview}
                  onSelect={(sessionId, candidateName) => {
                    setFirstSessionId(sessionId);
                    setFirstCandidateName(candidateName); 
                  }}
                  disabledEmail={secondCandidateName}
                />{" "}
              </div>

              <div className=" w-full md:w-1/4">
                <ComboboxDemo
                  selectedInterview={selectedInterview}
                  onSelect={(sessionId, candidateName) => {
                    setSecondSessionId(sessionId);
                    setSecondCandidateName(candidateName); 
                  }}
                  disabledEmail={firstCandidateName} 
                />
              </div>

              <div className=" w-full md:w-1/4">
                <button
                  className="rounded-lg bg-white text-black font-bold px-2 py-2 w-full"
                  onClick={handleCompareInterviews}
                >
                  {isLoading ? (
                    <LoaderCircle className="mx-auto animate-spin" size={24} />
                  ) : (
                    "Compare Interviews"
                  )}
                </button>
              </div>
            </div> */}

            {/* {isLoading && (
              <LoaderCircle className="mx-auto mt-10 animate-spin" size={48} />
              )} */}

            {!isComparePressed && <EmptyStateCards />}

            {isLoading && <LoadingStateCards />}


            {!isLoading && isComparePressed && (
              
            <div className="animate-fade-in"> 
             <div className="flex items-center justify-between my-8 ">
                  <h1 className="text-3xl font-semibold">
                    Compare Between Candidates
                  </h1>
                </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                
                <CandidateProfileCard 
                  candidate={comparisonResult} 
                  colorTheme="indigo"
                  candidateNumber="c1"
                />
                <CandidateProfileCard 
                  candidate={comparisonResult} 
                  colorTheme="purple" 
                  candidateNumber="c2"
                />
              </div>
              
              <ComparisonCharts comparisonData={comparisonResult} />
            </div>
          )}

            {isComparePressed && (
              <>
                {/* <div className="flex items-center justify-between mt-8 ">
                  <h1 className="text-3xl font-semibold">
                    Compare Between Candidates
                  </h1>
                </div> */}
                {/* <div className="flex justify-between mt-8 md:flex-row flex-col gap-8">
                  <div className="bg-blue-700/10 border-2 border-blue-900  p-8 md:w-1/2 w-full rounded-lg">
                    <h2 className="text-2xl font-bold mb-4 text-blue-500">
                      First Candidate
                    </h2>
                    <h2 className="text-xl font-bold mb-3">
                      <div className=" text-gray-500">
                        <span className=" text-white">Name: </span>
                        {firstCandidateName || "Candidate 1"}
                      </div>
                    </h2>
                    {comparisonResult?.overall && (
                      <div className="space-y-3 text-xl">
                        <div>
                          <strong>Overall Score:</strong>{" "}
                          <span className=" text-gray-500">
                            {comparisonResult.overall.score.c1.toFixed(2)}%
                          </span>
                        </div>

                      </div>
                    )}

                    <div className="mt-4">
                      <h3 className="font-semibold text-xl">Strengths</h3>
                      {comparisonResult?.strengths?.c1 ? (
                        <ul className="list-disc pl-4 text-sm font-normal text-gray-500">
                          {comparisonResult.strengths.c1.strengths.map(
                            (strength, index) => (
                              <li key={index}>{strength}</li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p className=" text-gray-600 text-xs italic">
                          No strengths available
                        </p>
                      )}
                    </div>

                    <div className="mt-4">
                      <h3 className="font-semibold text-xl">Weaknesses</h3>
                      {comparisonResult?.strengths?.c1?.weaknesses ? (
                        <ul className="list-disc pl-4 text-sm font-normal text-gray-500">
                          {comparisonResult.strengths.c1.weaknesses.map(
                            (weakness, index) => (
                              <li key={index}>{weakness}</li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p className=" text-gray-600 text-xs italic">
                          No weaknesses available
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-yellow-700/10 border-yellow-900 border-2 p-6 md:w-1/2 w-full rounded-lg">
                    <h2 className="text-2xl font-bold mb-4 text-yellow-500">
                      Second Candidate
                    </h2>
                    <h2 className="text-xl font-bold mb-3">
                      <div className=" text-gray-500">
                        <span className=" text-white">Name: </span>
                        {secondCandidateName || "Candidate 2"}
                      </div>
                    </h2>
                    {comparisonResult?.overall && (
                      <div className="space-y-3 text-xl">
                        <div>
                          <strong>Overall Score:</strong>{" "}
                          <span className=" text-gray-500">
                            {comparisonResult.overall.score.c2.toFixed(2) || 0}%
                          </span>
                        </div>

                      </div>
                    )}

                    <div className="mt-4">
                      <h3 className="font-semibold text-xl">Strengths</h3>
                      {comparisonResult?.strengths?.c2 ? (
                        <ul className="list-disc pl-4 text-sm font-normal text-gray-500">
                          {comparisonResult.strengths.c2.strengths.map(
                            (strength, index) => (
                              <li key={index}>{strength}</li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p className=" text-gray-600 text-xs italic">
                          No strengths available
                        </p>
                      )}
                    </div>


                    <div className="mt-4">
                      <h3 className="font-semibold text-xl">Weaknesses</h3>
                      {comparisonResult?.strengths?.c2?.weaknesses ? (
                        <ul className="list-disc pl-4 text-sm font-normal text-gray-500">
                          {comparisonResult.strengths.c2.weaknesses.map(
                            (weakness, index) => (
                              <li key={index}>{weakness}</li>
                            )
                          )}
                        </ul>
                      ) : (
                        <p className=" text-gray-600 text-xs italic">
                          No weaknesses available
                        </p>
                      )}
                    </div>
                  </div>
                </div> */}

                  
                <h2 className="text-2xl font-bold m-4 text-white-500">
                  Score Comparison
                </h2>
                <div className="flex flex-row w-full gap-4">
                  <div className="w-[60%]  items-center flex flex-col border border-red-400/40 rounded-lg p-4">
                  <h2 className="font-semibold text-white-500">
                  Overall Score Comparison
                </h2>
                    <Bar
                      data={generateChartData()}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        indexAxis: "y",
                        scales: {
                          y: {
                            beginAtZero: true,
                            title: {
                              display: true,
                              text: "Scores",
                              color: '#ffffff' // White title
                            },
                            ticks: {
                              color: '#ffffff' // White y-axis labels
                            },
                            grid: {
                              color: 'rgba(255, 255, 255, 0.1)' // Light grid lines
                            }
                          },
                          x: {
                            ticks: {
                              autoSkip: false,
                              color: '#ffffff' // White x-axis labels
                            },
                            grid: {
                              color: 'rgba(255, 255, 255, 0.1)' // Light grid lines
                            }
                          },
                        },
                        plugins: {
                          legend: {
                            labels: {
                              color: '#ffffff' // White legend text
                            }
                          }
                        }
                      }}
                    />
                  </div>

                  <div className="w-[40%]  items-center flex flex-col border border-red-400/40 rounded-lg p-4 ">
                  <h2 className=" text-white-500 font-semibold">
                  SoftSkills Score Comparison
                </h2>
                    <Radar
                      data={generateRadarChartData()}
                      options={{
                        scales: {
                          r: {
                            min: 0,
                            max: 100,
                            ticks: {
                              stepSize: 20,
                              color: '#ffffff' // White ticks
                            },
                            angleLines: {
                              color: 'rgba(255, 255, 255, 0.2)' // White grid lines
                            },
                            grid: {
                              color: 'rgba(255, 255, 255, 0.1)' // Lighter grid lines
                            },
                            pointLabels: {
                              color: '#ffffff' // White labels
                            }
                          }
                        },
                        plugins: {
                          legend: {
                            labels: {
                              color: '#ffffff' // White legend
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                {/* <div className="flex justify-around mt-10 flex-col md:flex-row space-y-4 md:space-y-0">
      
                  <div className="bg-slate-600/10 p-6 md:w-1/3 rounded-lg w-full">
                    <h2 className="text-xl font-bold mb-4">{firstCandidateName} - Strengths vs Weaknesses</h2>
                    <Pie
                      data={candidate1PieChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                        },
                      }}
                    />
                  </div>

                 
                  <div className="bg-slate-600/10 p-6 md:w-1/3 rounded-lg w-full">
                    <h2 className="text-xl font-bold mb-4">{secondCandidateName} - Strengths vs Weaknesses</h2>
                    <Pie
                      data={candidate2PieChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'top',
                          },
                        },
                      }}
                    />
                  </div>
                </div> */}

                {/* Recommendation Section */}
                <div className="mt-8 bg-slate-700/10 border-2 border-slate-900 p-8 rounded-lg">
                  <h2 className="text-2xl font-bold mb-4 text-slate-500">
                    Recommendation
                  </h2>
                  {comparisonResult?.recommendation ? (
                    <div className="space-y-2  text-lg">
                      <div className=" text-gray-500 py-2">
                        <strong className=" text-white">Best Candidate:</strong>{" "}
                        {comparisonResult[comparisonResult.recommendation.best] ||
                          comparisonResult.recommendation.best}
                      </div>
                      <div className="py-2">
                        <strong>Reason</strong>{" "}
                        <p className=" text-sm text-gray-500">
                          {comparisonResult.recommendation.reason}
                        </p>
                      </div>
                      <div className="py-2">
                        <strong>Factors</strong>{" "}
                        <p className=" text-sm text-gray-500">
                          {comparisonResult.recommendation.factors.join(", ") ||
                            "no factors"}
                        </p>
                      </div>
                      <div className="py-2">
                        <strong>Confidence</strong>{" "}
                        <p className=" text-sm text-gray-500">
                          {comparisonResult.recommendation.confidence}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className=" text-center text-gray-600 text-sm italic">
                      No recommendation available
                    </p>
                  )}
                </div>

                {/* Summary Section */}
                <div className="mt-8 bg-slate-700/10 border-2 border-slate-900 p-8 rounded-lg">
                  <h2 className="text-2xl font-bold mb-4 text-slate-500">
                    Summary
                  </h2>
                  {comparisonResult?.summary ? (
                    <div className="space-y-2 text-lg">
                      <div className="py-2">
                        <strong>Technical</strong>{" "}
                        <p className=" text-sm text-gray-500">
                          {comparisonResult.summary.technical ||
                            "no technical summary"}
                        </p>
                      </div>
                      <div className="py-2">
                        <strong>Culture</strong>{" "}
                        <p className=" text-sm text-gray-500">
                          {comparisonResult.summary.culture ||
                            "no summary of culture."}
                        </p>
                      </div>
                      <div className="py-2">
                        <strong>Growth</strong>{" "}
                        <p className=" text-sm text-gray-500">
                          {comparisonResult.summary.growth ||
                            "no summary of growth"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className=" text-center text-gray-600 text-sm italic">
                      No summary available
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </SidebarInset>
    </>
  );
};

export default InterviewComparision;




const EmptyStateCards = () => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card className="border-gray-700 bg-gray-900/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gray-800/50">
          <CardTitle className="text-xl text-gray-200 flex items-center gap-2">
            <Info className="h-5 w-5 text-indigo-400" />
            Candidate 1 Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-gray-300">Select candidates above to view detailed profiles including:</p>
            <ul className="list-disc pl-5 text-gray-400 space-y-2">
              <li>Overall interview scores</li>
              <li>Time spent in the interview</li>
              <li>Key strengths identified during assessment</li>
              <li>Areas for improvement</li>
            </ul>
            <p className="text-sm text-gray-500 mt-4">The profile will appear here after comparison</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-700 bg-gray-900/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gray-800/50">
          <CardTitle className="text-xl text-gray-200 flex items-center gap-2">
            <Info className="h-5 w-5 text-purple-400" />
            Candidate 2 Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-gray-300">Select candidates above to view detailed profiles including:</p>
            <ul className="list-disc pl-5 text-gray-400 space-y-2">
              <li>Overall interview scores</li>
              <li>Time spent in the interview</li>
              <li>Key strengths identified during assessment</li>
              <li>Areas for improvement</li>
            </ul>
            <p className="text-sm text-gray-500 mt-4">The profile will appear here after comparison</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card className="mb-8 border-gray-700 bg-gray-900/80 backdrop-blur-sm">
      <CardHeader className="bg-gray-800/50">
        <CardTitle className="text-xl text-gray-200 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-indigo-400" />
          Score Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-center py-10 space-y-4">
          <PieChart className="h-16 w-16 text-gray-700 mx-auto" />
          <h3 className="text-xl font-medium text-gray-300">Performance Score Visualization</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            After comparing candidates, you&apos;ll see charts comparing their overall performance scores,
            strengths vs. weaknesses ratio, and other key metrics to help you make an informed decision.
          </p>
        </div>
      </CardContent>
    </Card>

    <Card className="mb-8 border-gray-700 bg-gray-900/80 backdrop-blur-sm">
      <CardHeader className="bg-gray-800/50">
        <CardTitle className="text-xl text-gray-200 flex items-center gap-2">
          <LineChart className="h-5 w-5 text-indigo-400" />
          Skills Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-center py-10 space-y-4">
          <BarChart3 className="h-16 w-16 text-gray-700 mx-auto" />
          <h3 className="text-xl font-medium text-gray-300">Skills Radar Chart</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            The skills assessment radar chart will provide a visual comparison of both candidates across key
            skill dimensions including technical abilities, problem-solving, communication, experience,
            and team fit.
          </p>
        </div>
      </CardContent>
    </Card>
  </>
);



const LoadingStateCards = () => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <Card className="border-gray-700 bg-gray-900/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gray-800/50">
          <CardTitle className="text-xl text-gray-200 flex items-center gap-2">
            <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
            Loading Candidate 1 Profile...
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-10">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 text-indigo-500 animate-spin mx-auto" />
              <p className="text-gray-300">Retrieving candidate data...</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-gray-700 bg-gray-900/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gray-800/50">
          <CardTitle className="text-xl text-gray-200 flex items-center gap-2">
            <Loader2 className="h-5 w-5 text-purple-400 animate-spin" />
            Loading Candidate 2 Profile...
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-10">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 text-purple-500 animate-spin mx-auto" />
              <p className="text-gray-300">Retrieving candidate data...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card className="mb-8 border-gray-700 bg-gray-900/80 backdrop-blur-sm">
      <CardHeader className="bg-gray-800/50">
        <CardTitle className="text-xl text-gray-200 flex items-center gap-2">
          <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
          Preparing Comparison
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-center py-10 space-y-4">
          <Loader2 className="h-16 w-16 text-indigo-500 animate-spin mx-auto" />
          <h3 className="text-xl font-medium text-gray-300">Analyzing Candidate Data</h3>
          <p className="text-gray-400 max-w-2xl mx-auto">
            We&apos;re comparing the candidates and preparing visual insights for you. This will only take a moment...
          </p>
        </div>
      </CardContent>
    </Card>
  </>
);