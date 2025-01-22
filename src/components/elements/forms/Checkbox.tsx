import React, { forwardRef } from 'react';
import { Check, Minus } from 'lucide-react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
  indeterminate?: boolean;
  variant?: 'default' | 'filled';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  description,
  error,
  indeterminate = false,
  variant = 'default',
  size = 'medium',
  className = '',
  disabled,
  checked,
  onChange,
  id,
  ...props
}, ref) => {
  const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`checkbox-wrapper ${className}`}>
      <label
        className={`
          checkbox-label
          checkbox-${variant}
          checkbox-${size}
          ${disabled ? 'disabled' : ''}
        `}
      >
        <div className="checkbox-input-wrapper">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="checkbox-input"
            aria-describedby={
              description ? `${checkboxId}-description` : undefined
            }
            aria-invalid={!!error}
            {...props}
          />
          <div
            className={`
              checkbox-custom
              ${checked || indeterminate ? 'checked' : ''}
              ${error ? 'error' : ''}
            `}
          >
            {indeterminate ? (
              <Minus size={size === 'small' ? 12 : size === 'large' ? 16 : 14} />
            ) : checked ? (
              <Check size={size === 'small' ? 12 : size === 'large' ? 16 : 14} />
            ) : null}
          </div>
        </div>
        {(label || description) && (
          <div className="checkbox-text">
            {label && <span className="checkbox-label-text">{label}</span>}
            {description && (
              <span
                id={`${checkboxId}-description`}
                className="checkbox-description"
              >
                {description}
              </span>
            )}
          </div>
        )}
      </label>
      {error && <p className="checkbox-error">{error}</p>}

      <style jsx>{`
        .checkbox-wrapper {
          display: inline-flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .checkbox-label {
          display: inline-flex;
          align-items: flex-start;
          gap: 0.5rem;
          cursor: pointer;
          user-select: none;
        }

        .checkbox-label.disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .checkbox-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .checkbox-input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .checkbox-custom {
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          transition: var(--gw-transition);
          background-color: var(--gw-background);
          color: white;
        }

        .checkbox-small .checkbox-custom {
          width: 1rem;
          height: 1rem;
        }

        .checkbox-medium .checkbox-custom {
          width: 1.25rem;
          height: 1.25rem;
        }

        .checkbox-large .checkbox-custom {
          width: 1.5rem;
          height: 1.5rem;
        }

        .checkbox-custom.checked {
          background-color: var(--gw-primary);
          border-color: var(--gw-primary);
        }

        .checkbox-custom.error {
          border-color: var(--gw-error-500);
        }

        .checkbox-filled .checkbox-custom {
          background-color: var(--gw-background-secondary);
        }

        .checkbox-text {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          padding-top: 0.125rem;
        }

        .checkbox-label-text {
          color: var(--gw-text-primary);
          font-size: 0.875rem;
          line-height: 1.25;
        }

        .checkbox-description {
          color: var(--gw-text-secondary);
          font-size: 0.75rem;
          line-height: 1.25;
        }

        .checkbox-error {
          color: var(--gw-error-500);
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }

        /* Focus styles */
        .checkbox-input:focus-visible + .checkbox-custom {
          outline: 2px solid var(--gw-primary-200);
          outline-offset: 2px;
        }

        /* Hover styles */
        .checkbox-label:hover:not(.disabled) .checkbox-custom {
          border-color: var(--gw-primary);
        }

        /* Material Design styles */
        [data-design-system="material"] .checkbox-custom {
          border-radius: 2px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        [data-design-system="material"] .checkbox-custom.checked {
          transform: scale(1.1);
        }

        [data-design-system="material"] .checkbox-label-text {
          font-family: var(--gw-font-family);
          font-weight: 500;
        }

        [data-design-system="material"] .checkbox-description {
          font-family: var(--gw-font-family);
        }
      `}</style>
    </div>
  );
});

Checkbox.displayName = 'Checkbox';