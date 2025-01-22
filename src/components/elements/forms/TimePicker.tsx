import React, { useState, useRef, useEffect } from 'react';
import { Clock, ChevronUp, ChevronDown } from 'lucide-react';

interface TimePickerProps {
  value?: string | Date;
  onChange?: (value: string) => void;
  format?: '12' | '24';
  minuteStep?: number;
  minTime?: string;
  maxTime?: string;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  showSeconds?: boolean;
  showMeridiem?: boolean;
  clearable?: boolean;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  format = '24',
  minuteStep = 1,
  minTime,
  maxTime,
  placeholder = 'Select time',
  label,
  error,
  disabled = false,
  readOnly = false,
  required = false,
  showSeconds = false,
  showMeridiem = true,
  clearable = true,
  className = '',
  onFocus,
  onBlur,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [meridiem, setMeridiem] = useState<'AM' | 'PM'>('AM');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Parse initial value
  useEffect(() => {
    if (!value) {
      setInputValue('');
      return;
    }

    const date = value instanceof Date ? value : new Date(`1970-01-01T${value}`);
    if (isNaN(date.getTime())) {
      setInputValue('');
      return;
    }

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    let meridiem: 'AM' | 'PM' = hours >= 12 ? 'PM' : 'AM';

    if (format === '12') {
      hours = hours % 12 || 12;
    }

    setHours(hours);
    setMinutes(minutes);
    setSeconds(seconds);
    setMeridiem(meridiem);
    setInputValue(formatTime(hours, minutes, seconds, format === '12' ? meridiem : undefined));
  }, [value, format]);

  // Format time string
  const formatTime = (h: number, m: number, s: number, mer?: 'AM' | 'PM') => {
    const parts = [
      h.toString().padStart(2, '0'),
      m.toString().padStart(2, '0'),
    ];

    if (showSeconds) {
      parts.push(s.toString().padStart(2, '0'));
    }

    let time = parts.join(':');
    if (mer && format === '12') {
      time += ` ${mer}`;
    }

    return time;
  };

  // Parse time string
  const parseTime = (value: string) => {
    const pattern = showSeconds
      ? /^(\d{1,2}):(\d{1,2}):(\d{1,2})(?: (AM|PM))?$/i
      : /^(\d{1,2}):(\d{1,2})(?: (AM|PM))?$/i;

    const match = value.match(pattern);
    if (!match) return null;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const seconds = showSeconds ? parseInt(match[3], 10) : 0;
    const meridiem = match[showSeconds ? 4 : 3]?.toUpperCase() as 'AM' | 'PM' | undefined;

    if (format === '12' && meridiem) {
      if (hours === 12) {
        hours = meridiem === 'AM' ? 0 : 12;
      } else if (meridiem === 'PM') {
        hours += 12;
      }
    }

    if (
      hours < 0 || hours > 23 ||
      minutes < 0 || minutes > 59 ||
      seconds < 0 || seconds > 59
    ) {
      return null;
    }

    return { hours, minutes, seconds };
  };

  // Validate time against min/max
  const isTimeValid = (h: number, m: number, s: number) => {
    const time = formatTime(h, m, s);
    
    if (minTime && time < minTime) return false;
    if (maxTime && time > maxTime) return false;
    
    return true;
  };

  // Update time
  const updateTime = (newHours: number, newMinutes: number, newSeconds: number, newMeridiem?: 'AM' | 'PM') => {
    let h = newHours;
    if (format === '12' && newMeridiem) {
      if (h === 12) {
        h = newMeridiem === 'AM' ? 0 : 12;
      } else if (newMeridiem === 'PM') {
        h += 12;
      }
    }

    if (!isTimeValid(h, newMinutes, newSeconds)) return;

    const time = formatTime(
      format === '12' ? (h % 12 || 12) : h,
      newMinutes,
      newSeconds,
      format === '12' ? newMeridiem : undefined
    );

    setHours(format === '12' ? (h % 12 || 12) : h);
    setMinutes(newMinutes);
    setSeconds(newSeconds);
    if (newMeridiem) setMeridiem(newMeridiem);
    setInputValue(time);
    onChange?.(time);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const time = parseTime(value);
    if (!time) return;

    const mer = value.toUpperCase().includes('PM') ? 'PM' : 'AM';
    updateTime(time.hours, time.minutes, time.seconds, format === '12' ? mer : undefined);
  };

  // Handle increment/decrement
  const handleIncrement = (type: 'hours' | 'minutes' | 'seconds') => {
    let h = hours;
    let m = minutes;
    let s = seconds;
    let mer = meridiem;

    switch (type) {
      case 'hours':
        if (format === '12') {
          h = h === 12 ? 1 : h + 1;
        } else {
          h = (h + 1) % 24;
        }
        break;
      case 'minutes':
        m = (m + minuteStep) % 60;
        break;
      case 'seconds':
        s = (s + 1) % 60;
        break;
    }

    updateTime(h, m, s, mer);
  };

  const handleDecrement = (type: 'hours' | 'minutes' | 'seconds') => {
    let h = hours;
    let m = minutes;
    let s = seconds;
    let mer = meridiem;

    switch (type) {
      case 'hours':
        if (format === '12') {
          h = h === 1 ? 12 : h - 1;
        } else {
          h = (h + 23) % 24;
        }
        break;
      case 'minutes':
        m = (m - minuteStep + 60) % 60;
        break;
      case 'seconds':
        s = (s + 59) % 60;
        break;
    }

    updateTime(h, m, s, mer);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || readOnly) return;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        handleIncrement('hours');
        break;
      case 'ArrowDown':
        e.preventDefault();
        handleDecrement('hours');
        break;
      case 'Enter':
        e.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`time-picker ${className}`}
    >
      {label && (
        <label className="time-picker-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className="time-picker-input-wrapper">
        <Clock size={16} className="time-picker-icon" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            setIsOpen(true);
            onFocus?.();
          }}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={`time-picker-input ${error ? 'error' : ''}`}
        />
        {isOpen && !disabled && !readOnly && (
          <div className="time-picker-dropdown">
            <div className="time-picker-controls">
              <div className="time-unit">
                <button
                  type="button"
                  onClick={() => handleIncrement('hours')}
                  className="spinner-button"
                >
                  <ChevronUp size={16} />
                </button>
                <span className="time-value">{hours.toString().padStart(2, '0')}</span>
                <button
                  type="button"
                  onClick={() => handleDecrement('hours')}
                  className="spinner-button"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
              <span className="time-separator">:</span>
              <div className="time-unit">
                <button
                  type="button"
                  onClick={() => handleIncrement('minutes')}
                  className="spinner-button"
                >
                  <ChevronUp size={16} />
                </button>
                <span className="time-value">{minutes.toString().padStart(2, '0')}</span>
                <button
                  type="button"
                  onClick={() => handleDecrement('minutes')}
                  className="spinner-button"
                >
                  <ChevronDown size={16} />
                </button>
              </div>
              {showSeconds && (
                <>
                  <span className="time-separator">:</span>
                  <div className="time-unit">
                    <button
                      type="button"
                      onClick={() => handleIncrement('seconds')}
                      className="spinner-button"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <span className="time-value">{seconds.toString().padStart(2, '0')}</span>
                    <button
                      type="button"
                      onClick={() => handleDecrement('seconds')}
                      className="spinner-button"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                </>
              )}
              {format === '12' && showMeridiem && (
                <div className="meridiem-control">
                  <button
                    type="button"
                    className={`meridiem-button ${meridiem === 'AM' ? 'active' : ''}`}
                    onClick={() => updateTime(hours, minutes, seconds, 'AM')}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    className={`meridiem-button ${meridiem === 'PM' ? 'active' : ''}`}
                    onClick={() => updateTime(hours, minutes, seconds, 'PM')}
                  >
                    PM
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && <div className="time-picker-error">{error}</div>}

      <style jsx>{`
        .time-picker {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .time-picker-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--gw-text-secondary);
        }

        .required {
          color: var(--gw-error-500);
          margin-left: 0.25rem;
        }

        .time-picker-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .time-picker-icon {
          position: absolute;
          left: 0.75rem;
          color: var(--gw-text-secondary);
          pointer-events: none;
        }

        .time-picker-input {
          width: 100%;
          padding: 0.5rem 0.75rem 0.5rem 2.5rem;
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          font-size: 0.875rem;
          color: var(--gw-text-primary);
          background-color: var(--gw-background);
          transition: var(--gw-transition);
        }

        .time-picker-input:focus {
          outline: none;
          border-color: var(--gw-primary);
          box-shadow: 0 0 0 2px var(--gw-primary-100);
        }

        .time-picker-input.error {
          border-color: var(--gw-error-500);
        }

        .time-picker-input:disabled {
          background-color: var(--gw-background-secondary);
          cursor: not-allowed;
        }

        .time-picker-dropdown {
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
        }

        .time-picker-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .time-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .spinner-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          padding: 0;
          border: 1px solid var(--gw-border-color);
          background: none;
          color: var(--gw-text-secondary);
          border-radius: var(--gw-border-radius);
          cursor: pointer;
          transition: var(--gw-transition);
        }

        .spinner-button:hover {
          background-color: var(--gw-background-secondary);
          border-color: var(--gw-border-color-hover);
          color: var(--gw-text-primary);
        }

        .time-value {
          font-size: 1.25rem;
          font-weight: 500;
          color: var(--gw-text-primary);
          min-width: 2rem;
          text-align: center;
        }

        .time-separator {
          font-size: 1.25rem;
          font-weight: 500;
          color: var(--gw-text-secondary);
          margin: 0 0.25rem;
        }

        .meridiem-control {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-left: 0.5rem;
        }

        .meridiem-button {
          padding: 0.25rem 0.5rem;
          border: 1px solid var(--gw-border-color);
          background: none;
          color: var(--gw-text-secondary);
          border-radius: var(--gw-border-radius);
          cursor: pointer;
          transition: var(--gw-transition);
          font-size: 0.75rem;
          font-weight: 500;
        }

        .meridiem-button:hover {
          background-color: var(--gw-background-secondary);
          border-color: var(--gw-border-color-hover);
          color: var(--gw-text-primary);
        }

        .meridiem-button.active {
          background-color: var(--gw-primary);
          border-color: var(--gw-primary);
          color: white;
        }

        .time-picker-error {
          font-size: 0.75rem;
          color: var(--gw-error-500);
          margin-top: 0.25rem;
        }

        /* Material Design styles */
        [data-design-system="material"] .time-picker-input {
          border-radius: 4px;
          font-family: var(--gw-font-family);
        }

        [data-design-system="material"] .time-picker-dropdown {
          border-radius: 4px;
          box-shadow: var(--gw-shadow-lg);
        }

        [data-design-system="material"] .spinner-button {
          border-radius: 50%;
        }

        [data-design-system="material"] .meridiem-button {
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }
      `}</style>
    </div>
  );
};