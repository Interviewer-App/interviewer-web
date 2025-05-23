"use client";
import InterviewScheduleCard from "@/components/interview-schedules/interview-schedule-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getPublishedInterview } from "@/lib/api/interview";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import socket from "../../../lib/utils/socket";
import NoData from "@/assets/nodata.png";
import Image from "next/image";
import Loading from "@/app/loading";
import { usePathname, useRouter, redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { Filter, SlidersHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast"
const InterviewSchedulePage = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [interviews, setInterviews] = useState([]);
  const [isAnyInterviews, setIsAnyInterviews] = useState(false);
  const [sordBy, setSortBy] = useState("");
  const [datePosted, setDatePosted] = useState("");
  const [interviewCategory, setInterviewCategory] = useState("");
  const [interviewMedium, setInterviewMedium] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [keyWords, setKeyWords] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setIsSheetOpen(true);
  const handleClose = () => setIsSheetOpen(false);
  const { toast } = useToast()

  useEffect(() => {
    socket.on("published", (data) => {
      fetchPublishedInterviews();
    });

    fetchPublishedInterviews();

    return () => {
      socket.off("published");
    };
  }, []);

  const fetchPublishedInterviews = async () => {
    // debugger
    setLoading(true);
    try {
      // console.log("interviewCategory", interviewCategory);
      const response = await getPublishedInterview(
        sordBy,
        datePosted,
        interviewMedium,
        jobTitle,
        keyWords
      );
      setInterviews(response.data);
      console.log("interviews", response.data);
      setIsAnyInterviews(response.data.length > 0);

    } catch (error) {
      console.log("Error fetching interviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchPublishedInterviews();
    setIsSheetOpen(false);

    // Success toast for applying filters
    toast({
      title: "Success",
      description: "Filters applied successfully!",
    })
  };

  const handleReset = () => {
    // Reset all filter states to their initial values
    setSortBy("");
    setDatePosted("");
    setInterviewMedium("");
    setJobTitle("");
    setKeyWords("");

    // Fetch interviews without any filters
    fetchPublishedInterviews();

    // Close the sheet (if it's open)
    setIsSheetOpen(false);

    // Show a toast notification for resetting the filters
    toast({
      title: "Filters Reset",
      description: "All filters have been cleared!",
    });
  };

  useEffect(() => {
    fetchPublishedInterviews();
  }, [sordBy, datePosted, interviewMedium, jobTitle, keyWords]);


  if (status === "loading") {
    return (
      <>
        <Loading />
      </>
    );
  } else {
    if (session.user.role !== "CANDIDATE") {
      const loginURL = `/login?redirect=${encodeURIComponent(pathname)}`;
      redirect(loginURL);
    }
  }

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
                  <BreadcrumbPage>Interview Schedules</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="px-9 py-4 w-full max-w-[1500px] mx-auto  h-full text-white">
          <div className=" w-full flex justify-between items-center">
            <h1 className=" text-4xl font-semibold">Scheduled Interviews</h1>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger>
                <div className=" bg-transparent border-2 border-gray-300 text-gray-300 hover:text-gray-500 hover:border-gray-500 px-2 py-2 rounded-sm cursor-pointer">
                  <SlidersHorizontal />
                </div>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>
                    <span className=" text-2xl font-semibold">
                      Filter Interviews by
                    </span>
                  </SheetTitle>
                  {/* <SheetDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </SheetDescription> */}
                </SheetHeader>
                <form onSubmit={handleSubmit} className=" !text-white">
                  <div className=" w-full mt-5">
                    <span className=" text-xl font-semibold text-gray-400">
                      Sort by
                    </span>
                    <RadioGroup defaultValue={sordBy} onValueChange={setSortBy}>
                      <div className=" w-full flex space-x-8 mt-5 px-5">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="latest" id="latest" />
                          <Label htmlFor="latest">Latest</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="a-z" id="Ascending" />
                          <Label htmlFor="Ascending">Ascending</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="z-a" id="Descending" />
                          <Label htmlFor="Descending">Descending</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className=" w-full mt-6">
                    <span className=" text-xl font-semibold text-gray-400">
                      Date posted
                    </span>
                    <RadioGroup
                      defaultValue={datePosted}
                      onValueChange={setDatePosted}
                    >
                      <div className=" w-full flex space-x-8 mt-5 px-5">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="last 24 hours"
                            id="Ascending"
                          />
                          <Label htmlFor="Ascending">Past 24 hours</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="last week" id="last week" />
                          <Label htmlFor="last week">Past week</Label>
                        </div>
                      </div>
                      <div className=" w-full flex space-x-8 mt-3 px-5">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="last month" id="last month" />
                          <Label htmlFor="last month">Past month</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className=" w-full mt-6">
                    <span className=" text-xl font-semibold text-gray-400">
                      Interview Medium
                    </span>
                    <RadioGroup
                      defaultValue={interviewMedium}
                      onValueChange={setInterviewMedium}
                    >
                      <div className=" w-full flex space-x-8 mt-5 px-5">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="PHYSICAL" id="PHYSICAL" />
                          <Label htmlFor="PHYSICAL">Physical</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="VIRTUAL" id="VIRTUAL" />
                          <Label htmlFor="VIRTUAL">Virtual</Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className=" w-full mt-6">
                    <span className=" text-xl font-semibold text-gray-400">
                      Job Title
                    </span>
                    <input
                      typr="text"
                      placeholder="Job Title"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      className=" mt-5 h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2"
                    />
                  </div>
                  <div className=" w-full mt-6">
                    <span className=" text-xl font-semibold text-gray-400">
                      Key words
                    </span>

                    <input
                      typr="text"
                      placeholder="Key words"
                      value={keyWords}
                      onChange={(e) => setKeyWords(e.target.value)}
                      className=" mt-5 h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2"
                    />
                  </div>
                  <div className=" w-full flex justify-between mt-5">
                    <button type="button" onClick={handleReset} className=" mt-6 bg-transparent border-2 hover:text-white hover:border-white border-gray-600 rounded-lg text-center text-sm text-gray-600 font-semibold h-11 w-[130px]">
                      Reset fitler
                    </button>
                    <button
                      type="submit"
                      className=" mt-6 bg-white rounded-lg text-center text-sm text-black font-semibold h-11 w-[130px]"
                    >
                      Apply Filter
                    </button>
                  </div>
                </form>
              </SheetContent>
            </Sheet>
          </div>
          {isAnyInterviews ? (
            <div className=" grid grid-cols-1 gap-9 mt-6 md:grid-cols-2 lg:grid-cols-3">
              {interviews.map((interview, index) => (
                <InterviewScheduleCard
                  key={index}
                  index={index + 1}
                  interview={interview}
                  showButton={false}
                />
              ))}
            </div>
          ) : (
            <div className=" relative flex justify-center items-center h-full w-full">
              <div className=" w-full">
                <Image
                  src='/nodata.png'
                  alt="No data"
                  width={150}
                  height={150}
                  className=" mx-auto h-[150px] w-[200px]"
                />
                <h1 className="text-3xl py-2 text-gray-500 w-full text-center font-bold">
                  No interviews found
                </h1>
                <p className="text-gray-500 mb-8 text-center">
              You don&apos;t have any scheduled interviews at the moment. <br/>Schedule an interview or check back later.
            </p>
              </div>
            </div>
          )}
        </div>
        {loading && (
          <div className=" fixed  top-0 left-0 h-full w-full flex items-center justify-center bg-black/50">
            <Loading />
          </div>
        )}
      </SidebarInset>
    </>
  );
};

export default InterviewSchedulePage;
