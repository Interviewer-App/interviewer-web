"use client";
import Image from "next/image";
import Link from "next/link";
import bgGrid from "../assets/grid-bg.svg";
import bgGrain from "../assets/grain-bg.svg";
import bgblur from "../assets/grain-blur.svg";
import BgRound from "../assets/landing/bground.png";
import BgSquare from "../assets/landing/bgsquare.png";
import BgTrangel from "../assets/landing/bgtrangel.png";
import google from "../assets/landing/google.png";
import spotify from "../assets/landing/spotify.png";
import samsung from "../assets/landing/samsung.png";
import dropbox from "../assets/landing/dropbox.png";
import airbnb from "../assets/landing/airbnb.png";
import logo from "../assets/landing_page/logo.png";
import { BiLike } from "react-icons/bi";
import { FaAward } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";

import PremiuCard from "../components/home/premiumCard";
import { useEffect, useRef, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Matter from 'matter-js';
import MatterCircleStack from "@/components/MatterCircleStack";
import { motion } from "framer-motion";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const [duration, setDuration] = useState("MONTHLY");
  const [clicked, setClicked] = useState(false);


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


  const features = [
    { title: "Streamlined Interviews", desc: "Simplify your hiring process from start to finish." },
    { title: "Real-World Scenarios", desc: "Test skills in action, not just on paper." },
    { title: "Data-Driven Decisions", desc: "Make every hire backed by real data and clear insights." },
    { title: "Collaborative Feedback", desc: "Gather insights from your team." },
    { title: "Faster Hiring Process", desc: "Speed up your hiring without sacrificing quality." },
    { title: "AI-Powered Assessments", desc: "Smart assessments that see skills beyond the resume." },
    { title: "Unbiased Insights", desc: "Fair, data-driven evaluations — no bias, just talent." },
    { title: "Enhanced Experience", desc: "Streamlined communication." },
  ];

  const items = [
    { icon: "🎓", title: "Candidates" },
    { icon: "🏢", title: "Companies" },
    { icon: "💼", title: "Entrepreneurs" },
  ];


  const handleAuthentication = async () => {
    if (status === "authenticated") {
      const token = localStorage.getItem('accessToken');
      const session = await getSession();
      const userRole = session?.user?.role;
      if (userRole === 'COMPANY') {
        router.push('/interviews');
      } else if (userRole === 'CANDIDATE') {
        router.push('/my-interviews');
      } else if (userRole === 'ADMIN') {
        router.push('/users');
      } else {
        router.push('/');
      }

    }
  }

  return (
    <div className=" w-full">
      <div className=" w-full text-black bg-[#fff]">

        <header className=" w-full ">
          <div className=" w-[90%] max-w-[1500px] flex items-center justify-between py-[3rem] mx-auto">
            <div>
              <Image
                src='/landing_page/logo.png'
                alt="logo"
                width="422"
                height="56" />
            </div>
          </div>
        </header>


        {/* <div className=" flex flex-col lg:flex-row items-start justify-between w-full md:w-[90%] max-w-[1500px] mx-auto gap-12"> */}
        <div className=" grid grid-cols-1 md:grid-cols-2 w-[90%] md:w-[90%] max-w-[1500px] mx-auto gap-12">
          <div className=" flex flex-col justify-start items-start border-black border-2 px-[3rem] py-[3rem] bg-black">
            <h1 className="font-bohemian-soul text-start leading-[52px] text-[45px] md:leading-[52px] font-bold text-white">
              Find the Right Talent <br /> Without the Runaround
            </h1>
            <p className="text-base text-start pt-6 md:pt-9 text-[17px] leading-[23px] text-white font-puls">
              Skillchecker takes the guesswork out of hiring. Our AI-driven <br />
              interview platform evaluates real-world skills with precision, <br />
              giving you fast, unbiased, and data-backed insights — so you <br />
              can make confident hiring decisions every time
            </p>
            <div className="flex gap-6">
              <button onClick={handleAuthentication} className="bg-[#FFC400] text-black py-[20px] px-[20px] text-[14px]  mt-[52px] font-bold">
                Request a Demo
              </button>
              <button onClick={handleAuthentication} className="bg-[#000] relative text-white py-[20px] px-[20px] text-[14px] font-bold mt-[52px] border-2 border-white ">
                Contact us now
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>

          <div className=" flex min-h-[400px] flex-col justify-start items-start border-black border-2">
            <MatterCircleStack />
          </div>
        </div>

        {/* <div className="flex items-center justify-center h-screen bg-gray-900">
      <motion.div
        className="text-4xl cursor-pointer"
        onClick={() => setClicked(!clicked)}
        animate={{
          x: clicked ? [0, 80, -50, 120, 200] : [200, 120, -50, 80, 0],
          y: clicked ? [0, -40, 30, -20, 0] : [0, -20, 30, -40, 0],
          rotate: clicked ? [0, 15, -15, 10, 0] : [0, -10, 15, -15, 0],
        }}
        transition={{
          duration: 1.8,
          ease: [0.33, 1, 0.68, 1], // Smooth bezier curve easing
        }}
      >
        🌟
      </motion.div>
    </div> */}

        {/* <div className=" flex flex-col lg:flex-row items-center justify-between w-full md:w-[90%] max-w-[1500px] mx-auto py-9 md:py-24">
          <div className=" w-[70%] flex flex-col justify-start items-start">
            <h1 className=" text-start text-[42px] leading-[42px] md:text-[80px] md:leading-[86px] font-jakarta font-bold">
              Find the <span className="text-[#D41414]">Right Talent</span> Without the Runaround
            </h1>
            <p className=" text-base text-start pt-6 md:pt-9 md:text-[24px] md:leading-[40px]">
              Skillchecker takes the guesswork out of hiring. Our AI-driven interview platform <br />
              evaluates real-world skills with precision, giving you fast, unbiased, and data-<br /> backed insights — so you can make confident hiring decisions every time
            </p>
            <div className="flex gap-6">
              <button onClick={handleAuthentication} className="bg-[#D41414] text-white py-2 md:py-4 px-5 md:px-8 rounded-full text-sm md:text-base font-medium mt-5 lg:mt-10">
                Request a Demo
              </button>
              <button onClick={handleAuthentication} className="bg-[#000] text-white py-2 md:py-4 px-5 md:px-8 rounded-full text-sm md:text-base font-medium mt-5 lg:mt-10">
                Get Started
              </button>
            </div>

          </div>

        </div> */}
        {/* <div className=" w-[90%] max-w-[1500px] grid place-items-center place-content-center mx-auto lg:grid-cols-5 md:grid-cols-2 sm:grid-cols-1 mt-10 pb-16">
          <Image
            alt="Google logo"
            loading="lazy"
            width="130"
            height="32"
            decoding="async"
            data-nimg="1"
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
            src={airbnb}
            className=" mt-5 md:mt-0"
          />
        </div> */}
      </div>


      {/* <div className=" w-full bg-[#fff] relative text-white overflow-hidden">
        <div className=" w-[90%] max-w-[1500px] mx-auto mt-[3rem]">
          <h1 className=" text-start text-black font-bold text-[25px] pb-5 ">
            We got what you looking for
          </h1>

        </div>
        <div className="w-[90%] max-w-[1500px] mx-auto flex flex-wrap gap-4 py-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className="py-5 px-2 border-2 border-black rounded-lg "
            >
              <h3 className="font-semibold text-lg text-black">{feature.title}</h3>
              <p className="text-gray-600 mt-1">{feature.desc}</p>
            </div>
          ))}
        </div>

      </div> */}


      <div className=" w-full bg-[#fff] relative text-white overflow-hidden">
        <div className=" w-[90%] max-w-[1500px] mx-auto mt-[3rem]">
          <h1 className=" text-start text-black font-bold text-[25px] pb-5 ">
            We got what you looking for
          </h1>

        </div>
        <div className="w-[90%] max-w-[1500px] mx-auto flex flex-wrap gap-4 py-2">
          <div className="slider">
            <div className="slide-track flex gap-6">
              <div className="slide">
                <div className="py-5 px-2 border-2 border-black rounded-lg ">
                  <h3 className="font-semibold text-lg text-black">Streamlined Interviews</h3>
                  <p className="text-gray-600 mt-1">Simplify your hiring process from start to finish.</p>
                </div>
              </div>
              <div className="slide">
                <div className="py-5 px-2 border-2 border-black rounded-lg ">
                  <h3 className="font-semibold text-lg text-black">Real-World Scenarios </h3>
                  <p className="text-gray-600 mt-1">Test skills in action, not just on paper.</p>
                </div>
              </div>
              <div className="slide">
                <div className="py-5 px-2 border-2 border-black rounded-lg ">
                  <h3 className="font-semibold text-lg text-black">Data-Driven Decisions</h3>
                  <p className="text-gray-600 mt-1">Make every hire backed by real data and clear insights.</p>
                </div>
              </div>
              <div className="slide">
                <div className="py-5 px-2 border-2 border-black rounded-lg ">
                  <h3 className="font-semibold text-lg text-black">Collaborative Feedback
                  </h3>
                  <p className="text-gray-600 mt-1">Gather insights from your team.</p>
                </div>
              </div>

              <div className="slide">
                <div className="py-5 px-2 border-2 border-black rounded-lg ">
                  <h3 className="font-semibold text-lg text-black">Streamlined Interviews</h3>
                  <p className="text-gray-600 mt-1">Simplify your hiring process from start to finish.</p>
                </div>
              </div>
              <div className="slide">
                <div
                  className="py-5 px-2 border-2 border-black rounded-lg "
                >
                  <h3 className="font-semibold text-lg text-black">Real-World Scenarios </h3>
                  <p className="text-gray-600 mt-1">Test skills in action, not just on paper.</p>
                </div>
              </div>
              <div className="slide">
                <div
                  className="py-5 px-2 border-2 border-black rounded-lg "
                >
                  <h3 className="font-semibold text-lg text-black">Data-Driven Decisions</h3>
                  <p className="text-gray-600 mt-1">Make every hire backed by real data and clear insights.</p>
                </div>
              </div>
              <div className="slide">
                <div
                  className="py-5 px-2 border-2 border-black rounded-lg "
                >
                  <h3 className="font-semibold text-lg text-black">Collaborative Feedback
                  </h3>
                  <p className="text-gray-600 mt-1">Gather insights from your team.</p>
                </div>
              </div>

              <div className="slide">
                <div
                  className="py-5 px-2 border-2 border-black rounded-lg "
                >
                  <h3 className="font-semibold text-lg text-black">Streamlined Interviews</h3>
                  <p className="text-gray-600 mt-1">Simplify your hiring process from start to finish.</p>
                </div>
              </div>

            </div>
          </div>

          <div className="slider">
            <div className="slide-track flex gap-6">
              <div className="slide">

                <div
                  className="py-5 px-2 border-2 border-black rounded-lg "
                >
                  <h3 className="font-semibold text-lg text-black">Faster Hiring Process </h3>
                  <p className="text-gray-600 mt-1">Speed up your hiring without sacrificing quality.</p>
                </div>
              </div>
              <div className="slide">
                <div
                  className="py-5 px-2 border-2 border-black rounded-lg "
                >
                  <h3 className="font-semibold text-lg text-black">AI-Powered Assessments
                  </h3>
                  <p className="text-gray-600 mt-1">Smart assessments that see skills beyond the resume.</p>
                </div>
              </div>
              <div className="slide">
                <div
                  className="py-5 px-2 border-2 border-black rounded-lg "
                >
                  <h3 className="font-semibold text-lg text-black">Unbiased Insights</h3>
                  <p className="text-gray-600 mt-1">Fair, data-driven evaluations — no bias, just talent.</p>
                </div>
              </div>
              <div className="slide">
                <div
                  className="py-5 px-2 border-2 border-black rounded-lg "
                >
                  <h3 className="font-semibold text-lg text-black">Enhanced Experience
                  </h3>
                  <p className="text-gray-600 mt-1">Streamlined communication.</p>
                </div>
              </div>

              <div className="slide">
                <div
                  className="py-5 px-2 border-2 border-black rounded-lg "
                >
                  <h3 className="font-semibold text-lg text-black">Faster Hiring Process </h3>
                  <p className="text-gray-600 mt-1">Speed up your hiring without sacrificing quality.</p>
                </div>
              </div>
              <div className="slide">
                <div
                  className="py-5 px-2 border-2 border-black rounded-lg "
                >
                  <h3 className="font-semibold text-lg text-black">AI-Powered Assessments
                  </h3>
                  <p className="text-gray-600 mt-1">Smart assessments that see skills beyond the resume.</p>
                </div>
              </div>
              <div className="slide">
                <div
                  className="py-5 px-2 border-2 border-black rounded-lg "
                >
                  <h3 className="font-semibold text-lg text-black">Unbiased Insights                  </h3>
                  <p className="text-gray-600 mt-1">Fair, data-driven evaluations — no bias, just talent.</p>
                </div>
              </div>
              <div className="slide">
                <div
                  className="py-5 px-2 border-2 border-black rounded-lg "
                >
                  <h3 className="font-semibold text-lg text-black">Enhanced Experience
                  </h3>
                  <p className="text-gray-600 mt-1">Streamlined communication.</p>
                </div>
              </div>

              <div className="slide">
                <div
                  className="py-5 px-2 border-2 border-black rounded-lg "
                >
                  <h3 className="font-semibold text-lg text-black">Faster Hiring Process </h3>
                  <p className="text-gray-600 mt-1">Speed up your hiring without sacrificing quality.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <div className=" w-full bg-[#fff] relative text-white overflow-hidden">
        <div className=" w-[90%] max-w-[1500px] mx-auto mt-[53px] border-black border-2">
          <h1 className=" text-start text-black font-bold text-[25px] py-[30px] px-[30px] ">
            We got what you looking for
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 px-[30px] pb-[30px]">
            <div className="bg-[#f3f3f3] ">
              <div className="px-[1.175rem] py-[1.175rem] flex justify-center md:justify-start items-center md:items-start flex-col">
                <Image
                  src='/landing_page/grid/image1.png'
                  alt="bg"
                  width="300"
                  height="275"
                />
                <h3 className="font-semibold text-lg text-black  mt-[18px]">Real-World Scenarios</h3>
                <p className="text-gray-600 mt-1">Test Skills in action, not just on paper</p>
              </div>
            </div>

            <div className="bg-[#f3f3f3] ">
              <div className="px-[1.175rem] py-[1.175rem] flex justify-center md:justify-start items-center md:items-start flex-col">
                <Image
                  src='/landing_page/grid/image1.png'
                  alt="bg"
                  width="300"
                  height="275"
                />
                <h3 className="font-semibold text-lg text-black  mt-[18px]">Real-World Scenarios</h3>
                <p className="text-gray-600 mt-1">Test Skills in action, not just on paper</p>
              </div>
            </div>

            <div className="bg-[#f3f3f3] ">
              <div className="px-[1.175rem] py-[1.175rem] flex justify-center md:justify-start items-center md:items-start flex-col">
                <Image
                  src='/landing_page/grid/image1.png'
                  alt="bg"
                  width="300"
                  height="275"
                />
                <h3 className="font-semibold text-lg text-black  mt-[18px]">Real-World Scenarios</h3>
                <p className="text-gray-600 mt-1">Test Skills in action, not just on paper</p>
              </div>
            </div>

            <div className="bg-[#f3f3f3] ">
              <div className="px-[1.175rem] py-[1.175rem] flex justify-center md:justify-start items-center md:items-start flex-col">
                <Image
                  src='/landing_page/grid/image1.png'
                  alt="bg"
                  width="300"
                  height="275"
                />
                <h3 className="font-semibold text-lg text-black  mt-[18px]">Real-World Scenarios</h3>
                <p className="text-gray-600 mt-1">Test Skills in action, not just on paper</p>
              </div>
            </div>

            <div className="bg-[#f3f3f3] ">
              <div className="px-[1.175rem] py-[1.175rem] flex justify-center md:justify-start items-center md:items-start flex-col">
                <Image
                  src='/landing_page/grid/image1.png'
                  alt="bg"
                  width="300"
                  height="275"
                />
                <h3 className="font-semibold text-lg text-black  mt-[18px]">Real-World Scenarios</h3>
                <p className="text-gray-600 mt-1">Test Skills in action, not just on paper</p>
              </div>
            </div>

            <div className="bg-[#f3f3f3] ">
              <div className="px-[1.175rem] py-[1.175rem] flex justify-center md:justify-start items-center md:items-start flex-col">
                <Image
                  src='/landing_page/grid/image1.png'
                  alt="bg"
                  width="300"
                  height="275"
                />
                <h3 className="font-semibold text-lg text-black  mt-[18px]">Real-World Scenarios</h3>
                <p className="text-gray-600 mt-1">Test Skills in action, not just on paper</p>
              </div>
            </div>


            <div className="bg-[#f3f3f3] ">
              <div className="px-[1.175rem] py-[1.175rem] flex justify-center md:justify-start items-center md:items-start flex-col">
                <Image
                  src='/landing_page/grid/image1.png'
                  alt="bg"
                  width="300"
                  height="275"
                />
                <h3 className="font-semibold text-lg text-black mt-[18px]">Real-World Scenarios</h3>
                <p className="text-gray-600 mt-1">Test Skills in action, not just on paper</p>
              </div>
            </div>


            <div className="bg-[#f3f3f3] ">
              <div className="px-[1.175rem] py-[1.175rem] flex justify-center md:justify-start items-center md:items-start flex-col">
                <Image
                  src='/landing_page/grid/image1.png'
                  alt="bg"
                  width="300"
                  height="275"
                />
                <h3 className="font-semibold text-lg text-black  mt-[18px]">Real-World Scenarios</h3>
                <p className="text-gray-600 mt-1">Test Skills in action, not just on paper</p>
              </div>
            </div>

          </div>

        </div>


      </div>

      {/* why this product */}
      {/* <div className=" w-full bg-cover relative text-white overflow-hidden">
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
                Double-click anywhere on the text to edit it&apos;s contents.
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
                Double-click anywhere on the text to edit it&apos;s contents.
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
                Double-click anywhere on the text to edit it&apos;s contents.
              </p>
            </div>
          </div>
        </div>
      </div> */}

      <div className=" w-full bg-[#fff] relative text-white overflow-hidden">

        <div className=" w-[90%] max-w-[1500px] mx-auto bg-black text-white mt-[53px]">
          <div className="w-full flex flex-wrap md:flex-nowrap items-center py-[68px] px-6 justify-evenly gap-2">
            {/* Icons Section */}
            <div className="flex justify-center items-center gap-4">

              <div
              >
                <Image
                  src='/landing_page/icons/Entrepreneures.png'
                  alt="bg"
                  width="115"
                  height="115"
                />
              </div>

              <div
              >
                <Image
                  src='/landing_page/icons/Companies.png'
                  alt="bg"
                  width="115"
                  height="115"
                />
              </div>

              <div
              >
                <Image
                  src='/landing_page/icons/Investors.png'
                  alt="bg"
                  width="115"
                  height="115"
                />
              </div>
              <div
              >
                <Image
                  src='/landing_page/icons/Parents.png'
                  alt="bg"
                  width="115"
                  height="115"
                />
              </div>
              <div
              >
                <Image
                  src='/landing_page/icons/Everyone.png'
                  alt="bg"
                  width="115"
                  height="115"
                />
              </div>
            </div>

            {/* Description Section */}
            <div className="max-w-lg">
              <h2 className="text-xl font-semibold">Skillchecker helps</h2>
              <p className="text-gray-300 text-sm mt-2">
                Skillchecker takes the guesswork out of hiring. Our AI-driven interview platform evaluates real-world skills with precision, giving you fast, unbiased, and data-backed insights — so you can make confident hiring decisions every time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing */}
      {/* <div className=" relative w-full text-white  overflow-hidden">
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
              className={`${duration === "MONTHLY" ? "bg-white/10" : ""
                } py-3 px-8 rounded-xl text-base font-medium mr-2`}
            >
              Monthly
            </button>
            <button
              onClick={() => setDuration("ANNUALY")}
              className={` ${duration === "ANNUALY" ? "bg-white/10" : ""
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
              src="https://paddle-billing.vercel.app/assets/icons/logo/tailwind-logo.svg"
            />
            <Image
              alt="Next logo"
              loading="lazy"
              width="137"
              height="32"
              decoding="async"
              data-nimg="1"
              src="https://paddle-billing.vercel.app/assets/icons/logo/nextjs-logo.svg"
            />
            <Image
              alt="Shadcn logo"
              loading="lazy"
              width="137"
              height="35"
              decoding="async"
              data-nimg="1"
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
      </div> */}
      <div className=" w-full bg-[#fff] relative text-white overflow-hidden">

        <div className=" w-[90%] max-w-[1500px] mx-auto bg-[#FFC400] text-black mt-[53px] mb-4">
          <div className="flex justify-center md:justify-between py-6 px-8 flex-wrap">
            <div className="flex flex-col justify-center items-center">

              <div className=" text-sm text-center w-full">
                <Image
                  src={logo}
                  alt="logo"
                  width="180"
                  height="24" />
              </div>
              <span className="text-xs text-center inline-block mt-2">
                Terms and conditions{" "}
                <FiArrowUpRight className=" inline-block mr-2" />
                <span>
                  Privacy <FiArrowUpRight className=" inline-block" />
                </span>
              </span>

            </div>

            <div className="flex gap-3 mt-3 md:mt-0">

              <input type="text" className="w-full md:min-w-[235px] h-[50px] bg-transparent text-black py-2 md:py-4 px-5 md:px-5 rounded-full text-sm  font-medium border-black border-2 focus:border-black active:border-black target:border-black before:border-black after:border-black" />

              <button onClick={handleAuthentication} className="bg-black text-white py-2 md:py-4 px-5 md:px-5 rounded-full text-sm  font-medium w-full md:min-w-[135px]">
                Request a Demo
              </button>

            </div>


          </div>



        </div>

        <div className=" w-[80%] mx-auto mt-2 mb-9">
          <hr className=" opacity-15 mb-5" />
          <span className="flex justify-center items-center text-sm text-center w-full text-black">
            &#169;2025 &nbsp; Skillchecker.ai&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;All rights reserved
          </span>

        </div>
      </div>

      {/* <div className=" w-full text-center">
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
      </div> */}
    </div>
  );
}
