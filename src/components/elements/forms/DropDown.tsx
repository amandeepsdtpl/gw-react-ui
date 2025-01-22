import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';

interface DropDownOption {
  value: string | number;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface DropDownProps {
  options: DropDownOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
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
  fullWidth?: boolean;
  className?: string;
}

export const DropDown: React.FC<DropDownProps> = ({
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
  searchable = false,
  clearable = true,
  loading = false,
  size = 'medium',
  variant = 'outlined',
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
  const filteredOptions = searchValue
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchValue.toLowerCase())
      )
    : options;

  // Handle click outside
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

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listboxRef.current) {
      const option = listboxRef.current.children[highlightedIndex] as HTMLElement;
      if (option) {
        option.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const handleSelect = (option: DropDownOption) => {
    if (disabled || readOnly || option.disabled) return;

    onChange?.(option.value);
    setIsOpen(false);
    setSearchValue('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || readOnly) return;

    onChange?.(undefined as any);
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
          handleSelect(filteredOptions[highlightedIndex]);
        } else if (!isOpen) {
          setIsOpen(true);
        }
        break;

      case 'Escape':
        setIsOpen(false);
        setSearchValue('');
        break;
    }
  };

  const selectedOption = options.find(option => option.value === value);

  return (
    <div
      ref={containerRef}
      className={`dropdown-wrapper ${fullWidth ? 'full-width' : ''} ${className}`}
    >
      {label && (
        <label className="dropdown-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div
        className={`
          dropdown-container
          dropdown-${variant}
          dropdown-${size}
          ${error ? 'error' : ''}
          ${isOpen ? 'open' : ''}
          ${disabled ? 'disabled' : ''}
          ${readOnly ? 'readonly' : ''}
        `}
        onClick={() => !disabled && !readOnly && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-disabled={disabled}
      >
        <div className="selected-value">
          {selectedOption ? (
            <div className="selected-option">
              {selectedOption.icon && (
                <span className="option-icon">{selectedOption.icon}</span>
              )}
              <span className="option-label">{selectedOption.label}</span>
            </div>
          ) : (
            <span className="placeholder">{placeholder}</span>
          )}
        </div>
        <div className="dropdown-actions">
          {clearable && value && !disabled && !readOnly && (
            <button
              type="button"
              className="clear-button"
              onClick={handleClear}
              aria-label="Clear selection"
            >
              <span className="clear-icon">×</span>
            </button>
          )}
          <ChevronDown
            size={16}
            className={`dropdown-icon ${isOpen ? 'open' : ''}`}
          />
        </div>
      </div>
      {isOpen && (
        <div className="dropdown-panel" ref={listboxRef}>
          {searchable && (
            <div className="search-container">
              <Search size={16} className="search-icon" />
              <input
                ref={inputRef}
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search..."
                className="search-input"
                onClick={(e) => e.stopPropagation()}
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
                    dropdown-option
                    ${option.value === value ? 'selected' : ''}
                    ${option.disabled ? 'disabled' : ''}
                    ${highlightedIndex === index ? 'highlighted' : ''}
                  `}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  role="option"
                  aria-selected={option.value === value}
                >
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
                  {option.value === value && (
                    <Check size={16} className="selected-icon" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {(error || hint) && (
        <div className={`dropdown-message ${error ? 'error' : ''}`}>
          {error || hint}
        </div>
      )}

      <style jsx>{`
        .dropdown-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          position: relative;
        }

        .dropdown-wrapper.full-width {
          width: 100%;
        }

        .dropdown-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--gw-text-secondary);
        }

        .required {
          color: var(--gw-error-500);
          margin-left: 0.25rem;
        }

        .dropdown-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-height: 2.5rem;
          padding: 0.5rem;
          cursor: pointer;
          transition: var(--gw-transition);
        }

        /* Variants */
        .dropdown-outlined {
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          background-color: var(--gw-background);
        }

        .dropdown-outlined.open {
          border-color: var(--gw-primary);
          box-shadow: 0 0 0 2px var(--gw-primary-100);
        }

        .dropdown-filled {
          border: none;
          border-radius: var(--gw-border-radius);
          background-color: var(--gw-background-secondary);
        }

        .dropdown-filled.open {
          background-color: var(--gw-background-tertiary);
        }

        .dropdown-underlined {
          border: none;
          border-bottom: 1px solid var(--gw-border-color);
          border-radius: 0;
          background-color: transparent;
        }

        .dropdown-underlined.open {
          border-bottom-color: var(--gw-primary);
        }

        /* Sizes */
        .dropdown-small {
          min-height: 2rem;
          font-size: 0.875rem;
        }

        .dropdown-medium {
          min-height: 2.5rem;
          font-size: 1rem;
        }

        .dropdown-large {
          min-height: 3rem;
          font-size: 1.125rem;
        }

        /* States */
        .dropdown-container.error {
          border-color: var(--gw-error-500);
        }

        .dropdown-container.error.open {
          box-shadow: 0 0 0 2px var(--gw-error-100);
        }

        .dropdown-container.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background-color: var(--gw-background-secondary);
        }

        .dropdown-container.readonly {
          cursor: default;
          background-color: var(--gw-background-secondary);
        }

        .selected-value {
          flex: 1;
          min-width: 0;
        }

        .selected-option {
          display: flex;
          align-items: center;
          gap: 0.5rem;
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

        .placeholder {
          color: var(--gw-text-secondary);
        }

        .dropdown-actions {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .clear-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.5rem;
          height: 1.5rem;
          padding: 0;
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

        .clear-icon {
          font-size: 1.25rem;
          line-height: 1;
        }

        .dropdown-icon {
          color: var(--gw-text-secondary);
          transition: transform var(--gw-transition);
        }

        .dropdown-icon.open {
          transform: rotate(180deg);
        }

        .dropdown-panel {
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
          padding: 0.75rem;
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

        .dropdown-option {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          cursor: pointer;
          border-radius: var(--gw-border-radius);
          transition: var(--gw-transition);
        }

        .dropdown-option:hover:not(.disabled) {
          background-color: var(--gw-background-secondary);
        }

        .dropdown-option.highlighted {
          background-color: var(--gw-background-secondary);
        }

        .dropdown-option.selected {
          background-color: var(--gw-primary-50);
          color: var(--gw-primary-700);
        }

        .dropdown-option.disabled {
          opacity: 0.5;
          cursor: not-allowed;
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

        .selected-icon {
          color: var(--gw-primary);
        }

        .dropdown-message {
          padding: 0.75rem;
          text-align: center;
          color: var(--gw-text-secondary);
        }

        .dropdown-message.error {
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
        [data-design-system="material"] .dropdown-wrapper {
          font-family: var(--gw-font-family);
        }

        [data-design-system="material"] .dropdown-outlined {
          border-radius: 4px;
        }

        [data-design-system="material"] .dropdown-filled {
          border-radius: 4px 4px 0 0;
        }

        [data-design-system="material"] .dropdown-underlined {
          border-bottom-width: 2px;
        }

        [data-design-system="material"] .dropdown-panel {
          border-radius: 4px;
          box-shadow: var(--gw-shadow-lg);
        }

        [data-design-system="material"] .clear-button {
          border-radius: 50%;
        }

        [data-design-system="material"] .dropdown-option {
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};