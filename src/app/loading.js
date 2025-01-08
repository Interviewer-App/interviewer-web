"use client";
// import "@/style/loading.css";
import { useEffect } from "react";

export default function Loading() {
  useEffect(() => {
  }, []);

  return (

    <div className="flex justify-center item-center loading">
      <div>
      <p
            className="loading"
            
          >
            Loading.........................
          </p>
      </div>
    </div>
  );
}