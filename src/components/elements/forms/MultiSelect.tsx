import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, X, Search } from 'lucide-react';

interface MultiSelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value?: string[];
  onChange?: (value: string[]) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'filled' | 'underlined';
  maxItems?: number;
  fullWidth?: boolean;
  className?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value = [],
  onChange,
  label,
  placeholder = 'Select options',
  error,
  hint,
  disabled = false,
  readOnly = false,
  required = false,
  searchable = false,
  clearable = true,
  loading = false,
  size = 'medium',
  variant = 'outlined',
  maxItems,
  fullWidth = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);

  // Filter options based on search value
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchValue('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleToggle = () => {
    if (!disabled && !readOnly) {
      setIsOpen(!isOpen);
      setHighlightedIndex(-1);
      setSearchValue('');
    }
  };

  const handleOptionClick = (optionValue: string) => {
    if (disabled || readOnly) return;

    let newValue: string[];
    if (value.includes(optionValue)) {
      newValue = value.filter(v => v !== optionValue);
    } else {
      if (maxItems && value.length >= maxItems) {
        newValue = [...value.slice(1), optionValue];
      } else {
        newValue = [...value, optionValue];
      }
    }

    onChange?.(newValue);

    if (!multiple) {
      setIsOpen(false);
      setSearchValue('');
    }
  };

  const handleRemoveValue = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || readOnly) return;

    const newValue = value.filter(v => v !== optionValue);
    onChange?.(newValue);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || readOnly) return;

    onChange?.([]);
    setSearchValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || readOnly) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;

      case 'Enter':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          handleOptionClick(filteredOptions[highlightedIndex].value);
        } else if (!isOpen) {
          setIsOpen(true);
        }
        break;

      case 'Escape':
        setIsOpen(false);
        setSearchValue('');
        break;

      case 'Backspace':
        if (!searchValue && value.length > 0) {
          const newValue = value.slice(0, -1);
          onChange?.(newValue);
        }
        break;
    }
  };

  const selectedOptions = options.filter(option => value.includes(option.value));

  return (
    <div
      ref={containerRef}
      className={`multiselect-wrapper ${fullWidth ? 'full-width' : ''} ${className}`}
    >
      {label && (
        <label className="multiselect-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div
        className={`
          multiselect-container
          multiselect-${variant}
          multiselect-${size}
          ${error ? 'error' : ''}
          ${isOpen ? 'open' : ''}
          ${disabled ? 'disabled' : ''}
          ${readOnly ? 'readonly' : ''}
        `}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-disabled={disabled}
      >
        <div className="multiselect-values">
          {selectedOptions.length > 0 ? (
            <div className="selected-options">
              {selectedOptions.map(option => (
                <div key={option.value} className="selected-option">
                  {option.icon && (
                    <span className="option-icon">{option.icon}</span>
                  )}
                  <span className="option-label">{option.label}</span>
                  {!disabled && !readOnly && (
                    <button
                      type="button"
                      className="remove-option"
                      onClick={e => handleRemoveValue(option.value, e)}
                      aria-label={`Remove ${option.label}`}
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <span className="placeholder">{placeholder}</span>
          )}
        </div>
        <div className="multiselect-actions">
          {clearable && value.length > 0 && !disabled && !readOnly && (
            <button
              type="button"
              className="clear-button"
              onClick={handleClear}
              aria-label="Clear selection"
            >
              <X size={16} />
            </button>
          )}
          <ChevronDown
            size={16}
            className={`dropdown-icon ${isOpen ? 'open' : ''}`}
          />
        </div>
      </div>
      {isOpen && (
        <div className="multiselect-dropdown" ref={listboxRef}>
          {searchable && (
            <div className="search-container">
              <Search size={16} className="search-icon" />
              <input
                ref={inputRef}
                type="text"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder="Search..."
                className="search-input"
                onClick={e => e.stopPropagation()}
              />
            </div>
          )}
          {loading ? (
            <div className="dropdown-message">Loading...</div>
          ) : filteredOptions.length === 0 ? (
            <div className="dropdown-message">No options available</div>
          ) : (
            <div className="options-container" role="listbox">
              {filteredOptions.map((option, index) => (
                <div
                  key={option.value}
                  className={`
                    select-option
                    ${value.includes(option.value) ? 'selected' : ''}
                    ${option.disabled ? 'disabled' : ''}
                    ${highlightedIndex === index ? 'highlighted' : ''}
                  `}
                  onClick={() => !option.disabled && handleOptionClick(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  role="option"
                  aria-selected={value.includes(option.value)}
                >
                  <div className="checkbox">
                    {value.includes(option.value) && <Check size={14} />}
                  </div>
                  {option.icon && (
                    <span className="option-icon">{option.icon}</span>
                  )}
                  <div className="option-content">
                    <span className="option-label">{option.label}</span>
                    {option.description && (
                      <span className="option-description">
                        {option.description}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {(error || hint) && (
        <div className={`multiselect-message ${error ? 'error' : ''}`}>
          {error || hint}
        </div>
      )}

      <style jsx>{`
        .multiselect-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .multiselect-wrapper.full-width {
          width: 100%;
        }

        .multiselect-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--gw-text-secondary);
        }

        .required {
          color: var(--gw-error-500);
          margin-left: 0.25rem;
        }

        .multiselect-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-height: 2.5rem;
          padding: 0.25rem;
          cursor: pointer;
          transition: var(--gw-transition);
        }

        /* Variants */
        .multiselect-outlined {
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          background-color: var(--gw-background);
        }

        .multiselect-outlined.open {
          border-color: var(--gw-primary);
          box-shadow: 0 0 0 2px var(--gw-primary-100);
        }

        .multiselect-filled {
          border: none;
          border-radius: var(--gw-border-radius);
          background-color: var(--gw-background-secondary);
        }

        .multiselect-filled.open {
          background-color: var(--gw-background-tertiary);
        }

        .multiselect-underlined {
          border: none;
          border-bottom: 1px solid var(--gw-border-color);
          border-radius: 0;
          background-color: transparent;
        }

        .multiselect-underlined.open {
          border-bottom-color: var(--gw-primary);
        }

        /* Sizes */
        .multiselect-small {
          min-height: 2rem;
          font-size: 0.875rem;
        }

        .multiselect-large {
          min-height: 3rem;
          font-size: 1.125rem;
        }

        /* States */
        .multiselect-container.error {
          border-color: var(--gw-error-500);
        }

        .multiselect-container.error.open {
          box-shadow: 0 0 0 2px var(--gw-error-100);
        }

        .multiselect-container.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background-color: var(--gw-background-secondary);
        }

        .multiselect-container.readonly {
          background-color: var(--gw-background-secondary);
          cursor: default;
        }

        .multiselect-values {
          flex: 1;
          min-width: 0;
          padding: 0.25rem;
        }

        .selected-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }

        .selected-option {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.125rem 0.375rem;
          background-color: var(--gw-background-secondary);
          border-radius: var(--gw-border-radius);
          font-size: 0.875rem;
        }

        .option-icon {
          display: flex;
          align-items: center;
          color: var(--gw-text-secondary);
        }

        .option-label {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .remove-option {
          display: flex;
          align-items: center;
          padding: 0.125rem;
          margin: -0.125rem;
          border: none;
          background: none;
          color: var(--gw-text-secondary);
          cursor: pointer;
          border-radius: var(--gw-border-radius);
          transition: var(--gw-transition);
        }

        .remove-option:hover {
          background-color: var(--gw-background-tertiary);
          color: var(--gw-text-primary);
        }

        .placeholder {
          color: var(--gw-text-secondary);
        }

        .multiselect-actions {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding-right: 0.25rem;
        }

        .clear-button {
          display: flex;
          align-items: center;
          padding: 0.25rem;
          border: none;
          background: none;
          color: var(--gw-text-secondary);
          cursor: pointer;
          border-radius: var(--gw-border-radius);
          transition: var(--gw-transition);
        }

        .clear-button:hover {
          background-color: var(--gw-background-secondary);
          color: var(--gw-text-primary);
        }

        .dropdown-icon {
          color: var(--gw-text-secondary);
          transition: transform var(--gw-transition);
        }

        .dropdown-icon.open {
          transform: rotate(180deg);
        }

        .multiselect-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 0.25rem;
          background-color: var(--gw-background);
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          box-shadow: var(--gw-shadow-lg);
          z-index: 10;
          animation: dropdown-slide 0.2s ease-out;
        }

        .search-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          border-bottom: 1px solid var(--gw-border-color);
        }

        .search-icon {
          color: var(--gw-text-secondary);
        }

        .search-input {
          flex: 1;
          min-width: 0;
          border: none;
          background: none;
          color: var(--gw-text-primary);
          font-size: inherit;
          outline: none;
        }

        .options-container {
          max-height: 250px;
          overflow-y: auto;
          padding: 0.25rem;
        }

        .select-option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          cursor: pointer;
          border-radius: var(--gw-border-radius);
          transition: var(--gw-transition);
        }

        .select-option:hover:not(.disabled) {
          background-color: var(--gw-background-secondary);
        }

        .select-option.highlighted {
          background-color: var(--gw-background-secondary);
        }

        .select-option.selected {
          background-color: var(--gw-primary-50);
        }

        .select-option.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .checkbox {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1rem;
          height: 1rem;
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          color: var(--gw-primary);
        }

        .select-option.selected .checkbox {
          background-color: var(--gw-primary);
          border-color: var(--gw-primary);
          color: white;
        }

        .option-content {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .option-description {
          font-size: 0.75rem;
          color: var(--gw-text-secondary);
        }

        .dropdown-message {
          padding: 0.75rem;
          text-align: center;
          color: var(--gw-text-secondary);
        }

        .multiselect-message {
          font-size: 0.75rem;
          color: var(--gw-text-secondary);
        }

        .multiselect-message.error {
          color: var(--gw-error-500);
        }

        @keyframes dropdown-slide {
          from {
            opacity: 0;
            transform: translateY(-0.5rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Material Design styles */
        [data-design-system="material"] .multiselect-wrapper {
          font-family: var(--gw-font-family);
        }

        [data-design-system="material"] .multiselect-outlined {
          border-radius: 4px;
        }

        [data-design-system="material"] .multiselect-filled {
          border-radius: 4px 4px 0 0;
        }

        [data-design-system="material"] .multiselect-underlined {
          border-bottom-width: 2px;
        }

        [data-design-system="material"] .selected-option {
          border-radius: 16px;
        }

        [data-design-system="material"] .remove-option {
          border-radius: 50%;
        }

        [data-design-system="material"] .clear-button {
          border-radius: 50%;
        }

        [data-design-system="material"] .select-option {
          border-radius: 4px;
        }

        [data-design-system="material"] .checkbox {
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};