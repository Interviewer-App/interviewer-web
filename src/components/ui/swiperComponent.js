import React, { forwardRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

// Make sure to properly forward the ref
const SwiperComponent = forwardRef(({ questions, onSlideChange }, ref) => {
  return (
    <Swiper
      ref={ref} // Forward the ref to the Swiper instance
      spaceBetween={50}
      slidesPerView={1}
      onSlideChange={(swiper) => onSlideChange(swiper.activeIndex)} // Callback for slide change
      speed={500} // Smooth animation speed
      effect="slide"
      grabCursor={true} // Changes cursor when dragging
    >
      {questions.map((question, index) => (
        <SwiperSlide key={index}>
          <div className="p-8 h-[300px] bg-neutral-900 text-white shadow-md flex flex-col justify-center">
            <h1 className="text-2xl font-semibold">Question {index + 1}</h1>
            <p className="text-lg text-white pt-5">{question}</p>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
});
SwiperComponent.displayName = 'MyComponent';

export default SwiperComponent;
