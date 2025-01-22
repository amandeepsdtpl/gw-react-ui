import React from 'react';
import { Circle, CheckCircle } from 'lucide-react';

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface RadioButtonListProps {
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  required?: boolean;
  layout?: 'horizontal' | 'vertical' | 'grid';
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'card' | 'button';
  columns?: number;
  className?: string;
}

export const RadioButtonList: React.FC<RadioButtonListProps> = ({
  options,
  value,
  onChange,
  name = 'radio-group',
  label,
  error,
  hint,
  disabled = false,
  required = false,
  layout = 'vertical',
  size = 'medium',
  variant = 'default',
  columns = 2,
  className = '',
}) => {
  const handleChange = (optionValue: string) => {
    if (!disabled) {
      onChange?.(optionValue);
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      default:
        return 20;
    }
  };

  return (
    <div className={`radio-list-wrapper ${className}`}>
      {label && (
        <label className="radio-list-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div
        className={`
          radio-list
          radio-list-${layout}
          radio-list-${size}
          radio-list-${variant}
          ${disabled ? 'disabled' : ''}
        `}
        style={
          layout === 'grid'
            ? {
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              }
            : undefined
        }
        role="radiogroup"
        aria-label={label}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              radio-option
              ${value === option.value ? 'selected' : ''}
              ${option.disabled || disabled ? 'disabled' : ''}
            `}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => handleChange(option.value)}
              disabled={option.disabled || disabled}
              className="radio-input"
              required={required}
            />
            <div className="radio-content">
              {variant === 'default' && (
                <div className="radio-control">
                  {value === option.value ? (
                    <CheckCircle size={getIconSize()} className="radio-icon checked" />
                  ) : (
                    <Circle size={getIconSize()} className="radio-icon" />
                  )}
                </div>
              )}
              <div className="radio-label-content">
                {option.icon && (
                  <span className="radio-option-icon">{option.icon}</span>
                )}
                <div className="radio-text">
                  <span className="radio-label-text">{option.label}</span>
                  {option.description && (
                    <span className="radio-description">
                      {option.description}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>
      {(error || hint) && (
        <div className={`radio-message ${error ? 'error' : ''}`}>
          {error || hint}
        </div>
      )}

      <style jsx>{`
        .radio-list-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .radio-list-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--gw-text-secondary);
        }

        .required {
          color: var(--gw-error-500);
          margin-left: 0.25rem;
        }

        .radio-list {
          display: flex;
          gap: 1rem;
        }

        .radio-list-vertical {
          flex-direction: column;
        }

        .radio-list-grid {
          display: grid;
          gap: 1rem;
        }

        .radio-list.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .radio-option {
          position: relative;
          display: flex;
          cursor: pointer;
          user-select: none;
        }

        .radio-option.disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .radio-input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .radio-content {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem;
          width: 100%;
          border-radius: var(--gw-border-radius);
          transition: var(--gw-transition);
        }

        /* Default variant */
        .radio-list-default .radio-content {
          padding: 0.5rem;
        }

        .radio-list-default .radio-option:hover:not(.disabled) .radio-content {
          background-color: var(--gw-background-secondary);
        }

        /* Card variant */
        .radio-list-card .radio-content {
          border: 1px solid var(--gw-border-color);
          background-color: var(--gw-background);
        }

        .radio-list-card .radio-option:hover:not(.disabled) .radio-content {
          border-color: var(--gw-primary);
          background-color: var(--gw-background-secondary);
        }

        .radio-list-card .radio-option.selected .radio-content {
          border-color: var(--gw-primary);
          background-color: var(--gw-primary-50);
        }

        /* Button variant */
        .radio-list-button .radio-content {
          justify-content: center;
          text-align: center;
          border: 1px solid var(--gw-border-color);
          background-color: var(--gw-background);
        }

        .radio-list-button .radio-option:hover:not(.disabled) .radio-content {
          border-color: var(--gw-primary);
          background-color: var(--gw-background-secondary);
        }

        .radio-list-button .radio-option.selected .radio-content {
          border-color: var(--gw-primary);
          background-color: var(--gw-primary);
          color: white;
        }

        .radio-control {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .radio-icon {
          color: var(--gw-border-color);
          transition: var(--gw-transition);
        }

        .radio-icon.checked {
          color: var(--gw-primary);
        }

        .radio-label-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 0;
        }

        .radio-option-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--gw-text-secondary);
        }

        .radio-text {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          min-width: 0;
        }

        .radio-label-text {
          color: var(--gw-text-primary);
          font-weight: 500;
        }

        .radio-description {
          font-size: 0.875rem;
          color: var(--gw-text-secondary);
        }

        .radio-message {
          font-size: 0.75rem;
          color: var(--gw-text-secondary);
        }

        .radio-message.error {
          color: var(--gw-error-500);
        }

        /* Sizes */
        .radio-list-small .radio-content {
          padding: 0.5rem;
          font-size: 0.875rem;
        }

        .radio-list-large .radio-content {
          padding: 1rem;
          font-size: 1.125rem;
        }

        /* Material Design styles */
        [data-design-system="material"] .radio-list-wrapper {
          font-family: var(--gw-font-family);
        }

        [data-design-system="material"] .radio-content {
          border-radius: 4px;
        }

        [data-design-system="material"] .radio-list-card .radio-content {
          box-shadow: var(--gw-shadow-sm);
          border: none;
        }

        [data-design-system="material"] .radio-list-button .radio-content {
          text-transform: uppercase;
          letter-spacing: 0.025em;
          font-weight: 500;
        }

        [data-design-system="material"] .radio-option.selected .radio-content {
          box-shadow: var(--gw-shadow-md);
        }
      `}</style>
    </div>
  );
};