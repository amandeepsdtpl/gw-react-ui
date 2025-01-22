/**
 * A validator component that compares two values using specified operators.
 * 
 * @component
 * @example
 * ```tsx
 * // Compare password fields
 * <CompareValidator
 *   value1={password}
 *   value2={confirmPassword}
 *   operator="=="
 *   onValidate={(isValid) => setPasswordsMatch(isValid)}
 * >
 *   <p>Passwords must match</p>
 * </CompareValidator>
 * 
 * // Compare numbers
 * <CompareValidator
 *   value1={age}
 *   value2={18}
 *   operator=">="
 *   onValidate={(isValid) => setIsAdult(isValid)}
 * />
 * ```
 * 
 * @property {any} value1 - First value to compare
 * @property {any} value2 - Second value to compare
 * @property {'==' | '!=' | '>' | '>=' | '<' | '<='} [operator='=='] - Comparison operator
 * @property {(isValid: boolean) => void} onValidate - Callback with validation result
 * @property {ReactNode} [children] - Optional content to render
 */
import React from 'react';

interface CompareValidatorProps {
  value1: any;
  value2: any;
  operator?: '==' | '!=' | '>' | '>=' | '<' | '<=';
  onValidate: (isValid: boolean) => void;
  children?: React.ReactNode;
}

export const CompareValidator: React.FC<CompareValidatorProps> = ({
  value1,
  value2,
  operator = '==',
  onValidate,
  children,
}) => {
  React.useEffect(() => {
    let isValid = false;
    
    switch (operator) {
      case '==':
        isValid = value1 == value2;
        break;
      case '!=':
        isValid = value1 != value2;
        break;
      case '>':
        isValid = value1 > value2;
        break;
      case '>=':
        isValid = value1 >= value2;
        break;
      case '<':
        isValid = value1 < value2;
        break;
      case '<=':
        isValid = value1 <= value2;
        break;
    }

    onValidate(isValid);
  }, [value1, value2, operator, onValidate]);

  return <>{children}</>;
};