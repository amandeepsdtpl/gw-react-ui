import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  id: string;
  label: React.ReactNode;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  showHome?: boolean;
  variant?: 'default' | 'contained' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  separator = <ChevronRight size={16} />,
  maxItems = 0,
  showHome = false,
  variant = 'default',
  size = 'medium',
  className = '',
}) => {
  const renderItems = () => {
    let displayItems = items;

    if (maxItems > 0 && items.length > maxItems) {
      const firstItem = items[0];
      const lastItems = items.slice(-Math.floor(maxItems - 1));
      displayItems = [firstItem, { id: 'ellipsis', label: '...' }, ...lastItems];
    }

    return displayItems.map((item, index) => {
      const isLast = index === displayItems.length - 1;
      const isEllipsis = item.id === 'ellipsis';

      return (
        <li
          key={item.id}
          className={`
            breadcrumb-item
            ${isLast ? 'last' : ''}
            ${isEllipsis ? 'ellipsis' : ''}
          `}
        >
          {!isEllipsis ? (
            <div className="breadcrumb-content">
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="breadcrumb-link"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.icon && (
                    <span className="breadcrumb-icon">{item.icon}</span>
                  )}
                  <span className="breadcrumb-label">{item.label}</span>
                </a>
              ) : (
                <span
                  className="breadcrumb-text"
                  aria-current={isLast ? 'page' : undefined}
                >
                  {item.icon && (
                    <span className="breadcrumb-icon">{item.icon}</span>
                  )}
                  <span className="breadcrumb-label">{item.label}</span>
                </span>
              )}
            </div>
          ) : (
            <span className="breadcrumb-ellipsis">{item.label}</span>
          )}
          {!isLast && (
            <span className="breadcrumb-separator" aria-hidden="true">
              {separator}
            </span>
          )}
        </li>
      );
    });
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={`breadcrumbs breadcrumbs-${variant} breadcrumbs-${size} ${className}`}
    >
      <ol className="breadcrumbs-list">
        {showHome && (
          <li className="breadcrumb-item">
            <a href="/" className="breadcrumb-link">
              <span className="breadcrumb-icon">
                <Home size={size === 'small' ? 14 : size === 'large' ? 18 : 16} />
              </span>
              <span className="sr-only">Home</span>
            </a>
            <span className="breadcrumb-separator" aria-hidden="true">
              {separator}
            </span>
          </li>
        )}
        {renderItems()}
      </ol>

      <style jsx>{`
        .breadcrumbs {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .breadcrumbs-contained {
          background-color: var(--gw-background-secondary);
          border-radius: var(--gw-border-radius);
          padding: 0.5rem 1rem;
        }

        .breadcrumbs-outlined {
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          padding: 0.5rem 1rem;
        }

        .breadcrumbs-list {
          display: flex;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0;
          min-width: min-content;
        }

        .breadcrumb-item {
          display: flex;
          align-items: center;
          color: var(--gw-text-secondary);
        }

        .breadcrumb-item.last {
          color: var(--gw-text-primary);
          font-weight: 500;
        }

        .breadcrumb-content {
          display: flex;
          align-items: center;
        }

        .breadcrumb-link,
        .breadcrumb-text {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: inherit;
          border-radius: var(--gw-border-radius);
          transition: var(--gw-transition);
        }

        .breadcrumb-link {
          padding: 0.25rem 0.5rem;
          margin: -0.25rem -0.5rem;
        }

        .breadcrumb-link:hover {
          background-color: var(--gw-background-secondary);
          color: var(--gw-text-primary);
        }

        .breadcrumb-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          color: inherit;
        }

        .breadcrumb-separator {
          display: flex;
          align-items: center;
          margin: 0 0.5rem;
          color: var(--gw-text-secondary);
        }

        .breadcrumb-ellipsis {
          margin: 0 0.25rem;
        }

        /* Size variants */
        .breadcrumbs-small {
          font-size: 0.875rem;
        }

        .breadcrumbs-small .breadcrumb-link {
          padding: 0.125rem 0.375rem;
          margin: -0.125rem -0.375rem;
        }

        .breadcrumbs-small .breadcrumb-separator {
          margin: 0 0.375rem;
        }

        .breadcrumbs-large {
          font-size: 1.125rem;
        }

        .breadcrumbs-large .breadcrumb-link {
          padding: 0.375rem 0.75rem;
          margin: -0.375rem -0.75rem;
        }

        .breadcrumbs-large .breadcrumb-separator {
          margin: 0 0.75rem;
        }

        /* Screen reader only text */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        /* Material Design styles */
        [data-design-system="material"] .breadcrumbs {
          font-family: var(--gw-font-family);
        }

        [data-design-system="material"] .breadcrumbs-contained {
          box-shadow: var(--gw-shadow-sm);
        }

        [data-design-system="material"] .breadcrumb-link {
          border-radius: 4px;
        }

        [data-design-system="material"] .breadcrumb-item.last {
          color: var(--gw-primary);
        }
      `}</style>
    </nav>
  );
};