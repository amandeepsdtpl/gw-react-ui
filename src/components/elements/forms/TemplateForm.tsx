import React, { useState, useEffect } from 'react';
import { TextBox } from './TextBox';
import { TextArea } from './TextArea';
import { Checkbox } from './Checkbox';
import { Select } from './Select';
import { DatePicker } from './DatePicker';
import { TimePicker } from './TimePicker';
import { ColorPicker } from './ColorPicker';
import { FileInput } from './FileInput';
import { NumericInput } from './Numeric';
import { RadioButtonList } from './RadioButtonList';
import { Switch } from './Switch';
import { DataRepeater } from '../data/DataRepeater';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'email' | 'password' | 'date' | 'time' | 'color' | 'file' | 'select' | 'radio' | 'checkbox' | 'switch' | 'repeater';
  defaultValue?: any;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  hidden?: boolean;
  hint?: string;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    customValidator?: (value: any) => string | undefined;
  };
  options?: Array<{ value: string | number; label: string }>;
  repeaterTemplate?: FormField[];
  className?: string;
  props?: Record<string, any>;
}

interface FormSection {
  title?: string;
  description?: string;
  fields: FormField[];
  columns?: number;
  className?: string;
}

interface TemplateFormProps {
  template: FormSection[];
  initialValues?: Record<string, any>;
  onSubmit?: (values: Record<string, any>) => void;
  onChange?: (values: Record<string, any>) => void;
  onValidate?: (errors: Record<string, string>) => void;
  disabled?: boolean;
  readOnly?: boolean;
  submitButton?: React.ReactNode;
  cancelButton?: React.ReactNode;
  className?: string;
}

export const TemplateForm: React.FC<TemplateFormProps> = ({
  template,
  initialValues = {},
  onSubmit,
  onChange,
  onValidate,
  disabled = false,
  readOnly = false,
  submitButton,
  cancelButton,
  className = '',
}) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Initialize form values
  useEffect(() => {
    const defaultValues: Record<string, any> = {};
    template.forEach(section => {
      section.fields.forEach(field => {
        if (field.defaultValue !== undefined && values[field.name] === undefined) {
          defaultValues[field.name] = field.defaultValue;
        }
      });
    });
    setValues(prev => ({ ...defaultValues, ...prev }));
  }, [template]);

  // Validate field
  const validateField = (field: FormField, value: any): string | undefined => {
    if (field.required && (value === undefined || value === '' || value === null)) {
      return `${field.label} is required`;
    }

    if (field.validation) {
      const { pattern, minLength, maxLength, min, max, customValidator } = field.validation;

      if (pattern && typeof value === 'string') {
        const regex = new RegExp(pattern);
        if (!regex.test(value)) {
          return `${field.label} is invalid`;
        }
      }

      if (minLength !== undefined && typeof value === 'string' && value.length < minLength) {
        return `${field.label} must be at least ${minLength} characters`;
      }

      if (maxLength !== undefined && typeof value === 'string' && value.length > maxLength) {
        return `${field.label} must be at most ${maxLength} characters`;
      }

      if (min !== undefined && typeof value === 'number' && value < min) {
        return `${field.label} must be at least ${min}`;
      }

      if (max !== undefined && typeof value === 'number' && value > max) {
        return `${field.label} must be at most ${max}`;
      }

      if (customValidator) {
        const customError = customValidator(value);
        if (customError) return customError;
      }
    }

    return undefined;
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    template.forEach(section => {
      section.fields.forEach(field => {
        const error = validateField(field, values[field.name]);
        if (error) {
          newErrors[field.name] = error;
        }
      });
    });
    setErrors(newErrors);
    onValidate?.(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle field change
  const handleChange = (name: string, value: any) => {
    setValues(prev => {
      const newValues = { ...prev, [name]: value };
      onChange?.(newValues);
      return newValues;
    });

    setTouched(prev => ({ ...prev, [name]: true }));

    // Validate field if touched
    if (touched[name]) {
      const field = template
        .flatMap(section => section.fields)
        .find(f => f.name === name);
      
      if (field) {
        const error = validateField(field, value);
        setErrors(prev => ({ ...prev, [name]: error || '' }));
        onValidate?.(errors);
      }
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || readOnly) return;

    // Mark all fields as touched
    const newTouched: Record<string, boolean> = {};
    template.forEach(section => {
      section.fields.forEach(field => {
        newTouched[field.name] = true;
      });
    });
    setTouched(newTouched);

    // Validate form
    if (validateForm()) {
      onSubmit?.(values);
    }
  };

  // Render form field
  const renderField = (field: FormField) => {
    const commonProps = {
      name: field.name,
      label: field.label,
      value: values[field.name],
      onChange: (value: any) => handleChange(field.name, value),
      error: touched[field.name] ? errors[field.name] : undefined,
      disabled: disabled || field.disabled,
      readOnly: readOnly || field.readOnly,
      required: field.required,
      placeholder: field.placeholder,
      hint: field.hint,
      className: field.className,
      ...field.props,
    };

    switch (field.type) {
      case 'textarea':
        return <TextArea {...commonProps} />;
      case 'number':
        return <NumericInput {...commonProps} />;
      case 'email':
        return <TextBox {...commonProps} type="email" />;
      case 'password':
        return <TextBox {...commonProps} type="password" />;
      case 'date':
        return <DatePicker {...commonProps} />;
      case 'time':
        return <TimePicker {...commonProps} />;
      case 'color':
        return <ColorPicker {...commonProps} />;
      case 'file':
        return <FileInput {...commonProps} />;
      case 'select':
        return <Select {...commonProps} options={field.options || []} />;
      case 'radio':
        return <RadioButtonList {...commonProps} options={field.options || []} />;
      case 'checkbox':
        return <Checkbox {...commonProps} />;
      case 'switch':
        return <Switch {...commonProps} />;
      case 'repeater':
        if (!field.repeaterTemplate) return null;
        return (
          <DataRepeater
            items={values[field.name] || []}
            onItemsChange={items => handleChange(field.name, items)}
            renderItem={(item, index) => (
              <div className="repeater-form">
                {field.repeaterTemplate?.map(subField => (
                  <div key={subField.name} className="repeater-field">
                    {renderField({
                      ...subField,
                      name: `${field.name}[${index}].${subField.name}`,
                      defaultValue: item[subField.name],
                    })}
                  </div>
                ))}
              </div>
            )}
            {...field.props}
          />
        );
      default:
        return <TextBox {...commonProps} />;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`template-form ${className}`}
      noValidate
    >
      {template.map((section, sectionIndex) => (
        <div
          key={sectionIndex}
          className={`form-section ${section.className || ''}`}
        >
          {section.title && (
            <h3 className="section-title">{section.title}</h3>
          )}
          {section.description && (
            <p className="section-description">{section.description}</p>
          )}
          <div
            className="section-fields"
            style={{
              gridTemplateColumns: section.columns
                ? `repeat(${section.columns}, minmax(0, 1fr))`
                : undefined,
            }}
          >
            {section.fields.map(field =>
              field.hidden ? null : (
                <div key={field.name} className="field-wrapper">
                  {renderField(field)}
                </div>
              )
            )}
          </div>
        </div>
      ))}

      {(submitButton || cancelButton) && (
        <div className="form-actions">
          {cancelButton}
          {submitButton || (
            <button
              type="submit"
              className="submit-button"
              disabled={disabled || readOnly}
            >
              Submit
            </button>
          )}
        </div>
      )}

      <style jsx>{`
        .template-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          width: 100%;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--gw-text-primary);
          margin: 0;
        }

        .section-description {
          font-size: 0.875rem;
          color: var(--gw-text-secondary);
          margin: 0;
        }

        .section-fields {
          display: grid;
          gap: 1rem;
        }

        .field-wrapper {
          min-width: 0;
        }

        .repeater-form {
          display: grid;
          gap: 1rem;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--gw-border-color);
        }

        .submit-button {
          padding: 0.5rem 1rem;
          background-color: var(--gw-primary);
          color: white;
          border: none;
          border-radius: var(--gw-border-radius);
          font-weight: 500;
          cursor: pointer;
          transition: var(--gw-transition);
        }

        .submit-button:hover:not(:disabled) {
          background-color: var(--gw-primary-hover);
        }

        .submit-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Material Design styles */
        [data-design-system="material"] .template-form {
          font-family: var(--gw-font-family);
        }

        [data-design-system="material"] .section-title {
          font-family: var(--gw-font-family);
          font-weight: 500;
        }

        [data-design-system="material"] .submit-button {
          text-transform: uppercase;
          letter-spacing: 0.025em;
          font-weight: 500;
        }
      `}</style>
    </form>
  );
};