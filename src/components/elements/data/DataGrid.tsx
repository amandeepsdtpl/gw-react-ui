import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Pager } from './Pager';

interface Column<T> {
  field: keyof T;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  template?: (item: T) => React.ReactNode;
}

interface DataGridProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  onSort?: (field: keyof T, direction: 'asc' | 'desc') => void;
  onFilter?: (filters: Record<keyof T, string>) => void;
  onRowClick?: (item: T) => void;
  selectable?: boolean;
  selectedIds?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  loadingTemplate?: React.ReactNode;
  rowClassName?: (item: T) => string;
  rowStyle?: (item: T) => React.CSSProperties;
  showHeader?: boolean;
  stickyHeader?: boolean;
  resizableColumns?: boolean;
  reorderableColumns?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  dense?: boolean;
}

export function DataGrid<T extends { id: string | number }>({
  data,
  columns,
  pageSize = 10,
  onSort,
  onFilter,
  onRowClick,
  selectable = false,
  selectedIds = new Set(),
  onSelectionChange,
  className = '',
  emptyMessage = 'No data to display',
  loading = false,
  loadingTemplate,
  rowClassName,
  rowStyle,
  showHeader = true,
  stickyHeader = false,
  resizableColumns = false,
  reorderableColumns = false,
  striped = true,
  hoverable = true,
  bordered = true,
  dense = false,
}: DataGridProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);
  const [columnOrder, setColumnOrder] = useState<Array<keyof T>>(columns.map(col => col.field));
  const [columnWidths, setColumnWidths] = useState<Record<string, string>>({});
  const [draggedColumn, setDraggedColumn] = useState<keyof T | null>(null);
  const [resizingColumn, setResizingColumn] = useState<keyof T | null>(null);
  const [resizeStartX, setResizeStartX] = useState(0);

  // Pagination
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);
  const currentData = data.slice(startIndex, endIndex);

  // Sorting
  const handleSort = (field: keyof T) => {
    const column = columns.find(col => col.field === field);
    if (!column?.sortable) return;

    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    onSort?.(field, newDirection);
  };

  // Filtering
  const handleFilter = (field: keyof T, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilter?.(newFilters);
    setCurrentPage(1);
  };

  // Selection
  const handleSelectAll = () => {
    if (!selectable) return;

    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.size === data.length) {
      newSelectedIds.clear();
    } else {
      data.forEach(item => newSelectedIds.add(String(item.id)));
    }
    onSelectionChange?.(newSelectedIds);
  };

  const handleSelectRow = (item: T) => {
    if (!selectable) return;

    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(String(item.id))) {
      newSelectedIds.delete(String(item.id));
    } else {
      newSelectedIds.add(String(item.id));
    }
    onSelectionChange?.(newSelectedIds);
  };

  // Column reordering
  const handleColumnDragStart = (field: keyof T) => {
    if (!reorderableColumns) return;
    setDraggedColumn(field);
  };

  const handleColumnDragOver = (e: React.DragEvent, field: keyof T) => {
    if (!reorderableColumns || !draggedColumn) return;
    e.preventDefault();

    const newOrder = [...columnOrder];
    const draggedIndex = newOrder.indexOf(draggedColumn);
    const targetIndex = newOrder.indexOf(field);

    if (draggedIndex !== targetIndex) {
      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedColumn);
      setColumnOrder(newOrder);
    }
  };

  const handleColumnDragEnd = () => {
    setDraggedColumn(null);
  };

  // Column resizing
  const handleColumnResizeStart = (e: React.MouseEvent, field: keyof T) => {
    if (!resizableColumns) return;
    setResizingColumn(field);
    setResizeStartX(e.clientX);
  };

  const handleColumnResize = (e: MouseEvent) => {
    if (!resizingColumn || !resizableColumns) return;

    const deltaX = e.clientX - resizeStartX;
    const currentWidth = parseInt(columnWidths[String(resizingColumn)] || '150', 10);
    const newWidth = Math.max(50, currentWidth + deltaX);

    setColumnWidths(prev => ({
      ...prev,
      [String(resizingColumn)]: `${newWidth}px`,
    }));
    setResizeStartX(e.clientX);
  };

  const handleColumnResizeEnd = () => {
    setResizingColumn(null);
  };

  useEffect(() => {
    if (resizingColumn) {
      window.addEventListener('mousemove', handleColumnResize);
      window.addEventListener('mouseup', handleColumnResizeEnd);
      return () => {
        window.removeEventListener('mousemove', handleColumnResize);
        window.removeEventListener('mouseup', handleColumnResizeEnd);
      };
    }
  }, [resizingColumn]);

  const renderHeader = () => {
    if (!showHeader) return null;

    return (
      <div className={`grid-header ${stickyHeader ? 'sticky' : ''}`}>
        {selectable && (
          <div className="header-cell checkbox-cell">
            <input
              type="checkbox"
              checked={selectedIds.size === data.length}
              onChange={handleSelectAll}
            />
          </div>
        )}
        {columnOrder.map(field => {
          const column = columns.find(col => col.field === field);
          if (!column) return null;

          return (
            <div
              key={String(field)}
              className={`
                header-cell
                ${column.sortable ? 'sortable' : ''}
                ${draggedColumn === field ? 'dragging' : ''}
              `}
              style={{ width: columnWidths[String(field)] || column.width }}
              draggable={reorderableColumns}
              onDragStart={() => handleColumnDragStart(field)}
              onDragOver={e => handleColumnDragOver(e, field)}
              onDragEnd={handleColumnDragEnd}
            >
              <div
                className="header-content"
                onClick={() => handleSort(field)}
              >
                {column.header}
                {column.sortable && sortField === field && (
                  <span className="sort-icon">
                    {sortDirection === 'asc' ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </span>
                )}
              </div>
              {column.filterable && (
                <div className="filter-container">
                  <input
                    type="text"
                    value={filters[field] || ''}
                    onChange={e => handleFilter(field, e.target.value)}
                    onClick={e => e.stopPropagation()}
                    placeholder="Filter..."
                    className="filter-input"
                  />
                  <Search size={14} className="filter-icon" />
                </div>
              )}
              {resizableColumns && (
                <div
                  className="resize-handle"
                  onMouseDown={e => handleColumnResizeStart(e, field)}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderLoading = () => {
    if (!loading) return null;

    if (loadingTemplate) {
      return <div className="grid-loading">{loadingTemplate}</div>;
    }

    return (
      <div className="grid-loading">
        <div className="loading-spinner" />
        <span>Loading...</span>
      </div>
    );
  };

  const renderEmpty = () => {
    if (loading || data.length > 0) return null;

    return <div className="grid-empty">{emptyMessage}</div>;
  };

  return (
    <div className={`data-grid ${className}`}>
      {renderHeader()}
      {renderLoading()}
      {renderEmpty()}
      <div className="grid-body">
        {currentData.map((item, index) => {
          const isSelected = selectedIds.has(String(item.id));
          const customClassName = rowClassName?.(item) || '';
          const customStyle = rowStyle?.(item) || {};

          return (
            <div
              key={String(item.id)}
              className={`
                grid-row
                ${striped && index % 2 === 1 ? 'striped' : ''}
                ${hoverable ? 'hoverable' : ''}
                ${isSelected ? 'selected' : ''}
                ${customClassName}
              `}
              style={customStyle}
              onClick={() => {
                onRowClick?.(item);
                if (selectable) handleSelectRow(item);
              }}
            >
              {selectable && (
                <div className="grid-cell checkbox-cell">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectRow(item)}
                    onClick={e => e.stopPropagation()}
                  />
                </div>
              )}
              {columnOrder.map(field => {
                const column = columns.find(col => col.field === field);
                if (!column) return null;

                return (
                  <div
                    key={String(field)}
                    className="grid-cell"
                    style={{ width: columnWidths[String(field)] || column.width }}
                  >
                    {column.template ? column.template(item) : String(item[field])}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {totalPages > 1 && (
        <div className="grid-footer">
          <Pager
            totalItems={data.length}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <style jsx>{`
        .data-grid {
          width: 100%;
          background-color: var(--gw-background);
          border: ${bordered ? '1px solid var(--gw-border-color)' : 'none'};
          border-radius: var(--gw-border-radius);
          overflow: hidden;
        }

        .grid-header {
          display: flex;
          background-color: var(--gw-background-secondary);
          border-bottom: 1px solid var(--gw-border-color);
        }

        .grid-header.sticky {
          position: sticky;
          top: 0;
          z-index: 1;
        }

        .header-cell {
          flex: 1;
          position: relative;
          padding: ${dense ? '0.5rem' : '1rem'};
          font-weight: 500;
          color: var(--gw-text-secondary);
          border-right: ${bordered ? '1px solid var(--gw-border-color)' : 'none'};
        }

        .header-cell:last-child {
          border-right: none;
        }

        .header-cell.sortable {
          cursor: pointer;
        }

        .header-cell.sortable:hover {
          background-color: var(--gw-background-tertiary);
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .sort-icon {
          color: var(--gw-primary);
        }

        .filter-container {
          position: relative;
          margin-top: 0.5rem;
        }

        .filter-input {
          width: 100%;
          padding: 0.25rem 2rem 0.25rem 0.5rem;
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          font-size: 0.875rem;
        }

        .filter-icon {
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gw-text-secondary);
        }

        .resize-handle {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 4px;
          cursor: col-resize;
          background-color: transparent;
          transition: background-color var(--gw-transition);
        }

        .resize-handle:hover {
          background-color: var(--gw-primary);
        }

        .grid-body {
          min-height: 100px;
        }

        .grid-row {
          display: flex;
          border-bottom: ${bordered ? '1px solid var(--gw-border-color)' : 'none'};
          transition: var(--gw-transition);
        }

        .grid-row:last-child {
          border-bottom: none;
        }

        .grid-row.striped {
          background-color: var(--gw-background-secondary);
        }

        .grid-row.hoverable:hover {
          background-color: var(--gw-background-tertiary);
        }

        .grid-row.selected {
          background-color: var(--gw-primary-50);
        }

        .grid-cell {
          flex: 1;
          padding: ${dense ? '0.5rem' : '1rem'};
          border-right: ${bordered ? '1px solid var(--gw-border-color)' : 'none'};
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .grid-cell:last-child {
          border-right: none;
        }

        .checkbox-cell {
          flex: 0 0 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .grid-loading {
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

        .grid-empty {
          padding: 2rem;
          text-align: center;
          color: var(--gw-text-secondary);
        }

        .grid-footer {
          padding: 1rem;
          border-top: ${bordered ? '1px solid var(--gw-border-color)' : 'none'};
          background-color: var(--gw-background);
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Material Design styles */
        [data-design-system="material"] .data-grid {
          font-family: var(--gw-font-family);
          box-shadow: var(--gw-shadow-sm);
          border: none;
        }

        [data-design-system="material"] .header-cell {
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        [data-design-system="material"] .grid-row.selected {
          background-color: var(--gw-primary-100);
        }

        [data-design-system="material"] .filter-input {
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}