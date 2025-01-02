"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

//assets
import sideImage from "@/assets/reset-password/reset-password.jpg";

const ResetPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordconf, setPasswordconf] = useState("");

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
    passwordValidation(password, passwordconf);
  };

  return (
    <div className=" bg-background flex flex-col items-center justify-center h-lvh w-full">
      <div className="h-fit md:max-h-[600px] w-[90%] md:w-[50%] lg:w-[70%] lg:max-w-[1000px] bg-gradient-to-br from-[#1f2126] to-[#17191d] rounded-lg flex justify-between">
        <div className=" hidden lg:block w-[40%] h-full relative">
          <Image
            src={sideImage}
            alt="side image"
            className=" rounded-tl-lg rounded-bl-lg h-full w-full object-cover"
          />
        </div>
        <div className=" w-full lg:w-[60%] py-10 px-14 relative rounded-tr-lg">
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
                className=" h-12 mt-5 min-w-[150px] w-full md:w-[40%] cursor-pointer bg-gradient-to-b from-lightred to-darkred rounded-lg text-center text-base text-white font-semibold"
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
