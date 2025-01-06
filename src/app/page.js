"use client";
import Image from "next/image";
import Link from "next/link";
import bgGrid from "../assets/grid-bg.svg";
import bgGrain from "../assets/grain-bg.svg";
import bgblur from "../assets/grain-blur.svg";
import AiImage from "../assets/landing/aiImage.jpg";
import BgRound from "../assets/landing/bground.png";
import BgSquare from "../assets/landing/bgsquare.png";
import BgTrangel from "../assets/landing/bgtrangel.png";
import google from "../assets/landing/google.png";
import spotify from "../assets/landing/spotify.png";
import samsung from "../assets/landing/samsung.png";
import dropbox from "../assets/landing/dropbox.png";
import airbnb from "../assets/landing/airbnb.png";

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
      id: 1,
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
      id: 2,
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
      id: 3,
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
      {/* landing screen */}
      <div className=" w-full text-white bg-[#785DFB]">
        <header className=" w-full ">
          <div className=" w-[90%] max-w-[1500px] flex items-center justify-between py-6 mx-auto">
            <div>
              <h1 className=" text-base md:text-xl font-semibold ">
                INTERVIWER WEB
              </h1>
            </div>
            <div>
              <Link href="/login">
                <button className=" bg-[#2e2850]/80 py-2 md:py-3 px-5 md:px-8 rounded-lg mr-1 md:mr-3 text-sm md:text-base font-medium">
                  Sign In
                </button>
              </Link>
              <Link href="/register">
                <button className=" bg-[#2e2850]/80 py-2 md:py-3 px-5 md:px-8 rounded-lg text-sm md:text-base font-medium">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </header>
        <div className=" flex flex-col lg:flex-row items-center justify-between w-full md:w-[90%] max-w-[1500px] mx-auto py-9 md:py-24">
          <div className=" w-[90%] lg:w-[40%]">
            <h1 className="text-[42px] leading-[42px] md:text-[65px] md:leading-[65px] font-semibold">
              Effortless hiring with smart interview tools.
            </h1>
            <p className=" text-base pt-6 md:pt-9 md:text-[20px] md:leading-[30px]">
              Providing solutions for every team, from small businesses to large
              enterprises, to streamline operations effortlessly.
            </p>
            <Link href="/register">
              <button className="bg-[#2e2850]/80 py-2 md:py-4 px-5 md:px-8 rounded-lg text-sm md:text-base font-medium mt-5 lg:mt-10">
                Get Started Now
              </button>
            </Link>
          </div>
          <div className=" w-[90%] mt-9 md:mt-8 lg:mt-0 lg:w-[55%] shadow-black rounded-lg">
            <Image src={AiImage} alt="bg" className=" w-full rounded-lg" />
          </div>
        </div>
        <h1 className=" w-full text-center text-2xl font-semibold">
          Trusted by these companies
        </h1>
        <div className=" w-[90%] max-w-[1500px] grid place-items-center place-content-center mx-auto lg:grid-cols-5 md:grid-cols-2 sm:grid-cols-1 mt-10 pb-16">
          <Image
            alt="Google logo"
            loading="lazy"
            width="130"
            height="32"
            decoding="async"
            data-nimg="1"
            style="color:transparent"
            src={google}
            className=" mt-5 md:mt-0"
          />
          <Image
            alt="Spotify logo"
            loading="lazy"
            width="170"
            height="38"
            decoding="async"
            data-nimg="1"
            style="color:transparent"
            src={spotify}
            className=" mt-5 md:mt-0"
          />
          <Image
            alt="Samsung logo"
            loading="lazy"
            width="137"
            height="35"
            decoding="async"
            data-nimg="1"
            style="color:transparent"
            src={samsung}
            className=" mt-5 md:mt-0"
          />
          <Image
            alt="Dropbox logo"
            loading="lazy"
            width="160"
            height="35"
            decoding="async"
            data-nimg="1"
            style="color:transparent"
            src={dropbox}
            className=" mt-5 md:mt-0"
          />
          <Image
            alt="Shadcn logo"
            loading="lazy"
            width="137"
            height="35"
            decoding="async"
            data-nimg="1"
            style="color:transparent"
            src={airbnb}
            className=" mt-5 md:mt-0"
          />
        </div>
      </div>

      {/* why this product */}
      <div className=" w-full bg-cover relative text-white overflow-hidden">
        <div className=" absolute inset-0 bg-background -z-20"></div>
        <Image
          src={bgGrid}
          alt="bg"
          className=" absolute w-full top-0 left-0 -z-10 "
        />
        <div className=" mt-16 w-[90%] max-w-[1500px] mx-auto">
          <p className=" text-center uppercase text-gray-500 font-semibold text-xl pb-5 md:py-8">
            Why this product
          </p>
          <h1 className=" text-[48px] leading-[48px] md:text-[60px] md:leading-[60px] w-[90%] md:w-[70%] mx-auto text-[#785DFB] font-semibold text-center">
            This header tells people why they should use it
          </h1>
        </div>
        <div className=" my-16 w-[90%] max-w-[1500px]  mx-auto grid grid-cols-1 gap-8 lg:grid-cols-3 place-items-center">
          <div className=" bg-slate-500/10 rounded-lg">
            <div className="">
              <Image src={BgRound} alt="bg" className=" w-full rounded-lg " />
            </div>
            <div className=" p-9 ">
              <h1 className=" text-4xl font-semibold ">Candidates</h1>
              <p className=" text-lg text-gray-500 py-4">
                This is text describing why people should use your product.
                Double-click anywhere on the text to edit it's contents.
              </p>
            </div>
          </div>
          <div className=" bg-slate-500/10 rounded-lg">
            <div className="">
              <Image src={BgSquare} alt="bg" className=" w-full rounded-lg " />
            </div>
            <div className=" p-9 ">
              <h1 className=" text-4xl font-semibold ">Companies</h1>
              <p className=" text-lg text-gray-500 py-4">
                This is text describing why people should use your product.
                Double-click anywhere on the text to edit it's contents.
              </p>
            </div>
          </div>
          <div className=" bg-slate-500/10 rounded-lg">
            <div className="">
              <Image src={BgTrangel} alt="bg" className=" w-full rounded-lg " />
            </div>
            <div className=" p-9 ">
              <h1 className=" text-4xl font-semibold ">Entrepreneurs</h1>
              <p className=" text-lg text-gray-500 py-4">
                This is text describing why people should use your product.
                Double-click anywhere on the text to edit it's contents.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className=" relative w-full text-white  overflow-hidden">
        <div className="absolute inset-0 bg-background -z-20"></div>
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
        <div className=" mt-16 w-[90%] max-w-[1500px] mx-auto">
          <p className=" text-center uppercase text-gray-500 font-semibold text-xl pb-5 md:py-8">
            Pricing
          </p>
          <h1 className=" text-[48px] leading-[48px] md:text-[60px] md:leading-[60px] w-[90%] md:w-[70%] mx-auto text-[#785DFB] font-semibold text-center">
            This header tells people about early access pricing
          </h1>
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
        <div className="isolate mx-auto grid grid-cols-1 gap-8 lg:grid-cols-3 mt-10 w-4/5 max-w-[1500px] place-items-center">
          {premiumDetails.map((detail) => (
            <PremiuCard
              key={detail.id}
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
              Terms and conditions{" "}
              <FiArrowUpRight className=" inline-block mr-2" />
              <span>
                Privacy <FiArrowUpRight className=" inline-block" />
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
