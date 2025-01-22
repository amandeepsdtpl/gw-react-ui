import React from 'react';
import { Plus, Minus, ArrowUp, ArrowDown } from 'lucide-react';

interface DataRepeaterProps<T> {
  items: T[];
  onItemsChange: (items: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  addNewItem?: () => T;
  maxItems?: number;
  minItems?: number;
  allowReordering?: boolean;
  allowDeletion?: boolean;
  allowAddition?: boolean;
  addButtonText?: string;
  className?: string;
  disabled?: boolean;
}

export function DataRepeater<T>({
  items,
  onItemsChange,
  renderItem,
  addNewItem,
  maxItems = Infinity,
  minItems = 0,
  allowReordering = true,
  allowDeletion = true,
  allowAddition = true,
  addButtonText = 'Add Item',
  className = '',
  disabled = false,
}: DataRepeaterProps<T>) {
  const handleAdd = () => {
    if (disabled || !allowAddition || items.length >= maxItems) return;
    
    const newItem = addNewItem?.() ?? ({} as T);
    onItemsChange([...items, newItem]);
  };

  const handleDelete = (index: number) => {
    if (disabled || !allowDeletion || items.length <= minItems) return;
    
    const newItems = [...items];
    newItems.splice(index, 1);
    onItemsChange(newItems);
  };

  const handleMoveUp = (index: number) => {
    if (disabled || !allowReordering || index === 0) return;
    
    const newItems = [...items];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    onItemsChange(newItems);
  };

  const handleMoveDown = (index: number) => {
    if (disabled || !allowReordering || index === items.length - 1) return;
    
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    onItemsChange(newItems);
  };

  return (
    <div className={`data-repeater ${className}`}>
      <div className="repeater-items">
        {items.map((item, index) => (
          <div key={index} className="repeater-item">
            <div className="item-content">
              {renderItem(item, index)}
            </div>
            <div className="item-actions">
              {allowReordering && (
                <>
                  <button
                    type="button"
                    className="action-button"
                    onClick={() => handleMoveUp(index)}
                    disabled={disabled || index === 0}
                    aria-label="Move up"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    type="button"
                    className="action-button"
                    onClick={() => handleMoveDown(index)}
                    disabled={disabled || index === items.length - 1}
                    aria-label="Move down"
                  >
                    <ArrowDown size={16} />
                  </button>
                </>
              )}
              {allowDeletion && (
                <button
                  type="button"
                  className="action-button delete"
                  onClick={() => handleDelete(index)}
                  disabled={disabled || items.length <= minItems}
                  aria-label="Delete item"
                >
                  <Minus size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {allowAddition && (
        <button
          type="button"
          className="add-button"
          onClick={handleAdd}
          disabled={disabled || items.length >= maxItems}
        >
          <Plus size={16} />
          {addButtonText}
        </button>
      )}

      <style jsx>{`
        .data-repeater {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
        }

        .repeater-items {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .repeater-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background-color: var(--gw-background);
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          transition: var(--gw-transition);
        }

        .repeater-item:hover {
          border-color: var(--gw-border-color-hover);
        }

        .item-content {
          flex: 1;
          min-width: 0;
        }

        .item-actions {
          display: flex;
          gap: 0.25rem;
          align-items: center;
        }

        .action-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          padding: 0;
          border: 1px solid var(--gw-border-color);
          background: none;
          color: var(--gw-text-secondary);
          border-radius: var(--gw-border-radius);
          cursor: pointer;
          transition: var(--gw-transition);
        }

        .action-button:hover:not(:disabled) {
          background-color: var(--gw-background-secondary);
          border-color: var(--gw-border-color-hover);
          color: var(--gw-text-primary);
        }

        .action-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .action-button.delete:hover:not(:disabled) {
          background-color: var(--gw-error-50);
          border-color: var(--gw-error-500);
          color: var(--gw-error-500);
        }

        .add-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: 2px dashed var(--gw-border-color);
          background: none;
          color: var(--gw-text-secondary);
          border-radius: var(--gw-border-radius);
          cursor: pointer;
          transition: var(--gw-transition);
          font-weight: 500;
        }

        .add-button:hover:not(:disabled) {
          border-color: var(--gw-primary);
          color: var(--gw-primary);
          background-color: var(--gw-primary-50);
        }

        .add-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Material Design styles */
        [data-design-system="material"] .repeater-item {
          box-shadow: var(--gw-shadow-sm);
          border: none;
        }

        [data-design-system="material"] .action-button {
          border-radius: 50%;
        }

        [data-design-system="material"] .add-button {
          text-transform: uppercase;
          letter-spacing: 0.025em;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}