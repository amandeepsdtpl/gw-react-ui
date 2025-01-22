import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  className?: string;
}

export const Calendar: React.FC<CalendarProps> = ({
  value = new Date(),
  onChange,
  minDate,
  maxDate,
  disabledDates = [],
  className = '',
}) => {
  const [currentDate, setCurrentDate] = useState(value);
  const [selectedDate, setSelectedDate] = useState(value);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return disabledDates.some(disabledDate =>
      disabledDate.toDateString() === date.toDateString()
    );
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    if (!isDateDisabled(newDate)) {
      setSelectedDate(newDate);
      onChange?.(newDate);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    ));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    ));
  };

  const renderDays = () => {
    const days = [];
    const totalDays = firstDayOfMonth + daysInMonth;
    const rows = Math.ceil(totalDays / 7);

    for (let i = 0; i < rows * 7; i++) {
      const day = i - firstDayOfMonth + 1;
      const isCurrentMonth = day > 0 && day <= daysInMonth;
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const isSelected = isCurrentMonth &&
        selectedDate.toDateString() === date.toDateString();
      const isDisabled = isCurrentMonth && isDateDisabled(date);
      const isToday = isCurrentMonth &&
        date.toDateString() === new Date().toDateString();

      days.push(
        <button
          key={i}
          onClick={() => isCurrentMonth && handleDateClick(day)}
          disabled={!isCurrentMonth || isDisabled}
          className={`calendar-day ${
            isCurrentMonth ? 'current-month' : 'other-month'
          } ${isSelected ? 'selected' : ''} ${
            isToday ? 'today' : ''
          } ${isDisabled ? 'disabled' : ''}`}
        >
          {isCurrentMonth ? day : ''}
        </button>
      );
    }

    return days;
  };

  return (
    <div className={`calendar ${className}`}>
      <div className="calendar-header">
        <button
          onClick={handlePrevMonth}
          className="calendar-nav-button"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="calendar-title">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </div>
        <button
          onClick={handleNextMonth}
          className="calendar-nav-button"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="calendar-weekdays">
        {dayNames.map(day => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-days">
        {renderDays()}
      </div>

      <style jsx>{`
        .calendar {
          display: inline-block;
          background-color: var(--gw-background);
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          padding: 1rem;
          user-select: none;
        }

        .calendar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .calendar-title {
          font-weight: 500;
          color: var(--gw-text-primary);
        }

        .calendar-nav-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border: none;
          background: none;
          border-radius: var(--gw-border-radius);
          color: var(--gw-text-secondary);
          cursor: pointer;
          transition: var(--gw-transition);
        }

        .calendar-nav-button:hover {
          background-color: var(--gw-background-secondary);
          color: var(--gw-text-primary);
        }

        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.25rem;
          margin-bottom: 0.5rem;
        }

        .calendar-weekday {
          text-align: center;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--gw-text-secondary);
        }

        .calendar-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.25rem;
        }

        .calendar-day {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: none;
          font-size: 0.875rem;
          color: var(--gw-text-primary);
          border-radius: var(--gw-border-radius);
          cursor: pointer;
          transition: var(--gw-transition);
        }

        .calendar-day:hover:not(:disabled):not(.selected) {
          background-color: var(--gw-background-secondary);
        }

        .calendar-day.other-month {
          visibility: hidden;
        }

        .calendar-day.selected {
          background-color: var(--gw-primary);
          color: white;
        }

        .calendar-day.today {
          font-weight: 600;
          color: var(--gw-primary);
        }

        .calendar-day.today.selected {
          color: white;
        }

        .calendar-day.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Material Design Styles */
        [data-design-system="material"] .calendar {
          box-shadow: var(--gw-shadow-md);
          border: none;
        }

        [data-design-system="material"] .calendar-day {
          border-radius: 50%;
        }

        [data-design-system="material"] .calendar-day.selected {
          box-shadow: var(--gw-shadow-sm);
        }
      `}</style>
    </div>
  );
};