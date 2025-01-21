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

function InviteCandidateModal({ setInviteModalOpen, interviewId }) {
  const [email, setEmail] = useState("");
  const [interviewTimeSlots, setInterviewTimeSlots] = useState({});
  const [interviewTimeSlotsDates, setInterviewTimeSlotsDates] = useState([]);
  const [filterInterviewTimeSlots, setFilterInterviewTimeSlots] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  // const [interviewID, setInterviewID] = useState(interviewId);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const invitaionData = {
        to: email,
        interviewId: interviewId,
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
          const scheduleData = response.data.schedulesByDate || [];

          // Process dates and time slots
          const dates = Array.from(
            new Set(
              scheduleData.map(group =>
                new Date(group.date).toISOString().split('T')[0]
              )
            )
          ).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

          const timeSlotsMap = scheduleData.reduce((acc, group) => {
            const dateKey = new Date(group.date).toISOString().split('T')[0];
            acc[dateKey] = group.schedules.map(slot => ({
              scheduleID: slot.id,
              startTime: new Date(slot.start).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              }),
              endTime: new Date(slot.end).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              }),
              isBooked: slot.isBooked
            }));
            return acc;
          }, {});


          setInterviewTimeSlotsDates(dates)
          setInterviewTimeSlots(timeSlotsMap);
          setFilterInterviewTimeSlots(timeSlotsMap);
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
        <form onSubmit={handleSubmit} className=" flex w-full justify-between space-x-2 mt-5">
          <div className="flex-1">
            <input
              type="email"
              placeholder="Canadidate's Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 mb-5"
            />
          </div>
          <div className="flex-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="!bg-[#32353b] w-full h-[45px] m-0 px-2 focus:outline-none outline-none"
                  variant="outline"
                >
                  {Object.values(interviewTimeSlots)
                    .flat()
                    .find(slot => slot.scheduleID === selectedTimeSlot)?.startTime || "Select Time Slot"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Available Time Slots</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={selectedTimeSlot}
                  onValueChange={setSelectedTimeSlot}
                >
                  {interviewTimeSlotsDates?.map(date => (
                    <div key={date}>
                      <DropdownMenuLabel className="text-xs text-gray-400">
                        {new Date(date).toLocaleDateString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </DropdownMenuLabel>
                      {interviewTimeSlots[date]?.map(slot => (
                        <DropdownMenuRadioItem
                          key={slot.scheduleID}
                          value={slot.scheduleID}
                          disabled={slot.isBooked}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span>{slot.startTime} - {slot.endTime}</span>
                            {slot.isBooked && (
                              <span className="text-red-500 text-xs ml-2">Booked</span>
                            )}
                          </div>
                        </DropdownMenuRadioItem>
                      ))}
                    </div>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
        </form>
        <div className=" flex w-full justify-center w-full mt-4">
            <button type="submit" className=" py-2.5 bg-white text-black text-sm font-semibold rounded-lg px-5 w-full">
              Send Invitation
            </button>
          </div>
      </div>
    </div>
  );
}

export default InviteCandidateModal;
