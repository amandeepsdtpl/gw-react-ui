/**
 * A versatile Button component that supports different variants, sizes, and states.
 * 
 * @component
 * @example
 * ```tsx
 * // Primary button
 * <Button onClick={() => console.log('clicked')}>Click Me</Button>
 * 
 * // Secondary button with custom size
 * <Button variant="secondary" size="large">Large Button</Button>
 * 
 * // Full width outline button
 * <Button variant="outline" fullWidth>Full Width</Button>
 * ```
 * 
 * @property {ReactNode} children - Button content
 * @property {'primary' | 'secondary' | 'outline'} [variant='primary'] - Visual style variant
 * @property {'small' | 'medium' | 'large'} [size='medium'] - Size variant
 * @property {boolean} [fullWidth=false] - Whether the button should take full width
 * @property {string} [className] - Additional CSS classes
 * @property {boolean} [disabled] - Whether the button is disabled
 * @property {function} [onClick] - Click handler
 */
import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};