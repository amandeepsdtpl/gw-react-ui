import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { DataGrid } from '../data/DataGrid';

interface Column<T> {
  field: keyof T;
  header: string;
  sortable?: boolean;
  width?: string;
  template?: (item: T) => React.ReactNode;
}

interface DropDownDataGridProps<T extends { id: string | number }> {
  data: T[];
  columns: Column<T>[];
  value?: T | T[];
  onChange?: (value: T | T[]) => void;
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
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'filled' | 'underlined';
  fullWidth?: boolean;
  pageSize?: number;
  displayField?: keyof T;
  className?: string;
}

export function DropDownDataGrid<T extends { id: string | number }>({
  data,
  columns,
  value,
  onChange,
  label,
  placeholder = 'Select items',
  error,
  hint,
  disabled = false,
  readOnly = false,
  required = false,
  multiple = false,
  searchable = true,
  clearable = true,
  size = 'medium',
  variant = 'outlined',
  fullWidth = false,
  pageSize = 5,
  displayField = 'id',
  className = '',
}: DropDownDataGridProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Filter data based on search value
  const filteredData = searchValue
    ? data.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchValue.toLowerCase())
        )
      )
    : data;

  // Handle selection
  const handleSelect = (item: T) => {
    if (disabled || readOnly) return;

    if (multiple) {
      const currentValue = (value as T[]) || [];
      const isSelected = currentValue.some(v => v.id === item.id);
      
      const newValue = isSelected
        ? currentValue.filter(v => v.id !== item.id)
        : [...currentValue, item];
      
      onChange?.(newValue);
    } else {
      onChange?.(item);
      setIsOpen(false);
    }
  };

  // Handle clear
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || readOnly) return;

    onChange?.(multiple ? [] : undefined as any);
    setSearchValue('');
  };

  // Get display value
  const getDisplayValue = () => {
    if (!value) return '';

    if (multiple) {
      const selectedItems = value as T[];
      if (selectedItems.length === 0) return '';
      if (selectedItems.length === 1) return String(selectedItems[0][displayField]);
      return `${selectedItems.length} items selected`;
    }

    return String((value as T)[displayField]);
  };

  return (
    <div
      ref={containerRef}
      className={`dropdown-datagrid-wrapper ${fullWidth ? 'full-width' : ''} ${className}`}
    >
      {label && (
        <label className="dropdown-datagrid-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div
        className={`
          dropdown-datagrid-container
          dropdown-datagrid-${variant}
          dropdown-datagrid-${size}
          ${error ? 'error' : ''}
          ${isOpen ? 'open' : ''}
          ${disabled ? 'disabled' : ''}
          ${readOnly ? 'readonly' : ''}
        `}
        onClick={() => !disabled && !readOnly && setIsOpen(!isOpen)}
      >
        <div className="selected-value">
          {getDisplayValue() || <span className="placeholder">{placeholder}</span>}
        </div>
        <div className="dropdown-actions">
          {clearable && value && !disabled && !readOnly && (
            <button
              type="button"
              className="clear-button"
              onClick={handleClear}
              aria-label="Clear selection"
            >
              ×
            </button>
          )}
          <ChevronDown
            size={16}
            className={`dropdown-icon ${isOpen ? 'open' : ''}`}
          />
        </div>
      </div>
      {isOpen && (
        <div className="dropdown-panel">
          {searchable && (
            <div className="search-container">
              <Search size={16} className="search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search..."
                className="search-input"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          <DataGrid
            data={filteredData}
            columns={[
              ...(multiple
                ? [{
                    field: 'id' as keyof T,
                    header: '',
                    width: '40px',
                    template: (item: T) => (
                      <div className="selection-cell">
                        {Array.isArray(value) &&
                          value.some(v => v.id === item.id) && (
                            <Check size={16} />
                          )}
                      </div>
                    ),
                  }]
                : []),
              ...columns,
            ]}
            pageSize={pageSize}
            onRowClick={handleSelect}
            selectedIds={
              multiple && value
                ? new Set((value as T[]).map(item => String(item.id)))
                : value
                ? new Set([String((value as T).id)])
                : new Set()
            }
            hoverable
            className="dropdown-grid"
          />
        </div>
      )}
      {(error || hint) && (
        <div className={`dropdown-message ${error ? 'error' : ''}`}>
          {error || hint}
        </div>
      )}

      <style jsx>{`
        .dropdown-datagrid-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          position: relative;
        }

        .dropdown-datagrid-wrapper.full-width {
          width: 100%;
        }

        .dropdown-datagrid-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--gw-text-secondary);
        }

        .required {
          color: var(--gw-error-500);
          margin-left: 0.25rem;
        }

        .dropdown-datagrid-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          min-height: 2.5rem;
          padding: 0.5rem;
          cursor: pointer;
          transition: var(--gw-transition);
        }

        /* Variants */
        .dropdown-datagrid-outlined {
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          background-color: var(--gw-background);
        }

        .dropdown-datagrid-outlined.open {
          border-color: var(--gw-primary);
          box-shadow: 0 0 0 2px var(--gw-primary-100);
        }

        .dropdown-datagrid-filled {
          border: none;
          border-radius: var(--gw-border-radius);
          background-color: var(--gw-background-secondary);
        }

        .dropdown-datagrid-filled.open {
          background-color: var(--gw-background-tertiary);
        }

        .dropdown-datagrid-underlined {
          border: none;
          border-bottom: 1px solid var(--gw-border-color);
          border-radius: 0;
          background-color: transparent;
        }

        .dropdown-datagrid-underlined.open {
          border-bottom-color: var(--gw-primary);
        }

        /* Sizes */
        .dropdown-datagrid-small {
          min-height: 2rem;
          font-size: 0.875rem;
        }

        .dropdown-datagrid-medium {
          min-height: 2.5rem;
          font-size: 1rem;
        }

        .dropdown-datagrid-large {
          min-height: 3rem;
          font-size: 1.125rem;
        }

        /* States */
        .dropdown-datagrid-container.error {
          border-color: var(--gw-error-500);
        }

        .dropdown-datagrid-container.error.open {
          box-shadow: 0 0 0 2px var(--gw-error-100);
        }

        .dropdown-datagrid-container.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background-color: var(--gw-background-secondary);
        }

        .dropdown-datagrid-container.readonly {
          cursor: default;
          background-color: var(--gw-background-secondary);
        }

        .selected-value {
          flex: 1;
          min-width: 0;
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
          font-size: 1.25rem;
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

        .selection-cell {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--gw-primary);
        }

        .dropdown-grid {
          max-height: 300px;
          overflow-y: auto;
        }

        .dropdown-message {
          font-size: 0.75rem;
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
        [data-design-system="material"] .dropdown-datagrid-wrapper {
          font-family: var(--gw-font-family);
        }

        [data-design-system="material"] .dropdown-datagrid-outlined {
          border-radius: 4px;
        }

        [data-design-system="material"] .dropdown-datagrid-filled {
          border-radius: 4px 4px 0 0;
        }

        [data-design-system="material"] .dropdown-datagrid-underlined {
          border-bottom-width: 2px;
        }

        [data-design-system="material"] .dropdown-panel {
          border-radius: 4px;
          box-shadow: var(--gw-shadow-lg);
        }

        [data-design-system="material"] .clear-button {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}