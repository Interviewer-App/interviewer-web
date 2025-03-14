"use client";
import React, { useEffect, useState } from "react";
import { signUp } from "@/lib/api/authentication";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { signIn } from "next-auth/react";

//assets
import sideImage from "@/assets/register/register-side-image.jpg";
import bgGrid from "@/assets/grid-bg.svg";
import bgGrain from "@/assets/grain-bg.svg";

//icons
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

//shadcn components
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const RegisterPage = () => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordconf, setPasswordconf] = useState("");
  const [role, setRole] = useState("CANDIDATE");
  const [companyname, setCompanyName] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isPasswordMissMatch, setIsPasswordMissMatch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConf, setShowPasswordConf] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.documentElement.classList.remove(savedTheme);
    }
    localStorage.setItem("theme", "dark");
    document.documentElement.classList.add("dark");
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  const passwordValidation = (password, passwordconf) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

    if (password !== passwordconf) {
      setIsPasswordMissMatch(true);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Passwords do not match.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
      return false;
    }

    if (passwordRegex.test(password) && password.length >= 6) {
      setIsPasswordMissMatch(false);
      setIsValidPassword(false);
      return true;
    }

    setIsValidPassword(true);
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and be at least 6 characters long.",
      action: <ToastAction altText="Try again">Try again</ToastAction>,
    });
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (passwordValidation(password, passwordconf)) {
        const userData = {
          firstname,
          lastname,
          email,
          password,
          role,
          passwordconf,
          companyname,
        };
        const response = await signUp(userData);

        if (response) {
          router.push("/login");
        }
      }
    } catch (err) {
      if (err.response) {
        const { data } = err.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Registration failed: ${data.message}`,
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

  const handleGoogleLoginSuccess = async () => {
    await signIn("google", {
      callbackUrl: `/auth-callback?redirect=${encodeURIComponent(redirectUrl)}`,
    });
  };

  const handleGithubLoginSuccess = async () => {
    await signIn("github", {
      callbackUrl: `/auth-callback?redirect=${encodeURIComponent(redirectUrl)}`,
    });
  };

  const userRoleHandler = (role) => {
    setRole(role);
  };

  return (
    <div className=" relative overflow-hidden bg-cover flex flex-col items-center justify-center h-lvh w-full text-white">
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
      <div className="h-fit md:max-h-[700px] w-[90%] md:w-[60%] max-w-[500px] bg-gradient-to-br from-[#1f2126] to-[#17191d] rounded-lg flex justify-between">
        {/* <div className=" hidden lg:block w-[40%] h-full relative">
          <Image
            src={sideImage}
            alt="side image"
            className=" rounded-tl-lg rounded-bl-lg h-full w-full object-cover"
          />
        </div> */}

        <Tabs
          defaultValue="CANDIDATE"
          className=" w-full py-10 px-14 relative rounded-tr-lg"
          value={role}
          onValueChange={(value) => userRoleHandler(value)}
        >
          <TabsList className=" w-full flex items-center justify-between absolute top-0 left-0 h-12">
            <TabsTrigger
              className="h-10 w-[50%] text-center text-sm cursor-pointer transition-all duration-[1000ms]"
              value="CANDIDATE"
            >
              CANDIDATE
            </TabsTrigger>
            <TabsTrigger
              className="h-10 w-[50%] text-center text-sm cursor-pointer transition-all duration-[1000ms]"
              value="COMPANY"
            >
              COMPANY
            </TabsTrigger>
          </TabsList>
          <TabsContent value="CANDIDATE" className="pb-5">
            <h1 className=" text-2xl font-semibold text-[#f3f3f3] pt-7">
              Sign Up
            </h1>
            <div className=" mt-5 clear-start flex flex-col md:flex-row items-start justify-between">
              <button
                onClick={handleGoogleLoginSuccess}
                className=" w-full md:w-[45%] bg-white h-[45px] text-black font-normal rounded-lg text-sm "
              >
                <FcGoogle className=" mr-2 inline-block text-xl" />
                Sign in with Google
              </button>
              <button
                onClick={handleGithubLoginSuccess}
                className=" w-full mt-6 md:mt-0 md:w-[48%] bg-black h-[45px] text-white font-medium rounded-lg text-sm border-0"
              >
                <FaGithub className=" text-white mr-2 inline-block text-xl" />
                Sign in with Github
              </button>
            </div>
            <div className=" w-full my-2 flex items-center justify-center">
              <hr className="w-[48%] border-[#666666]" />
              <p className=" text-[#666666] text-sm py-4 px-8 overflow-hidden text-center">
                OR
              </p>
              <hr className="w-[45%] border-[#666666]" />
            </div>
            <form
              onSubmit={handleSubmit}
              className=" flex flex-col items-center justify-between mt-5"
            >
              <div
                className={` ${
                  role == "COMPANY"
                    ? " flex items-start justify-between mb-6"
                    : ""
                } w-full`}
              >
                <div
                  className={` ${role == "COMPANY" ? "w-[48%]" : "w-full"}  `}
                >
                  <input
                    type="text"
                    placeholder="Full Name"
                    name="name"
                    value={firstname}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className={` h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 ${
                      role === "COMPANY" ? "" : "mb-6"
                    }`}
                  />
                </div>
                <div
                  className={` ${role == "COMPANY" ? "w-[48%]" : "w-full"}  `}
                >
                  <input
                    type="text"
                    placeholder="Last Name"
                    name="lastname"
                    value={lastname}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className={`h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 ${
                      role === "COMPANY" ? "" : "mb-6"
                    }`}
                  />
                </div>
              </div>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className=" h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 mb-6"
              />
              <div className=" w-full flex items-start justify-between mb-6">
                <div className=" w-[48%] relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onClick={() => setIsValidPassword(false)}
                    required
                    className={` h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 ${
                      isValidPassword ? " border-2 border-lightred" : ""
                    }`}
                  />
                  {showPassword ? (
                    <IoEye
                      onClick={() => setShowPassword(!showPassword)}
                      className=" absolute right-4 top-4 text-[#737883] cursor-pointer"
                    />
                  ) : (
                    <IoEyeOff
                      onClick={() => setShowPassword(!showPassword)}
                      className=" absolute right-4 top-4 text-[#737883] cursor-pointer"
                    />
                  )}
                </div>
                <div className=" w-[48%] relative">
                  <input
                    type={showPasswordConf ? "text" : "password"}
                    placeholder="Confirme Password"
                    name="passwordconf"
                    value={passwordconf}
                    onChange={(e) => setPasswordconf(e.target.value)}
                    onClick={() => {
                      setIsPasswordMissMatch(false);
                    }}
                    required
                    className={` h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] px-6 py-2 appearance-none ${
                      isPasswordMissMatch ? " border-2 border-lightred" : ""
                    }`}
                  />
                  {showPasswordConf ? (
                    <IoEye
                      onClick={() => setShowPasswordConf(!showPasswordConf)}
                      className=" absolute right-4 top-4 text-[#737883] cursor-pointer"
                    />
                  ) : (
                    <IoEyeOff
                      onClick={() => setShowPasswordConf(!showPasswordConf)}
                      className=" absolute right-4 top-4 text-[#737883] cursor-pointer"
                    />
                  )}
                </div>
              </div>
              {isPasswordMissMatch && (
                <span className=" text-lightred text-xs text-left w-full -mt-5">
                  * Passwords do not match.
                </span>
              )}
              {isValidPassword && (
                <span className=" text-lightred text-xs text-left w-full -mt-5">
                  * Password must contain at least one uppercase letter, one
                  lowercase letter, one number, and be at least 6 characters
                  long.
                </span>
              )}
              <div className=" w-full">
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
              <button
                type="submit"
                className=" h-12 min-w-[100%] mt-5 w-full md:w-[40%] cursor-pointer bg-[#6E6ADA] rounded-lg text-center text-base text-white font-semibold"
              >
                Sign Up
              </button>
            </form>
            <div className="mt-5 w-full">
              <p className=" text-[#808080] text-sm text-center ">
                Got an account?{" "}
                <Link
                  href="/login"
                  className="text-[#4285f4] hover:underline cursor-pointer"
                >
                  Sign in
                </Link>{" "}
                here
              </p>
            </div>
          </TabsContent>
          <TabsContent value="COMPANY">
            <h1 className=" text-2xl font-semibold text-[#f3f3f3] pt-7">
              Sign Up
            </h1>
            <form
              onSubmit={handleSubmit}
              className=" flex flex-col items-center justify-between mt-5"
            >
              <div
                className={` ${
                  role == "COMPANY"
                    ? " flex items-start justify-between mb-6"
                    : ""
                } w-full`}
              >
                <div
                  className={` ${role == "COMPANY" ? "w-[48%]" : "w-full"}  `}
                >
                  <input
                    type="text"
                    placeholder="Full Name"
                    name="name"
                    value={firstname}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className={` h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 ${
                      role === "COMPANY" ? "" : "mb-6"
                    }`}
                  />
                </div>
                <div
                  className={` ${role == "COMPANY" ? "w-[48%]" : "w-full"}  `}
                >
                  <input
                    type="text"
                    placeholder="Last Name"
                    name="lastname"
                    value={lastname}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className={`h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 ${
                      role === "COMPANY" ? "" : "mb-6"
                    }`}
                  />
                </div>
              </div>

              <input
                type="text"
                placeholder="Company Name"
                name="companyname"
                value={companyname}
                onChange={(e) => setCompanyName(e.target.value)}
                required={role === "COMPANY"}
                className=" h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 mb-6"
              />

              <input
                type="email"
                placeholder="Email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className=" h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 mb-6"
              />
              <div className=" w-full flex items-start justify-between mb-6">
                <div className=" w-[48%] relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onClick={() => setIsValidPassword(false)}
                    required
                    className={` h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 ${
                      isValidPassword ? " border-2 border-lightred" : ""
                    }`}
                  />
                  {showPassword ? (
                    <IoEye
                      onClick={() => setShowPassword(!showPassword)}
                      className=" absolute right-4 top-4 text-[#737883] cursor-pointer"
                    />
                  ) : (
                    <IoEyeOff
                      onClick={() => setShowPassword(!showPassword)}
                      className=" absolute right-4 top-4 text-[#737883] cursor-pointer"
                    />
                  )}
                </div>
                <div className=" w-[48%] relative">
                  <input
                    type={showPasswordConf ? "text" : "password"}
                    placeholder="Confirme Password"
                    name="passwordconf"
                    value={passwordconf}
                    onChange={(e) => setPasswordconf(e.target.value)}
                    onClick={() => {
                      setIsPasswordMissMatch(false);
                    }}
                    required
                    className={` h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] px-6 py-2 appearance-none ${
                      isPasswordMissMatch ? " border-2 border-lightred" : ""
                    }`}
                  />
                  {showPasswordConf ? (
                    <IoEye
                      onClick={() => setShowPasswordConf(!showPasswordConf)}
                      className=" absolute right-4 top-4 text-[#737883] cursor-pointer"
                    />
                  ) : (
                    <IoEyeOff
                      onClick={() => setShowPasswordConf(!showPasswordConf)}
                      className=" absolute right-4 top-4 text-[#737883] cursor-pointer"
                    />
                  )}
                </div>
              </div>
              {isPasswordMissMatch && (
                <span className=" text-lightred text-xs text-left w-full -mt-5">
                  * Passwords do not match.
                </span>
              )}
              {isValidPassword && (
                <span className=" text-lightred text-xs text-left w-full -mt-5">
                  * Password must contain at least one uppercase letter, one
                  lowercase letter, one number, and be at least 6 characters
                  long.
                </span>
              )}
              <div className=" w-full">
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
              <button
                type="submit"
                className=" h-12 min-w-[100%] mt-5 w-full md:w-[40%] cursor-pointer bg-[#6E6ADA] rounded-lg text-center text-base text-white font-semibold"
              >
                Sign Up
              </button>
            </form>
            <div className="mt-5 w-full">
              <p className=" text-[#808080] text-sm text-center">
                Got an account?{" "}
                <Link
                  href="/login"
                  className="text-[#4285f4] hover:underline cursor-pointer"
                >
                  Sign in
                </Link>{" "}
                here
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RegisterPage;
