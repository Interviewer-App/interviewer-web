import React from "react";

function CirculerProgress({ marks, catorgory }) {
  const strokeDashoffset = 251.2 * (1 - marks / 100);

  const getGradientStops = () => {
    debugger
    if (marks <= 25) {
      return (
        <>
          <stop offset="0%" stopColor="#C30010" />
          <stop offset="100%" stopColor="#D1001F" />
        </>
      );
    } else if (marks <= 50) {
      return (
        <>
          <stop offset="0%" stopColor="#FC6600" />
          <stop offset="100%" stopColor="#EF820D" />
        </>
      );
    } else if (marks <= 75) {
      return (
        <>
          <stop offset="0%" stopColor="#FFBA00" />
          <stop offset="100%" stopColor="#FFD800" />
        </>
      );
    } else {
      return (
        <>
          <stop offset="0%" stopColor="#3CB043" />
          <stop offset="100%" stopColor="#03C04A" />
        </>
      );
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative w-[200px] h-[200px]">
        <svg
          className="absolute top-0 left-0 w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="#14161a"
            strokeWidth="8"
          />

          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="url(#progress-gradient)"
            strokeWidth="8"
            strokeDasharray="251.2"
            strokeLinecap="round"
            strokeDashoffset={strokeDashoffset}
          />

          <defs>
            <linearGradient
              key={marks}
              id="progress-gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              {getGradientStops()}
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-900 dark:text-gray-50">
          <p className="text-4xl font-bold text-gray-900 dark:text-gray-50">
            {marks}%
          </p>
          <p className=" text-sm text-gray-500">{catorgory}</p>
        </div>
      </div>
    </div>
  );
}

export default CirculerProgress;
