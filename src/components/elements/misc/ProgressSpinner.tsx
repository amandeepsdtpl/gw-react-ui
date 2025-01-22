import React from 'react';

interface ProgressSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  thickness?: number;
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

export const ProgressSpinner: React.FC<ProgressSpinnerProps> = ({
  size = 'medium',
  color = 'currentColor',
  thickness = 2,
  speed = 'normal',
  className = '',
}) => {
  const getSizeValue = () => {
    switch (size) {
      case 'small': return 24;
      case 'large': return 48;
      default: return 36;
    }
  };

  const getSpeedValue = () => {
    switch (speed) {
      case 'slow': return '1.5s';
      case 'fast': return '0.6s';
      default: return '1s';
    }
  };

  const spinnerSize = getSizeValue();
  const center = spinnerSize / 2;
  const radius = (spinnerSize - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashArray = `${circumference * 0.75} ${circumference * 0.25}`;

  return (
    <div
      className={`progress-spinner progress-spinner-${size} ${className}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={undefined}
      style={{
        width: spinnerSize,
        height: spinnerSize,
      }}
    >
      <svg
        viewBox={`0 0 ${spinnerSize} ${spinnerSize}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{
          animation: `spinner-rotate ${getSpeedValue()} linear infinite`,
        }}
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={dashArray}
          style={{
            transformOrigin: 'center',
          }}
        />
      </svg>
      <style jsx>{`
        @keyframes spinner-rotate {
          100% {
            transform: rotate(360deg);
          }
        }

        .progress-spinner {
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .progress-spinner svg {
          width: 100%;
          height: 100%;
        }

        .progress-spinner circle {
          transform-origin: center;
        }
      `}</style>
    </div>
  );
};