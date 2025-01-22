import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Date[];
  format?: string;
  clearable?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'filled' | 'underlined';
  fullWidth?: boolean;
  className?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Select date',
  error,
  hint,
  disabled = false,
  readOnly = false,
  required = false,
  minDate,
  maxDate,
  disabledDates = [],
  format = 'MM/dd/yyyy',
  clearable = true,
  size = 'medium',
  variant = 'outlined',
  fullWidth = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const [inputValue, setInputValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update input value when value prop changes
  useEffect(() => {
    setInputValue(value ? formatDate(value) : '');
  }, [value]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format date according to specified format
  const formatDate = (date: Date): string => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    return format
      .replace('MM', month)
      .replace('dd', day)
      .replace('yyyy', year.toString());
  };

  // Parse date from input value
  const parseDate = (value: string): Date | null => {
    const parts = value.split('/');
    if (parts.length !== 3) return null;

    const month = parseInt(parts[0], 10) - 1;
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    const date = new Date(year, month, day);
    if (isNaN(date.getTime())) return null;

    return date;
  };

  const isDateDisabled = (date: Date): boolean => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return disabledDates.some(
      disabledDate =>
        disabledDate.getFullYear() === date.getFullYear() &&
        disabledDate.getMonth() === date.getMonth() &&
        disabledDate.getDate() === date.getDate()
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const date = parseDate(newValue);
    if (date && !isDateDisabled(date)) {
      onChange?.(date);
      setCurrentMonth(date);
    }
  };

  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date)) return;

    onChange?.(date);
    setInputValue(formatDate(date));
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || readOnly) return;

    onChange?.(undefined as any);
    setInputValue('');
    setCurrentMonth(new Date());
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => {
      const date = new Date(prev);
      date.setMonth(date.getMonth() - 1);
      return date;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => {
      const date = new Date(prev);
      date.setMonth(date.getMonth() + 1);
      return date;
    });
  };

  const renderCalendar = () => {
    const monthStart = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const monthEnd = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay());

    const weeks = [];
    let days = [];
    let day = new Date(startDate);

    while (day <= monthEnd || days.length > 0) {
      if (days.length === 7) {
        weeks.push(days);
        days = [];
      }

      const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
      const isSelected = value && 
        day.getDate() === value.getDate() &&
        day.getMonth() === value.getMonth() &&
        day.getFullYear() === value.getFullYear();
      const isToday = 
        day.getDate() === new Date().getDate() &&
        day.getMonth() === new Date().getMonth() &&
        day.getFullYear() === new Date().getFullYear();
      const isDisabled = isDateDisabled(day);

      days.push(
        <button
          key={day.toISOString()}
          onClick={() => handleDateSelect(new Date(day))}
          className={`
            calendar-day
            ${isCurrentMonth ? 'current-month' : 'other-month'}
            ${isSelected ? 'selected' : ''}
            ${isToday ? 'today' : ''}
            ${isDisabled ? 'disabled' : ''}
          `}
          disabled={isDisabled}
          type="button"
        >
          {day.getDate()}
        </button>
      );

      day.setDate(day.getDate() + 1);
    }

    if (days.length > 0) {
      weeks.push(days);
    }

    return weeks;
  };

  return (
    <div
      ref={containerRef}
      className={`datepicker-wrapper ${fullWidth ? 'full-width' : ''} ${className}`}
    >
      {label && (
        <label className="datepicker-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div
        className={`
          datepicker-container
          datepicker-${variant}
          datepicker-${size}
          ${error ? 'error' : ''}
          ${isOpen ? 'open' : ''}
          ${disabled ? 'disabled' : ''}
          ${readOnly ? 'readonly' : ''}
        `}
        onClick={() => !disabled && !readOnly && setIsOpen(true)}
      >
        <CalendarIcon size={16} className="datepicker-icon" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className="datepicker-input"
        />
        <div className="datepicker-actions">
          {clearable && inputValue && !disabled && !readOnly && (
            <button
              type="button"
              className="clear-button"
              onClick={handleClear}
              aria-label="Clear date"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      {isOpen && (
        <div className="datepicker-dropdown">
          <div className="calendar-header">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="calendar-nav-button"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="current-month">
              {currentMonth.toLocaleString('default', {
                month: 'long',
                year: 'numeric',
              })}
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              className="calendar-nav-button"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <div className="calendar-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="weekday">
                {day}
              </div>
            ))}
          </div>
          <div className="calendar-days">
            {renderCalendar().map((week, i) => (
              <div key={i} className="calendar-week">
                {week}
              </div>
            ))}
          </div>
        </div>
      )}
      {(error || hint) && (
        <div className={`datepicker-message ${error ? 'error' : ''}`}>
          {error || hint}
        </div>
      )}

      <style jsx>{`
        .datepicker-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          position: relative;
        }

        .datepicker-wrapper.full-width {
          width: 100%;
        }

        .datepicker-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--gw-text-secondary);
        }

        .required {
          color: var(--gw-error-500);
          margin-left: 0.25rem;
        }

        .datepicker-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          transition: var(--gw-transition);
        }

        /* Variants */
        .datepicker-outlined {
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          background-color: var(--gw-background);
        }

        .datepicker-outlined.open {
          border-color: var(--gw-primary);
          box-shadow: 0 0 0 2px var(--gw-primary-100);
        }

        .datepicker-filled {
          border: none;
          border-radius: var(--gw-border-radius);
          background-color: var(--gw-background-secondary);
        }

        .datepicker-filled.open {
          background-color: var(--gw-background-tertiary);
        }

        .datepicker-underlined {
          border: none;
          border-bottom: 1px solid var(--gw-border-color);
          border-radius: 0;
          background-color: transparent;
        }

        .datepicker-underlined.open {
          border-bottom-color: var(--gw-primary);
        }

        /* Sizes */
        .datepicker-small {
          min-height: 2rem;
          font-size: 0.875rem;
        }

        .datepicker-medium {
          min-height: 2.5rem;
          font-size: 1rem;
        }

        .datepicker-large {
          min-height: 3rem;
          font-size: 1.125rem;
        }

        /* States */
        .datepicker-container.error {
          border-color: var(--gw-error-500);
        }

        .datepicker-container.error.open {
          box-shadow: 0 0 0 2px var(--gw-error-100);
        }

        .datepicker-container.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background-color: var(--gw-background-secondary);
        }

        .datepicker-container.readonly {
          cursor: default;
          background-color: var(--gw-background-secondary);
        }

        .datepicker-icon {
          color: var(--gw-text-secondary);
        }

        .datepicker-input {
          flex: 1;
          min-width: 0;
          border: none;
          background: none;
          color: var(--gw-text-primary);
          font-family: inherit;
          font-size: inherit;
          outline: none;
        }

        .datepicker-actions {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .clear-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem;
          border: none;
          background: none;
          color: var(--gw-text-secondary);
          cursor: pointer;
          border-radius: var(--gw-border-radius);
          transition: var(--gw-transition);
        }

        .clear-button:hover {
          background-color: var(--gw-background-secondary);
          color: var(--gw-text-primary);
        }

        .datepicker-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 0.25rem;
          padding: 1rem;
          background-color: var(--gw-background);
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          box-shadow: var(--gw-shadow-lg);
          z-index: 10;
          animation: dropdown-slide 0.2s ease-out;
        }

        .calendar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .calendar-nav-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          padding: 0;
          border: none;
          background: none;
          color: var(--gw-text-secondary);
          cursor: pointer;
          border-radius: var(--gw-border-radius);
          transition: var(--gw-transition);
        }

        .calendar-nav-button:hover {
          background-color: var(--gw-background-secondary);
          color: var(--gw-text-primary);
        }

        .current-month {
          font-weight: 500;
          color: var(--gw-text-primary);
        }

        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.25rem;
          margin-bottom: 0.5rem;
        }

        .weekday {
          text-align: center;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--gw-text-secondary);
        }

        .calendar-days {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .calendar-week {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.25rem;
        }

        .calendar-day {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          border: none;
          background: none;
          font-size: 0.875rem;
          color: var(--gw-text-primary);
          cursor: pointer;
          border-radius: var(--gw-border-radius);
          transition: var(--gw-transition);
        }

        .calendar-day:hover:not(:disabled) {
          background-color: var(--gw-background-secondary);
        }

        .calendar-day.other-month {
          color: var(--gw-text-secondary);
        }

        .calendar-day.selected {
          background-color: var(--gw-primary);
          color: white;
          font-weight: 500;
        }

        .calendar-day.today {
          border: 2px solid var(--gw-primary);
          font-weight: 500;
        }

        .calendar-day.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .datepicker-message {
          font-size: 0.75rem;
          color: var(--gw-text-secondary);
        }

        .datepicker-message.error {
          color: var(--gw-error-500);
        }

        @keyframes dropdown-slide {
          from {
            opacity: 0;
            transform: translateY(-0.5rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Material Design styles */
        [data-design-system="material"] .datepicker-wrapper {
          font-family: var(--gw-font-family);
        }

        [data-design-system="material"] .datepicker-outlined {
          border-radius: 4px;
        }

        [data-design-system="material"] .datepicker-filled {
          border-radius: 4px 4px 0 0;
        }

        [data-design-system="material"] .datepicker-underlined {
          border-bottom-width: 2px;
        }

        [data-design-system="material"] .datepicker-dropdown {
          border-radius: 4px;
          box-shadow: var(--gw-shadow-lg);
        }

        [data-design-system="material"] .calendar-nav-button {
          border-radius: 50%;
        }

        [data-design-system="material"] .calendar-day {
          border-radius: 50%;
        }

        [data-design-system="material"] .calendar-day.selected {
          box-shadow: var(--gw-shadow-sm);
        }

        [data-design-system="material"] .clear-button {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};