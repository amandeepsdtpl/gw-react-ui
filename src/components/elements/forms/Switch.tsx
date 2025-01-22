import React from 'react';

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'primary' | 'success' | 'error' | 'warning';
  labelPosition?: 'left' | 'right';
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked = false,
  onChange,
  label,
  description,
  disabled = false,
  required = false,
  error,
  size = 'medium',
  variant = 'primary',
  labelPosition = 'right',
  className = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange?.(e.target.checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLabelElement>) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!disabled) {
        onChange?.(!checked);
      }
    }
  };

  return (
    <div className={`switch-wrapper ${className}`}>
      <label
        className={`
          switch-label
          switch-${size}
          switch-${variant}
          label-${labelPosition}
          ${disabled ? 'disabled' : ''}
          ${error ? 'error' : ''}
        `}
        tabIndex={disabled ? undefined : 0}
        onKeyDown={handleKeyDown}
      >
        {label && labelPosition === 'left' && (
          <div className="label-content">
            <span className="label-text">
              {label}
              {required && <span className="required">*</span>}
            </span>
            {description && (
              <span className="label-description">{description}</span>
            )}
          </div>
        )}
        <div className="switch-container">
          <input
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            className="switch-input"
          />
          <div className="switch-track">
            <div className="switch-thumb" />
          </div>
        </div>
        {label && labelPosition === 'right' && (
          <div className="label-content">
            <span className="label-text">
              {label}
              {required && <span className="required">*</span>}
            </span>
            {description && (
              <span className="label-description">{description}</span>
            )}
          </div>
        )}
      </label>
      {error && <div className="switch-error">{error}</div>}

      <style jsx>{`
        .switch-wrapper {
          display: inline-flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .switch-label {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          user-select: none;
          outline: none;
        }

        .switch-label:focus-visible {
          outline: 2px solid var(--gw-primary-200);
          outline-offset: 2px;
          border-radius: var(--gw-border-radius);
        }

        .switch-label.disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .label-left {
          flex-direction: row;
        }

        .label-right {
          flex-direction: row-reverse;
        }

        .label-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .label-text {
          font-size: 0.875rem;
          color: var(--gw-text-primary);
        }

        .label-description {
          font-size: 0.75rem;
          color: var(--gw-text-secondary);
        }

        .required {
          color: var(--gw-error-500);
          margin-left: 0.25rem;
        }

        .switch-container {
          position: relative;
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
        }

        .switch-input {
          position: absolute;
          width: 0;
          height: 0;
          opacity: 0;
        }

        .switch-track {
          position: relative;
          display: inline-block;
          background-color: var(--gw-background-tertiary);
          border-radius: 9999px;
          transition: background-color var(--gw-transition);
        }

        .switch-thumb {
          position: absolute;
          background-color: white;
          border-radius: 50%;
          box-shadow: var(--gw-shadow-sm);
          transition: transform var(--gw-transition);
        }

        /* Sizes */
        .switch-small .switch-track {
          width: 28px;
          height: 16px;
        }

        .switch-small .switch-thumb {
          width: 12px;
          height: 12px;
          top: 2px;
          left: 2px;
        }

        .switch-small .switch-input:checked + .switch-track .switch-thumb {
          transform: translateX(12px);
        }

        .switch-medium .switch-track {
          width: 36px;
          height: 20px;
        }

        .switch-medium .switch-thumb {
          width: 16px;
          height: 16px;
          top: 2px;
          left: 2px;
        }

        .switch-medium .switch-input:checked + .switch-track .switch-thumb {
          transform: translateX(16px);
        }

        .switch-large .switch-track {
          width: 48px;
          height: 24px;
        }

        .switch-large .switch-thumb {
          width: 20px;
          height: 20px;
          top: 2px;
          left: 2px;
        }

        .switch-large .switch-input:checked + .switch-track .switch-thumb {
          transform: translateX(24px);
        }

        /* Variants */
        .switch-default .switch-input:checked + .switch-track {
          background-color: var(--gw-neutral-500);
        }

        .switch-primary .switch-input:checked + .switch-track {
          background-color: var(--gw-primary);
        }

        .switch-success .switch-input:checked + .switch-track {
          background-color: var(--gw-success-500);
        }

        .switch-error .switch-input:checked + .switch-track {
          background-color: var(--gw-error-500);
        }

        .switch-warning .switch-input:checked + .switch-track {
          background-color: var(--gw-warning-500);
        }

        /* Error state */
        .switch-label.error .switch-track {
          background-color: var(--gw-error-100);
        }

        .switch-error {
          font-size: 0.75rem;
          color: var(--gw-error-500);
        }

        /* Hover effects */
        .switch-label:not(.disabled):hover .switch-track {
          background-color: var(--gw-background-secondary);
        }

        .switch-label:not(.disabled):hover .switch-thumb {
          box-shadow: var(--gw-shadow-md);
        }

        /* Material Design styles */
        [data-design-system="material"] .switch-label {
          font-family: var(--gw-font-family);
        }

        [data-design-system="material"] .switch-track {
          opacity: 0.38;
        }

        [data-design-system="material"] .switch-input:checked + .switch-track {
          opacity: 0.5;
        }

        [data-design-system="material"] .switch-thumb {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        [data-design-system="material"] .switch-input:checked + .switch-track .switch-thumb {
          box-shadow: var(--gw-shadow-md);
        }

        [data-design-system="material"] .switch-label:not(.disabled):hover .switch-thumb {
          transform: scale(1.1);
        }

        [data-design-system="material"] .switch-label:not(.disabled):active .switch-thumb {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
};