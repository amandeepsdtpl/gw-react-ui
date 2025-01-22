import React from 'react';
import { ChevronRight } from 'lucide-react';

interface DataListItem {
  id: string;
  [key: string]: any;
}

interface DataListColumn<T> {
  field: keyof T;
  header: string;
  template?: (item: T) => React.ReactNode;
  width?: string;
}

interface DataListProps<T extends DataListItem> {
  items: T[];
  columns?: DataListColumn<T>[];
  layout?: 'list' | 'grid' | 'table';
  gridCols?: number;
  itemTemplate?: (item: T) => React.ReactNode;
  onItemClick?: (item: T) => void;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  loadingTemplate?: React.ReactNode;
  showHeader?: boolean;
  rowClassName?: (item: T) => string;
  rowStyle?: (item: T) => React.CSSProperties;
}

export function DataList<T extends DataListItem>({
  items,
  columns,
  layout = 'list',
  gridCols = 3,
  itemTemplate,
  onItemClick,
  selectable = false,
  selectedIds = new Set(),
  onSelectionChange,
  className = '',
  emptyMessage = 'No items to display',
  loading = false,
  loadingTemplate,
  showHeader = true,
  rowClassName,
  rowStyle,
}: DataListProps<T>) {
  const handleItemClick = (item: T) => {
    if (selectable) {
      const newSelectedIds = new Set(selectedIds);
      if (newSelectedIds.has(item.id)) {
        newSelectedIds.delete(item.id);
      } else {
        newSelectedIds.add(item.id);
      }
      onSelectionChange?.(newSelectedIds);
    }
    onItemClick?.(item);
  };

  const renderDefaultItem = (item: T) => {
    if (columns) {
      return columns.map((column, index) => (
        <div key={String(column.field)} className="item-field" style={{ width: column.width }}>
          {column.template ? column.template(item) : item[column.field]}
        </div>
      ));
    }
    return <div className="item-content">{JSON.stringify(item)}</div>;
  };

  const renderItem = (item: T) => {
    const isSelected = selectedIds.has(item.id);
    const customClassName = rowClassName?.(item) || '';
    const customStyle = rowStyle?.(item) || {};

    return (
      <div
        key={item.id}
        className={`
          data-list-item
          ${layout}-item
          ${isSelected ? 'selected' : ''}
          ${selectable ? 'selectable' : ''}
          ${onItemClick ? 'clickable' : ''}
          ${customClassName}
        `}
        style={customStyle}
        onClick={() => handleItemClick(item)}
        role={selectable ? 'checkbox' : onItemClick ? 'button' : undefined}
        aria-checked={selectable ? isSelected : undefined}
        tabIndex={selectable || onItemClick ? 0 : undefined}
      >
        {itemTemplate ? itemTemplate(item) : renderDefaultItem(item)}
        {onItemClick && <ChevronRight size={16} className="item-arrow" />}
      </div>
    );
  };

  const renderHeader = () => {
    if (!showHeader || !columns || layout === 'grid') return null;

    return (
      <div className="data-list-header">
        {columns.map((column) => (
          <div
            key={String(column.field)}
            className="header-cell"
            style={{ width: column.width }}
          >
            {column.header}
          </div>
        ))}
      </div>
    );
  };

  const renderLoading = () => {
    if (!loading) return null;

    if (loadingTemplate) {
      return <div className="data-list-loading">{loadingTemplate}</div>;
    }

    return (
      <div className="data-list-loading">
        <div className="loading-spinner" />
        <span>Loading...</span>
      </div>
    );
  };

  const renderEmpty = () => {
    if (loading || items.length > 0) return null;

    return <div className="data-list-empty">{emptyMessage}</div>;
  };

  return (
    <div className={`data-list data-list-${layout} ${className}`}>
      {renderHeader()}
      {renderLoading()}
      {renderEmpty()}
      <div
        className="data-list-content"
        style={
          layout === 'grid'
            ? {
                gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
              }
            : undefined
        }
      >
        {items.map(renderItem)}
      </div>

      <style jsx>{`
        .data-list {
          width: 100%;
          background-color: var(--gw-background);
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
        }

        .data-list-header {
          display: flex;
          padding: 1rem;
          background-color: var(--gw-background-secondary);
          border-bottom: 1px solid var(--gw-border-color);
          font-weight: 500;
        }

        .header-cell {
          flex: 1;
          padding: 0 0.5rem;
          color: var(--gw-text-secondary);
        }

        .data-list-content {
          display: flex;
          flex-direction: column;
        }

        .data-list-grid .data-list-content {
          display: grid;
          gap: 1rem;
          padding: 1rem;
        }

        .data-list-item {
          display: flex;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid var(--gw-border-color);
          transition: var(--gw-transition);
        }

        .data-list-item:last-child {
          border-bottom: none;
        }

        .grid-item {
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          height: 100%;
        }

        .data-list-item.selectable,
        .data-list-item.clickable {
          cursor: pointer;
        }

        .data-list-item.selectable:hover,
        .data-list-item.clickable:hover {
          background-color: var(--gw-background-secondary);
        }

        .data-list-item.selected {
          background-color: var(--gw-primary-50);
          border-color: var(--gw-primary-200);
        }

        .item-field {
          flex: 1;
          padding: 0 0.5rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .item-content {
          flex: 1;
          min-width: 0;
        }

        .item-arrow {
          flex-shrink: 0;
          margin-left: 0.5rem;
          color: var(--gw-text-secondary);
        }

        .data-list-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 2rem;
          color: var(--gw-text-secondary);
        }

        .loading-spinner {
          width: 1.5rem;
          height: 1.5rem;
          border: 2px solid var(--gw-background-secondary);
          border-top-color: var(--gw-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .data-list-empty {
          padding: 2rem;
          text-align: center;
          color: var(--gw-text-secondary);
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Material Design styles */
        [data-design-system="material"] .data-list {
          font-family: var(--gw-font-family);
          box-shadow: var(--gw-shadow-sm);
          border: none;
        }

        [data-design-system="material"] .data-list-header {
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        [data-design-system="material"] .grid-item {
          box-shadow: var(--gw-shadow-sm);
          border: none;
        }

        [data-design-system="material"] .data-list-item.selected {
          background-color: var(--gw-primary-100);
        }
      `}</style>
    </div>
  );
}