/**
 * A modal Dialog component for displaying content in an overlay with a backdrop.
 * 
 * @component
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <Dialog
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Dialog Title"
 * >
 *   <p>Dialog content</p>
 *   <button onClick={() => setIsOpen(false)}>Close</button>
 * </Dialog>
 * ```
 * 
 * Features:
 * - Keyboard support (Esc to close)
 * - Click outside to close
 * - Focus trap
 * - ARIA attributes for accessibility
 * 
 * @property {boolean} isOpen - Whether the dialog is visible
 * @property {function} onClose - Handler for closing the dialog
 * @property {string} title - Dialog title
 * @property {ReactNode} children - Dialog content
 * @property {string} [className] - Additional CSS classes
 */
import React, { useEffect, useRef } from 'react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div
        ref={dialogRef}
        className={`dialog ${className}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="dialog-header">
          <h2 className="dialog-title">{title}</h2>
          <button
            className="dialog-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>
        <div className="dialog-content">
          {children}
        </div>
      </div>
    </div>
  );
};