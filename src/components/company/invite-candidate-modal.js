import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoCloseCircle } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { getSession } from "next-auth/react";
import { getInterviewTimeSlotsInterviewById, sendInvitaionForCandidates } from "@/lib/api/interview-invitation";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast"

function InviteCandidateModal({ setInviteModalOpen , interviewId }) {
  const [email, setEmail] = useState("");
  const [interviewTimeSlots, setInterviewTimeSlots] = useState([]);
  const [filterInterviewTimeSlots, setFilterInterviewTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState();
  // const [interviewID, setInterviewID] = useState(interviewId);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    debugger
    e.preventDefault();
    try {
      const invitaionData = {
        to: email,
        interviewId:interviewId,
        scheduleId: selectedTimeSlot,
      };
      const response = await sendInvitaionForCandidates(invitaionData);

      if (response) {
        setInviteModalOpen(false);
      }
    } catch (err) {
      if (err.response) {
        const { data } = err.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Question create failed: ${data.message}`,
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
  useEffect(() => {
    const fetchInterviewTimeSlots = async () => {
      try {
        // const session = await getSession();
        // const companyId = session?.user?.companyID;
        const response = await getInterviewTimeSlotsInterviewById(interviewId);
        if (response) {
          setInterviewTimeSlots(response.data.schedules);
          setFilterInterviewTimeSlots(response.data.schedules);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Error fetching interviews: ${error}`,
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    };
    fetchInterviewTimeSlots();
  }, []);
  


  return (
    <div className=" fixed  top-0 left-0 z-50 h-full w-full flex items-center justify-center bg-black/50">
      <div className=" relative max-w-[700px] h-fit max-h-[670px] w-[90%] md:w-[50%] p-9 bg-gradient-to-br from-[#1f2126] to-[#17191d] rounded-lg">
        <h1 className=" text-2xl font-semibold text-[#f3f3f3] pb-5">
          Invite Candidate
        </h1>
        <button
        type="button"
          onClick={() => setInviteModalOpen(false)}
          className=" absolute top-5 right-5 text-[#f3f3f3]"
        >
          <MdClose className=" text-2xl" />
        </button>
        <p className=" text-sm text-gray-500 py-2">
          Enter the candidate's email address and click the "Send Invitation" button. Once
          submitted, an interview session link will be sent directly to the
          candidate's email.
        </p>
        <form onSubmit={handleSubmit} className=" flex flex-col space-y-4 mt-5">
          <input
            type="email"
            placeholder="Canadidate's Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className=" h-[45px] w-full md:w-[60%] rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 mb-5"
          />
          <div className="w-[40%]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className={`!bg-[#32353b] w-full h-[45px] m-0 px-2 focus:outline-none outline-none`}
                  variant="outline"
                >
                  {interviewTimeSlots.find(
                    (cat) => cat.scheduleID === selectedTimeSlot
                  )?.startTime || "Select Time Slot"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Interview Catagory</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={selectedTimeSlot}
                  onValueChange={setSelectedTimeSlot}
                >
                  {filterInterviewTimeSlots.map((schedule) => (
                    <DropdownMenuRadioItem
                      key={schedule.scheduleID}
                      value={schedule.scheduleID}
                    >
                      {schedule.startTime}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className=" flex w-full justify-end">
            <button type="submit" className=" py-2.5 bg-white text-black text-sm font-semibold rounded-lg px-5">
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InviteCandidateModal;
