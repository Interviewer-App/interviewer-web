"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams, redirect } from "next/navigation";
import { signIn ,useSession , signOut, getSession} from "next-auth/react";

//assets
import sideImage from "@/assets/signin/sign-in-side-mage.jpg";

//icons
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";

import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"


const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast()


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });

      if (res.ok) {
        
        const session = await getSession();
        const userRole = session?.user?.role;

        if (userRole === 'COMPANY') {
          router.push('/dashboard');
        } else if (userRole === 'CANDIDATE') {
          router.push('/panel');
        } else {
          router.push('/');
        }


      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Invalid email or password",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        })
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "An unexpected error occurred. Please try again.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      })
    }
  };

    const handleGoogleLoginSuccess = async () => {
      await signIn("google", {
        callbackUrl: "/panel",
      });
    };
    
    const handleGithubLoginSuccess = async () => {
      await signIn("github", {
        callbackUrl: "/panel",
      });
  
    };

  return (
    <div className=" bg-background flex flex-col items-center justify-center h-lvh w-full text-white">
      <div className="h-fit max-h-[670px] w-[90%] md:w-[50%] lg:w-[70%] bg-gradient-to-br from-[#1f2126] to-[#17191d] rounded-lg flex justify-between">
        <div className=" hidden lg:block w-[40%] h-full relative">
          <Image
            src={sideImage}
            alt="side image"
            className=" rounded-tl-lg rounded-bl-lg h-full w-full object-cover"
          />
        </div>
        <div className=" w-full lg:w-[60%] py-10 px-14">
          <h1 className=" text-2xl font-semibold text-[#f3f3f3]">Sign In</h1>
          <div className=" mt-8 clear-start flex flex-col items-start justify-between">
            <button onClick={handleGoogleLoginSuccess} className=" bg-white h-[45px] w-full text-black font-normal rounded-lg text-sm ">
              <FcGoogle className=" mr-2 inline-block text-xl" />
              Sign in with Google
            </button>
            <button onClick={handleGithubLoginSuccess} className=" bg-black h-[45px] text-white w-full font-medium rounded-lg text-sm border-0 mt-5">
              <FaGithub className=" text-white mr-2 inline-block text-xl" />
              Sign in with Github
            </button>
          </div>
          <div className=" w-full my-5 flex items-center justify-center">
            <hr className="w-[45%] border-[#666666]" />
            <p className=" text-[#666666] text-sm py-4 px-8 overflow-hidden text-center">
              OR
            </p>
            <hr className="w-[45%] border-[#666666]" />
          </div>
          <form
            onSubmit={handleSubmit}
            className=" flex flex-col items-center justify-between"
          >
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className=" h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 mb-5"
            />
            <div className=" w-full relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className=" h-[45px] w-full rounded-lg text-base border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2"
            />
            {showPassword ? <IoEye onClick={() => setShowPassword(!showPassword)} className=" absolute right-4 top-4 text-[#737883] cursor-pointer" /> : <IoEyeOff onClick={() => setShowPassword(!showPassword)} className=" absolute right-4 top-4 text-[#737883] cursor-pointer" />}
            </div>
            <div className=" w-full flex justify-between items-center mt-5">
              <div>
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  className=" h-4 w-4 rounded-sm mr-2"
                />
                <label htmlFor="remember" className=" text-sm">
                  Remember me
                </label>
              </div>
              <Link
                href="/forgot-password"
                className=" text-sm cursor-pointer text-[#4285f4] hover:underline"
              >
                Lost Password?
              </Link>
            </div>
              <button
                type="submit"
                className=" h-12 min-w-[150px] w-full md:w-[40%] mt-8 cursor-pointer bg-gradient-to-b from-lightred to-darkred rounded-lg text-center text-base text-white font-semibold"
              >
                Sign In
              </button>
          </form>
          <div className="mt-5 w-full">
            <p className=" text-[#808080] text-sm text-center">
              Not a member yet?{" "}
              <Link
                href="/register"
                className="text-[#4285f4] hover:underline cursor-pointer"
              >
                Sign up
              </Link>{" "}
              here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
