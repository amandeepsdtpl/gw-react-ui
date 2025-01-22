import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface PanelMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  href?: string;
  onClick?: () => void;
  children?: PanelMenuItem[];
  disabled?: boolean;
  defaultExpanded?: boolean;
}

interface PanelMenuProps {
  items: PanelMenuItem[];
  variant?: 'default' | 'bordered' | 'elevated';
  expandMode?: 'single' | 'multiple';
  className?: string;
}

export const PanelMenu: React.FC<PanelMenuProps> = ({
  items,
  variant = 'default',
  expandMode = 'multiple',
  className = '',
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    const expanded = new Set<string>();
    const addExpandedItems = (items: PanelMenuItem[]) => {
      items.forEach(item => {
        if (item.defaultExpanded) {
          expanded.add(item.id);
        }
        if (item.children) {
          addExpandedItems(item.children);
        }
      });
    };
    addExpandedItems(items);
    return expanded;
  });

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (expandMode === 'single') {
        next.clear();
      }
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const renderItem = (item: PanelMenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      if (item.disabled) return;

      if (hasChildren) {
        toggleItem(item.id);
      }
      if (item.onClick) {
        item.onClick();
      }
    };

    return (
      <div key={item.id} className="panel-menu-item">
        <a
          href={item.href || '#'}
          className={`
            panel-menu-link
            ${hasChildren ? 'has-children' : ''}
            ${isExpanded ? 'expanded' : ''}
            ${item.disabled ? 'disabled' : ''}
          `}
          style={{ paddingLeft: `${(level + 1) * 1}rem` }}
          onClick={handleClick}
          role={hasChildren ? 'button' : undefined}
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-disabled={item.disabled}
        >
          {item.icon && (
            <span className="item-icon">{item.icon}</span>
          )}
          <span className="item-label">{item.label}</span>
          {item.badge && (
            <span className="item-badge">{item.badge}</span>
          )}
          {hasChildren && (
            <span className="item-arrow">
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </span>
          )}
        </a>
        {hasChildren && isExpanded && (
          <div className="panel-menu-children">
            {item.children.map(child => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`panel-menu panel-menu-${variant} ${className}`}>
      {items.map(item => renderItem(item))}

      <style jsx>{`
        .panel-menu {
          width: 100%;
          background-color: var(--gw-background);
        }

        .panel-menu-bordered {
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          overflow: hidden;
        }

        .panel-menu-elevated {
          border-radius: var(--gw-border-radius);
          box-shadow: var(--gw-shadow-md);
        }

        .panel-menu-item {
          border-bottom: 1px solid var(--gw-border-color);
        }

        .panel-menu-item:last-child {
          border-bottom: none;
        }

        .panel-menu-link {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          color: var(--gw-text-primary);
          text-decoration: none;
          transition: var(--gw-transition);
          user-select: none;
        }

        .panel-menu-link:hover:not(.disabled) {
          background-color: var(--gw-background-secondary);
        }

        .panel-menu-link.expanded {
          background-color: var(--gw-background-secondary);
          font-weight: 500;
        }

        .panel-menu-link.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.5rem;
          height: 1.5rem;
          color: var(--gw-text-secondary);
        }

        .item-label {
          flex: 1;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .item-badge {
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          background-color: var(--gw-primary-100);
          color: var(--gw-primary-700);
          border-radius: 9999px;
        }

        .item-arrow {
          display: flex;
          align-items: center;
          color: var(--gw-text-secondary);
          transition: transform var(--gw-transition);
        }

        .panel-menu-children {
          animation: slide-down 0.2s ease-out;
        }

        @keyframes slide-down {
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
        [data-design-system="material"] .panel-menu {
          font-family: var(--gw-font-family);
        }

        [data-design-system="material"] .panel-menu-elevated {
          box-shadow: var(--gw-shadow-lg);
        }

        [data-design-system="material"] .panel-menu-link {
          padding: 1rem;
        }

        [data-design-system="material"] .item-badge {
          font-weight: 500;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};