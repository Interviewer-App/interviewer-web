"use client";

import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import Link from "next/link";

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className=" bg-background flex flex-col items-center justify-center h-lvh w-full">
      <div className="h-fit w-[90%] md:w[50%] lg:w-[40%] max-w-[450px] bg-gradient-to-br from-[#1f2126] to-[#17191d] p-5 sm:p-7 md:p-8 rounded-3xl flex flex-col justify-center">
        <h1 className=" text-2xl font-semibold text-[#f3f3f3]">Sign In</h1>
        <form
          onSubmit={handleSubmit}
          className=" flex flex-col items-center justify-between"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className=" h-[52px] w-full rounded-full text-base border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 mt-8"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className=" h-[52px] w-full rounded-full text-base border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 mt-8"
          />
          <button
            type="submit"
            className=" h-12 min-w-[150px] w-[50%] md:w-[40%] cursor-pointer bg-gradient-to-b from-lightred to-darkred rounded-full text-center text-base text-white font-semibold mt-8"
          >
            Sign In
          </button>
        </form>
        <div className="mt-8">
          <p className=" text-[#808080] text-base text-center">
            Not a member yet?{" "}
            <Link
              href="/register"
              className="text-[#4285f4] underline cursor-pointer"
            >
              Sign up
            </Link>{" "}
            here
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
