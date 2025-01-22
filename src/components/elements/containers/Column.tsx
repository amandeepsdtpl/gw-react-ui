import React from 'react';

interface ColumnProps {
  children: React.ReactNode;
  span?: number;
  offset?: number;
  className?: string;
}

export const Column: React.FC<ColumnProps> = ({
  children,
  span = 12,
  offset = 0,
  className = '',
}) => {
  return (
    <div
      className={`column col-${span} ${offset ? `offset-${offset}` : ''} ${className}`}
    >
      {children}

      <style jsx>{`
        .column {
          padding: 0.5rem;
        }

        @media (min-width: 640px) {
          .col-1 { width: 8.333333%; }
          .col-2 { width: 16.666667%; }
          .col-3 { width: 25%; }
          .col-4 { width: 33.333333%; }
          .col-5 { width: 41.666667%; }
          .col-6 { width: 50%; }
          .col-7 { width: 58.333333%; }
          .col-8 { width: 66.666667%; }
          .col-9 { width: 75%; }
          .col-10 { width: 83.333333%; }
          .col-11 { width: 91.666667%; }
          .col-12 { width: 100%; }

          .offset-1 { margin-left: 8.333333%; }
          .offset-2 { margin-left: 16.666667%; }
          .offset-3 { margin-left: 25%; }
          .offset-4 { margin-left: 33.333333%; }
          .offset-5 { margin-left: 41.666667%; }
          .offset-6 { margin-left: 50%; }
          .offset-7 { margin-left: 58.333333%; }
          .offset-8 { margin-left: 66.666667%; }
          .offset-9 { margin-left: 75%; }
          .offset-10 { margin-left: 83.333333%; }
          .offset-11 { margin-left: 91.666667%; }
        }
      `}</style>
    </div>
  );
};