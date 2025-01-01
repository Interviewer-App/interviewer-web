"use client";
import Image from "next/image";
import Link from "next/link";
import bgGrid from "../assets/grid-bg.svg";
import bgGrain from "../assets/grain-bg.svg";
import bgblur from "../assets/grain-blur.svg";

import { BiLike } from "react-icons/bi";
import { FaAward } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";

import PremiuCard from "../components/home/premiumCard";
import { useState } from "react";
import "./globals.css";

export default function Home() {
  const [duration, setDuration] = useState("MONTHLY");
  const premiumDetails = [
    {
      type: "Starter",
      icon: <BiLike className=" text-white text-xl" />,
      priceM: "0",
      priceY: "0",
      description:
        "Ideal for individuals who want to get started with simple design tasks.",
      features: [
        "1 workspace",
        "Limited collaboration",
        "Export to PNG and SVG",
      ],
    },
    {
      type: "Pro",
      icon: <FaAward className=" text-white text-xl" />,
      priceM: "50",
      priceY: "500",
      description:
        "Enhanced design tools for scaling teams who need more flexibility.",
      features: [
        "Integrations",
        "Unlimited workspaces",
        "Advanced editing tools",
        "Everything in Starter",
      ],
    },
    {
      type: "Advanced",
      icon: <FaStar className=" text-white text-xl" />,
      priceM: "85",
      priceY: "850",
      description:
        "Powerful tools designed for extensive collaboration and customization.",
      features: [
        "Single sign on (SSO)",
        "Advanced version control",
        "Assets library",
        "Guest accounts",
        "Everything in Pro",
      ],
    },
  ];

  return (
    <div className=" w-full">
      <Image
        src={bgGrid}
        alt="bg"
        className=" absolute w-full top-0 left-0 -z-10 "
      />
      <Image
        src={bgGrain}
        alt="bg"
        className=" absolute w-full h-lvh top-0 left-0 -z-10 "
      />
      <Image
        src={bgblur}
        alt="bg"
        className=" absolute w-full h-[130vh] top-0 left-0 -z-10"
      />
      <header className=" w-full ">
        <div className=" w-[90%] md:w-4/5 flex items-center justify-between py-6 mx-auto">
          <div>
            <h1 className=" text-base md:text-xl font-semibold ">
              INTERVIWER WEB
            </h1>
          </div>
          <div>
            <Link href="/login">
              <button className=" bg-white/15 py-2 md:py-3 px-5 md:px-8 rounded-xl mr-1 md:mr-3 text-sm md:text-base font-medium">
                Sign In
              </button>
            </Link>
            <Link href="/register">
              <button className=" bg-white/15 py-2 md:py-3 px-5 md:px-8 rounded-xl text-sm md:text-base font-medium">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </header>
      <div className=" mt-16 w-[90%] mx-auto">
        <h1 className=" text-[48px] leading-[48px] md:text-[80px] md:leading-[80px] font-semibold text-center">
          Smart interview tools.
          <br />
          Effortless hiring.
        </h1>
        <p className=" text-[18px] leading-[27px] text-center pt-9 md:text-[20px] md:leading-[30px]">
          Solutions for every team — from small businesses to large enterprises.
        </p>
        <div className=" flex items-center w-fit p-2 rounded-xl justify-center mx-auto bg-black mt-10">
          <button
            onClick={() => setDuration("MONTHLY")}
            className={`${
              duration === "MONTHLY" ? "bg-white/10" : ""
            } py-3 px-8 rounded-xl text-base font-medium mr-2`}
          >
            Monthly
          </button>
          <button
            onClick={() => setDuration("ANNUALY")}
            className={` ${
              duration === "ANNUALY" ? "bg-white/10" : ""
            } py-3 px-8 rounded-xl text-base font-medium`}
          >
            Annual
          </button>
        </div>
      </div>
      <div className="isolate mx-auto grid grid-cols-1 gap-8 lg:grid-cols-3 mt-10 w-4/5 place-items-center">
        {premiumDetails.map((detail) => (
          <PremiuCard
            key={detail.type}
            type={detail.type}
            icon={detail.icon}
            priceM={detail.priceM}
            priceY={detail.priceY}
            description={detail.description}
            features={detail.features}
            duration={duration}
          />
        ))}
      </div>

      <div className=" w-4/5 mx-auto mt-20">
        <h1 className=" text-center">Built with</h1>
        <div className=" flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-28 mt-10">
          <Image
            alt="Tailwind logo"
            loading="lazy"
            width="137"
            height="32"
            decoding="async"
            data-nimg="1"
            style="color:transparent"
            src="https://paddle-billing.vercel.app/assets/icons/logo/tailwind-logo.svg"
          />
          <Image
            alt="Next logo"
            loading="lazy"
            width="137"
            height="32"
            decoding="async"
            data-nimg="1"
            style="color:transparent"
            src="https://paddle-billing.vercel.app/assets/icons/logo/nextjs-logo.svg"
          />
          <Image
            alt="Shadcn logo"
            loading="lazy"
            width="137"
            height="35"
            decoding="async"
            data-nimg="1"
            style="color:transparent"
            src="https://paddle-billing.vercel.app/assets/icons/logo/shadcn-logo.svg"
          />
        </div>
      </div>

      <div className=" w-full text-center">
        <div className=" w-[80%] mx-auto mt-20 mb-9">
          <hr className=" opacity-15 mb-5" />
          <span className=" text-sm text-center w-full">
            Design by <span className=" text-sm font-semibold">Coullax</span>
          </span>
          <br />
          <span className=" text-xs text-center inline-block">
            Terms and conditions <FiArrowUpRight className=" inline-block mr-2" /> 
            <span>
              Privacy <FiArrowUpRight className=" inline-block" />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
