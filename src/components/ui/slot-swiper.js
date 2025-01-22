import React, { forwardRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { getSession } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { bookSchedule } from "@/lib/api/interview-schedules";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

const SlotSwiperComponent = forwardRef(
  ({ scheduling, interviewId, setSlotModalOpen, onSlideChange }, ref) => {
    const { toast } = useToast();

    const handleBookSlot = async (id) => {
      try {
        const session = await getSession();
        const candidateID = session?.user?.candidateID;
        const booking = {
          interviewId: interviewId,
          scheduleId: id,
          candidateId: candidateID,
        };
        const response = await bookSchedule(booking);
        if (response) {
          toast({
            title: "Success!",
            description: `Your slot has been booked successfully.`,
          });
          setSlotModalOpen(false);
        }
      } catch (err) {
        if (err.response) {
          const { data } = err.response;

          if (data && data.message) {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: `Schedule Booking failed: ${data.message}`,
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

    return (
      <Swiper
        ref={ref}
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={(swiper) => onSlideChange(swiper.activeIndex)}
        speed={500}
        effect="slide"
        grabCursor={false}
        allowTouchMove={false}
      >
        {scheduling.map((schedule, index) => (
          <SwiperSlide key={index}>
            <div className=" w-full h-[300px] text-white shadow-md ">
              <p className="text-lg text-white py-5 w-full text-center">
                {new Date(schedule.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <div className=" w-full grid place-content-center grid-cols-1  md:grid-cols-2  lg:grid-cols-3 gap-3">
                {schedule.schedules.map((slot, index) => (
                  <AlertDialog key={index}>
                    <AlertDialogTrigger disabled={slot.isBooked}>
                      <div
                        key={index}
                        className={` py-2 border-2 ${
                          slot.isBooked ? "border-red-700" : "border-gray-700"
                        } rounded-lg p-5 `}
                      >
                        <div className=" flex justify-between w-full">
                          <div className=" text-sm">
                            {new Date(slot.start).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          <div className=" text-sm">
                            {new Date(slot.end).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                        <div className=" w-full flex justify-center items-center mt-1">
                          {slot.isBooked ? (
                            <div
                              className={` mt-1 mx-auto text-xs px-3 py-1 text-red-500 bg-red-500/20 rounded-full flex justify-start items-center`}
                            >
                              <div className=" aspect-square h-[8px] rounded-full bg-red-400"></div>
                              <div className=" ml-2">Booked</div>
                            </div>
                          ) : (
                            <div
                              className={` mt-1 mx-auto text-xs px-3 py-1 text-gray-500 bg-gray-500/20 rounded-full flex justify-start items-center`}
                            >
                              <div className=" aspect-square h-[8px] rounded-full bg-gray-400"></div>
                              <div className=" ml-2">Available</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to Book this time slot?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          If you book this time slot, it will be marked as
                          Booked.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleBookSlot(slot.id)}
                          className="h-[40px] font-medium"
                        >
                          Book now
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ))}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }
);
SlotSwiperComponent.displayName = "MyComponent";

export default SlotSwiperComponent;
