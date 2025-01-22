import React, { useState, useCallback } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface TreeGridColumn<T> {
  field: keyof T;
  header: string;
  width?: string;
  sortable?: boolean;
  template?: (item: T) => React.ReactNode;
}

interface TreeGridNode<T> {
  id: string;
  data: T;
  children?: TreeGridNode<T>[];
  expanded?: boolean;
  level?: number;
}

interface TreeGridProps<T> {
  data: TreeGridNode<T>[];
  columns: TreeGridColumn<T>[];
  onToggle?: (node: TreeGridNode<T>) => void;
  onSort?: (field: keyof T, direction: 'asc' | 'desc') => void;
  className?: string;
  rowHeight?: number;
  headerHeight?: number;
  striped?: boolean;
  hoverable?: boolean;
  selectable?: boolean;
  onSelect?: (node: TreeGridNode<T>) => void;
  selectedIds?: Set<string>;
}

export function TreeGrid<T>({
  data,
  columns,
  onToggle,
  onSort,
  className = '',
  rowHeight = 48,
  headerHeight = 48,
  striped = true,
  hoverable = true,
  selectable = false,
  onSelect,
  selectedIds = new Set(),
}: TreeGridProps<T>) {
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Flatten tree data for rendering
  const flattenData = useCallback((
    nodes: TreeGridNode<T>[],
    level = 0,
    parentExpanded = true
  ): (TreeGridNode<T> & { visible: boolean; level: number })[] => {
    return nodes.reduce((acc, node) => {
      const isExpanded = expandedNodes.has(node.id);
      const visible = parentExpanded;
      
      acc.push({ ...node, visible, level });
      
      if (node.children && isExpanded) {
        acc.push(...flattenData(node.children, level + 1, visible));
      }
      
      return acc;
    }, [] as (TreeGridNode<T> & { visible: boolean; level: number })[]);
  }, [expandedNodes]);

  const handleSort = (field: keyof T) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
    onSort?.(field, newDirection);
  };

  const handleToggle = (node: TreeGridNode<T>) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(node.id)) {
        next.delete(node.id);
      } else {
        next.add(node.id);
      }
      return next;
    });
    onToggle?.(node);
  };

  const handleSelect = (node: TreeGridNode<T>) => {
    onSelect?.(node);
  };

  const renderCell = (node: TreeGridNode<T>, column: TreeGridColumn<T>, isFirstColumn: boolean) => {
    const value = node.data[column.field];
    const content = column.template ? column.template(node.data) : value;

    if (isFirstColumn) {
      return (
        <div
          className="tree-grid-cell first-column"
          style={{ paddingLeft: `${node.level * 1.5 + 1}rem` }}
        >
          {node.children && node.children.length > 0 && (
            <button
              className="toggle-button"
              onClick={(e) => {
                e.stopPropagation();
                handleToggle(node);
              }}
              aria-label={expandedNodes.has(node.id) ? 'Collapse' : 'Expand'}
            >
              {expandedNodes.has(node.id) ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>
          )}
          <span className="cell-content">{content}</span>
        </div>
      );
    }

    return (
      <div className="tree-grid-cell">
        <span className="cell-content">{content}</span>
      </div>
    );
  };

  const flattenedData = flattenData(data);

  return (
    <div className={`tree-grid ${className}`}>
      {/* Header */}
      <div
        className="tree-grid-header"
        style={{ height: headerHeight }}
      >
        {columns.map((column, index) => (
          <div
            key={String(column.field)}
            className={`tree-grid-header-cell ${column.sortable ? 'sortable' : ''}`}
            style={{ width: column.width }}
            onClick={() => column.sortable && handleSort(column.field)}
          >
            <span className="header-content">
              {column.header}
              {column.sortable && sortField === column.field && (
                <span className={`sort-indicator ${sortDirection}`}>
                  ▲
                </span>
              )}
            </span>
          </div>
        ))}
      </div>

      {/* Body */}
      <div className="tree-grid-body">
        {flattenedData.map((node, index) => (
          <div
            key={node.id}
            className={`
              tree-grid-row
              ${striped && index % 2 === 1 ? 'striped' : ''}
              ${hoverable ? 'hoverable' : ''}
              ${selectable ? 'selectable' : ''}
              ${selectedIds.has(node.id) ? 'selected' : ''}
            `}
            style={{ height: rowHeight }}
            onClick={() => selectable && handleSelect(node)}
            role={selectable ? 'button' : undefined}
            tabIndex={selectable ? 0 : undefined}
          >
            {columns.map((column, columnIndex) => (
              <div
                key={String(column.field)}
                className="tree-grid-column"
                style={{ width: column.width }}
              >
                {renderCell(node, column, columnIndex === 0)}
              </div>
            ))}
          </div>
        ))}
      </div>

      <style jsx>{`
        .tree-grid {
          width: 100%;
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          overflow: hidden;
        }

        .tree-grid-header {
          display: flex;
          background-color: var(--gw-background-secondary);
          border-bottom: 1px solid var(--gw-border-color);
        }

        .tree-grid-header-cell {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 0 1rem;
          font-weight: 500;
          color: var(--gw-text-primary);
          position: relative;
        }

        .tree-grid-header-cell.sortable {
          cursor: pointer;
          user-select: none;
        }

        .tree-grid-header-cell.sortable:hover {
          background-color: var(--gw-background-tertiary);
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .sort-indicator {
          font-size: 0.75rem;
          transition: transform var(--gw-transition);
        }

        .sort-indicator.desc {
          transform: rotate(180deg);
        }

        .tree-grid-body {
          overflow-y: auto;
        }

        .tree-grid-row {
          display: flex;
          border-bottom: 1px solid var(--gw-border-color);
          transition: var(--gw-transition);
        }

        .tree-grid-row:last-child {
          border-bottom: none;
        }

        .tree-grid-row.striped {
          background-color: var(--gw-background-secondary);
        }

        .tree-grid-row.hoverable:hover {
          background-color: var(--gw-background-tertiary);
        }

        .tree-grid-row.selectable {
          cursor: pointer;
        }

        .tree-grid-row.selected {
          background-color: var(--gw-primary-50);
        }

        .tree-grid-column {
          flex: 1;
          min-width: 0;
        }

        .tree-grid-cell {
          height: 100%;
          padding: 0 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .tree-grid-cell.first-column {
          padding-left: 1rem;
        }

        .toggle-button {
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

        .toggle-button:hover {
          background-color: var(--gw-background-tertiary);
          color: var(--gw-text-primary);
        }

        .cell-content {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Material Design styles */
        [data-design-system="material"] .tree-grid {
          font-family: var(--gw-font-family);
          box-shadow: var(--gw-shadow-sm);
          border: none;
        }

        [data-design-system="material"] .tree-grid-header {
          font-weight: 500;
        }

        [data-design-system="material"] .tree-grid-row.selected {
          background-color: var(--gw-primary-100);
        }

        [data-design-system="material"] .toggle-button {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
}