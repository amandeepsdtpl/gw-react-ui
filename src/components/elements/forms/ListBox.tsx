import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronRight } from 'lucide-react';

interface ListBoxGroup {
  id: string;
  label: string;
  items: ListBoxItem[];
}

interface ListBoxItem {
  id: string;
  label: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  group?: string;
}

interface ListBoxProps {
  items: (ListBoxItem | ListBoxGroup)[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  multiple?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'card' | 'compact';
  maxHeight?: number;
  className?: string;
  emptyMessage?: string;
  showCheckboxes?: boolean;
  showGroups?: boolean;
  defaultExpandedGroups?: boolean;
}

export const ListBox: React.FC<ListBoxProps> = ({
  items,
  value,
  onChange,
  label,
  error,
  hint,
  disabled = false,
  readOnly = false,
  required = false,
  multiple = false,
  size = 'medium',
  variant = 'default',
  maxHeight = 300,
  className = '',
  emptyMessage = 'No items available',
  showCheckboxes = true,
  showGroups = true,
  defaultExpandedGroups = true,
}) => {
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(defaultExpandedGroups ? items.filter(isGroup).map(g => g.id) : [])
  );
  const containerRef = useRef<HTMLDivElement>(null);

  // Type guard for groups
  const isGroup = (item: ListBoxItem | ListBoxGroup): item is ListBoxGroup => {
    return 'items' in item;
  };

  // Flatten items for keyboard navigation
  const getFlattenedItems = () => {
    const flattened: ListBoxItem[] = [];
    items.forEach(item => {
      if (isGroup(item)) {
        if (expandedGroups.has(item.id)) {
          flattened.push(...item.items);
        }
      } else {
        flattened.push(item);
      }
    });
    return flattened;
  };

  // Handle item selection
  const handleSelect = (item: ListBoxItem) => {
    if (disabled || readOnly || item.disabled) return;

    if (multiple) {
      const values = Array.isArray(value) ? value : [];
      const newValue = values.includes(item.value)
        ? values.filter(v => v !== item.value)
        : [...values, item.value];
      onChange?.(newValue);
    } else {
      onChange?.(item.value);
    }
  };

  // Handle group toggle
  const toggleGroup = (groupId: string) => {
    if (disabled || readOnly) return;

    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled || readOnly) return;

      const flattenedItems = getFlattenedItems();
      const currentIndex = flattenedItems.findIndex(item => item.id === focusedId);

      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault();
          const nextIndex = currentIndex < flattenedItems.length - 1 ? currentIndex + 1 : 0;
          setFocusedId(flattenedItems[nextIndex].id);
          break;
        }
        case 'ArrowUp': {
          e.preventDefault();
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : flattenedItems.length - 1;
          setFocusedId(flattenedItems[prevIndex].id);
          break;
        }
        case ' ':
        case 'Enter': {
          e.preventDefault();
          if (focusedId) {
            const item = flattenedItems.find(item => item.id === focusedId);
            if (item) handleSelect(item);
          }
          break;
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (container) {
        container.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [focusedId, disabled, readOnly]);

  // Render list item
  const renderItem = (item: ListBoxItem) => {
    const isSelected = multiple
      ? Array.isArray(value) && value.includes(item.value)
      : item.value === value;
    const isFocused = item.id === focusedId;

    return (
      <div
        key={item.id}
        className={`
          listbox-item
          ${isSelected ? 'selected' : ''}
          ${isFocused ? 'focused' : ''}
          ${item.disabled ? 'disabled' : ''}
        `}
        onClick={() => handleSelect(item)}
        onMouseEnter={() => setFocusedId(item.id)}
        role="option"
        aria-selected={isSelected}
        aria-disabled={item.disabled}
        tabIndex={item.disabled ? -1 : 0}
      >
        {multiple && showCheckboxes && (
          <div className="checkbox">
            {isSelected && <Check size={14} />}
          </div>
        )}
        {item.icon && (
          <span className="item-icon">{item.icon}</span>
        )}
        <div className="item-content">
          <span className="item-label">{item.label}</span>
          {item.description && (
            <span className="item-description">{item.description}</span>
          )}
        </div>
      </div>
    );
  };

  // Render group
  const renderGroup = (group: ListBoxGroup) => {
    const isExpanded = expandedGroups.has(group.id);

    return (
      <div key={group.id} className="listbox-group">
        <div
          className="group-header"
          onClick={() => toggleGroup(group.id)}
          role="button"
          aria-expanded={isExpanded}
        >
          <ChevronRight
            size={16}
            className={`group-icon ${isExpanded ? 'expanded' : ''}`}
          />
          <span className="group-label">{group.label}</span>
        </div>
        {isExpanded && (
          <div className="group-items">
            {group.items.map(renderItem)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`listbox-wrapper ${className}`}>
      {label && (
        <label className="listbox-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div
        ref={containerRef}
        className={`
          listbox
          listbox-${variant}
          listbox-${size}
          ${disabled ? 'disabled' : ''}
        `}
        style={{ maxHeight }}
        role="listbox"
        aria-multiselectable={multiple}
        aria-label={label}
        tabIndex={disabled ? -1 : 0}
      >
        {items.length === 0 ? (
          <div className="listbox-empty">{emptyMessage}</div>
        ) : (
          items.map(item => (isGroup(item) && showGroups ? renderGroup(item) : renderItem(item)))
        )}
      </div>
      {(error || hint) && (
        <div className={`listbox-message ${error ? 'error' : ''}`}>
          {error || hint}
        </div>
      )}

      <style jsx>{`
        .listbox-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .listbox-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--gw-text-secondary);
        }

        .required {
          color: var(--gw-error-500);
          margin-left: 0.25rem;
        }

        .listbox {
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          background-color: var(--gw-background);
          overflow-y: auto;
          outline: none;
        }

        .listbox:focus-visible {
          border-color: var(--gw-primary);
          box-shadow: 0 0 0 2px var(--gw-primary-100);
        }

        .listbox.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background-color: var(--gw-background-secondary);
        }

        /* Variants */
        .listbox-default {
          padding: 0.25rem;
        }

        .listbox-card {
          padding: 0.5rem;
          box-shadow: var(--gw-shadow-sm);
        }

        .listbox-compact {
          padding: 0;
        }

        /* Sizes */
        .listbox-small .listbox-item {
          padding: 0.375rem 0.5rem;
          font-size: 0.875rem;
        }

        .listbox-medium .listbox-item {
          padding: 0.5rem 0.75rem;
          font-size: 1rem;
        }

        .listbox-large .listbox-item {
          padding: 0.75rem 1rem;
          font-size: 1.125rem;
        }

        .listbox-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          border-radius: var(--gw-border-radius);
          transition: var(--gw-transition);
          user-select: none;
        }

        .listbox-item:hover:not(.disabled) {
          background-color: var(--gw-background-secondary);
        }

        .listbox-item.focused {
          background-color: var(--gw-background-secondary);
        }

        .listbox-item.selected {
          background-color: var(--gw-primary-50);
          color: var(--gw-primary-700);
        }

        .listbox-item.disabled {
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

        .listbox-item.selected .checkbox {
          background-color: var(--gw-primary);
          border-color: var(--gw-primary);
          color: white;
        }

        .item-icon {
          display: flex;
          align-items: center;
          color: var(--gw-text-secondary);
        }

        .item-content {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .item-label {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-description {
          font-size: 0.75rem;
          color: var(--gw-text-secondary);
        }

        .listbox-group {
          margin-bottom: 0.5rem;
        }

        .listbox-group:last-child {
          margin-bottom: 0;
        }

        .group-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          color: var(--gw-text-secondary);
          font-weight: 500;
          cursor: pointer;
          user-select: none;
        }

        .group-icon {
          transition: transform var(--gw-transition);
        }

        .group-icon.expanded {
          transform: rotate(90deg);
        }

        .group-items {
          padding-left: 1rem;
        }

        .listbox-empty {
          padding: 1rem;
          text-align: center;
          color: var(--gw-text-secondary);
        }

        .listbox-message {
          font-size: 0.75rem;
          color: var(--gw-text-secondary);
        }

        .listbox-message.error {
          color: var(--gw-error-500);
        }

        /* Material Design styles */
        [data-design-system="material"] .listbox-wrapper {
          font-family: var(--gw-font-family);
        }

        [data-design-system="material"] .listbox {
          border-radius: 4px;
        }

        [data-design-system="material"] .listbox-item {
          border-radius: 4px;
        }

        [data-design-system="material"] .checkbox {
          border-radius: 2px;
        }

        [data-design-system="material"] .listbox-card {
          box-shadow: var(--gw-shadow-md);
          border: none;
        }
      `}</style>
    </div>
  );
};