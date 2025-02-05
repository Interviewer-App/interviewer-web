"use client";
import CreateInterviewModal from "@/components/interviews/create-interview-modal";
import InterviewDisplayCard from "@/components/interviews/interview-display-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { getInterviews } from "@/lib/api/interview";

//MUI
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import NoData from "@/assets/nodata.png";
import Image from "next/image";
import Loading from "@/app/loading";
import { usePathname, useRouter, redirect } from "next/navigation";
import { useSession, getSession } from "next-auth/react";
import { AlertCircle } from "lucide-react"
import { getCompanyById } from "@/lib/api/users";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

const InterviewsPage = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [interviews, setInterviews] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isAnyInterviews, setIsAnyInterviews] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [companyDetails, setCompanyDetails] = useState({});
  const [companyId, setCompanyId] = useState("");

  useEffect(() => {
    const fetchInterviews = async () => {
      setIsLoading(true);
      try {
        const session = await getSession();
        const companyId = session?.user?.companyID;
        const response = await getInterviews(companyId);

        if (response) {
          setInterviews(response.data);
          setIsAnyInterviews(response.data.length > 0);
        }

      } catch (error) {
        setIsLoading(false);
        // Check if the error is a 404 (no interviews found)
        if (error.response && error.response.status === 404) {
          // No interviews found, set state accordingly
          setInterviews([]);
          setIsAnyInterviews(false);
        } else {
          // Handle other errors
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Error fetching interviews: ${error}`,
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchInterviews();
  }, [modalOpen]);

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
              description: `Company Details Fetching Failed: ${data.message}`,
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
            description: "An unexpected error occurred. Please check your network and try again.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }
      }
    };

    if (companyId) {
      fetchCompanyDetails();
    }
  }, [companyId]);




  if (status === "loading") {
    return (
      <>
        <Loading />
      </>
    );
  } else {
    if (session.user.role !== "COMPANY") {
      const loginURL = `/login?redirect=${encodeURIComponent(pathname)}`;
      redirect(loginURL);
    }
  }

  return (
    <>
      <SidebarInset>
        <header className="flex h-16 shrink-0 bg-black items-center gap-2">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage
                    href="/interviews"
                    className=" hidden md:block cursor-pointer"
                  >
                    Interviews
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className=" px-9 py-4 w-full bg-black max-w-[1500px] mx-auto h-full">
          <div className=" flex items-start flex-col">
            <h1 className=" text-4xl font-semibold mb-4">Interviews</h1>
            {/* {(companyDetails?.companyDescription === null || companyDetails?.companyDescription === "<p><br></p>") && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Please complete your company details section before scheduling an interview.
                </AlertDescription>
              </Alert>
            )} */}
            {!isAnyInterviews && (
              <button
                onClick={() => setModalOpen(true)}
                className=" hidden md:block rounded-lg font-semibold bg-white text-black text-sm px-5 py-2"
              >
                + Create Interview
              </button>
            )}
          </div>
          {isAnyInterviews && (
            <div className=" grid grid-cols-1 gap-9 mt-6 md:grid-cols-2 lg:grid-cols-3">
              <div
                onClick={() => setModalOpen(true)}
                className=" w-full h-full cursor-pointer border-4 border-dashed border-gray-700 flex flex-col items-center justify-center rounded-xl"
              >
                <div className=" bg-slate-500 rounded-full p-6 m-14 md:m-0">
                  <FaPlus className=" text-white text-3xl " />
                </div>
              </div>
              {interviews.map((interview, index) => (
                <InterviewDisplayCard
                  key={index}
                  index={index + 1}
                  interview={interview}
                />
              ))}
            </div>
          )}
          {!isAnyInterviews && (
            <div className=" relative flex justify-center items-center h-full w-full">
              <div className=" w-full">
                <Image
                  src={NoData}
                  alt="No data"
                  className=" mx-auto h-[150px] w-[200px]"
                />
                <h1 className="text-3xl py-2 text-gray-500 w-full text-center">
                  No interviews found
                </h1>
                <button
                  onClick={() => setModalOpen(true)}
                  className=" mx-auto my-4 block md:hidden rounded-lg bg-white text-black px-5 py-2"
                >
                  + Create Interview
                </button>
              </div>
            </div>
          )}
        </div>
        {modalOpen && <CreateInterviewModal setModalOpen={setModalOpen} />}
        {isLoading && (
          <div className=" fixed  top-0 left-0 h-full w-full flex items-center justify-center bg-black/50">
            <Loading />
          </div>
        )}
      </SidebarInset>
    </>
  );
};

export default InterviewsPage;
