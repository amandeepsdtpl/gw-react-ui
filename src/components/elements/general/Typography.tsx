import React from 'react';

interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption' | 'overline';
  align?: 'left' | 'center' | 'right' | 'justify';
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  truncate?: boolean;
  className?: string;
}

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body1',
  align = 'left',
  color,
  weight,
  truncate = false,
  className = '',
}) => {
  const Component = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(variant)
    ? variant
    : 'p';

  return (
    <Component
      className={`typography typography-${variant} ${className}`}
    >
      {children}

      <style jsx>{`
        .typography {
          margin: 0;
          text-align: ${align};
          ${color ? `color: var(--gw-${color}-500);` : ''}
          ${weight ? `font-weight: ${
            weight === 'normal' ? '400' :
            weight === 'medium' ? '500' :
            weight === 'semibold' ? '600' :
            '700'
          };` : ''}
          ${truncate ? `
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          ` : ''}
        }

        .typography-h1 {
          font-size: var(--gw-font-size-4xl);
          line-height: var(--gw-line-height-tight);
          font-weight: 700;
          color: var(--gw-text-primary);
        }

        .typography-h2 {
          font-size: var(--gw-font-size-3xl);
          line-height: var(--gw-line-height-tight);
          font-weight: 700;
          color: var(--gw-text-primary);
        }

        .typography-h3 {
          font-size: var(--gw-font-size-2xl);
          line-height: var(--gw-line-height-snug);
          font-weight: 600;
          color: var(--gw-text-primary);
        }

        .typography-h4 {
          font-size: var(--gw-font-size-xl);
          line-height: var(--gw-line-height-snug);
          font-weight: 600;
          color: var(--gw-text-primary);
        }

        .typography-h5 {
          font-size: var(--gw-font-size-lg);
          line-height: var(--gw-line-height-normal);
          font-weight: 600;
          color: var(--gw-text-primary);
        }

        .typography-h6 {
          font-size: var(--gw-font-size-base);
          line-height: var(--gw-line-height-normal);
          font-weight: 600;
          color: var(--gw-text-primary);
        }

        .typography-body1 {
          font-size: var(--gw-font-size-base);
          line-height: var(--gw-line-height-relaxed);
          color: var(--gw-text-primary);
        }

        .typography-body2 {
          font-size: var(--gw-font-size-sm);
          line-height: var(--gw-line-height-relaxed);
          color: var(--gw-text-secondary);
        }

        .typography-caption {
          font-size: var(--gw-font-size-xs);
          line-height: var(--gw-line-height-normal);
          color: var(--gw-text-secondary);
        }

        .typography-overline {
          font-size: var(--gw-font-size-xs);
          line-height: var(--gw-line-height-normal);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--gw-text-secondary);
        }

        /* Material Design styles */
        [data-design-system="material"] .typography {
          font-family: var(--gw-font-family);
        }

        [data-design-system="material"] .typography-h1,
        [data-design-system="material"] .typography-h2,
        [data-design-system="material"] .typography-h3,
        [data-design-system="material"] .typography-h4,
        [data-design-system="material"] .typography-h5,
        [data-design-system="material"] .typography-h6 {
          letter-spacing: -0.025em;
        }

        [data-design-system="material"] .typography-body1,
        [data-design-system="material"] .typography-body2 {
          letter-spacing: 0.015em;
        }

        [data-design-system="material"] .typography-caption,
        [data-design-system="material"] .typography-overline {
          letter-spacing: 0.05em;
        }
      `}</style>
    </Component>
  );
};