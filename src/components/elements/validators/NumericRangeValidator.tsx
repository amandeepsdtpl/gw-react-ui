/**
 * A validator component that checks if a number is within a specified range.
 * 
 * @component
 * @example
 * ```tsx
 * // Age validation
 * <NumericRangeValidator
 *   value={age}
 *   min={18}
 *   max={120}
 *   onValidate={(isValid) => setIsAgeValid(isValid)}
 * >
 *   <p>Age must be between 18 and 120</p>
 * </NumericRangeValidator>
 * 
 * // Percentage validation
 * <NumericRangeValidator
 *   value={percentage}
 *   min={0}
 *   max={100}
 *   onValidate={(isValid) => setIsPercentageValid(isValid)}
 * />
 * ```
 * 
 * @property {number} value - Number to validate
 * @property {number} [min=-Infinity] - Minimum value
 * @property {number} [max=Infinity] - Maximum value
 * @property {(isValid: boolean) => void} onValidate - Callback with validation result
 * @property {ReactNode} [children] - Optional content to render
 */
import React from 'react';

interface NumericRangeValidatorProps {
  value: number;
  min?: number;
  max?: number;
  onValidate: (isValid: boolean) => void;
  children?: React.ReactNode;
}

export const NumericRangeValidator: React.FC<NumericRangeValidatorProps> = ({
  value,
  min = -Infinity,
  max = Infinity,
  onValidate,
  children,
}) => {
  React.useEffect(() => {
    const isValid = !isNaN(value) && value >= min && value <= max;
    onValidate(isValid);
  }, [value, min, max, onValidate]);

  return <>{children}</>;
};