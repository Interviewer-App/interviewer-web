"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

//assets
import sideImage from "@/assets/reset-password/reset-password.jpg";
import bgGrid from "@/assets/grid-bg.svg";
import bgGrain from "@/assets/grain-bg.svg";

//icons
import { IoEye, IoEyeOff } from "react-icons/io5";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordconf, setPasswordconf] = useState("");

  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isPasswordMissMatch, setIsPasswordMissMatch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConf, setShowPasswordConf] = useState(false);

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
    passwordValidation(password, passwordconf);
  };

  return (
    <div className=" bg-cover overflow-hidden relative flex flex-col items-center justify-center h-lvh w-full text-white">
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
      <div className="h-fit md:max-h-[600px] w-[90%] md:w-[60%] lg:max-w-[500px] bg-gradient-to-br from-[#1f2126] to-[#17191d] rounded-lg flex justify-between">
        <div className=" w-full py-10 px-14 relative rounded-tr-lg">
          <h1 className=" text-xl md:text-2xl lg:text-3xl font-semibold text-[#f3f3f3] pt-5">
            Reset your password
          </h1>

          <form
            onSubmit={handleSubmit}
            className=" flex flex-col items-center justify-between mt-8"
          >
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
              className=" h-[45px] w-full rounded-lg text-sm border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2"
            />

            <label
              htmlFor="password"
              className=" text-left text-sm w-full mb-2 mt-5"
            >
              Your Password
            </label>
            <div className=" w-full relative">
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
            {isValidPassword && (
              <span className=" text-lightred text-xs text-left w-full pt-1">
                * Password must contain at least one uppercase letter, one
                lowercase letter, one number, and be at least 6 characters long.
              </span>
            )}

            <label
              htmlFor="passwordconf"
              className=" text-left text-sm w-full mb-2 mt-5"
            >
              Confirme Password
            </label>
            <div className=" w-full relative">
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
            {isPasswordMissMatch && (
              <span className=" text-lightred text-xs text-left w-full pt-1">
                * Passwords do not match.
              </span>
            )}
            <div className="mt-8 w-full">
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
              className=" h-12 mt-5 min-w-[150px] w-full md:w-[40%] cursor-pointer rounded-lg text-center text-sm text-black bg-white font-semibold"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
