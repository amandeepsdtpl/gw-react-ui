import React, { useState, useRef, useEffect } from 'react';

interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'filled' | 'underlined';
  fullWidth?: boolean;
  autoResize?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
  minRows?: number;
  maxRows?: number;
  className?: string;
  onValueChange?: (value: string) => void;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  hint,
  size = 'medium',
  variant = 'outlined',
  fullWidth = false,
  autoResize = true,
  showCharCount = false,
  maxLength,
  minRows = 3,
  maxRows = 10,
  className = '',
  value,
  onChange,
  onValueChange,
  disabled,
  required,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Calculate character count
  const charCount = typeof value === 'string' ? value.length : 0;
  const showCount = showCharCount || maxLength;

  // Auto-resize textarea
  useEffect(() => {
    if (!autoResize || !textareaRef.current) return;

    const textarea = textareaRef.current;
    const computedStyle = window.getComputedStyle(textarea);
    const lineHeight = parseInt(computedStyle.lineHeight);

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';

    // Calculate min and max heights
    const minHeight = lineHeight * minRows;
    const maxHeight = lineHeight * maxRows;

    // Set new height based on content
    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
    textarea.style.height = `${newHeight}px`;
  }, [value, autoResize, minRows, maxRows]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (maxLength && e.target.value.length > maxLength) return;
    onChange?.(e);
    onValueChange?.(e.target.value);
  };

  return (
    <div className={`textarea-wrapper ${fullWidth ? 'full-width' : ''} ${className}`}>
      {label && (
        <label className="textarea-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className={`
        textarea-container
        textarea-${variant}
        textarea-${size}
        ${error ? 'error' : ''}
        ${isFocused ? 'focused' : ''}
        ${disabled ? 'disabled' : ''}
      `}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          rows={minRows}
          className="textarea-input"
          {...props}
        />
      </div>
      <div className="textarea-footer">
        {(error || hint) && (
          <div className={`textarea-message ${error ? 'error' : ''}`}>
            {error || hint}
          </div>
        )}
        {showCount && (
          <div className="char-count">
            {charCount}
            {maxLength && ` / ${maxLength}`}
          </div>
        )}
      </div>

      <style jsx>{`
        .textarea-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .textarea-wrapper.full-width {
          width: 100%;
        }

        .textarea-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--gw-text-secondary);
        }

        .required {
          color: var(--gw-error-500);
          margin-left: 0.25rem;
        }

        .textarea-container {
          position: relative;
          display: flex;
          transition: var(--gw-transition);
        }

        /* Variants */
        .textarea-outlined {
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          background-color: var(--gw-background);
        }

        .textarea-outlined.focused {
          border-color: var(--gw-primary);
          box-shadow: 0 0 0 2px var(--gw-primary-100);
        }

        .textarea-filled {
          border: none;
          border-radius: var(--gw-border-radius);
          background-color: var(--gw-background-secondary);
        }

        .textarea-filled.focused {
          background-color: var(--gw-background-tertiary);
        }

        .textarea-underlined {
          border: none;
          border-bottom: 1px solid var(--gw-border-color);
          border-radius: 0;
          background-color: transparent;
        }

        .textarea-underlined.focused {
          border-bottom-color: var(--gw-primary);
        }

        /* Sizes */
        .textarea-small .textarea-input {
          padding: 0.5rem;
          font-size: 0.875rem;
        }

        .textarea-medium .textarea-input {
          padding: 0.75rem;
          font-size: 1rem;
        }

        .textarea-large .textarea-input {
          padding: 1rem;
          font-size: 1.125rem;
        }

        /* States */
        .textarea-container.error {
          border-color: var(--gw-error-500);
        }

        .textarea-container.error.focused {
          box-shadow: 0 0 0 2px var(--gw-error-100);
        }

        .textarea-container.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background-color: var(--gw-background-secondary);
        }

        /* Input */
        .textarea-input {
          width: 100%;
          border: none;
          background: none;
          color: var(--gw-text-primary);
          resize: vertical;
          outline: none;
          font-family: inherit;
          line-height: 1.5;
        }

        .textarea-input:disabled {
          cursor: not-allowed;
        }

        /* Footer */
        .textarea-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          min-height: 1.5rem;
        }

        .textarea-message {
          font-size: 0.75rem;
          color: var(--gw-text-secondary);
        }

        .textarea-message.error {
          color: var(--gw-error-500);
        }

        .char-count {
          font-size: 0.75rem;
          color: var(--gw-text-secondary);
          margin-left: auto;
        }

        /* Material Design styles */
        [data-design-system="material"] .textarea-outlined {
          border-radius: 4px;
        }

        [data-design-system="material"] .textarea-filled {
          border-radius: 4px 4px 0 0;
        }

        [data-design-system="material"] .textarea-underlined {
          border-bottom-width: 2px;
        }

        [data-design-system="material"] .textarea-label {
          font-family: var(--gw-font-family);
          font-weight: 500;
        }

        [data-design-system="material"] .textarea-input {
          font-family: var(--gw-font-family);
        }
      `}</style>
    </div>
  );
};