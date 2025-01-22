/**
 * A validator component that tests a string against a regular expression pattern.
 * 
 * @component
 * @example
 * ```tsx
 * // Email validation
 * <RegularExpressionValidator
 *   value={email}
 *   pattern={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
 *   onValidate={(isValid) => setIsEmailValid(isValid)}
 * >
 *   <p>Please enter a valid email address</p>
 * </RegularExpressionValidator>
 * 
 * // Phone number validation
 * <RegularExpressionValidator
 *   value={phone}
 *   pattern="^\+?[1-9]\d{1,14}$"
 *   onValidate={(isValid) => setIsPhoneValid(isValid)}
 * />
 * ```
 * 
 * @property {string} value - String to validate
 * @property {string | RegExp} pattern - Regular expression pattern
 * @property {(isValid: boolean) => void} onValidate - Callback with validation result
 * @property {ReactNode} [children] - Optional content to render
 */
import React from 'react';

interface RegularExpressionValidatorProps {
  value: string;
  pattern: string | RegExp;
  onValidate: (isValid: boolean) => void;
  children?: React.ReactNode;
}

export const RegularExpressionValidator: React.FC<RegularExpressionValidatorProps> = ({
  value,
  pattern,
  onValidate,
  children,
}) => {
  React.useEffect(() => {
    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    const isValid = regex.test(value);
    onValidate(isValid);
  }, [value, pattern, onValidate]);

  return <>{children}</>;
};