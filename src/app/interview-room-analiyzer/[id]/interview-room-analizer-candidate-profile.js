import React, { use, useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { getCandidateById } from "@/lib/api/users";
import { FaDiscord, FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { FaFacebookSquare } from "react-icons/fa";

function InterviewRoomAnalizerCandidateProfile({ candidateId }) {
  const [candidateDetails, setCandidateDetails] = useState({});
  const [age, setAge] = useState(0);
  const { toast } = useToast();

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

  return (
    <div className=" w-[90%] max-w-[1500px] bg-black mx-auto h-full p-6 relative">
      <h1 className=" text-3xl font-semibold">Candidate Profile</h1>
      <div className=" w-full flex flex-col md:flex-row justify-center md:justify-start items-center mt-9">
        <Avatar className=" h-28 w-28 md:h-40 md:w-40 ">
          <AvatarFallback className="text-4xl md:text-6xl">CN</AvatarFallback>
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
          <div className="bg-blue-700/5 text-blue-500 border-2 border-blue-900 px-8 py-5 rounded-lg">
            <h1 className=" text-xl font-semibold">Experiences</h1>
            <div
              className="text-justify w-full text-gray-500 bg-transparent rounded-lg mt-3"
              dangerouslySetInnerHTML={{
                __html: candidateDetails?.experience || "No Experiences",
              }}
            />
          </div>
          <div className="bg-yellow-700/5 text-yellow-800 border-2 border-yellow-900 px-8 py-5 rounded-lg mt-5">
            <h1 className=" text-xl font-semibold">Skill Highlights</h1>
            <div
              className="text-justify text-gray-500 w-full bg-transparent rounded-lg mt-3"
              dangerouslySetInnerHTML={{
                __html:
                  candidateDetails?.skillHighlights || "No Skill Highlight",
              }}
            />
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
          </div>
          <div className="bg-gray-700/20 text-gray-400 border-2 border-gray-700 px-8 py-5 rounded-lg mt-5">
                    <h2 className=" text-xl font-semibold">Social Media</h2>
                    <div className=" w-full mt-5 flex justify-start items-center gap-2">
                      <FaLinkedin className=" text-3xl" />
                      <p
                        type="text"
                        className={` focus:outline-none bg-transparent rounded-lg w-full text-sm py-1.5 px-2`}
                      >Linkedin url</p>
                    </div>
                    <div className=" w-full mt-5 flex justify-start items-center gap-2">
                      <FaGithub className=" text-3xl" />
                      <p
                        type="text"
                        className={` focus:outline-none bg-transparent rounded-lg w-full text-sm py-1.5 px-2`}
                      >Github Url</p>
                    </div>
                    <div className=" w-full mt-5 flex justify-start items-center gap-2">
                      <FaFacebookSquare className=" text-3xl" />
                      <p
                        type="text"
                        className={` focus:outline-none bg-transparent rounded-lg w-full text-sm py-1.5 px-2`}
                      >Facebook Url</p>
                    </div>
                    <div className=" w-full mt-5 flex justify-start items-center gap-2">
                      <FaXTwitter className=" text-3xl" />
                      <p
                        type="text"
                        className={` focus:outline-none bg-transparent rounded-lg w-full text-sm py-1.5 px-2`}
                      >X Url</p>
                    </div>
                    <div className=" w-full mt-5 flex justify-start items-center gap-2">
                      <FaDiscord className=" text-3xl" />
                      <p
                        type="text"
                        className={` focus:outline-none bg-transparent rounded-lg w-full text-sm py-1.5 px-2`}
                      >Discord Url</p>
                    </div>
                  </div>
          <div className="bg-gray-700/20 text-gray-400 border-2 border-gray-700 px-8 py-5 rounded-lg mt-5">
            <h2 className=" text-xl font-semibold">Resume</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewRoomAnalizerCandidateProfile;
