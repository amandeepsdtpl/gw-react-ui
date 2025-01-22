import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface MaskedTextBoxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'size'> {
  value?: string;
  onChange?: (value: string, unmaskedValue: string) => void;
  mask: string;
  maskChar?: string;
  formatChars?: Record<string, RegExp>;
  label?: string;
  error?: string;
  hint?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'filled' | 'underlined';
  fullWidth?: boolean;
  clearable?: boolean;
  className?: string;
}

export const MaskedTextBox: React.FC<MaskedTextBoxProps> = ({
  value = '',
  onChange,
  mask,
  maskChar = '_',
  formatChars = {
    '9': /[0-9]/,
    'a': /[a-zA-Z]/,
    '*': /[a-zA-Z0-9]/,
  },
  label,
  error,
  hint,
  size = 'medium',
  variant = 'outlined',
  fullWidth = false,
  clearable = true,
  className = '',
  disabled,
  required,
  placeholder,
  ...props
}) => {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize display value
  useEffect(() => {
    const formatted = formatValue(value);
    setDisplayValue(formatted);
  }, [value, mask, maskChar]);

  // Format value according to mask
  const formatValue = (val: string): string => {
    let formatted = '';
    let valueIndex = 0;

    for (let i = 0; i < mask.length && valueIndex < val.length; i++) {
      const maskChar = mask[i];
      const formatChar = formatChars[maskChar];

      if (formatChar) {
        while (valueIndex < val.length) {
          const char = val[valueIndex];
          valueIndex++;

          if (formatChar.test(char)) {
            formatted += char;
            break;
          }
        }
      } else {
        formatted += maskChar;
      }
    }

    // Fill remaining mask with placeholder character
    while (formatted.length < mask.length) {
      const maskChar = mask[formatted.length];
      formatted += formatChars[maskChar] ? this.maskChar : maskChar;
    }

    return formatted;
  };

  // Get unmasked value (strip out non-input characters)
  const getUnmaskedValue = (val: string): string => {
    let unmasked = '';
    
    for (let i = 0; i < val.length; i++) {
      const char = val[i];
      const maskChar = mask[i];
      
      if (formatChars[maskChar] && char !== maskChar) {
        unmasked += char;
      }
    }

    return unmasked;
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    let newValue = e.target.value;
    let newCursorPosition = e.target.selectionStart || 0;

    // Handle backspace
    if (newValue.length < displayValue.length) {
      while (
        newCursorPosition > 0 &&
        !formatChars[mask[newCursorPosition - 1]]
      ) {
        newCursorPosition--;
      }
    }

    // Format the new value
    const formatted = formatValue(newValue);
    setDisplayValue(formatted);
    
    // Get unmasked value for onChange
    const unmasked = getUnmaskedValue(formatted);
    onChange?.(formatted, unmasked);

    // Update cursor position
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
  };

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    const input = e.currentTarget;
    const selectionStart = input.selectionStart || 0;
    const selectionEnd = input.selectionEnd || 0;

    // Handle delete key
    if (e.key === 'Delete' && selectionStart === selectionEnd) {
      e.preventDefault();
      
      let newCursorPosition = selectionStart;
      while (
        newCursorPosition < mask.length &&
        !formatChars[mask[newCursorPosition]]
      ) {
        newCursorPosition++;
      }

      const newValue =
        displayValue.substring(0, selectionStart) +
        maskChar +
        displayValue.substring(newCursorPosition + 1);

      setDisplayValue(newValue);
      onChange?.(newValue, getUnmaskedValue(newValue));

      setTimeout(() => {
        input.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    }

    // Handle backspace key
    if (e.key === 'Backspace' && selectionStart === selectionEnd) {
      e.preventDefault();
      
      let newCursorPosition = selectionStart - 1;
      while (newCursorPosition > 0 && !formatChars[mask[newCursorPosition]]) {
        newCursorPosition--;
      }

      if (newCursorPosition >= 0) {
        const newValue =
          displayValue.substring(0, newCursorPosition) +
          maskChar +
          displayValue.substring(newCursorPosition + 1);

        setDisplayValue(newValue);
        onChange?.(newValue, getUnmaskedValue(newValue));

        setTimeout(() => {
          input.setSelectionRange(newCursorPosition, newCursorPosition);
        }, 0);
      }
    }
  };

  // Handle clear button click
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;

    const emptyValue = mask.replace(/[9a*]/g, maskChar);
    setDisplayValue(emptyValue);
    onChange?.(emptyValue, '');
    inputRef.current?.focus();
  };

  return (
    <div className={`masked-textbox-wrapper ${fullWidth ? 'full-width' : ''} ${className}`}>
      {label && (
        <label className="masked-textbox-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div
        className={`
          masked-textbox-container
          masked-textbox-${variant}
          masked-textbox-${size}
          ${error ? 'error' : ''}
          ${isFocused ? 'focused' : ''}
          ${disabled ? 'disabled' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className="masked-textbox-input"
          {...props}
        />
        {clearable && displayValue && !disabled && (
          <button
            type="button"
            className="masked-textbox-clear"
            onClick={handleClear}
            aria-label="Clear input"
          >
            <X size={16} />
          </button>
        )}
      </div>
      {(error || hint) && (
        <div className={`masked-textbox-message ${error ? 'error' : ''}`}>
          {error || hint}
        </div>
      )}

      <style jsx>{`
        .masked-textbox-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .masked-textbox-wrapper.full-width {
          width: 100%;
        }

        .masked-textbox-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--gw-text-secondary);
        }

        .required {
          color: var(--gw-error-500);
          margin-left: 0.25rem;
        }

        .masked-textbox-container {
          position: relative;
          display: flex;
          align-items: center;
          transition: var(--gw-transition);
        }

        /* Variants */
        .masked-textbox-outlined {
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          background-color: var(--gw-background);
        }

        .masked-textbox-outlined.focused {
          border-color: var(--gw-primary);
          box-shadow: 0 0 0 2px var(--gw-primary-100);
        }

        .masked-textbox-filled {
          border: none;
          border-radius: var(--gw-border-radius);
          background-color: var(--gw-background-secondary);
        }

        .masked-textbox-filled.focused {
          background-color: var(--gw-background-tertiary);
        }

        .masked-textbox-underlined {
          border: none;
          border-bottom: 1px solid var(--gw-border-color);
          border-radius: 0;
          background-color: transparent;
        }

        .masked-textbox-underlined.focused {
          border-bottom-color: var(--gw-primary);
        }

        /* Sizes */
        .masked-textbox-small {
          min-height: 2rem;
          font-size: 0.875rem;
        }

        .masked-textbox-medium {
          min-height: 2.5rem;
          font-size: 1rem;
        }

        .masked-textbox-large {
          min-height: 3rem;
          font-size: 1.125rem;
        }

        /* States */
        .masked-textbox-container.error {
          border-color: var(--gw-error-500);
        }

        .masked-textbox-container.error.focused {
          box-shadow: 0 0 0 2px var(--gw-error-100);
        }

        .masked-textbox-container.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background-color: var(--gw-background-secondary);
        }

        .masked-textbox-input {
          width: 100%;
          height: 100%;
          padding: 0.5rem;
          border: none;
          background: none;
          color: var(--gw-text-primary);
          font-family: inherit;
          font-size: inherit;
          outline: none;
        }

        .masked-textbox-clear {
          display: flex;
          align-items: center;
          padding: 0.25rem;
          margin-right: 0.25rem;
          border: none;
          background: none;
          color: var(--gw-text-secondary);
          cursor: pointer;
          border-radius: var(--gw-border-radius);
          transition: var(--gw-transition);
        }

        .masked-textbox-clear:hover {
          background-color: var(--gw-background-secondary);
          color: var(--gw-text-primary);
        }

        .masked-textbox-message {
          font-size: 0.75rem;
          color: var(--gw-text-secondary);
        }

        .masked-textbox-message.error {
          color: var(--gw-error-500);
        }

        /* Material Design styles */
        [data-design-system="material"] .masked-textbox-wrapper {
          font-family: var(--gw-font-family);
        }

        [data-design-system="material"] .masked-textbox-outlined {
          border-radius: 4px;
        }

        [data-design-system="material"] .masked-textbox-filled {
          border-radius: 4px 4px 0 0;
        }

        [data-design-system="material"] .masked-textbox-underlined {
          border-bottom-width: 2px;
        }

        [data-design-system="material"] .masked-textbox-clear {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};