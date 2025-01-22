import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface NumericProps {
  value?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'filled' | 'outlined';
  showControls?: boolean;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const NumericInput: React.FC<NumericProps> = ({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  precision = 0,
  label,
  placeholder,
  error,
  hint,
  disabled = false,
  readOnly = false,
  required = false,
  fullWidth = false,
  size = 'medium',
  variant = 'outlined',
  showControls = true,
  prefix,
  suffix,
  className = '',
}) => {
  const [localValue, setLocalValue] = useState<string>(
    value !== undefined ? formatValue(value) : ''
  );
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const incrementTimer = useRef<NodeJS.Timeout>();
  const decrementTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (value !== undefined) {
      setLocalValue(formatValue(value));
    }
  }, [value]);

  const formatValue = (num: number): string => {
    return num.toFixed(precision);
  };

  const parseValue = (str: string): number => {
    const num = parseFloat(str);
    return Number.isNaN(num) ? 0 : num;
  };

  const clampValue = (num: number): number => {
    const clampedValue = Math.min(Math.max(num, min), max);
    const stepValue = Math.round(clampedValue / step) * step;
    return Number(stepValue.toFixed(precision));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;

    const newValue = e.target.value;
    setLocalValue(newValue);

    if (newValue === '') {
      onChange?.(0);
      return;
    }

    const parsedValue = parseValue(newValue);
    if (!Number.isNaN(parsedValue)) {
      const clampedValue = clampValue(parsedValue);
      onChange?.(clampedValue);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (localValue === '') {
      setLocalValue(formatValue(0));
      onChange?.(0);
      return;
    }

    const parsedValue = parseValue(localValue);
    const clampedValue = clampValue(parsedValue);
    setLocalValue(formatValue(clampedValue));
    onChange?.(clampedValue);
  };

  const handleIncrement = () => {
    if (disabled || readOnly) return;
    const currentValue = parseValue(localValue);
    const newValue = clampValue(currentValue + step);
    setLocalValue(formatValue(newValue));
    onChange?.(newValue);
  };

  const handleDecrement = () => {
    if (disabled || readOnly) return;
    const currentValue = parseValue(localValue);
    const newValue = clampValue(currentValue - step);
    setLocalValue(formatValue(newValue));
    onChange?.(newValue);
  };

  const startIncrement = () => {
    if (disabled || readOnly) return;
    handleIncrement();
    incrementTimer.current = setInterval(handleIncrement, 100);
  };

  const startDecrement = () => {
    if (disabled || readOnly) return;
    handleDecrement();
    decrementTimer.current = setInterval(handleDecrement, 100);
  };

  const stopIncrement = () => {
    if (incrementTimer.current) {
      clearInterval(incrementTimer.current);
    }
  };

  const stopDecrement = () => {
    if (decrementTimer.current) {
      clearInterval(decrementTimer.current);
    }
  };

  return (
    <div className={`numeric-wrapper ${fullWidth ? 'full-width' : ''} ${className}`}>
      {label && (
        <label className="numeric-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div
        className={`
          numeric-container
          numeric-${variant}
          numeric-${size}
          ${error ? 'error' : ''}
          ${isFocused ? 'focused' : ''}
          ${disabled ? 'disabled' : ''}
          ${readOnly ? 'readonly' : ''}
        `}
      >
        {prefix && <span className="numeric-affix prefix">{prefix}</span>}
        <input
          ref={inputRef}
          type="number"
          value={localValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          placeholder={placeholder}
          className="numeric-input"
        />
        {suffix && <span className="numeric-affix suffix">{suffix}</span>}
        {showControls && !readOnly && (
          <div className="numeric-controls">
            <button
              type="button"
              className="numeric-control"
              onMouseDown={startIncrement}
              onMouseUp={stopIncrement}
              onMouseLeave={stopIncrement}
              disabled={disabled || parseValue(localValue) >= max}
              aria-label="Increment"
            >
              <ChevronUp size={size === 'small' ? 14 : size === 'large' ? 18 : 16} />
            </button>
            <button
              type="button"
              className="numeric-control"
              onMouseDown={startDecrement}
              onMouseUp={stopDecrement}
              onMouseLeave={stopDecrement}
              disabled={disabled || parseValue(localValue) <= min}
              aria-label="Decrement"
            >
              <ChevronDown size={size === 'small' ? 14 : size === 'large' ? 18 : 16} />
            </button>
          </div>
        )}
      </div>
      {(error || hint) && (
        <div className={`numeric-message ${error ? 'error' : ''}`}>
          {error || hint}
        </div>
      )}

      <style jsx>{`
        .numeric-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .numeric-wrapper.full-width {
          width: 100%;
        }

        .numeric-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--gw-text-secondary);
        }

        .required {
          color: var(--gw-error-500);
          margin-left: 0.25rem;
        }

        .numeric-container {
          position: relative;
          display: flex;
          align-items: center;
          transition: var(--gw-transition);
        }

        /* Variants */
        .numeric-outlined {
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          background-color: var(--gw-background);
        }

        .numeric-outlined.focused {
          border-color: var(--gw-primary);
          box-shadow: 0 0 0 2px var(--gw-primary-100);
        }

        .numeric-filled {
          border: none;
          border-radius: var(--gw-border-radius);
          background-color: var(--gw-background-secondary);
        }

        .numeric-filled.focused {
          background-color: var(--gw-background-tertiary);
        }

        .numeric-default {
          border: none;
          border-bottom: 1px solid var(--gw-border-color);
          border-radius: 0;
          background-color: transparent;
        }

        .numeric-default.focused {
          border-bottom-color: var(--gw-primary);
        }

        /* Sizes */
        .numeric-small {
          min-height: 2rem;
          font-size: 0.875rem;
        }

        .numeric-medium {
          min-height: 2.5rem;
          font-size: 1rem;
        }

        .numeric-large {
          min-height: 3rem;
          font-size: 1.125rem;
        }

        /* States */
        .numeric-container.error {
          border-color: var(--gw-error-500);
        }

        .numeric-container.error.focused {
          box-shadow: 0 0 0 2px var(--gw-error-100);
        }

        .numeric-container.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background-color: var(--gw-background-secondary);
        }

        .numeric-container.readonly {
          background-color: var(--gw-background-secondary);
        }

        .numeric-input {
          width: 100%;
          padding: 0.5rem;
          border: none;
          background: none;
          color: var(--gw-text-primary);
          font-family: inherit;
          font-size: inherit;
          -moz-appearance: textfield;
        }

        .numeric-input::-webkit-outer-spin-button,
        .numeric-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .numeric-input:focus {
          outline: none;
        }

        .numeric-affix {
          padding: 0 0.5rem;
          color: var(--gw-text-secondary);
          font-size: 0.875em;
        }

        .numeric-controls {
          display: flex;
          flex-direction: column;
          border-left: 1px solid var(--gw-border-color);
        }

        .numeric-control {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem;
          border: none;
          background: none;
          color: var(--gw-text-secondary);
          cursor: pointer;
          transition: var(--gw-transition);
        }

        .numeric-control:hover:not(:disabled) {
          background-color: var(--gw-background-secondary);
          color: var(--gw-text-primary);
        }

        .numeric-control:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .numeric-message {
          font-size: 0.75rem;
          color: var(--gw-text-secondary);
        }

        .numeric-message.error {
          color: var(--gw-error-500);
        }

        /* Material Design styles */
        [data-design-system="material"] .numeric-wrapper {
          font-family: var(--gw-font-family);
        }

        [data-design-system="material"] .numeric-outlined {
          border-radius: 4px;
        }

        [data-design-system="material"] .numeric-filled {
          border-radius: 4px 4px 0 0;
        }

        [data-design-system="material"] .numeric-default {
          border-bottom-width: 2px;
        }

        [data-design-system="material"] .numeric-control {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};