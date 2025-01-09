'use client'

import React from 'react'
import InterviewScheduleCard from "@/components/interview-schedules/interview-schedule-card";
import { useEffect, useState } from "react";
import { getPublishedInterview } from "@/lib/api/interview";

const ComapanySchedules = () => {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const fetchPublishedInterviews = async () => {
      try {
        const response = await getPublishedInterview();
        setInterviews(response.data);
      } catch (error) {
        console.log("Error fetching interviews:", error);
      }
    };
    fetchPublishedInterviews();
  }, []);
  return (
    <div className=" w-full p-9 h-full">
    <h1 className=" text-4xl font-semibold">Scheduled Interviews</h1>
    <div className=" grid grid-cols-1 gap-9 mt-6 md:grid-cols-2 lg:grid-cols-3">
      {interviews.map((interview, index) => (
        <InterviewScheduleCard
          key={index}
          index={index + 1}
          interview={interview}
          showButton={false}
        />
      ))}
    </div>
  </div>
  )
}

export default ComapanySchedules