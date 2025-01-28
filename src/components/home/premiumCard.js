import React from "react";
import { FaRegCheckCircle } from "react-icons/fa";

export default function premiumCard({
  type,
  icon,
  priceM,
  priceY,
  description,
  features,
  duration,
}) {
  return (
    <div className={` rounded-lg bg-black/30 backdrop-blur-[6px] overflow-hidden border-2 ${type === 'Pro' ? 'border-[#81F0E8]/30' : 'border-slate-500'} border-opacity-20 p-9 flex flex-col items-center h-full`}>
      <div className=" flex justify-start items-center w-full">
        <div className=" bg-gradient-to-t from-black via-black to-slate-500/50 rounded-full p-[1px] mr-4">
          <div className=" h-10 aspect-square bg-background rounded-full flex justify-center items-center">
            {icon}
          </div>
        </div>
        <p className=" text-xl font-semibold">{type}</p>
        {type === "Pro" && (
          <div className=" absolute right-9 top-9 rounded-lg border-2 border-[#81F0E8]/50 text-sm py-1 px-5 md:px-7 text-[#81F0E8]/60">
            Most popular
          </div>
        )}
      </div>
      <div className=" w-full mt-9">
        <h1 className=" text-6xl  md:text-8xl font-semibold">${duration === "MONTHLY" ? priceM : priceY}</h1>
        <p className=" text-sm font-semibold ">per user / {duration === "MONTHLY" ? 'month' : 'year'}</p>
      </div>
      <hr className=" w-full opacity-30 my-5" />
      <p className=" text-base">{description}</p>
      <button className="  bg-white/15 py-3 px-8 rounded-xl mr-3 text-base font-medium w-full my-7">
        Get started
      </button>

      <div className=" w-full">
        <ul className=" text-base w-full text-left space-y-2">
          {features.map((feature, index) => (
            <li key={index}>
              <FaRegCheckCircle className=" text-gray-500 inline-block text-xl mr-3" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
