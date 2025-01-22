/**
 * A validator component that checks if a string or array length is within specified bounds.
 * 
 * @component
 * @example
 * ```tsx
 * // Username length validation
 * <LengthValidator
 *   value={username}
 *   min={3}
 *   max={20}
 *   onValidate={(isValid) => setIsUsernameValid(isValid)}
 * >
 *   <p>Username must be between 3 and 20 characters</p>
 * </LengthValidator>
 * 
 * // Array size validation
 * <LengthValidator
 *   value={selectedItems}
 *   min={1}
 *   onValidate={(isValid) => setHasSelection(isValid)}
 * >
 *   <p>Please select at least one item</p>
 * </LengthValidator>
 * ```
 * 
 * @property {string | any[]} value - String or array to validate
 * @property {number} [min=0] - Minimum length
 * @property {number} [max=Infinity] - Maximum length
 * @property {(isValid: boolean) => void} onValidate - Callback with validation result
 * @property {ReactNode} [children] - Optional content to render
 */
import React from 'react';

interface LengthValidatorProps {
  value: string | any[];
  min?: number;
  max?: number;
  onValidate: (isValid: boolean) => void;
  children?: React.ReactNode;
}

export const LengthValidator: React.FC<LengthValidatorProps> = ({
  value,
  min = 0,
  max = Infinity,
  onValidate,
  children,
}) => {
  React.useEffect(() => {
    const length = value?.length || 0;
    const isValid = length >= min && length <= max;
    onValidate(isValid);
  }, [value, min, max, onValidate]);

  return <>{children}</>;
};