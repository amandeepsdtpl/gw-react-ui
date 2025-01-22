import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
  labelFormat?: (value: number, max: number) => string;
  animated?: boolean;
  striped?: boolean;
  indeterminate?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'primary',
  size = 'medium',
  showLabel = true,
  labelPosition = 'right',
  labelFormat,
  animated = true,
  striped = false,
  indeterminate = false,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const formatLabel = () => {
    if (labelFormat) {
      return labelFormat(value, max);
    }
    return `${Math.round(percentage)}%`;
  };

  return (
    <div
      className={`
        progress-wrapper
        progress-${size}
        label-${labelPosition}
        ${className}
      `}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuetext={indeterminate ? 'In progress' : formatLabel()}
    >
      {showLabel && (labelPosition === 'top' || labelPosition === 'left') && (
        <span className="progress-label">{formatLabel()}</span>
      )}
      <div className="progress-track">
        <div
          className={`
            progress-fill
            progress-${variant}
            ${striped ? 'striped' : ''}
            ${animated ? 'animated' : ''}
            ${indeterminate ? 'indeterminate' : ''}
          `}
          style={{ width: indeterminate ? '100%' : `${percentage}%` }}
        />
      </div>
      {showLabel && (labelPosition === 'bottom' || labelPosition === 'right') && (
        <span className="progress-label">{formatLabel()}</span>
      )}

      <style jsx>{`
        .progress-wrapper {
          display: flex;
          gap: 0.75rem;
          width: 100%;
        }

        .label-top,
        .label-bottom {
          flex-direction: column;
          gap: 0.25rem;
        }

        .label-top .progress-label {
          order: -1;
        }

        .progress-track {
          flex: 1;
          background-color: var(--gw-background-secondary);
          border-radius: 9999px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          width: 0;
          border-radius: inherit;
          transition: width 0.3s ease;
        }

        /* Variants */
        .progress-primary {
          background-color: var(--gw-primary);
        }

        .progress-secondary {
          background-color: var(--gw-secondary);
        }

        .progress-success {
          background-color: var(--gw-success-500);
        }

        .progress-error {
          background-color: var(--gw-error-500);
        }

        .progress-warning {
          background-color: var(--gw-warning-500);
        }

        /* Sizes */
        .progress-small .progress-track {
          height: 0.25rem;
        }

        .progress-medium .progress-track {
          height: 0.375rem;
        }

        .progress-large .progress-track {
          height: 0.5rem;
        }

        /* Label */
        .progress-label {
          font-size: 0.875rem;
          color: var(--gw-text-secondary);
          font-weight: 500;
          min-width: 3rem;
          text-align: right;
        }

        .label-left .progress-label,
        .label-right .progress-label {
          line-height: 1;
          display: flex;
          align-items: center;
        }

        .label-left .progress-label {
          text-align: left;
        }

        /* Striped */
        .striped {
          background-image: linear-gradient(
            45deg,
            rgba(255, 255, 255, 0.15) 25%,
            transparent 25%,
            transparent 50%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0.15) 75%,
            transparent 75%,
            transparent
          );
          background-size: 1rem 1rem;
        }

        /* Animations */
        .animated:not(.indeterminate) {
          transition: width 0.3s ease;
        }

        .animated.striped {
          animation: progress-stripes 1s linear infinite;
        }

        .indeterminate {
          width: 50% !important;
          animation: indeterminate 1.5s ease-in-out infinite;
        }

        @keyframes progress-stripes {
          from {
            background-position: 1rem 0;
          }
          to {
            background-position: 0 0;
          }
        }

        @keyframes indeterminate {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        /* Material Design styles */
        [data-design-system="material"] .progress-wrapper {
          font-family: var(--gw-font-family);
        }

        [data-design-system="material"] .progress-track {
          height: 0.25rem;
          border-radius: 0;
        }

        [data-design-system="material"] .progress-fill {
          border-radius: 0;
          transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        [data-design-system="material"] .progress-label {
          font-weight: 500;
          letter-spacing: 0.025em;
        }

        [data-design-system="material"] .indeterminate {
          animation: indeterminate-material 2s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
        }

        @keyframes indeterminate-material {
          0% {
            left: -35%;
            right: 100%;
          }
          60% {
            left: 100%;
            right: -90%;
          }
          100% {
            left: 100%;
            right: -90%;
          }
        }
      `}</style>
    </div>
  );
};