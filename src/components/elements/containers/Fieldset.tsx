import React from 'react';

interface FieldsetProps {
  children: React.ReactNode;
  legend?: string;
  disabled?: boolean;
  className?: string;
}

export const Fieldset: React.FC<FieldsetProps> = ({
  children,
  legend,
  disabled = false,
  className = '',
}) => {
  return (
    <fieldset
      className={`fieldset ${disabled ? 'disabled' : ''} ${className}`}
      disabled={disabled}
    >
      {legend && <legend className="fieldset-legend">{legend}</legend>}
      <div className="fieldset-content">{children}</div>

      <style jsx>{`
        .fieldset {
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          padding: 1rem;
          margin: 0;
        }

        .fieldset-legend {
          padding: 0 0.5rem;
          font-weight: 500;
          color: var(--gw-text-primary);
        }

        .fieldset.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .fieldset-content {
          margin-top: 0.5rem;
        }

        /* Material Design styles */
        [data-design-system="material"] .fieldset {
          font-family: var(--gw-font-family);
          padding: 1.5rem;
        }

        [data-design-system="material"] .fieldset-legend {
          font-weight: 500;
        }
      `}</style>
    </fieldset>
  );
};