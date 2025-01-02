"use client";
import Link from "next/link";
import React, { useState } from "react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  return (
    <div className=" bg-background flex flex-col items-center justify-center h-lvh w-full">
      <div className="h-fit max-h-[670px] max-w-[600px] w-[90%] md:w-[50%] bg-gradient-to-br from-[#1f2126] to-[#17191d] rounded-lg p-14">
        <h1 className=" text-xl md:text-2xl lg:text-3xl font-semibold text-[#f3f3f3]">
          Forgot your password?
        </h1>
        <p className=" text-sm md:text-base text-neutral-500 pt-3 pb-8 ">
          Don't fret! Just type in your email and we will send you a code to
          reset your password!
        </p>
        <form className=" w-full">
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
            <Link href="/reset-password">
              <button
                type="submit"
                className=" h-12 min-w-[170px] w-full md:w-[40%] cursor-pointer bg-gradient-to-b from-lightred to-darkred rounded-lg text-center text-base text-white font-semibold"
              >
                Reset Password
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
