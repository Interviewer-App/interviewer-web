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
import { useEffect,useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { getInterviews } from "@/lib/api/interview";
import { useSession, getSession } from "next-auth/react";


const InterviewComparision = () => {
  const { toast } = useToast();
  const [interviews, setInterviews] = useState([]); 
  const [selectedInterview, setSelectedInterview] = useState(""); // State to store selected interview

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

        <div className="w-[90%] max-w-[1500px] mx-auto h-full p-6 relative">
          <h1 className=" text-3xl font-semibold">Candidate comparision</h1>
          <div className="bg-slate-600/10 w-full h-fit p-9 rounded-lg mt-5">
            <div className="flex items-center justify-between p-9">

              <h1 className="text-2xl font-semibold">Compare Between Candidates</h1>

              {/* 
              <button
        
        className="rounded-lg bg-white text-black font-bold px-2 py-2"
      >
       Compare All Interviews
      </button> */}
            </div>


            <div className="flex items-center justify-between p-9">

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
                <ComboboxDemo selectedInterview={selectedInterview} />
              </div>
              <div>
                <ComboboxDemo selectedInterview={selectedInterview}/>
              </div>



              {/* Add Category Button */}
              <div>
                <button

                  className="rounded-lg bg-white text-black font-bold px-2 py-2"
                >
                  Compare Interviews
                </button>
              </div>
            </div>


            <div className="flex justify-around mt-20">
              <div className="bg-slate-600/10 px-40 py-40">

              </div>
              <div className="bg-slate-600/10 px-40 py-40">

              </div>
            </div>




          </div>

        </div>


      </SidebarInset>
    </>
  )
}

export default InterviewComparision