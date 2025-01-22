import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  value?: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: 'small' | 'medium' | 'large';
  precision?: 0.5 | 1;
  readOnly?: boolean;
  disabled?: boolean;
  label?: string;
  error?: string;
  hint?: string;
  showValue?: boolean;
  emptyIcon?: React.ReactNode;
  filledIcon?: React.ReactNode;
  className?: string;
}

export const Rating: React.FC<RatingProps> = ({
  value = 0,
  onChange,
  max = 5,
  size = 'medium',
  precision = 1,
  readOnly = false,
  disabled = false,
  label,
  error,
  hint,
  showValue = false,
  emptyIcon,
  filledIcon,
  className = '',
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);

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

  const handleMouseMove = (event: React.MouseEvent, index: number) => {
    if (readOnly || disabled) return;

    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percent = x / rect.width;

    let newValue = index + 1;
    if (precision === 0.5) {
      newValue = percent <= 0.5 ? index + 0.5 : index + 1;
    }

    setHoverValue(newValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
    setIsHovering(false);
  };

  const handleClick = (newValue: number) => {
    if (readOnly || disabled) return;
    onChange?.(newValue);
  };

  const renderStar = (index: number) => {
    const displayValue = hoverValue ?? value;
    const filled = index < displayValue;
    const halfFilled = precision === 0.5 && index + 0.5 === displayValue;

    return (
      <div
        key={index}
        className={`rating-star ${filled ? 'filled' : ''} ${
          halfFilled ? 'half-filled' : ''
        }`}
        onMouseMove={(e) => handleMouseMove(e, index)}
        onClick={() => handleClick(index + 1)}
        style={{
          cursor: readOnly || disabled ? 'default' : 'pointer',
        }}
      >
        {filled ? (
          filledIcon || (
            <Star
              size={getIconSize()}
              fill="currentColor"
              className="star-icon filled"
            />
          )
        ) : (
          emptyIcon || (
            <Star size={getIconSize()} className="star-icon empty" />
          )
        )}
      </div>
    );
  };

  return (
    <div className={`rating-wrapper ${className}`}>
      {label && (
        <label className="rating-label">
          {label}
          {showValue && (
            <span className="rating-value">
              {hoverValue ?? value}
              {max && ` / ${max}`}
            </span>
          )}
        </label>
      )}
      <div
        className={`rating-container rating-${size} ${
          disabled ? 'disabled' : ''
        }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        role="radiogroup"
        aria-label={label || 'Rating'}
      >
        {Array.from({ length: max }, (_, index) => renderStar(index))}
      </div>
      {(error || hint) && (
        <div className={`rating-message ${error ? 'error' : ''}`}>
          {error || hint}
        </div>
      )}

      <style jsx>{`
        .rating-wrapper {
          display: inline-flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .rating-label {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--gw-text-secondary);
        }

        .rating-value {
          font-size: 0.75rem;
          color: var(--gw-text-secondary);
          margin-left: 0.5rem;
        }

        .rating-container {
          display: inline-flex;
          gap: 0.25rem;
          align-items: center;
        }

        .rating-container.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .rating-star {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }

        .rating-star:hover:not(.disabled) {
          transform: scale(1.1);
        }

        .star-icon {
          color: var(--gw-border-color);
          transition: all 0.2s ease;
        }

        .star-icon.filled {
          color: #f59e0b;
        }

        .star-icon.empty:hover {
          color: #fcd34d;
        }

        .rating-small .star-icon {
          width: 1rem;
          height: 1rem;
        }

        .rating-large .star-icon {
          width: 1.5rem;
          height: 1.5rem;
        }

        .rating-message {
          font-size: 0.75rem;
          color: var(--gw-text-secondary);
        }

        .rating-message.error {
          color: var(--gw-error-500);
        }

        /* Half-filled star styles */
        .rating-star.half-filled .star-icon {
          position: relative;
          color: var(--gw-border-color);
        }

        .rating-star.half-filled .star-icon::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background-color: #f59e0b;
          mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'/%3E%3C/svg%3E")
            no-repeat center / contain;
          -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'/%3E%3C/svg%3E")
            no-repeat center / contain;
        }

        /* Material Design styles */
        [data-design-system="material"] .rating-wrapper {
          font-family: var(--gw-font-family);
        }

        [data-design-system="material"] .rating-star {
          padding: 0.25rem;
          border-radius: 50%;
        }

        [data-design-system="material"] .rating-star:hover:not(.disabled) {
          background-color: var(--gw-background-secondary);
        }

        [data-design-system="material"] .star-icon.filled {
          color: #f59e0b;
        }
      `}</style>
    </div>
  );
};