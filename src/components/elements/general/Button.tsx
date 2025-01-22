import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'error';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      className={`
        button
        button-${variant}
        button-${size}
        ${fullWidth ? 'button-full' : ''}
        ${loading ? 'loading' : ''}
        ${disabled ? 'disabled' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2 
          size={size === 'small' ? 14 : size === 'large' ? 18 : 16}
          className="button-spinner"
        />
      )}
      {!loading && leftIcon && (
        <span className="button-icon left">{leftIcon}</span>
      )}
      <span className="button-content">{children}</span>
      {!loading && rightIcon && (
        <span className="button-icon right">{rightIcon}</span>
      )}

      <style jsx>{`
        .button {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          border: none;
          border-radius: var(--gw-border-radius);
          font-weight: 500;
          cursor: pointer;
          transition: var(--gw-transition);
          white-space: nowrap;
          text-decoration: none;
        }

        .button:focus-visible {
          outline: 2px solid var(--gw-primary-200);
          outline-offset: 2px;
        }

        .button.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Sizes */
        .button-small {
          height: 2rem;
          padding: 0 0.75rem;
          font-size: 0.875rem;
          gap: 0.375rem;
        }

        .button-medium {
          height: 2.5rem;
          padding: 0 1rem;
          font-size: 1rem;
          gap: 0.5rem;
        }

        .button-large {
          height: 3rem;
          padding: 0 1.5rem;
          font-size: 1.125rem;
          gap: 0.625rem;
        }

        /* Variants */
        .button-primary {
          background-color: var(--gw-primary);
          color: white;
        }

        .button-primary:hover:not(.disabled):not(.loading) {
          background-color: var(--gw-primary-600);
        }

        .button-primary:active:not(.disabled):not(.loading) {
          background-color: var(--gw-primary-700);
        }

        .button-secondary {
          background-color: var(--gw-secondary);
          color: white;
        }

        .button-secondary:hover:not(.disabled):not(.loading) {
          background-color: var(--gw-secondary-600);
        }

        .button-secondary:active:not(.disabled):not(.loading) {
          background-color: var(--gw-secondary-700);
        }

        .button-outline {
          background-color: transparent;
          border: 1px solid var(--gw-border-color);
          color: var(--gw-text-primary);
        }

        .button-outline:hover:not(.disabled):not(.loading) {
          background-color: var(--gw-background-secondary);
          border-color: var(--gw-border-color-hover);
        }

        .button-outline:active:not(.disabled):not(.loading) {
          background-color: var(--gw-background-tertiary);
        }

        .button-ghost {
          background-color: transparent;
          color: var(--gw-text-primary);
        }

        .button-ghost:hover:not(.disabled):not(.loading) {
          background-color: var(--gw-background-secondary);
        }

        .button-ghost:active:not(.disabled):not(.loading) {
          background-color: var(--gw-background-tertiary);
        }

        .button-link {
          background-color: transparent;
          color: var(--gw-primary);
          padding: 0;
          height: auto;
        }

        .button-link:hover:not(.disabled):not(.loading) {
          text-decoration: underline;
        }

        .button-error {
          background-color: var(--gw-error-500);
          color: white;
        }

        .button-error:hover:not(.disabled):not(.loading) {
          background-color: var(--gw-error-600);
        }

        .button-error:active:not(.disabled):not(.loading) {
          background-color: var(--gw-error-700);
        }

        /* Full width */
        .button-full {
          width: 100%;
        }

        /* Loading state */
        .button.loading {
          cursor: wait;
        }

        .button-spinner {
          animation: spin 1s linear infinite;
        }

        .button.loading .button-content {
          opacity: 0.8;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Icon positioning */
        .button-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Material Design styles */
        [data-design-system="material"] .button {
          font-family: var(--gw-font-family);
          text-transform: uppercase;
          letter-spacing: 0.025em;
          font-weight: 500;
        }

        [data-design-system="material"] .button:not(.button-link):not(.button-ghost) {
          box-shadow: var(--gw-shadow-sm);
        }

        [data-design-system="material"] .button:not(.button-link):not(.button-ghost):hover:not(.disabled):not(.loading) {
          box-shadow: var(--gw-shadow-md);
          transform: translateY(-1px);
        }

        [data-design-system="material"] .button:not(.button-link):not(.button-ghost):active:not(.disabled):not(.loading) {
          box-shadow: var(--gw-shadow-sm);
          transform: translateY(0);
        }

        [data-design-system="material"] .button-primary,
        [data-design-system="material"] .button-secondary,
        [data-design-system="material"] .button-error {
          border-radius: 4px;
        }
      `}</style>
    </button>
  );
});

Button.displayName = 'Button';