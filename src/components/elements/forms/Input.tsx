/**
 * A flexible Input component that supports various input types with validation and error states.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic text input
 * <Input
 *   label="Username"
 *   placeholder="Enter username"
 *   onChange={(e) => console.log(e.target.value)}
 * />
 * 
 * // Input with error state
 * <Input
 *   label="Email"
 *   type="email"
 *   error="Please enter a valid email"
 *   fullWidth
 * />
 * 
 * // Password input
 * <Input
 *   label="Password"
 *   type="password"
 *   required
 * />
 * ```
 * 
 * @property {string} [label] - Input label text
 * @property {string} [error] - Error message to display
 * @property {boolean} [fullWidth=false] - Whether the input should take full width
 * @property {string} [type='text'] - HTML input type
 * @property {string} [placeholder] - Placeholder text
 * @property {boolean} [required] - Whether the input is required
 * @property {boolean} [disabled] - Whether the input is disabled
 * @property {string} [className] - Additional CSS classes
 */
import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  fullWidth = false,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`input-wrapper ${fullWidth ? 'input-full' : ''}`}>
      {label && <label htmlFor={inputId} className="input-label">{label}</label>}
      <input
        id={inputId}
        className={`input-field ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      {error && <span className="input-error-message">{error}</span>}
    </div>
  );
};