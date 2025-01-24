import React, { forwardRef, use, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const ServeySwiperComponent = forwardRef(
  ({ questions, onSlideChange, setQuestionsState, questionsState }, ref) => {
    const [textAnswer, setTextAnswer] = useState("");

    useEffect(() => {
      setQuestionsState(questions);
    }, []);

    const handleSelect = (question, answer) => {
      setQuestionsState((prevQuestions) =>
        prevQuestions.map((q) => {
          if (q.Id === question.Id) {
            if (q.type === "MULTIPLE_CHOICE") {
              const newGivenAnswer = q.givenAnswer.includes(answer)
                ? q.givenAnswer.filter((option) => option !== answer)
                : [...q.givenAnswer, answer];
              return { ...q, givenAnswer: newGivenAnswer };
            }
            if (q.type === "MCQ") {
              return { ...q, givenAnswer: answer };
            }
            if (q.type === "OPEN_ENDED") {
              return { ...q, givenAnswer: textAnswer };
            }
          }
          return q;
        })
      );
    };

    return (
      <Swiper
        ref={ref}
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={(swiper) => onSlideChange(swiper.activeIndex)}
        speed={500}
        effect="slide"
        grabCursor={false}
        allowTouchMove={false}
      >
        {questions.map((question, index) => (
          <SwiperSlide key={question.Id}>
            <div className=" md:min-h-[400px] bg-transparent text-white shadow-md ">
              <h1 className="text-2xl font-semibold">Question {index + 1}</h1>
              <p className="text-lg text-white pt-8">{question.question}</p>
              <p className="text-sm text-gray-500 py-2">
                {question.type === "MCQ"
                  ? "Please select one option."
                  : question.type === "MULTIPLE_CHOICE"
                  ? "You can select multiple options."
                  : "Provide your answer below."}
              </p>

              {question.type === "MCQ" && (
                <div className="w-[80%] mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-2">
                  {question.options.map((option) => (
                    <div key={option.id}>
                      <span
                        onClick={() => handleSelect(question, option.answer)}
                        className={`${
                          questionsState.find((q) => q.Id === question.Id)
                            ?.givenAnswer === option.answer
                            ? "border-blue-700 text-blue-400 bg-blue-700/20"
                            : "border-gray-700 text-gray-400 bg-gray-700/20"
                        } border-2 flex items-center h-16 justify-start px-4 my-2 cursor-pointer rounded-md`}
                      >
                        {option.answer}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {question.type === "MULTIPLE_CHOICE" && (
                <div className="w-[80%] mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-2">
                  {question.options.map((option) => (
                    <div key={option.id}>
                      <span
                        onClick={() => handleSelect(question, option.answer)}
                        className={`${
                          questionsState
                            .find((q) => q.Id === question.Id)
                            ?.givenAnswer?.includes(option.answer)
                            ? "border-blue-700 text-blue-400 bg-blue-700/20"
                            : "border-gray-700 text-gray-400 bg-gray-700/20"
                        } border-2 flex items-center h-16 justify-start px-4 my-2 rounded-md cursor-pointer`}
                      >
                        <span>{option.answer}</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {question.type === "OPEN_ENDED" && (
                <div className=" w-full mx-auto mt-8">
                  <textarea
                    placeholder="Enter your answer here"
                    value={question.givenAnswer || textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                    onKeyUp={(e) => handleSelect(question, textAnswer)}
                    className="w-full h-[400px] md:h-[200px] border-2 overflow-y-auto border-gray-700 bg-gray-700/20 py-3 text-sm rounded-md px-4"
                  />
                </div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }
);
ServeySwiperComponent.displayName = "MyComponent";

export default ServeySwiperComponent;
