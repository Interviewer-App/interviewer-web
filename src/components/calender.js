// components/Calendar.js

import { useEffect, useState, } from 'react';

const Calendar = ({ selectedDate,setModalOpen}) => {
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

  const handleClick = ()  =>{
    setModalOpen(true)
  }

  return (
    <div className="calendar" onClick={handleClick}>
      <p id="monthName">{monthName}</p>
      <p id="dayName">{dayName}</p>
      <p id="dayNumber">{dayNumber}</p>
      <p id="year">{year}</p>
    </div>
  );
};

export default Calendar;
