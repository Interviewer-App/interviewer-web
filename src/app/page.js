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
import Matter from "matter-js";
import MatterCircleStack from "@/components/MatterCircleStack";
import { motion } from "framer-motion";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Moon, Sun } from "lucide-react";
import { LuMoon, LuSun } from "react-icons/lu";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const [duration, setDuration] = useState("MONTHLY");
  const [clicked, setClicked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState('default');

  const initialImages = [
    [
      "/landing_page/icons/Investors.png",
      "/landing_page/icons/Entrepreneures.png",
      "/landing_page/icons/Everyone.png",
      "/landing_page/icons/Parents.png",
      "/landing_page/icons/Companies.png",
    ],
    [
      "/landing_page/icons/Entrepreneures.png",
      "/landing_page/icons/Everyone.png",
      "/landing_page/icons/Parents.png",
      "/landing_page/icons/Companies.png",
      "/landing_page/icons/Investors.png",
    ],
    [
      "/landing_page/icons/Everyone.png",
      "/landing_page/icons/Parents.png",
      "/landing_page/icons/Companies.png",
      "/landing_page/icons/Investors.png",
      "/landing_page/icons/Entrepreneures.png",
    ],
    [
      "/landing_page/icons/Parents.png",
      "/landing_page/icons/Companies.png",
      "/landing_page/icons/Investors.png",
      "/landing_page/icons/Entrepreneures.png",
      "/landing_page/icons/Everyone.png",
    ],
    [
      "/landing_page/icons/Companies.png",
      "/landing_page/icons/Investors.png",
      "/landing_page/icons/Entrepreneures.png",
      "/landing_page/icons/Everyone.png",
      "/landing_page/icons/Parents.png",
    ],
  ];

  const initialImagesMobile = [
    [
      "/landing_page/icons/Investors.png",
      "/landing_page/icons/Entrepreneures.png",
      "/landing_page/icons/Everyone.png",
      "/landing_page/icons/Parents.png",
      "/landing_page/icons/Companies.png",
    ],
    [
      "/landing_page/icons/Entrepreneures.png",
      "/landing_page/icons/Everyone.png",
      "/landing_page/icons/Parents.png",
      "/landing_page/icons/Companies.png",
      "/landing_page/icons/Investors.png",
    ],
    [
      "/landing_page/icons/Everyone.png",
      "/landing_page/icons/Parents.png",
      "/landing_page/icons/Companies.png",
      "/landing_page/icons/Investors.png",
      "/landing_page/icons/Entrepreneures.png",
    ]
  ];
  const [imageQueues, setImageQueues] = useState(initialImages);
  const [imageQueuesMobile, setImageQueuesMobile] = useState(initialImagesMobile);

  // Toggle between light and dark mode
  // const toggleTheme = () => {
  //   setIsDarkMode((prev) => !prev);
  //   document.documentElement.classList.toggle('dark');
  // };
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

  const featuresOne = [
    { title: "Streamlined Interviews", desc: "Simplify your hiring process from start to finish." },
    { title: "Real-World Scenarios", desc: "Test skills in action, not just on paper." },
    { title: "Data-Driven Decisions", desc: "Make every hire backed by real data and clear insights." },
    { title: "Collaborative Feedback", desc: "Gather insights from your team." },
    { title: "OnBoading Made Easy", desc: "Seamless integration of new hires into your team" },
    { title: "Countinous Learning", desc: "Foster a culture of growth with ongoing traning" },
    { title: "Streamlined Interviews", desc: "Simplify your hiring process from start to finish." },
    { title: "Real-World Scenarios", desc: "Test skills in action, not just on paper." },
    { title: "Data-Driven Decisions", desc: "Make every hire backed by real data and clear insights." },
    { title: "Collaborative Feedback", desc: "Gather insights from your team." },
    { title: "OnBoading Made Easy", desc: "Seamless integration of new hires into your team" },
    { title: "Collaborative Feedback", desc: "Gather insights from your team." },
  ];

  const featuresTwo = [
    { title: "Faster Hiring Process", desc: "Speed up your hiring without sacrificing quality." },
    { title: "AI-Powered Assessments", desc: "Smart assessments that see skills beyond the resume." },
    { title: "Unbiased Insights", desc: "Fair, data-driven evaluations — no bias, just talent." },
    { title: "Enhanced Experience", desc: "Streamlined communication." },
    { title: "Automated Scheduling", desc: "Eliminate back-and-forth with smart interview scheduling." },
    { title: "Comprehensive Analytics", desc: "Deep insights into hiring trends and candidate performance." },
    { title: "Faster Hiring Process", desc: "Speed up your hiring without sacrificing quality." },
    { title: "AI-Powered Assessments", desc: "Smart assessments that see skills beyond the resume." },
    { title: "Unbiased Insights", desc: "Fair, data-driven evaluations — no bias, just talent." },
    { title: "Enhanced Experience", desc: "Streamlined communication." },
    { title: "Enhanced Experience", desc: "Streamlined communication." },
  ];

  const superPower = [
    { title: "Real-World Scenarios", desc: "Test skills in action, not just on paper." },
    { title: "Real-World Scenarios", desc: "Test skills in action, not just on paper." },
    { title: "Real-World Scenarios", desc: "Test skills in action, not just on paper." },
    { title: "Real-World Scenarios", desc: "Test skills in action, not just on paper." },
    { title: "Real-World Scenarios", desc: "Test skills in action, not just on paper." },
    { title: "Real-World Scenarios", desc: "Test skills in action, not just on paper." },
    { title: "Real-World Scenarios", desc: "Test skills in action, not just on paper." },
    { title: "Real-World Scenarios", desc: "Test skills in action, not just on paper." },
  ];

  const items = [
    { icon: "🎓", title: "Candidates" },
    { icon: "🏢", title: "Companies" },
    { icon: "💼", title: "Entrepreneurs" },
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'default';
    document.documentElement.setAttribute('data-theme', savedTheme);
    setTheme(savedTheme);

    // Check if a theme is already saved in localStorage
    // const savedTheme = localStorage.getItem("theme");

    // if (savedTheme === "dark") {
    //   // If "dark" is saved, enable dark mode
    //   setIsDarkMode(true);
    //   document.documentElement.classList.add("dark");
    // } else if (savedTheme === "light") {
    //   // If "light" is saved, enable light mode
    //   setIsDarkMode(false);
    //   document.documentElement.classList.remove("dark");
    // } else {
    //   // If no theme is saved, use the system's preferred theme
    //   const prefersDarkMode = window.matchMedia(
    //     "(prefers-color-scheme: dark)"
    //   ).matches;
    //   setIsDarkMode(prefersDarkMode);
    //   document.documentElement.classList.toggle("dark", prefersDarkMode);
    // }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        setIsAnimating(true);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAnimating]);

  const handleAnimationComplete = (index) => {
    setImageQueues((prevQueues) => {
      const newQueues = [...prevQueues];
      const newQueue = [...newQueues[index]];
      const firstImage = newQueue.shift();
      if (firstImage) newQueue.push(firstImage);
      newQueues[index] = newQueue;
      return newQueues;
    });
    setIsAnimating(false);
  };

  const handleAnimationCompleteMobile = (index) => {
    setImageQueuesMobile((prevQueues) => {
      const newQueues = [...prevQueues];
      const newQueue = [...newQueues[index]];
      const firstImage = newQueue.shift();
      if (firstImage) newQueue.push(firstImage);
      newQueues[index] = newQueue;
      return newQueues;
    });
    setIsAnimating(false);
  };

  const toggleTheme = () => {
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    setTheme(newTheme);
    // setIsDarkMode((prev) => {
    //   const newTheme = !prev;
    //   document.documentElement.classList.toggle("dark");
    //   localStorage.setItem("theme", newTheme ? "dark" : "light");
    //   return newTheme;
    // });
  };

  const handleThemeChange = (newTheme) => {
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    if(newTheme === 'dark') {
      setIsDarkMode(true);
    }else{
      setIsDarkMode(false);
    }

    setTheme(newTheme);
  };

  const handleAuthentication = async () => {
    if (status === "authenticated") {
      const token = localStorage.getItem("accessToken");
      const session = await getSession();
      const userRole = session?.user?.role;
      if (userRole === "COMPANY") {
        router.push("/interviews");
      } else if (userRole === "CANDIDATE") {
        router.push("/my-interviews");
      } else if (userRole === "ADMIN") {
        router.push("/users");
      } else {
        router.push("/");
      }
    }
  };

  const requestDemo = async () => {
    router.push("https://tally.so/r/wQko91");
  };

  return (
    <div className=" w-full">
      <div className=" w-full text-black bg-background dark:text-white">
        <header className=" w-full ">
          <div className=" w-[90%] max-w-[1500px] flex items-center justify-between pt-14 md:pt-20 pb-[30px] md:pb-12 mx-auto">
            <div>
              <div className="hidden md:block">
                {isDarkMode ? (
                  <Image
                    src="/landing_page/logo-dark.png"
                    alt="logo"
                    width={464}
                    height={82}
                  />
                ) : (
                  <Image
                    src="/landing_page/logo.png"
                    alt="logo"
                    width={464}
                    height={82}
                  />
                )}
              </div>

              <div className="block md:hidden">
                {isDarkMode ? (
                  <Image
                    src="/landing_page/logo_mobile_dark.png"
                    alt="logo"
                    width={200}
                    height={50}
                  />
                ) : (
                  <Image
                    src="/landing_page/logo_mobile_light.png"
                    alt="logo"
                    width={200}
                    height={50}
                  />
                )}
              </div>
            </div>

            <div className="flex justify-center items-center">
              <div className="flex justify-center items-center gap-4 mt-4">
                <button
                  onClick={() => handleThemeChange('default')}
                  className="w-8 h-8 rounded-full bg-[#fff]"
                ></button>
                <button
                  onClick={() => handleThemeChange('theme1')}
                  className="w-8 h-8 rounded-full bg-[#DDDDDD]"
                ></button>
                <button
                  onClick={() => handleThemeChange('theme2')}
                  className="w-8 h-8 rounded-full bg-[#D1F8FF]"
                ></button>
                <button
                  onClick={() => handleThemeChange('theme3')}
                  className="w-8 h-8 rounded-full bg-[#DDFFD1]"
                ></button>
                <button
                  onClick={() => handleThemeChange('theme4')}
                  className="w-8 h-8 rounded-full bg-[#FFF8D1]"
                ></button>
                <button
                  onClick={() => handleThemeChange('theme5')}
                  className="w-8 h-8 rounded-full bg-[#FEDBDB]"
                ></button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className="w-8 h-8 rounded-full bg-[#000]"
                ></button>
              </div>
              {/* <button
                onClick={toggleTheme}
                className="bg-black dark:bg-white w-11 h-11 md:w-16 md:h-16 rounded-full flex justify-center items-center transition-all duration-300"
              >
                <div className="hidden md:block">
                  {isDarkMode ? (
                    <LuSun size={34} color="#000" />
                  ) : (
                    <LuMoon size={34} color="#fff" />
                  )}
                </div>
                <div className="block md:hidden">
                  {isDarkMode ? (
                    <LuSun size={24} color="#000" />
                  ) : (
                    <LuMoon size={24} color="#fff" />
                  )}
                </div>
              </button> */}
            </div>
          </div>
        </header>

        {/* <div className="min-h-screen bg-background text-secondary">
          <header className="p-4 bg-primary text-white">
            <h1 className="text-2xl font-bold">Dynamic Theme Example</h1>
          </header>
          <main className="p-4">
            <p className="text-accent">This text changes color based on the theme.</p>
          </main>
          <footer className="p-4 bg-secondary text-primary">
            <p>Footer Content</p>
          </footer>
        </div> */}

        {/* <div className=" flex flex-col lg:flex-row items-start justify-between w-full md:w-[90%] max-w-[1500px] mx-auto gap-12"> */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 w-[90%] md:w-[90%] max-w-[1500px] mx-auto gap-12">
          <div className="flex flex-col justify-center md:justify-start items-center md:items-start border-black border-[3px] rounded-[10px] px-4 py-11 md:px-11  md:py-12 bg-[#FFE582] dark:bg-[#FFE582] dark:text-black">
            <h1 className="font-bohemian-soul text-center md:text-start leading-[28px] text-2xl md:text-4xl md:leading-[52px] font-bold text-black dark:text-black">
              <span>Find the Right Talent</span><br />
              <span>Without the Runaround</span>
            </h1>
            <p className="max-w-[368px] md:max-w-[500px] text-xs md:text-base text-center md:text-start pt-[15px] md:pt-[18px] leading-[23px] text-black dark:text-black font-puls">
              Skillchecker takes the guesswork out of hiring. Our AI-driven
              interview platform evaluates real-world skills with precision,
              giving you fast, unbiased, and data-backed insights — so you
              can make confident hiring decisions every time
            </p>
            <div className="flex gap-6 pt-[15px] md:pt-14">
              <button onClick={requestDemo} className="bg-purple-200 text-black dark:text-white py-[12px] px-[20px] text-xs md:text-base font-bold  shadow-[4px_4px_0px_black] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all border-2 border-black">
                Request a Demo
              </button>
              {/* <button onClick={requestDemo} className="bg-[#000] dark:bg-white relative text-white dark:text-black py-[12px] px-[20px] text-xs md:text-base font-bold border-2 border-white dark:border-black ">
                Contact us now
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              </button> */}
              <a
                href="mailto:director@coullax.com?subject=Contact%20Request&body=Hello,%20I%20would%20like%20to%20get%20in%20touch..."
                className="  relative  dark:text-black py-[12px] px-[20px] text-xs md:text-base font-bold inline-block border-2 border-black bg-yellow-200 text-black shadow-[4px_4px_0px_black] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
              >
                Contact us now
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              </a>
            </div>
          </div>

          <div className=" lg:col-span-2 flex min-h-[450px] flex-col justify-start items-start border-black border-2 rounded-[10px]">
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

      <div className=" w-full bg-background relative text-white dark:text-black overflow-hidden ">
        <div className=" w-[90%] max-w-[1500px] mx-auto pt-3 md:pt-10">
          <h1 className="text-center md:text-start text-black dark:text-white font-bold text-xl leading-[56px] md:leading-[60px] pb-3 ">
            We got what you looking for
          </h1>
        </div>
        <div className="w-[90%] max-w-[1500px] mx-auto flex flex-wrap gap-4 py-2">
          <div className="slider">
            <div className="slide-track flex gap-6">
              {featuresOne.map((feature, index) => (
                <div className="slide" key={index}>
                  <div className="py-3 px-3 border-2 border-black dark:border-white rounded-lg ">
                    <h3 className="font-bold text-xs text-black dark:text-white leading-6">{feature.title}</h3>
                    <p className="text-black dark:text-white text-xs leading-7">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="slider">
            <div className="slide-track flex gap-6">
              {featuresTwo.map((feature, index) => (
                <div className="slide" key={index}>
                  <div className="py-3 px-3 border-2 border-black dark:border-white rounded-lg ">
                    <h3 className="font-bold text-xs text-black dark:text-white leading-6">{feature.title}</h3>
                    <p className="text-black dark:text-white text-xs leading-7">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className=" w-full bg-background relative overflow-hidden">
        <div className=" w-[90%] max-w-[1500px] mx-auto border-0 md:border-black dark:md:border-[#282828] md:border-2 md:mt-10 mt-[30px] py-[0px] md:py-[30px] md:px-[30px] px-[26px]">
          <h1 className="text-center md:text-start text-black dark:text-white font-bold text-xl  leading-[24px] md:leading-[60px] ">
            We got what you looking for
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:mt-[11px] mt-[20px]">


            {superPower.map((feature, index) => (
              <div className="bg-[#f3f3f3] dark:bg-[#181818]" key={index}>
                <div className="px-[1.175rem] py-[1.175rem] flex justify-center items-center md:justify-start md:items-start flex-col">
                  <Image
                    src='/landing_page/grid/image1.png'
                    alt="bg"
                    width="300"
                    height="275"
                  />
                  <h3 className="font-bold text-sm text-black dark:text-white mt-[18px] leading-8 text-start">{feature.title}</h3>
                  <p className="text-black dark:text-white text-sm leading-6">{feature.desc}</p>
                </div>
              </div>
            ))}

            {/* <div className="bg-[#f3f3f3] dark:bg-[#181818]">
              <div className="px-[1.175rem] py-[1.175rem] flex justify-center md:justify-start items-center md:items-start flex-col">
                <Image
                  src="/landing_page/grid/image1.png"
                  alt="bg"
                  width="300"
                  height="275"
                />
                <h3 className="font-bold text-sm text-black dark:text-white mt-[18px] leading-8">Real-World Scenarios</h3>
                <p className="text-black dark:text-white text-sm leading-6">Test Skills in action, not just on paper</p>
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
            </div> */}
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

      <div className=" w-full bg-background relative overflow-hidden">

        <div className="  bg-black dark:bg-white dark:text-black text-white mt-[30px] md:mt-10 ">
          <div className="w-full flex flex-wrap md:flex-nowrap items-center py-6 md:py-10 px-6 justify-evenly gap-2 flex-col-reverse md:flex-row">
            {/* Icons Section */}
            <div className="hidden md:flex justify-center items-center gap-4 py-7 ">
              {imageQueues.map((imageQueue, index) => (
                <div
                  key={index}
                  className="overflow-hidden h-[115px] relative w-[115px]"
                >
                  <motion.div
                    key={imageQueue[0]}
                    initial={{ y: 0, opacity: 1 }}
                    animate={isAnimating ? { y: -133, opacity: 0.5 } : {}}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    onAnimationComplete={() => handleAnimationComplete(index)}
                    className="flex flex-col"
                  >
                    {imageQueue.map((image, i) => (
                      <motion.div key={i} className="mb-2">
                        <Image src={image} alt="bg" width={115} height={115} />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              ))}
            </div>

            <div className="flex md:hidden justify-center items-center gap-4 py-7">
              {imageQueuesMobile.map((imageQueue, index) => (
                <div
                  key={index}
                  className="overflow-hidden h-[115px] relative w-[115px]"
                >
                  <motion.div
                    key={imageQueue[0]}
                    initial={{ y: 0, opacity: 1 }}
                    animate={isAnimating ? { y: -133, opacity: 0.5 } : {}}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    onAnimationComplete={() => handleAnimationCompleteMobile(index)}
                    className="flex flex-col"
                  >
                    {imageQueue.map((image, i) => (
                      <motion.div key={i} className="mb-2">
                        <Image src={image} alt="bg" width={115} height={115} />
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              ))}
            </div>

            {/* Description Section */}
            <div className="max-w-lg">
              <h2 className="text-center md:text-start text-xl font-bold leading-10">
                Skillchecker helps
              </h2>
              <p className="text-center md:text-start text-white dark:text-black text-base mt-2 leading-6">
                Skillchecker takes the guesswork out of hiring. Our AI-driven
                interview platform evaluates real-world skills with precision,
                giving you fast, unbiased, and data-backed insights — so you can
                make confident hiring decisions every time.
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
      <div className=" w-full bg-background relative overflow-hidden">

        <div className="  bg-[#009bac] text-black mb-4">
          <div className="w-[90%] max-w-[1500px] mx-auto flex justify-center md:justify-between py-6 px-8 flex-wrap flex-col md:flex-row items-center ">
            <div className="flex flex-col justify-center items-center">
              <div className="flex justify-center md:justify-start text-sm text-center w-full">
                <Image src={logo} alt="logo" width="180" height="24" />
              </div>
              <span className="text-xs text-center inline-block mt-2">
                Terms and conditions{" "}
                <FiArrowUpRight className=" inline-block mr-2" />
                <span>
                  Privacy <FiArrowUpRight className=" inline-block" />
                </span>
                <span>
                  policy <FiArrowUpRight className=" inline-block" />
                </span>
              </span>
            </div>

            <div className="flex gap-3 mt-3 md:mt-0 flex-col md:flex-row items-center justify-center md:justify-between">
              {/* <input placeholder="Email" type="text" className="w-full md:min-w-[235px] h-[50px] bg-transparent text-black py-2 md:py-4 px-5 md:px-5 text-sm  font-medium border-black border-2 focus:border-black active:border-black target:border-black before:border-black after:border-black" /> */}

              <button
                onClick={handleAuthentication}
                className="bg-black text-white py-2 md:py-4 h-[67px] md:h-[51px] px-5 md:px-5 text-sm  font-medium w-full md:min-w-[135px]"
              >
                Request a Demo
              </button>
            </div>
          </div>
        </div>

        <div className=" w-[80%] mx-auto mt-5 mb-5 ">
          {/* <hr className=" opacity-15 mb-5" /> */}
          <span className="flex justify-center items-center text-sm text-center w-full text-black dark:text-white">
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
