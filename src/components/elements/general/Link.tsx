import React from 'react';
import { ExternalLink } from 'lucide-react';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: 'default' | 'button' | 'underline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  showExternalIcon?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const Link: React.FC<LinkProps> = ({
  children,
  href,
  variant = 'default',
  size = 'medium',
  color = 'primary',
  showExternalIcon = true,
  disabled = false,
  fullWidth = false,
  target,
  className = '',
  ...props
}) => {
  const isExternal = href?.startsWith('http') || href?.startsWith('//');
  const shouldShowExternalIcon = showExternalIcon && isExternal;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    props.onClick?.(e);
  };

  return (
    <a
      href={disabled ? undefined : href}
      target={isExternal ? target || '_blank' : target}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={`
        link
        link-${variant}
        link-${size}
        link-${color}
        ${disabled ? 'disabled' : ''}
        ${fullWidth ? 'full-width' : ''}
        ${className}
      `}
      onClick={handleClick}
      {...props}
    >
      <span className="link-content">
        {children}
        {shouldShowExternalIcon && (
          <ExternalLink size={size === 'small' ? 14 : size === 'large' ? 18 : 16} />
        )}
      </span>

      <style jsx>{`
        .link {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          transition: var(--gw-transition);
          cursor: pointer;
        }

        .link-content {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .link.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          pointer-events: none;
        }

        .link.full-width {
          width: 100%;
        }

        /* Variants */
        .link-default {
          color: var(--gw-primary);
        }

        .link-default:hover:not(.disabled) {
          color: var(--gw-primary-600);
          text-decoration: underline;
        }

        .link-button {
          padding: 0.5rem 1rem;
          border-radius: var(--gw-border-radius);
          font-weight: 500;
        }

        .link-button.link-primary {
          background-color: var(--gw-primary);
          color: white;
        }

        .link-button.link-primary:hover:not(.disabled) {
          background-color: var(--gw-primary-600);
        }

        .link-button.link-secondary {
          background-color: var(--gw-secondary);
          color: white;
        }

        .link-button.link-secondary:hover:not(.disabled) {
          background-color: var(--gw-secondary-600);
        }

        .link-button.link-success {
          background-color: var(--gw-success-500);
          color: white;
        }

        .link-button.link-success:hover:not(.disabled) {
          background-color: var(--gw-success-600);
        }

        .link-button.link-error {
          background-color: var(--gw-error-500);
          color: white;
        }

        .link-button.link-error:hover:not(.disabled) {
          background-color: var(--gw-error-600);
        }

        .link-button.link-warning {
          background-color: var(--gw-warning-500);
          color: white;
        }

        .link-button.link-warning:hover:not(.disabled) {
          background-color: var(--gw-warning-600);
        }

        .link-underline {
          text-decoration: underline;
          text-underline-offset: 0.2em;
        }

        .link-underline:hover:not(.disabled) {
          text-decoration-thickness: 2px;
        }

        .link-ghost {
          color: var(--gw-text-primary);
        }

        .link-ghost:hover:not(.disabled) {
          color: var(--gw-primary);
        }

        /* Sizes */
        .link-small {
          font-size: 0.875rem;
        }

        .link-small.link-button {
          padding: 0.375rem 0.75rem;
        }

        .link-large {
          font-size: 1.125rem;
        }

        .link-large.link-button {
          padding: 0.625rem 1.25rem;
        }

        /* Colors (for non-button variants) */
        .link-primary:not(.link-button) {
          color: var(--gw-primary);
        }

        .link-primary:not(.link-button):hover:not(.disabled) {
          color: var(--gw-primary-600);
        }

        .link-secondary:not(.link-button) {
          color: var(--gw-secondary);
        }

        .link-secondary:not(.link-button):hover:not(.disabled) {
          color: var(--gw-secondary-600);
        }

        .link-success:not(.link-button) {
          color: var(--gw-success-500);
        }

        .link-success:not(.link-button):hover:not(.disabled) {
          color: var(--gw-success-600);
        }

        .link-error:not(.link-button) {
          color: var(--gw-error-500);
        }

        .link-error:not(.link-button):hover:not(.disabled) {
          color: var(--gw-error-600);
        }

        .link-warning:not(.link-button) {
          color: var(--gw-warning-500);
        }

        .link-warning:not(.link-button):hover:not(.disabled) {
          color: var(--gw-warning-600);
        }

        /* Material Design styles */
        [data-design-system="material"] .link {
          font-family: var(--gw-font-family);
        }

        [data-design-system="material"] .link-button {
          text-transform: uppercase;
          letter-spacing: 0.025em;
          font-weight: 500;
          border-radius: 4px;
        }

        [data-design-system="material"] .link-button:not(.disabled) {
          box-shadow: var(--gw-shadow-sm);
        }

        [data-design-system="material"] .link-button:hover:not(.disabled) {
          box-shadow: var(--gw-shadow-md);
        }

        [data-design-system="material"] .link-underline {
          text-decoration-thickness: 1px;
        }

        [data-design-system="material"] .link-underline:hover:not(.disabled) {
          text-decoration-thickness: 2px;
        }
      `}</style>
    </a>
  );
};