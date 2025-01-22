/**
 * A flexible Card component for displaying content in a contained, elevated surface.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic card
 * <Card>
 *   <p>Card content</p>
 * </Card>
 * 
 * // Card with title and elevation
 * <Card title="Card Title" elevated>
 *   <p>Card with title and shadow</p>
 * </Card>
 * 
 * // Card with title and subtitle
 * <Card 
 *   title="Main Title" 
 *   subtitle="Supporting text"
 *   elevated
 * >
 *   <p>Card content</p>
 * </Card>
 * ```
 * 
 * @property {ReactNode} children - Card content
 * @property {string} [title] - Card title
 * @property {string} [subtitle] - Card subtitle
 * @property {boolean} [elevated=false] - Whether to add elevation shadow
 * @property {string} [className] - Additional CSS classes
 */
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  elevated?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  elevated = false,
  className = '',
}) => {
  return (
    <div className={`card ${elevated ? 'card-elevated' : ''} ${className}`}>
      {(title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};