import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PagerProps {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  variant?: 'default' | 'simple' | 'compact';
  showFirstLast?: boolean;
  showTotal?: boolean;
  maxVisiblePages?: number;
  className?: string;
  disabled?: boolean;
}

export const Pager: React.FC<PagerProps> = ({
  totalItems,
  pageSize,
  currentPage,
  onPageChange,
  variant = 'default',
  showFirstLast = true,
  showTotal = true,
  maxVisiblePages = 5,
  className = '',
  disabled = false,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(startItem + pageSize - 1, totalItems);

  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('ellipsis');
      }
    }

    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('ellipsis');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && !disabled) {
      onPageChange(page);
    }
  };

  return (
    <div className={`pager pager-${variant} ${className}`}>
      {showTotal && variant !== 'compact' && (
        <div className="pager-info">
          Showing {startItem}-{endItem} of {totalItems} items
        </div>
      )}

      <div className="pager-controls">
        {showFirstLast && variant !== 'compact' && (
          <button
            className="pager-button"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1 || disabled}
            aria-label="First page"
          >
            <ChevronsLeft size={16} />
          </button>
        )}

        <button
          className="pager-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || disabled}
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {variant === 'default' && (
          <div className="pager-pages">
            {getVisiblePages().map((page, index) => (
              <React.Fragment key={index}>
                {page === 'ellipsis' ? (
                  <span className="pager-ellipsis">...</span>
                ) : (
                  <button
                    className={`pager-page ${page === currentPage ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                    disabled={disabled}
                    aria-label={`Page ${page}`}
                    aria-current={page === currentPage ? 'page' : undefined}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {variant === 'simple' && (
          <div className="pager-simple">
            Page {currentPage} of {totalPages}
          </div>
        )}

        <button
          className="pager-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages || disabled}
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>

        {showFirstLast && variant !== 'compact' && (
          <button
            className="pager-button"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages || disabled}
            aria-label="Last page"
          >
            <ChevronsRight size={16} />
          </button>
        )}
      </div>

      <style jsx>{`
        .pager {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.875rem;
        }

        .pager-compact {
          gap: 0.5rem;
        }

        .pager-info {
          color: var(--gw-text-secondary);
        }

        .pager-controls {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .pager-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          padding: 0;
          border: 1px solid var(--gw-border-color);
          background: none;
          color: var(--gw-text-primary);
          border-radius: var(--gw-border-radius);
          cursor: pointer;
          transition: var(--gw-transition);
        }

        .pager-compact .pager-button {
          border: none;
        }

        .pager-button:hover:not(:disabled) {
          background-color: var(--gw-background-secondary);
          border-color: var(--gw-border-color-hover);
        }

        .pager-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pager-pages {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .pager-page {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 2rem;
          height: 2rem;
          padding: 0 0.5rem;
          border: 1px solid var(--gw-border-color);
          background: none;
          color: var(--gw-text-primary);
          border-radius: var(--gw-border-radius);
          cursor: pointer;
          transition: var(--gw-transition);
        }

        .pager-page:hover:not(:disabled):not(.active) {
          background-color: var(--gw-background-secondary);
          border-color: var(--gw-border-color-hover);
        }

        .pager-page.active {
          background-color: var(--gw-primary);
          border-color: var(--gw-primary);
          color: white;
          font-weight: 500;
        }

        .pager-page:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pager-ellipsis {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          color: var(--gw-text-secondary);
        }

        .pager-simple {
          padding: 0 0.5rem;
          color: var(--gw-text-secondary);
        }

        /* Material Design styles */
        [data-design-system="material"] .pager {
          font-family: var(--gw-font-family);
        }

        [data-design-system="material"] .pager-button,
        [data-design-system="material"] .pager-page {
          border-radius: 50%;
          font-weight: 500;
        }

        [data-design-system="material"] .pager-page.active {
          box-shadow: var(--gw-shadow-sm);
        }

        [data-design-system="material"] .pager-button:hover:not(:disabled),
        [data-design-system="material"] .pager-page:hover:not(:disabled):not(.active) {
          background-color: var(--gw-background-tertiary);
        }
      `}</style>
    </div>
  );
};