import React from 'react';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  thickness?: number;
  spacing?: number;
  label?: React.ReactNode;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  thickness = 1,
  spacing = 16,
  label,
  className = '',
}) => {
  if (orientation === 'vertical') {
    return (
      <div
        className={`divider-vertical divider-${variant} ${className}`}
        style={{
          width: thickness,
          margin: `0 ${spacing}px`,
        }}
      />
    );
  }

  if (label) {
    return (
      <div
        className={`divider-horizontal divider-${variant} divider-with-label ${className}`}
        style={{ marginBlock: spacing }}
      >
        <span className="divider-line" style={{ height: thickness }} />
        <span className="divider-label">{label}</span>
        <span className="divider-line" style={{ height: thickness }} />
      </div>
    );
  }

  return (
    <hr
      className={`divider-horizontal divider-${variant} ${className}`}
      style={{
        height: thickness,
        marginBlock: spacing,
      }}
    />
  );
};