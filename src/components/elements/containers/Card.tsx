import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  elevated?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  elevated = false,
  header,
  footer,
  className = '',
}) => {
  return (
    <div className={`card ${elevated ? 'elevated' : ''} ${className}`}>
      {(header || title || subtitle) && (
        <div className="card-header">
          {header || (
            <>
              {title && <h3 className="card-title">{title}</h3>}
              {subtitle && <p className="card-subtitle">{subtitle}</p>}
            </>
          )}
        </div>
      )}
      <div className="card-content">{children}</div>
      {footer && <div className="card-footer">{footer}</div>}

      <style jsx>{`
        .card {
          background-color: var(--gw-background);
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          overflow: hidden;
        }

        .card.elevated {
          border: none;
          box-shadow: var(--gw-shadow-md);
        }

        .card-header {
          padding: 1rem;
          border-bottom: 1px solid var(--gw-border-color);
        }

        .card-title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--gw-text-primary);
        }

        .card-subtitle {
          margin: 0.25rem 0 0;
          font-size: 0.875rem;
          color: var(--gw-text-secondary);
        }

        .card-content {
          padding: 1rem;
        }

        .card-footer {
          padding: 1rem;
          border-top: 1px solid var(--gw-border-color);
          background-color: var(--gw-background-secondary);
        }

        /* Material Design styles */
        [data-design-system="material"] .card {
          font-family: var(--gw-font-family);
        }

        [data-design-system="material"] .card.elevated {
          box-shadow: var(--gw-shadow-lg);
        }

        [data-design-system="material"] .card-header {
          padding: 1rem 1.5rem;
        }

        [data-design-system="material"] .card-content {
          padding: 1.5rem;
        }

        [data-design-system="material"] .card-footer {
          padding: 1rem 1.5rem;
        }
      `}</style>
    </div>
  );
};