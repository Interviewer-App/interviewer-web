"use client";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";

//assets
import bgGrid from "@/assets/grid-bg.svg";
import bgGrain from "@/assets/grain-bg.svg";

//API
import { forgotPassword } from "@/lib/api/users";

//components
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await forgotPassword({email});
      if (response) {
        toast({
          variant: "success",
          title: "Email Sent!",
          description: "We have sent you an email with a temporary password.",
        });
        router.push("/login");
      }
    } catch (err) {
      if (err.response) {
        const { data } = err.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Email Send Fail: ${data.message}`,
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
    <div className=" relative bg-cover overflow-hidden flex flex-col items-center justify-center h-lvh w-full text-white">
      <div className="absolute inset-0 bg-background -z-20"></div>
      <Image
        src={bgGrid}
        alt="bg"
        className=" absolute w-full  top-0 left-0 -z-10 "
      />
      <Image
        src={bgGrain}
        alt="bg"
        className=" absolute w-full top-0 left-0 -z-10 "
      />
      <div className="h-fit max-h-[670px] max-w-[600px] w-[90%] md:w-[50%] bg-gradient-to-br from-[#1f2126] to-[#17191d] rounded-lg p-14">
        <h1 className=" text-xl md:text-2xl lg:text-3xl font-semibold text-[#f3f3f3]">
          {"Forgot your password? "}
        </h1>
        <p className=" text-sm md:text-base text-neutral-500 pt-3 pb-8 ">
          {
            "Enter your email address below, and we will send you a temporary password to log in to your account."
          }
        </p>
        <form onSubmit={handleSubmit} className=" w-full">
          <label
            htmlFor="email"
            className=" text-left text-sm w-full mb-2 mt-5"
          >
            Your Email
          </label>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className=" h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 mt-2"
          />
          <div className="my-5 w-full">
            <input
              type="checkbox"
              id="accepterms"
              name="accepterms"
              className=" h-4 w-4 rounded-sm mr-2"
            />
            <label htmlFor="accepterms" className=" text-sm">
              I accept the{" "}
              <Link
                href="#"
                className="text-[#4285f4] hover:underline cursor-pointer"
              >
                Terms and Conditions
              </Link>
            </label>
          </div>
          <div className=" w-full flex justify-center items-center mt-7">
            <button
              type="submit"
              className=" h-12 min-w-[170px] w-full md:w-[40%] cursor-pointer rounded-lg text-center text-sm text-black bg-white font-semibold"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
