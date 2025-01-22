import React from 'react';

interface RowProps {
  children: React.ReactNode;
  gap?: number;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  wrap?: boolean;
  className?: string;
}

export const Row: React.FC<RowProps> = ({
  children,
  gap = 4,
  align = 'stretch',
  justify = 'start',
  wrap = true,
  className = '',
}) => {
  return (
    <div
      className={`row align-${align} justify-${justify} ${wrap ? 'wrap' : ''} ${className}`}
      style={{ gap: `${gap * 0.25}rem` }}
    >
      {children}

      <style jsx>{`
        .row {
          display: flex;
          margin: -0.5rem;
        }

        .wrap {
          flex-wrap: wrap;
        }

        .align-start { align-items: flex-start; }
        .align-center { align-items: center; }
        .align-end { align-items: flex-end; }
        .align-stretch { align-items: stretch; }

        .justify-start { justify-content: flex-start; }
        .justify-center { justify-content: center; }
        .justify-end { justify-content: flex-end; }
        .justify-between { justify-content: space-between; }
        .justify-around { justify-content: space-around; }

        /* Material Design styles */
        [data-design-system="material"] .row {
          font-family: var(--gw-font-family);
        }
      `}</style>
    </div>
  );
};