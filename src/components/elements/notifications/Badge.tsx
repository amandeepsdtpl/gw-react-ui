import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  size?: 'small' | 'medium' | 'large';
  rounded?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  rounded = false,
  className = '',
}) => {
  return (
    <span className={`badge badge-${variant} badge-${size} ${rounded ? 'rounded' : ''} ${className}`}>
      {children}

      <style jsx>{`
        .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
          line-height: 1;
          white-space: nowrap;
          transition: var(--gw-transition);
        }

        .badge-small {
          padding: 0.125rem 0.375rem;
          font-size: 0.75rem;
          min-height: 1.25rem;
        }

        .badge-medium {
          padding: 0.25rem 0.5rem;
          font-size: 0.875rem;
          min-height: 1.5rem;
        }

        .badge-large {
          padding: 0.375rem 0.75rem;
          font-size: 1rem;
          min-height: 1.75rem;
        }

        .badge.rounded {
          border-radius: 9999px;
        }

        .badge:not(.rounded) {
          border-radius: var(--gw-border-radius);
        }

        .badge-primary {
          background-color: var(--gw-primary);
          color: white;
        }

        .badge-secondary {
          background-color: var(--gw-secondary);
          color: white;
        }

        .badge-success {
          background-color: var(--gw-success-500);
          color: white;
        }

        .badge-error {
          background-color: var(--gw-error-500);
          color: white;
        }

        .badge-warning {
          background-color: var(--gw-warning-500);
          color: white;
        }

        .badge-info {
          background-color: var(--gw-info-500);
          color: white;
        }

        /* Material Design styles */
        [data-design-system="material"] .badge {
          font-family: var(--gw-font-family);
          box-shadow: var(--gw-shadow-sm);
        }
      `}</style>
    </span>
  );
};