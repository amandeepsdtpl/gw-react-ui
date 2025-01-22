import React from 'react';
import { X } from 'lucide-react';

interface ChipProps {
  label: string;
  onRemove?: () => void;
  icon?: React.ReactNode;
  color?: string;
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  onRemove,
  icon,
  color,
  variant = 'filled',
  size = 'medium',
  className = '',
}) => {
  return (
    <div
      className={`chip chip-${variant} chip-${size} ${className}`}
      style={{ backgroundColor: variant === 'filled' ? color : undefined }}
    >
      {icon && <span className="chip-icon">{icon}</span>}
      <span className="chip-label">{label}</span>
      {onRemove && (
        <button
          className="chip-remove"
          onClick={onRemove}
          aria-label={`Remove ${label}`}
        >
          <X size={size === 'small' ? 14 : size === 'large' ? 18 : 16} />
        </button>
      )}

      <style jsx>{`
        .chip {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          border-radius: 9999px;
          font-weight: 500;
          transition: var(--gw-transition);
        }

        .chip-filled {
          background-color: var(--gw-neutral-100);
          color: var(--gw-text-primary);
        }

        .chip-outlined {
          border: 1px solid var(--gw-border-color);
          background-color: transparent;
          color: var(--gw-text-primary);
        }

        .chip-small {
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
        }

        .chip-medium {
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
        }

        .chip-large {
          padding: 0.5rem 1rem;
          font-size: 1rem;
        }

        .chip-icon {
          display: flex;
          align-items: center;
          margin-right: 0.25rem;
        }

        .chip-remove {
          display: flex;
          align-items: center;
          padding: 0.125rem;
          margin-left: 0.25rem;
          margin-right: -0.25rem;
          border: none;
          background: none;
          color: currentColor;
          opacity: 0.7;
          cursor: pointer;
          border-radius: 9999px;
          transition: var(--gw-transition);
        }

        .chip-remove:hover {
          opacity: 1;
          background-color: rgba(0, 0, 0, 0.1);
        }

        /* Material Design styles */
        [data-design-system="material"] .chip {
          font-family: var(--gw-font-family);
          box-shadow: var(--gw-shadow-sm);
        }

        [data-design-system="material"] .chip-outlined {
          box-shadow: none;
        }
      `}</style>
    </div>
  );
};