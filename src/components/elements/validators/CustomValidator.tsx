/**
 * A validator component that uses a custom validation function.
 * 
 * @component
 * @example
 * ```tsx
 * // Email validation
 * <CustomValidator
 *   value={email}
 *   validationFn={(value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)}
 *   onValidate={(isValid) => setIsEmailValid(isValid)}
 * >
 *   <p>Please enter a valid email address</p>
 * </CustomValidator>
 * 
 * // Custom password strength check
 * <CustomValidator
 *   value={password}
 *   validationFn={(value) => value.length >= 8 && /[A-Z]/.test(value) && /[0-9]/.test(value)}
 *   onValidate={(isValid) => setIsPasswordStrong(isValid)}
 * />
 * ```
 * 
 * @property {any} value - Value to validate
 * @property {(value: any) => boolean} validationFn - Custom validation function
 * @property {(isValid: boolean) => void} onValidate - Callback with validation result
 * @property {ReactNode} [children] - Optional content to render
 */
import React from 'react';

interface CustomValidatorProps {
  value: any;
  validationFn: (value: any) => boolean;
  onValidate: (isValid: boolean) => void;
  children?: React.ReactNode;
}

export const CustomValidator: React.FC<CustomValidatorProps> = ({
  value,
  validationFn,
  onValidate,
  children,
}) => {
  React.useEffect(() => {
    const isValid = validationFn(value);
    onValidate(isValid);
  }, [value, validationFn, onValidate]);

  return <>{children}</>;
};