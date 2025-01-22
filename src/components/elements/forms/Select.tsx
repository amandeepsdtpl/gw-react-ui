import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Search, X } from 'lucide-react';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: React.ReactNode;
}

interface SelectProps {
  options: SelectOption[];
  value?: string | number | Array<string | number>;
  onChange?: (value: string | number | Array<string | number>) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  loading?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'filled' | 'underlined';
  fullWidth?: boolean;
  maxHeight?: number;
  className?: string;
  renderOption?: (option: SelectOption) => React.ReactNode;
  noOptionsMessage?: string;
  loadingMessage?: string;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select an option',
  error,
  hint,
  disabled = false,
  readOnly = false,
  required = false,
  multiple = false,
  searchable = false,
  clearable = true,
  loading = false,
  size = 'medium',
  variant = 'outlined',
  fullWidth = false,
  maxHeight = 250,
  className = '',
  renderOption,
  noOptionsMessage = 'No options available',
  loadingMessage = 'Loading...',
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

  // Get selected option(s)
  const selectedOptions = multiple
    ? options.filter(option => Array.isArray(value) && value.includes(option.value))
    : options.find(option => option.value === value);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Enter':
          e.preventDefault();
          if (highlightedIndex >= 0) {
            handleOptionSelect(filteredOptions[highlightedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, highlightedIndex, filteredOptions]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listboxRef.current) {
      const option = listboxRef.current.children[highlightedIndex] as HTMLElement;
      if (option) {
        option.scrollIntoView({
          block: 'nearest',
        });
      }
    }
  }, [highlightedIndex]);

  // Handle option selection
  const handleOptionSelect = (option: SelectOption) => {
    if (option.disabled) return;

    if (multiple) {
      const newValue = Array.isArray(value) ? [...value] : [];
      const index = newValue.indexOf(option.value);
      
      if (index === -1) {
        newValue.push(option.value);
      } else {
        newValue.splice(index, 1);
      }
      
      onChange?.(newValue);
    } else {
      onChange?.(option.value);
      setIsOpen(false);
    }

    if (searchable && !multiple) {
      setSearchValue('');
    }
  };

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(multiple ? [] : '');
    setSearchValue('');
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setHighlightedIndex(-1);
  };

  // Render selected value(s)
  const renderValue = () => {
    if (!selectedOptions) return null;

    if (multiple) {
      return Array.isArray(selectedOptions) && selectedOptions.length > 0 ? (
        <div className="selected-options">
          {selectedOptions.map(option => (
            <div key={option.value} className="selected-option">
              {option.icon && <span className="option-icon">{option.icon}</span>}
              <span className="option-label">{option.label}</span>
              {!disabled && !readOnly && (
                <button
                  type="button"
                  className="remove-option"
                  onClick={e => {
                    e.stopPropagation();
                    handleOptionSelect(option);
                  }}
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
      );
    }

    return selectedOptions ? (
      <div className="selected-value">
        {selectedOptions.icon && (
          <span className="option-icon">{selectedOptions.icon}</span>
        )}
        <span className="option-label">{selectedOptions.label}</span>
      </div>
    ) : (
      <span className="placeholder">{placeholder}</span>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`select-wrapper ${fullWidth ? 'full-width' : ''} ${className}`}
    >
      {label && (
        <label className="select-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div
        className={`
          select-container
          select-${variant}
          select-${size}
          ${error ? 'error' : ''}
          ${isOpen ? 'open' : ''}
          ${disabled ? 'disabled' : ''}
          ${readOnly ? 'readonly' : ''}
        `}
        onClick={() => {
          if (!disabled && !readOnly) {
            setIsOpen(!isOpen);
            if (!isOpen && searchable) {
              setTimeout(() => inputRef.current?.focus(), 0);
            }
          }
        }}
      >
        {searchable && isOpen ? (
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search..."
            onClick={e => e.stopPropagation()}
          />
        ) : (
          renderValue()
        )}
        <div className="select-actions">
          {clearable && value && !disabled && !readOnly && (
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
        <div
          ref={listboxRef}
          className="select-dropdown"
          style={{ maxHeight }}
          role="listbox"
          aria-multiselectable={multiple}
        >
          {loading ? (
            <div className="dropdown-message loading">{loadingMessage}</div>
          ) : filteredOptions.length === 0 ? (
            <div className="dropdown-message">{noOptionsMessage}</div>
          ) : (
            filteredOptions.map((option, index) => (
              <div
                key={option.value}
                className={`
                  select-option
                  ${option.disabled ? 'disabled' : ''}
                  ${highlightedIndex === index ? 'highlighted' : ''}
                  ${
                    multiple
                      ? Array.isArray(value) && value.includes(option.value)
                        ? 'selected'
                        : ''
                      : option.value === value
                      ? 'selected'
                      : ''
                  }
                `}
                onClick={() => handleOptionSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                role="option"
                aria-selected={
                  multiple
                    ? Array.isArray(value) && value.includes(option.value)
                    : option.value === value
                }
              >
                {renderOption ? (
                  renderOption(option)
                ) : (
                  <>
                    {multiple && (
                      <div className="checkbox">
                        {Array.isArray(value) && value.includes(option.value) && (
                          <Check size={14} />
                        )}
                      </div>
                    )}
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
                  </>
                )}
              </div>
            ))
          )}
        </div>
      )}
      {(error || hint) && (
        <div className={`select-message ${error ? 'error' : ''}`}>
          {error || hint}
        </div>
      )}

      <style jsx>{`
        .select-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .select-wrapper.full-width {
          width: 100%;
        }

        .select-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--gw-text-secondary);
        }

        .required {
          color: var(--gw-error-500);
          margin-left: 0.25rem;
        }

        .select-container {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-height: 2.5rem;
          padding: 0.5rem;
          cursor: pointer;
          transition: var(--gw-transition);
        }

        /* Variants */
        .select-outlined {
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          background-color: var(--gw-background);
        }

        .select-outlined.open {
          border-color: var(--gw-primary);
          box-shadow: 0 0 0 2px var(--gw-primary-100);
        }

        .select-filled {
          border: none;
          border-radius: var(--gw-border-radius);
          background-color: var(--gw-background-secondary);
        }

        .select-filled.open {
          background-color: var(--gw-background-tertiary);
        }

        .select-underlined {
          border: none;
          border-bottom: 1px solid var(--gw-border-color);
          border-radius: 0;
          background-color: transparent;
        }

        .select-underlined.open {
          border-bottom-color: var(--gw-primary);
        }

        /* Sizes */
        .select-small {
          min-height: 2rem;
          font-size: 0.875rem;
        }

        .select-medium {
          min-height: 2.5rem;
          font-size: 1rem;
        }

        .select-large {
          min-height: 3rem;
          font-size: 1.125rem;
        }

        /* States */
        .select-container.error {
          border-color: var(--gw-error-500);
        }

        .select-container.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background-color: var(--gw-background-secondary);
        }

        .select-container.readonly {
          cursor: default;
        }

        /* Selected value */
        .selected-value,
        .placeholder {
          flex: 1;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .placeholder {
          color: var(--gw-text-secondary);
        }

        .selected-options {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
          flex: 1;
          min-width: 0;
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
          justify-content: center;
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
          justify-content: center;
          padding: 0;
          border: none;
          background: none;
          color: var(--gw-text-secondary);
          cursor: pointer;
          transition: var(--gw-transition);
        }

        .remove-option:hover {
          color: var(--gw-text-primary);
        }

        /* Actions */
        .select-actions {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          margin-left: auto;
        }

        .clear-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem;
          border: none;
          background: none;
          color: var(--gw-text-secondary);
          cursor: pointer;
          transition: var(--gw-transition);
          border-radius: var(--gw-border-radius);
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

        /* Search input */
        .search-input {
          flex: 1;
          min-width: 0;
          border: none;
          background: none;
          padding: 0;
          color: var(--gw-text-primary);
          outline: none;
        }

        /* Dropdown */
        .select-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 0.25rem;
          background-color: var(--gw-background);
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          box-shadow: var(--gw-shadow-lg);
          overflow-y: auto;
          z-index: 10;
        }

        .dropdown-message {
          padding: 0.75rem;
          text-align: center;
          color: var(--gw-text-secondary);
        }

        .dropdown-message.loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .select-option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          cursor: pointer;
          transition: var(--gw-transition);
        }

        .select-option:hover:not(.disabled),
        .select-option.highlighted:not(.disabled) {
          background-color: var(--gw-background-secondary);
        }

        .select-option.selected {
          background-color: var(--gw-primary-50);
          color: var(--gw-primary-700);
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
        }

        .option-description {
          display: block;
          font-size: 0.75rem;
          color: var(--gw-text-secondary);
        }

        .select-message {
          font-size: 0.75rem;
          color: var(--gw-text-secondary);
        }

        .select-message.error {
          color: var(--gw-error-500);
        }

        /* Material Design styles */
        [data-design-system="material"] .select-outlined {
          border-radius: 4px;
        }

        [data-design-system="material"] .select-filled {
          border-radius: 4px 4px 0 0;
        }

        [data-design-system="material"] .select-underlined {
          border-bottom-width: 2px;
        }

        [data-design-system="material"] .select-label {
          font-family: var(--gw-font-family);
          font-weight: 500;
        }

        [data-design-system="material"] .select-dropdown {
          border-radius: 4px;
        }

        [data-design-system="material"] .checkbox {
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
};