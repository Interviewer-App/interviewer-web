import { useEffect, useState, } from 'react';

const Calendar = ({ selectedDate, setModalOpen, setInterviewDetails, interviews }) => {
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

        const interview = interviews.find(
            (interview) => new Date(interview.startTime).toDateString() === new Date(event).toDateString()
        );

        if (interview) {

            setModalOpen(true);
            setInterviewDetails(interview);
        }
    };

    return (
        <div className="calendar" onClick={() => handleClick(selectedDate)}>
            <div id="monthName">{monthName}</div>
            <div id="dayName">{dayName}</div>
            <div id="dayNumber">{dayNumber}</div>
            <div id="year">{year}</div>


            {interviews && interviews.map((interview) => (
                new Date(interview.startTime).toDateString() === new Date(selectedDate).toDateString() && (
                    <div key={interview.interviewId} onClick={() => handleClick(interview.startTime)}>
                        <div>Interview at {new Date(interview.startTime).toLocaleTimeString()}</div>
                    </div>
                )
            ))}
        </div>
    );
};

export default Calendar;
