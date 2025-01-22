import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface SidebarItem {
  icon?: React.ReactNode;
  label: string;
  href?: string;
  badge?: string | number;
  children?: SidebarItem[];
  disabled?: boolean;
}

interface SidebarProps {
  items: SidebarItem[];
  isOpen?: boolean;
  onClose?: () => void;
  width?: number;
  collapsedWidth?: number;
  position?: 'left' | 'right';
  variant?: 'fixed' | 'static';
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  isOpen = true,
  onClose,
  width = 280,
  collapsedWidth = 80,
  position = 'left',
  variant = 'fixed',
  collapsible = true,
  defaultCollapsed = false,
  className = '',
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [activeItem, setActiveItem] = useState<string | null>(null);

  useEffect(() => {
    // Handle responsive behavior
    const handleResize = () => {
      if (window.innerWidth < 1024 && !collapsed) {
        setCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [collapsed]);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const toggleItem = (label: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const handleItemClick = (item: SidebarItem) => {
    if (item.disabled) return;
    
    if (item.children) {
      toggleItem(item.label);
    } else {
      setActiveItem(item.label);
      if (window.innerWidth < 1024) {
        onClose?.();
      }
    }
  };

  const renderItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.label);
    const isActive = activeItem === item.label;

    return (
      <div key={item.label} className="sidebar-item-container">
        <a
          href={item.href}
          className={`
            sidebar-item
            ${hasChildren ? 'has-children' : ''}
            ${isActive ? 'active' : ''}
            ${item.disabled ? 'disabled' : ''}
          `}
          style={{ paddingLeft: `${level * 1.5 + 1}rem` }}
          onClick={(e) => {
            e.preventDefault();
            handleItemClick(item);
          }}
          role={hasChildren ? 'button' : 'link'}
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-disabled={item.disabled}
          tabIndex={item.disabled ? -1 : 0}
        >
          {item.icon && (
            <span className="sidebar-item-icon">
              {item.icon}
            </span>
          )}
          {(!collapsed || level > 0) && (
            <span className="sidebar-item-label">
              {item.label}
            </span>
          )}
          {item.badge && !collapsed && (
            <span className="sidebar-item-badge">
              {item.badge}
            </span>
          )}
          {hasChildren && !collapsed && (
            <ChevronRight
              size={16}
              className={`sidebar-item-arrow ${isExpanded ? 'expanded' : ''}`}
            />
          )}
        </a>
        {hasChildren && isExpanded && !collapsed && (
          <div className="sidebar-children">
            {item.children.map(child => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {variant === 'fixed' && isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          role="presentation"
        />
      )}
      <aside
        className={`
          sidebar
          ${variant === 'fixed' ? 'fixed' : 'static'}
          ${position === 'right' ? 'right' : 'left'}
          ${collapsed ? 'collapsed' : ''}
          ${isOpen ? 'open' : ''}
          ${className}
        `}
        style={{
          width: collapsed ? collapsedWidth : width,
          [position]: variant === 'fixed' ? 0 : undefined,
        }}
      >
        <div className="sidebar-content">
          {items.map(item => renderItem(item))}
        </div>
        {collapsible && (
          <button
            className="sidebar-collapse-button"
            onClick={toggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </button>
        )}

        <style jsx>{`
          .sidebar {
            height: 100vh;
            background-color: var(--gw-background);
            border-right: 1px solid var(--gw-border-color);
            display: flex;
            flex-direction: column;
            transition: width var(--gw-transition-duration) var(--gw-transition-timing);
            z-index: var(--gw-z-30);
          }

          .sidebar.fixed {
            position: fixed;
            top: 0;
            transform: translateX(-100%);
          }

          .sidebar.fixed.right {
            transform: translateX(100%);
            border-right: none;
            border-left: 1px solid var(--gw-border-color);
          }

          .sidebar.open {
            transform: translateX(0);
          }

          .sidebar-overlay {
            position: fixed;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: var(--gw-z-20);
            animation: fade-in 0.2s ease-out;
          }

          .sidebar-content {
            flex: 1;
            overflow-y: auto;
            padding: 1rem 0;
          }

          .sidebar-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 0.75rem 1rem;
            color: var(--gw-text-secondary);
            text-decoration: none;
            transition: var(--gw-transition);
            cursor: pointer;
            user-select: none;
          }

          .sidebar-item:hover:not(.disabled) {
            background-color: var(--gw-background-secondary);
            color: var(--gw-text-primary);
          }

          .sidebar-item.active {
            background-color: var(--gw-primary-50);
            color: var(--gw-primary-700);
          }

          .sidebar-item.disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .sidebar-item-icon {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 1.5rem;
            height: 1.5rem;
          }

          .sidebar-item-label {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .sidebar-item-badge {
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
            font-weight: 500;
            background-color: var(--gw-primary-100);
            color: var(--gw-primary-700);
            border-radius: 9999px;
          }

          .sidebar-item-arrow {
            flex-shrink: 0;
            transition: transform var(--gw-transition);
          }

          .sidebar-item-arrow.expanded {
            transform: rotate(90deg);
          }

          .sidebar-children {
            animation: slide-down 0.2s ease-out;
          }

          .sidebar-collapse-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 2rem;
            height: 2rem;
            margin: 1rem auto;
            border: none;
            background-color: var(--gw-background-secondary);
            color: var(--gw-text-secondary);
            border-radius: 9999px;
            cursor: pointer;
            transition: var(--gw-transition);
          }

          .sidebar-collapse-button:hover {
            background-color: var(--gw-background-tertiary);
            color: var(--gw-text-primary);
          }

          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
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
          [data-design-system="material"] .sidebar {
            font-family: var(--gw-font-family);
            box-shadow: var(--gw-shadow-md);
            border: none;
          }

          [data-design-system="material"] .sidebar-item {
            border-radius: 0 9999px 9999px 0;
            margin: 0 1rem 0 0;
          }

          [data-design-system="material"] .sidebar.right .sidebar-item {
            border-radius: 9999px 0 0 9999px;
            margin: 0 0 0 1rem;
          }

          [data-design-system="material"] .sidebar-item.active {
            background-color: var(--gw-primary-100);
            color: var(--gw-primary);
          }

          [data-design-system="material"] .sidebar-collapse-button {
            box-shadow: var(--gw-shadow-sm);
          }
        `}</style>
      </aside>
    </>
  );
};