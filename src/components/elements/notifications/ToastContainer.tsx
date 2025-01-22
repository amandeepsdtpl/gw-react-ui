import React, { useState, useEffect } from 'react';
import { Toast } from './Toast';

interface ToastItem {
  id: string;
  message: string;
  variant?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastContainerProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'top-right',
  className = '',
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    // Add global method to show toasts from anywhere
    window.addToast = ({ message, variant = 'info', duration = 5000 }) => {
      const id = Math.random().toString(36).substr(2, 9);
      setToasts(prev => [...prev, { id, message, variant, duration }]);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const positionClasses = {
    'top-right': 'top-0 right-0',
    'top-left': 'top-0 left-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
  };

  return (
    <div
      className={`fixed z-50 m-4 flex flex-col ${positionClasses[position]} ${className}`}
      style={{ 
        gap: '0.5rem',
        pointerEvents: 'none',
        maxWidth: 'calc(100% - 2rem)',
        maxHeight: 'calc(100vh - 2rem)',
        overflow: 'hidden'
      }}
    >
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          variant={toast.variant}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
      <style jsx>{`
        /* Material Design styles */
        [data-design-system="material"] :global(.toast) {
          font-family: var(--gw-font-family);
          box-shadow: var(--gw-shadow-lg);
          border-radius: 4px;
          font-weight: 500;
        }

        /* Animation classes */
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slide-out {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }

        :global(.toast-enter) {
          animation: slide-in 0.3s ease forwards;
        }

        :global(.toast-exit) {
          animation: slide-out 0.3s ease forwards;
        }

        /* Position-specific animations */
        [data-position="top-left"] :global(.toast-enter),
        [data-position="bottom-left"] :global(.toast-enter) {
          animation-name: slide-in-left;
        }

        [data-position="top-left"] :global(.toast-exit),
        [data-position="bottom-left"] :global(.toast-exit) {
          animation-name: slide-out-left;
        }

        @keyframes slide-in-left {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slide-out-left {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(-100%);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};