// components/Calendar.js

import { useEffect, useState, } from 'react';

const Calendar = ({ selectedDate,setModalOpen,setInterviewDetails,interviews }) => {
  const [dayNumber, setDayNumber] = useState(null);
  const [monthName, setMonthName] = useState('');
  const [dayName, setDayName] = useState('');
  const [year, setYear] = useState(null);

  useEffect(() => {
    const date = selectedDate ? new Date(selectedDate) : new Date();
    
    const dayNumber = date.getDate();
    const lang = navigator.languages;
    const monthName = date.toLocaleString(lang, { month: "long" });
    const dayName = date.toLocaleString(lang, { weekday: "long" });
    const year = date.getFullYear();

    // Update state with the selected date
    setDayNumber(dayNumber);
    setMonthName(monthName);
    setDayName(dayName);
    setYear(year);
  }, [selectedDate]);

  const handleClick = (event) => {
    // Find the interview that corresponds to this clicked date
    const interview = interviews.find(
      (interview) => new Date(interview.startTime).toDateString() === new Date(event).toDateString()
    );
    
    if (interview) {
      // Set modal details if interview is found for the selected day
      setModalOpen(true);
      setInterviewDetails(interview);
    }
  };

  return (
    <div className="calendar">
    {/* Render the calendar details */}
    <p id="monthName">{monthName}</p>
    <p id="dayName">{dayName}</p>
    <p id="dayNumber" onClick={() => handleClick(selectedDate)}>{dayNumber}</p>
    <p id="year">{year}</p>

    {/* Optionally, you can render all interviews for the selected date */}
    {interviews && interviews.map((interview) => (
      new Date(interview.startTime).toDateString() === new Date(selectedDate).toDateString() && (
        <div key={interview.interviewId} onClick={() => handleClick(interview.startTime)}>
          <p>Interview at {new Date(interview.startTime).toLocaleTimeString()}</p>
        </div>
      )
    ))}
  </div>
  );
};

export default Calendar;
