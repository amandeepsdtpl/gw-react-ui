import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

interface AlertProps {
  children: React.ReactNode;
  title?: string;
  variant?: 'success' | 'error' | 'info' | 'warning';
  onClose?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  title,
  variant = 'info',
  onClose,
  icon,
  className = '',
}) => {
  const getIcon = () => {
    if (icon) return icon;
    switch (variant) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  return (
    <div className={`alert alert-${variant} ${className}`} role="alert">
      <div className="alert-icon">{getIcon()}</div>
      <div className="alert-content">
        {title && <div className="alert-title">{title}</div>}
        <div className="alert-message">{children}</div>
      </div>
      {onClose && (
        <button
          className="alert-close"
          onClick={onClose}
          aria-label="Close alert"
        >
          <X size={20} />
        </button>
      )}

      <style jsx>{`
        .alert {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem;
          border-radius: var(--gw-border-radius);
          animation: alert-slide-in 0.2s ease-out;
        }

        .alert-success {
          background-color: var(--gw-success-50);
          color: var(--gw-success-700);
        }

        .alert-error {
          background-color: var(--gw-error-50);
          color: var(--gw-error-700);
        }

        .alert-warning {
          background-color: var(--gw-warning-50);
          color: var(--gw-warning-700);
        }

        .alert-info {
          background-color: var(--gw-info-50);
          color: var(--gw-info-700);
        }

        .alert-icon {
          flex-shrink: 0;
        }

        .alert-content {
          flex-grow: 1;
          min-width: 0;
        }

        .alert-title {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .alert-message {
          font-size: 0.875rem;
        }

        .alert-close {
          flex-shrink: 0;
          padding: 0.25rem;
          margin: -0.25rem;
          border: none;
          background: none;
          color: currentColor;
          opacity: 0.7;
          cursor: pointer;
          border-radius: var(--gw-border-radius);
          transition: var(--gw-transition);
        }

        .alert-close:hover {
          opacity: 1;
          background-color: rgba(0, 0, 0, 0.1);
        }

        @keyframes alert-slide-in {
          from {
            opacity: 0;
            transform: translateY(-0.5rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Material Design styles */
        [data-design-system="material"] .alert {
          font-family: var(--gw-font-family);
          box-shadow: var(--gw-shadow-sm);
        }
      `}</style>
    </div>
  );
};