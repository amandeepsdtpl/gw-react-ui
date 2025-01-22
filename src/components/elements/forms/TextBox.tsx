import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, X } from 'lucide-react';

interface TextBoxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'filled' | 'underlined';
  fullWidth?: boolean;
  clearable?: boolean;
  showPasswordToggle?: boolean;
  mask?: string;
  maskChar?: string;
  unmask?: boolean;
  className?: string;
  onValueChange?: (value: string) => void;
}

export const TextBox: React.FC<TextBoxProps> = ({
  label,
  error,
  hint,
  icon,
  iconPosition = 'left',
  size = 'medium',
  variant = 'outlined',
  fullWidth = false,
  clearable = false,
  showPasswordToggle = false,
  mask,
  maskChar = '_',
  unmask = false,
  className = '',
  type = 'text',
  value,
  onChange,
  onValueChange,
  disabled,
  required,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [maskedValue, setMaskedValue] = useState('');
  const [unmaskedValue, setUnmaskedValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize masked value
  useEffect(() => {
    if (mask && value) {
      const { maskedValue, unmaskedValue } = applyMask(String(value), mask, maskChar);
      setMaskedValue(maskedValue);
      setUnmaskedValue(unmaskedValue);
    }
  }, [value, mask, maskChar]);

  // Apply mask to input value
  const applyMask = (value: string, mask: string, maskChar: string) => {
    let maskedValue = '';
    let unmaskedValue = '';
    let valueIndex = 0;

    for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
      const maskChar = mask[i];
      const valueChar = value[valueIndex];

      if (maskChar === '9') {
        // Digit
        if (/\d/.test(valueChar)) {
          maskedValue += valueChar;
          unmaskedValue += valueChar;
          valueIndex++;
        } else {
          maskedValue += '_';
        }
      } else if (maskChar === 'a') {
        // Letter
        if (/[a-zA-Z]/.test(valueChar)) {
          maskedValue += valueChar;
          unmaskedValue += valueChar;
          valueIndex++;
        } else {
          maskedValue += '_';
        }
      } else if (maskChar === '*') {
        // Any character
        maskedValue += valueChar;
        unmaskedValue += valueChar;
        valueIndex++;
      } else {
        // Literal character
        maskedValue += maskChar;
        if (valueChar === maskChar) {
          valueIndex++;
        }
      }
    }

    return { maskedValue, unmaskedValue };
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (mask) {
      const { maskedValue, unmaskedValue } = applyMask(newValue, mask, maskChar);
      setMaskedValue(maskedValue);
      setUnmaskedValue(unmaskedValue);
      newValue = unmask ? unmaskedValue : maskedValue;
    }

    onChange?.(e);
    onValueChange?.(newValue);
  };

  // Handle clear button click
  const handleClear = () => {
    if (inputRef.current) {
      const event = new Event('input', { bubbles: true });
      inputRef.current.value = '';
      inputRef.current.dispatchEvent(event);
    }
  };

  // Handle password toggle
  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  // Get input type
  const getInputType = () => {
    if (type === 'password') {
      return showPassword ? 'text' : 'password';
    }
    return type;
  };

  return (
    <div className={`textbox-wrapper ${fullWidth ? 'full-width' : ''} ${className}`}>
      {label && (
        <label className="textbox-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className={`
        textbox-container
        textbox-${variant}
        textbox-${size}
        ${error ? 'error' : ''}
        ${isFocused ? 'focused' : ''}
        ${disabled ? 'disabled' : ''}
      `}>
        {icon && iconPosition === 'left' && (
          <span className="textbox-icon left">{icon}</span>
        )}
        <input
          ref={inputRef}
          type={getInputType()}
          value={mask ? maskedValue : value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          required={required}
          className={`
            textbox-input
            ${icon && iconPosition === 'left' ? 'has-left-icon' : ''}
            ${(icon && iconPosition === 'right') || clearable || showPasswordToggle ? 'has-right-icon' : ''}
          `}
          {...props}
        />
        <div className="textbox-actions">
          {icon && iconPosition === 'right' && (
            <span className="textbox-icon right">{icon}</span>
          )}
          {type === 'password' && showPasswordToggle && (
            <button
              type="button"
              className="textbox-action-button"
              onClick={handlePasswordToggle}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
          {clearable && value && !disabled && (
            <button
              type="button"
              className="textbox-action-button"
              onClick={handleClear}
              tabIndex={-1}
              aria-label="Clear input"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      {(error || hint) && (
        <div className={`textbox-message ${error ? 'error' : ''}`}>
          {error || hint}
        </div>
      )}

      <style jsx>{`
        .textbox-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .textbox-wrapper.full-width {
          width: 100%;
        }

        .textbox-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--gw-text-secondary);
        }

        .required {
          color: var(--gw-error-500);
          margin-left: 0.25rem;
        }

        .textbox-container {
          position: relative;
          display: flex;
          align-items: center;
          transition: var(--gw-transition);
        }

        /* Variants */
        .textbox-outlined {
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          background-color: var(--gw-background);
        }

        .textbox-outlined.focused {
          border-color: var(--gw-primary);
          box-shadow: 0 0 0 2px var(--gw-primary-100);
        }

        .textbox-filled {
          border: none;
          border-radius: var(--gw-border-radius);
          background-color: var(--gw-background-secondary);
        }

        .textbox-filled.focused {
          background-color: var(--gw-background-tertiary);
        }

        .textbox-underlined {
          border: none;
          border-bottom: 1px solid var(--gw-border-color);
          border-radius: 0;
          background-color: transparent;
        }

        .textbox-underlined.focused {
          border-bottom-color: var(--gw-primary);
        }

        /* Sizes */
        .textbox-small {
          min-height: 2rem;
        }

        .textbox-medium {
          min-height: 2.5rem;
        }

        .textbox-large {
          min-height: 3rem;
        }

        /* States */
        .textbox-container.error {
          border-color: var(--gw-error-500);
        }

        .textbox-container.error.focused {
          box-shadow: 0 0 0 2px var(--gw-error-100);
        }

        .textbox-container.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background-color: var(--gw-background-secondary);
        }

        /* Input */
        .textbox-input {
          width: 100%;
          height: 100%;
          padding: 0.5rem;
          border: none;
          background: none;
          color: var(--gw-text-primary);
          font-size: 0.875rem;
          outline: none;
        }

        .textbox-input.has-left-icon {
          padding-left: 2.5rem;
        }

        .textbox-input.has-right-icon {
          padding-right: 2.5rem;
        }

        .textbox-input:disabled {
          cursor: not-allowed;
        }

        /* Icons and Actions */
        .textbox-icon {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 100%;
          color: var(--gw-text-secondary);
          pointer-events: none;
        }

        .textbox-icon.left {
          left: 0;
        }

        .textbox-icon.right {
          right: 0;
        }

        .textbox-actions {
          position: absolute;
          right: 0;
          height: 100%;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding-right: 0.5rem;
        }

        .textbox-action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.5rem;
          height: 1.5rem;
          padding: 0;
          border: none;
          background: none;
          color: var(--gw-text-secondary);
          border-radius: var(--gw-border-radius);
          cursor: pointer;
          transition: var(--gw-transition);
        }

        .textbox-action-button:hover {
          background-color: var(--gw-background-secondary);
          color: var(--gw-text-primary);
        }

        /* Message */
        .textbox-message {
          font-size: 0.75rem;
          color: var(--gw-text-secondary);
        }

        .textbox-message.error {
          color: var(--gw-error-500);
        }

        /* Material Design styles */
        [data-design-system="material"] .textbox-outlined {
          border-radius: 4px;
        }

        [data-design-system="material"] .textbox-filled {
          border-radius: 4px 4px 0 0;
        }

        [data-design-system="material"] .textbox-underlined {
          border-bottom-width: 2px;
        }

        [data-design-system="material"] .textbox-label {
          font-family: var(--gw-font-family);
          font-weight: 500;
        }

        [data-design-system="material"] .textbox-action-button {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};