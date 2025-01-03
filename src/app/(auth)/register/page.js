"use client";
import React, { useState } from "react";
import { signUp } from "@/lib/api/authentication";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { signIn } from "next-auth/react";

//assets
import sideImage from "@/assets/register/register-side-image.jpg";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

const RegisterPage = () => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordconf, setPasswordconf] = useState("");
  const [role, setRole] = useState("CANDIDATE");
  const [companyname, setCompanyName] = useState("");
  const router = useRouter();

  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isPasswordMissMatch, setIsPasswordMissMatch] = useState(false);

  const passwordValidation = (password, passwordconf) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

    if (password !== passwordconf) {
      setIsPasswordMissMatch(true);
      return false;
    }

    if (passwordRegex.test(password) && password.length >= 6) {
      setIsPasswordMissMatch(false);
      setIsValidPassword(false);
      return true;
    }

    setIsValidPassword(true);
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

        // Log in the user after successful registration
        // login({ email: response.email, role: response.role, token: response.token });

        // // Redirect based on role
        // if (response.role === 'ADMIN') {
        //   router.push('/admin/dashboard');
        // } else {
        //   router.push('/candidate/dashboard');
        // }
        // Call your registration API
      }
    } catch (err) {
      if (err.response) {
        const { data } = err.response;

        if (data && data.message) {
          alert(`Registration failed: ${data.message}`);
        } else {
          alert("An unexpected error occurred. Please try again.");
        }
      } else {
        alert(
          "An unexpected error occurred. Please check your network and try again."
        );
      }
    }
  };

  const handleLoginSuccess = async () => {
    await signIn("google", {
      // callbackUrl: `${
      //   window.location.origin
      // }/auth-callback?redirect=${encodeURIComponent(redirects)}`,
      callbackUrl: "/panel",
    });
  };

  const userRoleHandler = (role) => {
    setRole(role);
  };

  return (
    <div className=" bg-background flex flex-col items-center justify-center h-lvh w-full">
      <div className="h-fit md:max-h-[670px] w-[90%] md:w-[50%] lg:w-[70%] lg:max-w-[1000px] bg-gradient-to-br from-[#1f2126] to-[#17191d] rounded-lg flex justify-between">
        <div className=" hidden lg:block w-[40%] h-full relative">
          <Image
            src={sideImage}
            alt="side image"
            className=" rounded-tl-lg rounded-bl-lg h-full w-full object-cover"
          />
        </div>
        <div className=" w-full lg:w-[60%] py-10 px-14 relative rounded-tr-lg">
          <div className=" w-full flex items-center justify-between absolute top-0 left-0">
            <div
              onClick={() => userRoleHandler("CANDIDATE")}
              className={` ${
                role === "CANDIDATE"
                  ? "bg-gradient-to-b from-lightred to-darkred"
                  : "bg-slate-400/10"
              } rounded-b-lg p-3 md:p-4 w-[50%] text-center text-sm cursor-pointer transition-all duration-[1000ms]`}
            >
              Candidate
            </div>
            <div
              onClick={() => userRoleHandler("COMPANY")}
              className={` ${
                role === "COMPANY"
                  ? "bg-gradient-to-b from-lightred to-darkred"
                  : "bg-slate-400/10"
              } rounded-b-lg rounded-tr-lg p-3 md:p-4 w-[50%] text-center text-sm cursor-pointer transition-colors duration-[1000ms]`}
            >
              Company
            </div>
          </div>
          <h1 className=" text-2xl font-semibold text-[#f3f3f3] pt-7">
            Sign Up
          </h1>
          <div className=" mt-5 clear-start flex flex-col md:flex-row items-start justify-between">
            <button
              onClick={handleLoginSuccess}
              className=" w-full md:w-[45%] bg-white h-[45px] text-black font-normal rounded-lg text-sm "
            >
              <FcGoogle className=" mr-2 inline-block text-xl" />
              Sign in with Google
            </button>
            <button className=" w-full mt-6 md:mt-0 md:w-[48%] bg-black h-[45px] text-white font-medium rounded-lg text-sm border-0">
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
            className=" flex flex-col items-center justify-between"
          >
            <div
              className={` ${
                role == "COMPANY"
                  ? " flex items-start justify-between mb-6"
                  : ""
              } w-full`}
            >
              <div className={` ${role == "COMPANY" ? "w-[48%]" : "w-full"}  `}>
                <input
                  type="text"
                  placeholder="Full Name"
                  name="name"
                  value={firstname}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className={` h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 ${role === "COMPANY"? '' : 'mb-6'}`}
                />
              </div>
              <div className={` ${role == "COMPANY" ? "w-[48%]" : "w-full"}  `}>
                <input
                  type="text"
                  placeholder="Last Name"
                  name="lastname"
                  value={lastname}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className={`h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 ${role === "COMPANY"? '' : 'mb-6'}`}
                />
              </div>
            </div>
            {role === "COMPANY" && (
              <input
                type="text"
                placeholder="Company Name"
                name="companyname"
                value={companyname}
                onChange={(e) => setCompanyName(e.target.value)}
                required={role === "COMPANY"}
                className=" h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 mb-6"
              />
            )}
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
              <div className=" w-[48%]">
                <input
                  type="password"
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
              </div>
              <div className=" w-[48%]">
                <input
                  type="password"
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
              </div>
            </div>
            {isPasswordMissMatch && (
              <span className=" text-lightred text-xs text-left w-full pt-1">
                * Passwords do not match.
              </span>
            )}
            {isValidPassword && (
              <span className=" text-lightred text-xs text-left w-full pt-1">
                * Password must contain at least one uppercase letter, one
                lowercase letter, one number, and be at least 6 characters long.
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
                className=" h-12 min-w-[150px] mt-5 w-full md:w-[40%] cursor-pointer bg-gradient-to-b from-lightred to-darkred rounded-lg text-center text-base text-white font-semibold"
              >
                Register
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
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
