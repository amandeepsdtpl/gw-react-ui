/**
 * A validator component that checks if a value is not empty, null, or undefined.
 * 
 * @component
 * @example
 * ```tsx
 * // Required field validation
 * <RequiredValidator
 *   value={name}
 *   onValidate={(isValid) => setIsNameValid(isValid)}
 * >
 *   <p>This field is required</p>
 * </RequiredValidator>
 * 
 * // Required selection validation
 * <RequiredValidator
 *   value={selectedOption}
 *   onValidate={(isValid) => setHasSelection(isValid)}
 * />
 * ```
 * 
 * @property {any} value - Value to validate
 * @property {(isValid: boolean) => void} onValidate - Callback with validation result
 * @property {ReactNode} [children] - Optional content to render
 */
import React from 'react';

interface RequiredValidatorProps {
  value: any;
  onValidate: (isValid: boolean) => void;
  children?: React.ReactNode;
}

export const RequiredValidator: React.FC<RequiredValidatorProps> = ({
  value,
  onValidate,
  children,
}) => {
  React.useEffect(() => {
    const isValid = value !== null && value !== undefined && value !== '';
    onValidate(isValid);
  }, [value, onValidate]);

  return <>{children}</>;
};