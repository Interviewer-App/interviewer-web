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
import { color, hover, motion } from "framer-motion";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Moon, Sun } from "lucide-react";
import { LuMoon, LuSun, Hand } from "react-icons/lu";
import { PiHandPointing } from "react-icons/pi";

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
  const [expandedSections, setExpandedSections] = useState({});
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);

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

  const object = [
    {
      titleHead: "Unlocking Certainty & Smart Decision-Making",
      color: "bg-[#f1ffe6]",
      features: [
        { title: "💪  Hiring with Confidence", desc: "Hiring with Confidence – No more guessing if a candidate is truly qualified.", hover: 'A startup founder hiring a developer but has no coding knowledge.' },
        { title: "💰 Investing Wisely", desc: "Know if a startup’s technical team actually has the expertise.", hover: 'An investor backing an AI startup without understanding AI.' },
        { title: "🤝  Partnering Smartly", desc: "Verify collaborators’ skills before committing to projects.", hover: 'A restaurant owner partnering with a marketer to grow online sales.' },
        { title: "🚀 Scaling with Trust", desc: "Ensure the right talent fuels your business growth.", hover: 'A real estate agency outsourcing website development but unsure about the developer’s skills.' },
        { title: "🤜🤛Building Future-Ready Teams", desc: "Recruit the best talent even outside your domain.", hover: 'A medical practice hiring a cybersecurity expert for patient data protection.' }

      ]
    },
    {
      titleHead: "Expanding Collaboration Across Industries",
      color: "bg-[#e6f6ff]",
      features: [
        { title: "🔬 Cross-Industry Innovation", desc: "Work across disciplines without fear of knowledge gaps.", hover: 'A fashion brand hiring an AI consultant to integrate smart wearables.' },
        { title: "💪  Seamless Outsourcing", desc: "Hire specialists globally without needing to vet them yourself.", hover: 'A business owner in the US hiring a data analyst from India.' },
        { title: "🙋‍♂️  Bridging Skill Gaps", desc: "Find experts even in fields you know nothing about.", hover: 'A musician looking for a video editor to create professional content.' },
        { title: "⚡ Better Vendor Selection", desc: "Confirm service providers actually deliver on their promises.", hover: 'A company hiring a blockchain consultant but unsure if they truly understand the tech.' },
        { title: "⚛︎  Unlocking Multi-Disciplinary Projects", desc: "Bring together professionals from different domains with certainty.", hover: 'A game developer hiring an AI expert to create NPC interactions.' }

      ]
    },
    {
      titleHead: "Enabling Bold Moves & Limitless Possibilities",
      color: "bg-[#f4e6ff]",
      features: [
        { title: "🌍 Entering New Markets", desc: "Expand without needing to master every skill yourself.", hover: 'A traditional farmer adopting automation and hiring a robotics engineer.' },
        { title: "✪ Breaking Industry Barriers", desc: "Collaborate across fields with verified expertise.", hover: 'A filmmaker using AI to analyze audience trends before hiring a marketing strategist.' },
        { title: "💫  Launching Big Ideas Faster", desc: "Build projects with the right team from day one.", hover: 'An educator creating an EdTech platform but not knowing how to evaluate developers.' },
        { title: "🌟 Democratizing Opportunity", desc: "Give under-the-radar talent a fair shot based on real skills.", hover: 'A non-profit organization choosing a social media strategist based on performance, not degrees.' },
        { title: "✊ Empowering Entrepreneurs", desc: "Start ventures in industries you don’t fully understand, with the perfect team.", hover: 'A fitness coach launching a mobile app but unsure about app development.' }

      ]
    },
    {
      titleHead: "Reducing Risk & Ensuring Quality",
      color: "bg-[#fedbdb]",
      features: [
        { title: "🥊 Avoiding Costly Mistakes", desc: "Stop hiring or investing based on inflated resumes.", hover: 'A CEO hiring a CFO but not knowing how to verify their financial expertise.' },
        { title: "⚖️  Minimizing Bias in Hiring", desc: "Focus on proven skills, not just credentials.", hover: 'A recruiter choosing between two designers one with a degree, one with verified talent.)' },
        { title: "🎯 Ensuring Skill-Based Excellence", desc: "No more “experts” who can’t actually do the job.", hover: 'A parent verifying if a music teacher is actually skilled before hiring them for their child.' },
        { title: "📊  Making Data-Driven Decisions", desc: "Trust verified skills over flashy presentations.", hover: 'A business guru promising 10x growth do they actually have a proven strategy?' },
        { title: "📊  🥸 Eliminating Skill Fraud", desc: "Weed out imposters who talk big but can’t deliver.", hover: ' A small business hiring an SEO consultant but not knowing if they actually understand search algorithms.' }
      ]
    }
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

  const videos = [
    {
      id: 1,
      url: "/videos/scenario1.mp4", // Replace with your actual video path
      title: "Real-World Scenarios",
      description: "Test skills in action, not just on paper."
    },
    {
      id: 2,
      url: "/videos/scenario2.mp4",
      title: "Real-World Scenarios",
      description: "Test skills in action, not just on paper."
    },
    {
      id: 3,
      url: "/videos/scenario3.mp4",
      title: "Real-World Scenarios",
      description: "Test skills in action, not just on paper."
    },
    {
      id: 4,
      url: "/videos/scenario4.mp4",
      title: "Real-World Scenarios",
      description: "Test skills in action, not just on paper."
    },
    {
      id: 5,
      url: "/videos/scenario5.mp4",
      title: "Real-World Scenarios",
      description: "Test skills in action, not just on paper."
    }
  ];

  const beneficiaryGroups = [
    {
      title: "💼 For Business Leaders & Hiring Managers",
      color: "bg-[#ffffff]",
      benefits: [
        {
          title: "Recruiters & HR Teams",
          description: "Verify candidate skills before hiring."
        },
        {
          title: "Startup Founders & CEOs",
          description: "Build the perfect team, even outside your expertise."
        },
        {
          title: "Small Business Owners",
          description: "Find specialists without needing deep knowledge of their field."
        }
      ]
    },
    {
      title: "💰 For Investors & Decision-Makers",
      color: "bg-[#F1FFE6]",
      benefits: [
        {
          title: "Venture Capitalists & Angel Investors",
          description: "Validate startup teams before investing."
        },
        {
          title: "Private Equity & Corporate Buyers",
          description: "Assess expertise in acquisitions & mergers."
        },
        {
          title: "Government & Enterprise Leaders",
          description: "Ensure large-scale hiring meets real skill requirements."
        }
      ]
    },
    {
      title: "🤝 For Partners & Collaborators",
      color: "bg-[#E6F6FF]",
      benefits: [
        {
          title: "Agencies & Freelancers",
          description: "Verify vendor & contractor expertise."
        },
        {
          title: "Entrepreneurs & Innovators",
          description: "Work with specialists across industries."
        },
        {
          title: "Creative & Tech Consultants",
          description: "Test partners before collaboration."
        }
      ]
    },
    {
      title: "🎓 For Educators & Skill Seekers",
      color: "bg-[#F4E6FF]",
      benefits: [
        {
          title: "Students & Job Seekers",
          description: "Prove your real skills with AI validation."
        },
        {
          title: "Coaches & Trainers",
          description: "Evaluate knowledge gaps you've trained."
        },
        {
          title: "Parents & Individuals",
          description: "Verify skills of teachers, instructors, and personal service providers."
        }
      ]
    }
  ];

  const widerAudiences = [
    {
      title: "✨ Anyone who wants to make smarter choices – If skills matter, The Skillchecker is for you",
      icon: "🌐",
      isWide: true,
    },
    {
      title: "🤔 Curious minds – Ever wonder if someone really knows their craft? Find out",
      icon: "🤔",
      isWide: true,
    },
    {
      title: "🔍 Tinkerers & Explorers – Hire, invest, or collaborate in fields beyond your own",
      icon: "🔍",
      isWide: true,
    },
    {
      title: "🚀 Cross-industry pioneers – Break barriers and work with experts in any discipline",
      icon: "🚀",
      isWide: true,
    },
    {
      title: "🌐 For Everyone (Because The Possibilities Are Endless!)",
      icon: "✨",
      isFullWidth: true,
    }
  ];
  const themes = ['default', 'theme2', 'theme3', 'theme4', 'theme5', 'dark'];
  // let currentThemeIndex = 0;
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'default';
    document.documentElement.setAttribute('data-theme', savedTheme);
    setTheme(savedTheme);

    const currentThemeIndex = themes.indexOf(localStorage.getItem('theme'));
    setCurrentThemeIndex(currentThemeIndex);
    // Check if a theme is already saved in localStorage
    // const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      // If "dark" is saved, enable dark mode
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else if ((savedTheme === "default") || (savedTheme === "theme1") || (savedTheme === "theme2") || (savedTheme === "theme3") || (savedTheme === "theme4") || (savedTheme === "theme5")) {
      // If "light" is saved, enable light mode
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else {
      // If no theme is saved, use the system's preferred theme
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDarkMode(prefersDarkMode);
      document.documentElement.classList.toggle("dark", prefersDarkMode);
      if (prefersDarkMode) {
        setTheme('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
        // localStorage.setItem('theme', newTheme);
      } else {
        setTheme(savedTheme);
        document.documentElement.setAttribute('data-theme', savedTheme);
      }

    }
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
    if (newTheme === 'dark') {
      document.documentElement.classList.toggle("dark");
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    setTheme(newTheme);
  };



  const handleThemeChangeMobile = () => {
    // const themes = ['default', 'theme2', 'theme3', 'theme4', 'theme5', 'dark'];

    const currentThemeIndexNew = (currentThemeIndex + 1) % themes.length;
    const newTheme = themes[currentThemeIndexNew];
    setCurrentThemeIndex(currentThemeIndexNew);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDarkMode(false);
    }

    setTheme(newTheme);
  };


  // Toggle visibility of a section
  const toggleSection = (index) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [index]: !prevState[index]
    }));
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

  const getButtonBgColor = () => {
    const themeColors = {
      default: '#ffe582',
      theme2: '#a6e197',
      theme3: '#d3b4ff',
      theme4: '#ffb3b5',
      theme5: '#82dbff',
      dark: '#82e0ff',
    };
    return themeColors[theme] || '#ffffff';
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
              <div className="sm:flex justify-center items-center gap-4 mt-4 hidden ">
                <button
                  onClick={() => handleThemeChange('default')}
                  className={`w-8 h-8 rounded-full bg-[#ffffff] ${theme === 'default' ? 'border-2 border-gray-400' : ''}`}
                ></button>
                {/* <button
                  onClick={() => handleThemeChange('theme1')}
                  className="w-8 h-8 rounded-full bg-[#DDDDDD]"
                ></button> */}
                <button
                  onClick={() => handleThemeChange('theme2')}
                  className={`w-8 h-8 rounded-full bg-[#D1F8FF] ${theme === 'theme2' ? 'border-2 border-gray-400' : ''}`}
                ></button>
                <button
                  onClick={() => handleThemeChange('theme3')}
                  className={`w-8 h-8 rounded-full bg-[#DDFFD1] ${theme === 'theme3' ? 'border-2 border-gray-400' : ''}`}
                ></button>
                <button
                  onClick={() => handleThemeChange('theme4')}
                  className={`w-8 h-8 rounded-full bg-[#FFF8D1] ${theme === 'theme4' ? 'border-2 border-gray-400' : ''}`}
                ></button>
                <button
                  onClick={() => handleThemeChange('theme5')}
                  className={`w-8 h-8 rounded-full bg-[#FEDBDB] ${theme === 'theme5' ? 'border-2 border-gray-400' : ''}`}
                ></button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`w-8 h-8 rounded-full bg-[#161618] ${theme === 'dark' ? 'border-2 border-gray-400' : ''}`}
                ></button>
              </div>
              {/* <button
                  onClick={() => handleThemeChangeMobile()}
                className="bg-black dark:bg-white w-11 h-11 md:w-16 md:h-16 rounded-full flex justify-center items-center transition-all duration-300 sm:hidden"
              >
                <PiHandPointing size={24} color="#fff" />
              </button> */}
              <button
                onClick={() => handleThemeChangeMobile()}
                className="w-11 h-11 md:w-16 md:h-16 rounded-full flex justify-center items-center transition-all duration-300 sm:hidden "
                style={{ backgroundColor: getButtonBgColor() }}
              >
                {/* { isDarkMode ? <PiHandPointing size={24} color="#fff" /> : <PiHandPointing size={24} color="#000" /> } */}
                <PiHandPointing size={24} color="#000" />
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-[90%] md:w-[90%] max-w-[1500px] mx-auto gap-8">
          <div className="flex flex-col justify-center md:justify-start items-center md:items-start border-black border-[3px] rounded-[10px] px-4 py-11 md:px-[30px]  md:py-[30px] bg-title-card-background dark:bg-title-card-background dark:text-black">
            <h1 className="font-bohemian-soul text-center md:text-start leading-[28px] text-[25px] md:text-[25px] md:leading-[30px] font-bold text-black dark:text-black">
              <span>Evaluate Skills in Any Field.</span><br />
              <span>No Expertise Needed.</span><br />
              {/* <span>We&apos;ve got you</span> */}
            </h1>

            <p className="max-w-[368px] md:max-w-[388px] text-xs md:text-[15px] text-center md:text-start pt-[15px] md:pt-[30px] leading-[18px] text-black dark:text-black font-puls">
            <span>The Skillchecker is an AI powered tool that helps you evaluate skills in any field,</span><br/>
            <span>especially those outside your expertise.</span><br/><br/>
            <span>  Whether you are hiring, investing, or partnering,</span><br/>
              
            <span>  it gives you the confidence to make smart decisions when evaluating someone’s skills without needing an external expert every time.</span>
             
            </p>
            <div className="flex gap-6 pt-[15px] md:pt-[40px]">
              <button onClick={requestDemo} className=" bg-request-demo-background hover:bg-request-demo-background-hover text-black py-[12px] px-[20px] text-xs md:text-base font-bold  shadow-[4px_4px_0px_black]  active:shadow-none active:translate-x-1 active:translate-y-1 transition-all border-2 border-black">
                Request a Demo
              </button>
              {/* <button onClick={requestDemo} className="bg-[#000] dark:bg-white relative text-white dark:text-black py-[12px] px-[20px] text-xs md:text-base font-bold border-2 border-white dark:border-black ">
                Contact us now
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              </button> */}
              <a
                href="mailto:director@coullax.com?subject=Contact%20Request&body=Hello,%20I%20would%20like%20to%20get%20in%20touch..."
                className=" relative bg-white hover:bg-gray-200 dark:text-black py-[12px] px-[20px] text-xs md:text-base font-bold inline-block border-2 border-black text-black shadow-[4px_4px_0px_black]  active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
              >
                Contact us now
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
              </a>
            </div>
          </div>

          <div className=" lg:col-span-2 flex min-h-[418px] flex-col justify-start items-start border-black  border-[3px] rounded-[10px]">
            <MatterCircleStack />
          </div>
        </div>
      </div>

      <div className=" w-full bg-background relative text-white dark:text-black overflow-hidden pt-[25px] md:pt-10 ">
        <div className=" w-[90%] max-w-[1500px] mx-auto md:px-[25px] md:py-[35px] md:bg-skills-card-background rounded-[10px]">
          <h1 className="text-center text-black dark:text-white font-bold text-xl leading-[28px] md:leading-[28px]">
            Skills Checked. Risks Eliminated. Possibilities Unlocked.
          </h1>

          <div>
            {object.map((section, index) => (
              <div key={index} className="pt-[25px] md:pt-[35px]">
                {/* Title with Click Handler for Mobile */}
                <h1
                  onClick={() => toggleSection(index)} // Toggle visibility on click
                  className={`text-center md:text-start text-black md:dark:text-white font-bold text-base leading-[20px] md:leading-[20px] cursor-pointer sm:cursor-auto border-2 border-black rounded-[50px] px-[15px] py-[15px] md:border-none md:rounded-none md:px-0 md:py-0 ${section.color} md:bg-transparent`}
                >
                  {section.titleHead}
                </h1>

                {/* Features Grid - Conditionally Rendered */}
                {(expandedSections[index] || true) && (
                  <div className={`grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-6 md:mt-[15px] ${expandedSections[index] ? 'mt-[15px]' : ''}`}>
                    {section.features.map((item, idx) => (
                      <div
                        key={idx}
                        className={`group relative bg-[#f4f4f4] dark:bg-[#3b3b3d] px-[15px] py-[10px] 
                      flex justify-center items-start flex-col md:border-2 md:border-[#343434] 
                      md:dark:border-[#545454] rounded-[7px] min-h-[92px] hover:bg-black
                      ${expandedSections[index] ? '' : 'hidden md:block'}
                      transition-all duration-300`}
                      >
                        {/* Original Content */}
                        <h3 className="font-bold text-[12px] text-black dark:text-white 
                      leading-[20px] text-start transition-opacity duration-300 
                      group-hover:opacity-0">
                          {item.title}
                        </h3>
                        <p className="text-black dark:text-white text-[12px] leading-[18px] 
                      mt-[6px] transition-opacity duration-300 group-hover:opacity-0">
                          {item.desc}
                        </p>

                        {/* Hover Content */}
                        <div className="absolute inset-0 flex items-center justify-center 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                      bg-black bg-opacity-75 text-white text-[14px] font-medium 
                      rounded-[7px]">
                          <span className="text-center px-2 text-xs">{item.hover}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>



      {/* <div className=" w-full bg-background relative text-white dark:text-black overflow-hidden pt-[45px] md:pt-10 ">
        <div className=" w-[90%] max-w-[1500px] mx-auto ">
          <h1 className="text-center md:text-start text-black dark:text-white font-bold text-xl  leading-[24px] md:leading-[28px] mb-[30px]">
            Powerful features that will make skill verification <br />
            Fast, Fair, and Foolproof
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-[30px]">
            <VideoCard video={videos[0]} />
            <VideoCard video={videos[1]} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <VideoCard video={videos[2]} />
            <VideoCard video={videos[3]} />
            <VideoCard video={videos[4]} />
          </div>


        </div>
      </div> */}


      <div className=" w-full bg-background relative text-white dark:text-black overflow-hidden pt-3 md:pt-10 ">
        <div className=" w-[90%] max-w-[1500px] mx-auto md:px-[35px] py-[35px] bg-transparent md:bg-benefits-card-background rounded-[10px]">
          <div className="max-w-[591px]">
            <h1 className="text-center md:text-start text-black dark:text-white font-bold text-xl leading-[50px] md:leading-[50px]">
              Who Can Benefit from Skillchecker?
            </h1>
            <p className="text-center md:text-start text-black dark:text-white text-base leading-[25px] md:leading-[25px] pt-[15px]">
              At Skillchecker, we empower businesses of all sizes to enhance their hiring processes. Whether you&apos;re a startup looking to build a strong team or an established company aiming to refine your recruitment strategy, our platform is designed to support you.
            </p>
          </div>



          <div className="">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-[32px]">
              {beneficiaryGroups.map((group, index) => (
                <div key={index} className={`border-2 border-black rounded-lg px-3 py-5 ${group.color} bg-feature-card${index + 1}-background`}>
                  <h1 className="text-center text-black dark:md:text-white text-sm font-bold leading-[20px] md:leading-[20px] border-2 bg-[#ffffff] dark:md:bg-black border-black dark:md:border-white rounded-[50px] px-[5px] py-[6px]">
                    {group.title}
                  </h1>

                  <ul className="space-y-3">
                    {group.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex pt-[20px]">
                        <span className="mr-2 text-black">•</span>
                        <div className="text-sm text-black">
                          <span className="font-bold ">{benefit.title} – </span>
                          <span className="text-black">{benefit.description}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center space-y-3">
              <div className="flex flex-wrap justify-center gap-3 w-full">
                {widerAudiences.slice(0, 2).map((category, index) => (
                  <div
                    key={index}
                    className="w-full md:w-auto inline-flex items-center justify-center text-center bg-[#f4f4f4] dark:bg-[#3b3b3d] md:bg-white md:border-2 md:border-black rounded-[10px] md:dark:border-[#545454] md:rounded-full py-7 px-3 md:py-2 md:px-4 text-sm"
                  >
                    <span className="text-black dark:text-white md:font-bold">{category.title}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-3 w-full">
                {widerAudiences.slice(2, 4).map((category, index) => (
                  <div
                    key={index}
                    className="w-full md:w-auto inline-flex items-center justify-center bg-[#f4f4f4] dark:bg-[#3b3b3d] md:bg-white md:border-2 md:border-black rounded-[10px] md:dark:border-[#545454] md:rounded-full py-7 px-3 md:py-2 md:px-4 text-sm text-center"
                  >
                    <span className="text-black dark:text-white md:font-bold">{category.title}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-center w-full">
                <div className="w-full md:w-auto inline-flex items-center justify-center bg-[#f4f4f4] dark:bg-[#3b3b3d] md:bg-white md:border-2 md:border-black md:dark:border-[#545454] rounded-[10px] md:rounded-full py-7 px-3 md:py-2 md:px-4 text-sm text-center">
                  <span className="text-black dark:text-white md:font-bold">{widerAudiences[4].title}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* <div className=" w-full bg-background relative overflow-hidden">

        <div className="  bg-black dark:bg-white dark:text-black text-white mt-[30px] md:mt-10 ">
          <div className="w-full flex flex-wrap md:flex-nowrap items-center py-6 md:py-10 px-6 justify-evenly gap-2 flex-col-reverse md:flex-row">
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
      </div> */}

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
      <div className=" w-full bg-background relative overflow-hidden pt-3 md:pt-10 ">
        <div className=" md:w-[90%] md:max-w-[1500px] md:mx-auto  bg-footer-background text-black mb-4">
          <div className="flex justify-center md:justify-between py-6 px-8 flex-wrap flex-col md:flex-row items-center ">
            <div className="flex flex-col justify-center items-center">
              <div className="flex justify-center md:justify-start text-sm text-center w-full">
                <Image src={logo} alt="logo" width="180" height="24" />
              </div>
              <span className="text-xs text-center inline-block mt-2">
                Terms and conditions{" "}
                <FiArrowUpRight className=" inline-block mr-2" />
                <span>
                  Privacy policy{" "} <FiArrowUpRight className=" inline-block" />
                </span>
                {/* <span className="ml-2">
                  policy{" "} <FiArrowUpRight className=" inline-block" />
                </span> */}
              </span>
            </div>

            <div className="flex gap-3 mt-3 md:mt-0 flex-col md:flex-row items-center justify-center md:justify-between">
              {/* <input placeholder="Email" type="text" className="w-full md:min-w-[235px] h-[50px] bg-transparent text-black py-2 md:py-4 px-5 md:px-5 text-sm  font-medium border-black border-2 focus:border-black active:border-black target:border-black before:border-black after:border-black" /> */}

              <button onClick={requestDemo} className="bg-[#ffffff] text-black py-[12px] px-[20px] text-xs md:text-base font-bold  shadow-[4px_4px_0px_black] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all border-2 border-black">
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


const VideoCard = ({ video }) => (
  <div className=" bg-[#ffffff] dark:bg-[#1f1e20] md:bg-transparent md:dark:bg-transparent p-4 md:p-0 rounded-lg ">
    <div className=" bg-features-card-background rounded-sm aspect-square md:aspect-video w-full mb-2 overflow-hidden">
      {/* <video
        className="w-full h-full object-cover"
        controls
        poster="/video-placeholder.jpg" // Optional: Add a placeholder image
      >
        <source src={video.url} type="video/mp4" />
        Your browser does not support the video tag.
      </video> */}
    </div>
    <div>
      <h3 className="text-sm font-bold text-black dark:text-white mt-4 leading-[34px]">{video.title}</h3>
      <p className="text-sm text-black dark:text-white  leading-[35px]">{video.description}</p>
    </div>
  </div>
);