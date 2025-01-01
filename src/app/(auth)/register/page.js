"use client";
import React, { useState } from "react";
import { register } from "@/lib/api/authentication";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { signIn } from "next-auth/react";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordconf, setPasswordconf] = useState("");
  const [role, setRole] = useState("CANDIDATE");
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
        const userData = { name, email, password, role, passwordconf };
        const response = await register(userData);

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
      callbackUrl: "/login",
    });
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
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className=" h-[52px] w-full rounded-full text-base border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 mt-8"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className=" h-[52px] w-full rounded-full text-base border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 mt-6"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onClick={() => setIsValidPassword(false)}
            required
            className={` h-[52px] w-full rounded-full text-base border-0 bg-[#32353b] placeholder-[#737883] px-6 py-2 mt-6 ${
              isValidPassword ? " border-2 border-lightred" : ""
            }`}
          />
          {isValidPassword && (
            <span className=" text-lightred text-xs text-left w-full pt-1">
              * Password must contain at least one uppercase letter, one
              lowercase letter, one number, and be at least 6 characters long.
            </span>
          )}
          <input
            type="password"
            placeholder="Confirme Password"
            value={passwordconf}
            onChange={(e) => setPasswordconf(e.target.value)}
            onClick={() => {
              setIsPasswordMissMatch(false);
            }}
            required
            className={` h-[52px] w-full rounded-full text-base border-0 bg-[#32353b] px-6 py-2 mt-6 appearance-none ${
              isPasswordMissMatch ? " border-2 border-lightred" : ""
            }`}
          />
          {isPasswordMissMatch && (
            <span className=" text-lightred text-xs text-left w-full pt-1">
              * Passwords do not match.
            </span>
          )}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className=" h-[52px] w-full rounded-full text-base border-0 bg-[#32353b] px-6 py-2 mt-6 appearance-none"
          >
            <option value="CANDIDATE">Candidate</option>
            <option value="COMPANY">Company</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button
            type="submit"
            className=" h-12 min-w-[150px] w-[50%] md:w-[40%] cursor-pointer bg-gradient-to-b from-lightred to-darkred rounded-full text-center text-base text-white font-semibold mt-8"
          >
            Register
          </button>
        </form>
        <div className=" flex items-center justify-center mt-3">
          <img
            src='https://th.bing.com/th/id/R.0fa3fe04edf6c0202970f2088edea9e7?rik=joOK76LOMJlBPw&riu=http%3a%2f%2fpluspng.com%2fimg-png%2fgoogle-logo-png-open-2000.png&ehk=0PJJlqaIxYmJ9eOIp9mYVPA4KwkGo5Zob552JPltDMw%3d&risl=&pid=ImgRaw&r=0'
            alt="google logo"
            onClick={handleLoginSuccess}
            className=" rounded-lg h-8 w-8"
          />
        </div>
        <div className="mt-6">
          <p className=" text-[#808080] text-base text-center">
            Got an account?{" "}
            <Link
              href="/login"
              className="text-[#4285f4] underline cursor-pointer"
            >
              Sign in
            </Link>{" "}
            here
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
