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
import React from 'react'
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
} from "@/components/ui/select"
import { ComboboxDemo } from "@/components/ui/comboxDemo";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { getInterviews } from "@/lib/api/interview";
import { useSession, getSession } from "next-auth/react";
import { getCompletedSessionComparision } from "@/lib/api/interview-session";


import { Doughnut } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);


const InterviewComparision = () => {
  const { toast } = useToast();
  const [interviews, setInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(""); // State to store selected interview
  const [firstSessionId, setFirstSessionId] = useState(null)
  const [secondSessionId, setSecondSessionId] = useState(null)
  const [comparisonResult, setComparisonResult] = useState(null);
  const [isComparePressed, setIsComparePressed] = useState(false);
  const [firstCandidateName, setFirstCandidateName] = useState("");
  const [secondCandidateName, setSecondCandidateName] = useState("");
  
  
  // Hardcoded comparison result
  const hardcodedComparisonResult = {
    "overall": {
      "score": {
        "c1": 36,
        "c2": 33,
        "diff": 3
      },
      "time": {
        "c1": 50,
        "c2": 40,
        "diff": "10 mins"
      }
    },
    "categories": [
      {
        "name": "Technical",
        "metrics": [
          {
            "metric": "Coding Skills",
            "c1": "Scored 36 out of 36 in a coding question on Spring Boot REST API development, demonstrating a strong grasp of the technology.",
            "c2": "Scored 33 out of 33 in a coding question on finding the sum of even numbers in an array.",
            "importance": "High"
          },
          {
            "metric": "Problem-Solving Approach",
            "c1": "Provided clear and detailed answers, showing a logical and structured approach to problem-solving.",
            "c2": "Showed a good understanding of core programming concepts but lacked clear structure in explaining the approach.",
            "importance": "High"
          }
        ]
      }
    ],
    "strengths": {
      "c1": {
        "strengths": [
          "Strong Spring Boot technical skills",
          "Excelled in open-ended technical discussions",
          "Demonstrates a strong understanding of core Java concepts"
        ],
        "weaknesses": [
          "Could benefit from improving time management during interviews"
        ]
      },
      "c2": {
        "strengths": [
          "Showed good problem-solving skills",
          "Understands fundamental programming principles including OOP"
        ],
        "weaknesses": [
          "Technical skills could benefit from further enhancement",
          "Some difficulty in communicating technical concepts clearly"
        ]
      }
    },
    "experience": {
      "projects": {
        "c1": "No information provided in the given data.",
        "c2": "No information provided in the given data.",
        "comparison": "No comparison can be made as project information is missing."
      },
      "education": {
        "c1": "No information provided in the given data.",
        "c2": "No information provided in the given data.",
        "relevance": "No comparison can be made as education information is missing."
      }
    },
    "recommendation": {
      "best": "c1",
      "reason": "Candidate c1 demonstrated stronger technical skills, including a comprehensive understanding of Spring Boot and Java fundamentals, as well as a more structured problem-solving approach.",
      "factors": [
        "Technical performance",
        "Problem-solving skills",
        "Communication abilities"
      ],
      "confidence": "high"
    },
    "summary": {
      "technical": "Both candidates showed a good understanding of core programming concepts. Candidate c1 demonstrated stronger technical skills in the context of Java and Spring Boot, while candidate c2 could benefit from further strengthening their technical foundation.",
      "culture": "No information provided in the given data.",
      "growth": "With continued development and experience, both candidates have the potential to grow into successful software engineers."
    }
  };



  const chartData = {
    labels: [firstCandidateName, secondCandidateName], // The candidates
    datasets: [
      {
        label: 'Overall Score', // You can adjust this label to match your comparison metric
        data: [comparisonResult?.overall?.score?.c1, comparisonResult?.overall?.score?.c2], // Using the comparison result for data
        backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)'], // Blue for Candidate 1, Red for Candidate 2
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };


  const doughnutChartData = {
    labels: ['Strengths', 'Weaknesses'], // The labels for each section
    datasets: [
      {
        label: firstCandidateName,
        data: [
          comparisonResult?.strengths?.c1?.strengths.length || 0, // Number of strengths for Candidate 1
          comparisonResult?.strengths?.c1?.weaknesses.length || 0  // Number of weaknesses for Candidate 1
        ],
        backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)'], // Blue for strengths, Red for weaknesses
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'], // Same color border for the sections
        borderWidth: 1,
      },
      {
        label: secondCandidateName, 
        data: [
          comparisonResult?.strengths?.c2?.strengths.length || 0, // Number of strengths for Candidate 2
          comparisonResult?.strengths?.c2?.weaknesses.length || 0  // Number of weaknesses for Candidate 2
        ],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'], // Green for strengths, Purple for weaknesses
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'], // Same color border for the sections
        borderWidth: 1,
      }
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
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Error fetching interviews: ${error}`,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    };
    fetchInterviews();
  }, []);


  // const handleCompareInterviews = async () => {
  //   if (firstSessionId && secondSessionId) {
  //     try {
  //       const data = {
  //         sessionId1: firstSessionId,
  //         sessionId2: secondSessionId,
  //       };
  //       const response = await getCompletedSessionComparision(data);
  //       setIsComparePressed(true);
  //       setComparisonResult(response.data); // Store the comparison result
  //       console.log("Comparison Result:", response.data);

  //       // Display success toast
  //       toast({
  //         title: "Comparison Successful",
  //         description: "The comparison was completed successfully.",
  //       });
  //     } catch (error) {
  //       console.error("Error comparing sessions:", error);

  //       // Display error toast
  //       toast({
  //         variant: "destructive",
  //         title: "Uh oh! Something went wrong.",
  //         description: `Error comparing sessions: ${error.message}`,
  //         action: <ToastAction altText="Try again">Try again</ToastAction>,
  //       });
  //     }
  //   } else {
  //     alert("Please select both candidates to compare.");
  //   }
  // };


  const handleCompareInterviews = async () => {
    // Check if both session IDs are selected
    if (!firstSessionId || !secondSessionId) {
      toast({
        variant: "destructive",
        title: "Selection Incomplete",
        description: "Please select both candidates to compare.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return; // Exit the function if validation fails
    }

    // Set the hardcoded comparison result
    setIsComparePressed(true);
    setComparisonResult(hardcodedComparisonResult);

    // Display success toast
    toast({
      title: "Comparison Successful",
      description: "The comparison was completed successfully.",
    });
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
                  <BreadcrumbPage>Interview Comparision</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="w-[90%] max-w-[1500px] mx-auto p-6 relative">
          <h1 className=" text-3xl font-semibold">Candidate comparision</h1>
          <div className="bg-slate-600/10 w-full h-fit p-9 rounded-lg mt-5">
            <div className="flex items-center justify-between p-9 ">

              <h1 className="text-2xl font-semibold">Compare Between Candidates</h1>

              {/* 
              <button
        
        className="rounded-lg bg-white text-black font-bold px-2 py-2"
      >
       Compare All Interviews
      </button> */}
            </div>


            <div className="flex items-center justify-between p-9 flex-col md:flex-row space-y-4">

              <div>
                <Select onValueChange={setSelectedInterview}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Interview" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Interviews</SelectLabel>
                      {interviews.map((interview) => (
                        <SelectItem
                          key={interview.interviewID}
                          value={interview.interviewID}
                        >
                          {interview.jobDescription.replace(/<[^>]+>/g, "")} {/* Remove HTML tags */}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <ComboboxDemo
                  selectedInterview={selectedInterview}
                  onSelect={(sessionId, candidateName) => {
                    setFirstSessionId(sessionId);
                    setFirstCandidateName(candidateName); // Set the candidate name
                  }}
                  disabledEmail={secondCandidateName} // Add this line

                />              </div>
              <div>
                <ComboboxDemo
                  selectedInterview={selectedInterview}
                  onSelect={(sessionId, candidateName) => {
                    setSecondSessionId(sessionId);
                    setSecondCandidateName(candidateName); // Set the candidate name
                  }}
                  disabledEmail={firstCandidateName} // Add this line
                />              
                </div>

              {/* Add Category Button */}
              <div>
                <button

                  className="rounded-lg bg-white text-black font-bold px-2 py-2"
                  onClick={handleCompareInterviews}
                >
                  Compare Interviews
                </button>
              </div>
            </div>

            {isComparePressed && (
              <>
                <div className="flex justify-around mt-10 md:flex-row flex-col space-y-4 md:space-y-0 ">
                  <div className="bg-slate-600/10 p-6 md:w-1/3 w-full rounded-lg">
                  <h2 className="text-xl font-bold mb-4">First Candidate</h2>
                    <h2 className="text-xl font-bold mb-4">{firstCandidateName}</h2>
                    {comparisonResult?.overall && (
                      <div className="space-y-2">
                        <p><strong>Overall Score:</strong> {comparisonResult.overall.score.c1.toFixed(2)}</p>
                        <p><strong>Time Spent:</strong> {comparisonResult.overall.time.c1} mins</p>
                      </div>
                    )}

                    {comparisonResult?.strengths?.c1 && (
                      <div className="mt-4">
                        <h3 className="font-semibold">Strengths</h3>
                        <ul className="list-disc pl-4">
                          {comparisonResult.strengths.c1.strengths.map((strength, index) => (
                            <li key={index}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-600/10 p-6 md:w-1/3 w-full rounded-lg">
                  <h2 className="text-xl font-bold mb-4">Second Candidate</h2>
                    <h2 className="text-xl font-bold mb-4">{secondCandidateName}</h2>
                    {comparisonResult?.overall && (
                      <div className="space-y-2">
                        <p><strong>Overall Score:</strong> {comparisonResult.overall.score.c2.toFixed(2)}</p>
                        <p><strong>Time Spent:</strong> {comparisonResult.overall.time.c2} mins</p>
                      </div>
                    )}

                    {comparisonResult?.strengths?.c2 && (
                      <div className="mt-4">
                        <h3 className="font-semibold">Strengths</h3>
                        <ul className="list-disc pl-4">
                          {comparisonResult.strengths.c2.strengths.map((strength, index) => (
                            <li key={index}>{strength}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>



                <div className="flex justify-around mt-10 flex-col md:flex-row space-y-4 md:space-y-0">
                  {/* Display chart */}
                  <div className="bg-slate-600/10 p-6 md:w-1/3 rounded-lg w-full">
                    <h2 className="text-xl font-bold mb-4">Overall Score Comparison</h2>
                    <Bar data={chartData} options={{ responsive: true }} />
                  </div>


                  {/*dougnut chart for declaration */}
                  <div className="bg-slate-600/10 p-6 md:w-1/3 rounded-lg w-full">
                    <h2 className="text-xl font-bold mb-4">Strengths vs Weaknesses</h2>
                    <Doughnut data={doughnutChartData} options={{ responsive: true }} />
                  </div>
                </div>


                {/* Recommendation Section */}
                <div className="mt-10 bg-slate-600/10 p-6 rounded-lg">
                  <h2 className="text-xl font-bold mb-4">Recommendation</h2>
                  {comparisonResult?.recommendation && (
                    <div className="space-y-2">
                      <p><strong>Best Candidate:</strong> {comparisonResult.recommendation.best}</p>
                      <p><strong>Reason:</strong> {comparisonResult.recommendation.reason}</p>
                      <p><strong>Factors:</strong> {comparisonResult.recommendation.factors.join(', ')}</p>
                      <p><strong>Confidence:</strong> {comparisonResult.recommendation.confidence}</p>
                    </div>
                  )}
                </div>

                {/* Summary Section */}
                <div className="mt-10 bg-slate-600/10 p-6 rounded-lg">
                  <h2 className="text-xl font-bold mb-4">Summary</h2>
                  {comparisonResult?.summary && (
                    <div className="space-y-2">
                      <p><strong>Technical:</strong> {comparisonResult.summary.technical}</p>
                      <p><strong>Culture:</strong> {comparisonResult.summary.culture}</p>
                      <p><strong>Growth:</strong> {comparisonResult.summary.growth}</p>
                    </div>
                  )}
                </div>


              </>)}




          </div>

        </div>


      </SidebarInset>
    </>
  )
}

export default InterviewComparision