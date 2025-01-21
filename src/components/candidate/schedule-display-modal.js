import React, { use } from "react";
import { MdClose } from "react-icons/md";
import { getAllInterviewSchedules } from "@/lib/api/interview-schedules";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useState } from "react";
import { useEffect } from "react";
import SlotSwiperComponent from "../ui/slot-swiper";
import { useRef } from "react";
import { Schedule } from "@mui/icons-material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

function ScheduleDesplayModal({
  setSlotModalOpen,
  interviewId,
  startDate,
  endDate,
}) {
  const [scheduling, setScheduling] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [dateLength, setDateLength] = useState(0);
  const { toast } = useToast();
  const swiperRef = useRef(null);

  useEffect(() => {
    setDateLength(
      Math.ceil(
        (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)
      )
    );
  }, [startDate, endDate, scheduling]);

  useEffect(() => {
    console.log(dateLength);
  }, [dateLength]);

    useEffect(() => {
      const fetchAllSchedules = async () => {
        try {
          const response = await getAllInterviewSchedules(interviewId);
          console.log(response)
          if (response.data.schedulesByDate) {
            setScheduling(response.data.schedulesByDate);
          }
        } catch (err) {
          if (err.response) {
            const { data } = err.response;

            if (data && data.message) {
              toast({
                variant: "destructive",
                title: "Uh oh! Something went wrong.",
                description: `Schedule fetch failed: ${data.message}`,
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

      fetchAllSchedules();
    }, []);


  const handleNext = () => {
    if (activeStep < (scheduling).length - 1) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  return (
    <div className=" fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className=" relative max-w-[700px] h-fit w-[90%] md:w-[50%] p-9 bg-gradient-to-br from-[#1f2126] to-[#17191d] rounded-lg">
        <button
          onClick={() => setSlotModalOpen(false)}
          className=" absolute top-5 right-5 text-[#f3f3f3]"
        >
          <MdClose className=" text-2xl" />
        </button>
        <h1 className=" text-2xl font-semibold text-[#f3f3f3] pb-5">
          Book Your Slot
        </h1>
        <p className=" text-sm text-gray-400 font-normal">
          {new Date(startDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}{" "}
          -{" "}
          {new Date(endDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <div className="flex justify-between mt-5">
          <button
            onClick={handlePrev}
            className=" text-gray-500 text-sm py-1 rounded-md hover:text-gray-300"
          >
            <ArrowBackIosNewIcon sx={{fontSize: '12px'}}/> Prev day
          </button>
          <button
            onClick={handleNext}
            className=" text-gray-500 text-sm py-1 rounded-md hover:text-gray-300"
          >
            Next day <ArrowForwardIosIcon sx={{fontSize: '12px'}}/> 
          </button>
        </div>
        <SlotSwiperComponent
          ref={swiperRef}
          scheduling={scheduling}
            interviewId={interviewId}
            setSlotModalOpen={setSlotModalOpen}
          onSlideChange={(index) => setActiveStep(index)}
        />
      </div>
    </div>
  );
}

export default ScheduleDesplayModal;
