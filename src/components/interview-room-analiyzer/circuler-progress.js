import React from "react";
function CirculerProgress({ marks, catorgory, subTitleSize, titleSize }) {
  const strokeDashoffset = 251.2 * (1 - marks / 100);
  const gradientId = `gradient-${marks}-${catorgory.replace(/\s+/g, '-')}`;

  const getGradientStops = () => {
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
            stroke={`url(#${gradientId})`}
            strokeWidth="8"
            strokeDasharray="251.2"
            strokeLinecap="round"
            strokeDashoffset={`${marks === 0 ? 251.2 : strokeDashoffset}`}
          />
          <defs>
            <linearGradient
              id={`${gradientId}`}
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
          <p className={`${titleSize} font-bold text-gray-900 dark:text-gray-50 text-center`}>
            {parseInt(marks || 0).toFixed(2)}%
          </p>
          <p className={` ${subTitleSize} text-gray-500 text-center`}>{catorgory}</p>
        </div>
      </div>
    </div>
  );
}
export default CirculerProgress;