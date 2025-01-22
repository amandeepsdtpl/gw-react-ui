import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface ToastProps {
  message: string;
  variant?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose: () => void;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  variant = 'info',
  duration = 5000,
  onClose,
  className = '',
}) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
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
    <div
      className={`toast toast-${variant} ${className}`}
      role="alert"
      style={{ pointerEvents: 'auto' }}
    >
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-content">{message}</div>
      <button
        className="toast-close"
        onClick={onClose}
        aria-label="Close toast"
      >
        <X size={16} />
      </button>

      <style jsx>{`
        .toast {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: var(--gw-border-radius);
          background-color: var(--gw-background);
          box-shadow: var(--gw-shadow-lg);
          min-width: 300px;
          max-width: 500px;
          animation: toast-slide-in 0.2s ease-out;
        }

        .toast-success {
          border-left: 4px solid var(--gw-success-500);
          color: var(--gw-success-700);
        }

        .toast-error {
          border-left: 4px solid var(--gw-error-500);
          color: var(--gw-error-700);
        }

        .toast-warning {
          border-left: 4px solid var(--gw-warning-500);
          color: var(--gw-warning-700);
        }

        .toast-info {
          border-left: 4px solid var(--gw-info-500);
          color: var(--gw-info-700);
        }

        .toast-icon {
          flex-shrink: 0;
        }

        .toast-content {
          flex-grow: 1;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .toast-close {
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

        .toast-close:hover {
          opacity: 1;
          background-color: rgba(0, 0, 0, 0.1);
        }

        @keyframes toast-slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        /* Material Design styles */
        [data-design-system="material"] .toast {
          font-family: var(--gw-font-family);
          border-radius: 4px;
          border-left-width: 0;
          padding: 1rem;
        }

        [data-design-system="material"] .toast-success {
          background-color: var(--gw-success-50);
        }

        [data-design-system="material"] .toast-error {
          background-color: var(--gw-error-50);
        }

        [data-design-system="material"] .toast-warning {
          background-color: var(--gw-warning-50);
        }

        [data-design-system="material"] .toast-info {
          background-color: var(--gw-info-50);
        }
      `}</style>
    </div>
  );
};