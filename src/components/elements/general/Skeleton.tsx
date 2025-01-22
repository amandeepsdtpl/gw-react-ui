import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animation?: 'pulse' | 'wave' | 'none';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  animation = 'pulse',
  width,
  height,
  className = '',
}) => {
  const getDefaultHeight = () => {
    switch (variant) {
      case 'text':
        return '1em';
      case 'circular':
        return '2.5rem';
      case 'rectangular':
      case 'rounded':
        return '100px';
      default:
        return 'auto';
    }
  };

  const getDefaultWidth = () => {
    switch (variant) {
      case 'text':
        return '100%';
      case 'circular':
        return '2.5rem';
      case 'rectangular':
      case 'rounded':
        return '100%';
      default:
        return 'auto';
    }
  };

  return (
    <div
      className={`
        skeleton
        skeleton-${variant}
        skeleton-${animation}
        ${className}
      `}
      style={{
        width: width || getDefaultWidth(),
        height: height || getDefaultHeight(),
      }}
      role="status"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading...</span>

      <style jsx>{`
        .skeleton {
          display: block;
          background-color: var(--gw-background-secondary);
          position: relative;
          overflow: hidden;
        }

        /* Variants */
        .skeleton-text {
          transform-origin: 0 55%;
          transform: scale(1, 0.60);
          border-radius: 4px;
        }

        .skeleton-circular {
          border-radius: 50%;
        }

        .skeleton-rectangular {
          border-radius: 0;
        }

        .skeleton-rounded {
          border-radius: var(--gw-border-radius);
        }

        /* Animations */
        .skeleton-pulse {
          animation: skeleton-pulse 1.5s ease-in-out infinite;
        }

        .skeleton-wave {
          &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              90deg,
              transparent,
              var(--gw-background-tertiary),
              transparent
            );
            animation: skeleton-wave 1.5s linear infinite;
          }
        }

        @keyframes skeleton-pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes skeleton-wave {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        /* Screen reader only */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* Material Design styles */
        [data-design-system="material"] .skeleton {
          background-color: var(--gw-background-tertiary);
        }

        [data-design-system="material"] .skeleton-text {
          border-radius: 2px;
        }

        [data-design-system="material"] .skeleton-rounded {
          border-radius: 4px;
        }

        [data-design-system="material"] .skeleton-wave::after {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
        }
      `}</style>
    </div>
  );
};