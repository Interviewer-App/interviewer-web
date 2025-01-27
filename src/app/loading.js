"use client";

import { useEffect } from "react";
import { PuffLoader } from "react-spinners";

export default function Loading() {
  useEffect(() => {}, []);

  return (
    <div className="flex fixed flex-col h-lvh w-full bg-black/80 z-[999] justify-center item-center">
      <div className=" w-full flex justify-center items-center">
        <PuffLoader color="#ffffff" />
      </div>
      <p className=" w-full text-center font-semibold text-xl py-5">
        Loading...
      </p>
    </div>
  );
}
