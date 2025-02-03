"use client";
import React, { useEffect, useRef, useState } from "react";
import SurveySwiperComponent from "@/components/ui/survey-swiper";
import { submitSurvey } from "@/lib/api/users";
import { getSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

function SurveyPage() {
  const swiperRef = useRef(null);
  const [userRole, setUserRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const router = useRouter();
  const [id, setId] = useState("");
  const [nextButtonActive, setNextButtonActive] = useState(false);
  const [questionsState, setQuestionsState] = useState([]);
  const [companyQuestions, setCompanyQuestions] = useState([
    {
      Id: 1,
      question: "What is the size of your company?",
      type: "MCQ",
      options: [
        { id: 1, answer: "Fewer than 50 employees" },
        { id: 2, answer: "50-249 employees" },
        { id: 3, answer: "250-999 employees" },
        { id: 4, answer: "1,000+ employees" },
      ],
      givenAnswer: null,
      isAnswered: false,
    },
    {
      Id: 2,
      question: "In which industry does your company operate?",
      type: "MCQ",
      options: [
        { id: 1, answer: "Technology" },
        { id: 2, answer: "Finance" },
        { id: 3, answer: "Healthcare" },
        { id: 4, answer: "Retail" },
        { id: 5, answer: "Manufacturing" },
        { id: 6, answer: "Other" },
      ],
      givenAnswer: null,
      isAnswered: false,
    },
    {
      Id: 3,
      question: "What is your primary reason for using this app?",
      type: "MULTIPLE_CHOICE",
      options: [
        { id: 1, answer: "To streamline the hiring process" },
        { id: 2, answer: "To find qualified candidates" },
        { id: 3, answer: "To reduce time-to-hire" },
        { id: 4, answer: "To improve candidate experience" },
        { id: 5, answer: "Other" },
      ],
      givenAnswer: [],
      isAnswered: false,
    },
    {
      Id: 4,
      question: "How many job roles are you currently looking to fill?",
      type: "MCQ",
      options: [
        { id: 1, answer: "1-5 roles" },
        { id: 2, answer: "6-10 roles" },
        { id: 3, answer: "11-20 roles" },
        { id: 4, answer: " More than 20 roles" },
      ],
      givenAnswer: null,
      isAnswered: false,
    },
    {
      Id: 5,
      question:
        "Which interview types do you find most effective for evaluating candidates?",
      type: "MCQ",
      options: [
        { id: 1, answer: "Technical interview" },
        { id: 2, answer: "Behavioral interview" },
        { id: 3, answer: "Case study" },
        { id: 4, answer: "Panel interview" },
        { id: 5, answer: "Phone/Skype interview" },
      ],
      givenAnswer: null,
      isAnswered: false,
    },
    {
      Id: 6,
      question: "What challenges do you face in the hiring process? ",
      type: "MULTIPLE_CHOICE",
      options: [
        { id: 1, answer: "Finding qualified candidates" },
        { id: 2, answer: "Scheduling interviews" },
        { id: 3, answer: "Assessing cultural fit" },
        { id: 4, answer: "High candidate drop-out rates" },
        { id: 5, answer: "Managing candidate pipelines" },
        { id: 6, answer: "Other" },
      ],
      givenAnswer: [],
      isAnswered: false,
    },
    {
      Id: 7,
      question:
        "How important is it for you to receive feedback from candidates after an interview?",
      type: "MCQ",
      options: [
        { id: 1, answer: "Very important" },
        { id: 2, answer: "Somewhat important" },
        { id: 3, answer: "Neutral" },
        { id: 4, answer: "Somewhat unimportant" },
        { id: 5, answer: "Not important at all" },
      ],
      givenAnswer: null,
      isAnswered: false,
    },
    {
      Id: 8,
      question:
        "Which communication channels do you prefer for interview updates and notifications?",
      type: "MULTIPLE_CHOICE",
      options: [
        { id: 1, answer: "Email" },
        { id: 2, answer: "SMS/Text message" },
        { id: 3, answer: "In-app notifications" },
        { id: 4, answer: "Phone calls" },
        { id: 5, answer: "Other" },
      ],
      givenAnswer: [],
      isAnswered: false,
    },
    {
      Id: 9,
      question:
        "What inspired the company's mission, and how do you plan to achieve it?",
      type: "OPEN_ENDED",
      options: "",
      givenAnswer: "",
      isAnswered: false,
    },
    {
      Id: 10,
      question:
        "What kind of work environment can employees expect here?",
      type: "OPEN_ENDED",
      options: "",
      givenAnswer: "",
      isAnswered: false,
    },
    {
      Id: 11,
      question:
        "What features would you like to see in a hiring and interview management app?",
      type: "OPEN_ENDED",
      options: "",
      givenAnswer: "",
      isAnswered: false,
    },
  ]);

  const [candidateQuestions, setCandidateQuestions] = useState([
    {
      Id: 1,
      question: "What are your primary goals in searching for a new job?",
      type: "MULTIPLE_CHOICE",
      options: [
        { id: 1, answer: "Career advancement" },
        { id: 2, answer: "Better work-life balance" },
        { id: 3, answer: "New industry experience" },
        { id: 4, answer: "Higher salary" },
        { id: 5, answer: "Improve work environment" },
      ],
      givenAnswer: [],
      isAnswered: false,
    },
    {
      Id: 2,
      question: "Which interview formats do you prefer?",
      type: "MULTIPLE_CHOICE",
      options: [
        { id: 1, answer: "Technical interview" },
        { id: 2, answer: "Behavioral interview" },
        { id: 3, answer: "Case study interview" },
        { id: 4, answer: "Panel interview" },
        { id: 5, answer: "Phone/Skype interview" },
      ],
      givenAnswer: [],
      isAnswered: false,
    },
    {
      Id: 3,
      question: "What do you find most challenging in your job search process?",
      type: "MULTIPLE_CHOICE",
      options: [
        { id: 1, answer: "Finding relevant job opportunities" },
        { id: 2, answer: "Preparing for interviews" },
        { id: 3, answer: "Negotiating salary and benefits" },
        { id: 4, answer: "Balancing job search with current job" },
        { id: 5, answer: "Lack of feedback from employers" },
      ],
      givenAnswer: [],
      isAnswered: false,
    },
    {
      Id: 4,
      question:
        "How important is it for you to have access to resources that help you prepare for interviews?",
      type: "MCQ",
      options: [
        { id: 1, answer: "Very important" },
        { id: 2, answer: "Somewhat important" },
        { id: 3, answer: "Neutral" },
        { id: 4, answer: "Somewhat unimportant" },
        { id: 5, answer: "Not important at all" },
      ],
      givenAnswer: null,
      isAnswered: false,
    },
    {
      Id: 5,
      question:
        "Which communication channels do you prefer for interview updates and notifications?",
      type: "MULTIPLE_CHOICE",
      options: [
        { id: 1, answer: "Email" },
        { id: 2, answer: "SMS/Text message" },
        { id: 3, answer: "In-app notifications" },
        { id: 4, answer: "Phone calls" },
        { id: 5, answer: "Other" },
      ],
      givenAnswer: [],
      isAnswered: false,
    },
    {
      Id: 6,
      question:
        "How willing are you to participate in surveys or provide feedback after an interview?",
      type: "MCQ",
      options: [
        { id: 1, answer: "Very willing" },
        { id: 2, answer: "Somewhat willing" },
        { id: 3, answer: "Neutral" },
        { id: 4, answer: "Somewhat unwilling" },
        { id: 5, answer: "Not willing at all" },
      ],
      givenAnswer: null,
      isAnswered: false,
    },
    {
      Id: 7,
      question:
        "What features would you like to see in a job interview preparation app?",
      type: "OPEN_ENDED",
      options: "",
      givenAnswer: "",
      isAnswered: false,
    },
  ]);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      const role = session?.user?.role;
      const userId =
        role === "CANDIDATE"
          ? session?.user?.candidateID
          : session?.user?.companyID;

      setId(userId);
      setUserRole(role);
      const selectedQuestions =
        role === "CANDIDATE" ? candidateQuestions : companyQuestions;
      setQuestions(selectedQuestions);
      setQuestionsState(selectedQuestions.map((q) => ({ ...q })));
    };

    fetchSession();
  }, []);

  useEffect(() => {
    if (questions.length) {
      setProgress(((activeStep + 1) / questions.length) * 100);
    }
  }, [activeStep, questions]);

  useEffect(() => {
    if (questionsState[activeStep]) {
      setNextButtonActive(questionsState[activeStep].isAnswered);
    }
  }, [activeStep, questionsState]);

  const handleNext = () => {
    if (swiperRef.current?.swiper && activeStep < questions.length - 1) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const handlePrev = () => {
    if (swiperRef.current?.swiper && activeStep > 0) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const saveAnswer = async (e) => {
    e.preventDefault();
    try {
      const answers = {
        role: userRole,
        id: id,
        surveys: questionsState.map((question) => ({
          question: question.question,
          answer: question.givenAnswer,
        })),
      };

      const response = await submitSurvey(answers);

      if (response) {
        toast({
          variant: "success",
          title: "Survey submitted successfully",
          description: "Thank you for your feedback!",
        });
        if (userRole === "COMPANY") {
          router.push("/interviews");
        } else if (userRole === "CANDIDATE") {
          router.push("/my-interviews");
        }
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;

        if (data && data.message) {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Answer saving failed: ${data.message}`,
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "An unexpected error occurred. Please try again.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "An unexpected error occurred. Please check your network and try again.",
          action: <ToastAction altText="Try again">Try again</ToastAction>,
        });
      }
    }
  };

  return (
    <div className=" h-full md:h-lvh w-full text-white bg-black flex justify-center items-center">
      <div className=" w-[90%] py-8 md:w-[55%] bg-black max-w-[900px] mx-auto">
        <SurveySwiperComponent
          ref={swiperRef}
          questions={questions}
          activeStep={activeStep}
          setActiveStep={setActiveStep}
          setQuestionsState={setQuestionsState}
          questionsState={questionsState}
        />

        <div className="w-full mt-8">
          <div className="flex items-center mb-3 ">
            <span className="text-sm text-gray-400">
              Step {activeStep + 1} of{" "}
              {
                (userRole === "CANDIDATE"
                  ? candidateQuestions
                  : companyQuestions
                ).length
              }
            </span>
          </div>

          <div className="relative w-full h-2 bg-gray-400 rounded-full">
            <div
              className="absolute top-0 left-0 h-full bg-blue-400 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-5">
            {activeStep !== 0 ? (
              <button
                onClick={handlePrev}
                className=" bg-white text-black text-sm font-semibold py-1 px-4 rounded-md"
              >
                prev
              </button>
            ) : (
              <button></button>
            )}
            {activeStep !==
            (userRole === "CANDIDATE" ? candidateQuestions : companyQuestions)
              .length -
              1 ? (
              <button
                onClick={handleNext}
                className={` ${
                  nextButtonActive ? "block" : "hidden"
                } bg-white text-black text-sm font-semibold py-1 px-4 rounded-md`}
              >
                next
              </button>
            ) : (
              <button
                onClick={saveAnswer}
                className={`  ${
                  nextButtonActive ? "block" : "hidden"
                } bg-white text-black text-sm font-semibold py-1 px-4 rounded-md`}
              >
                submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SurveyPage;
