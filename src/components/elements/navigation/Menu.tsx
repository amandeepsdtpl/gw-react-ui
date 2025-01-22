import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  children?: MenuItem[];
  badge?: string | number;
  disabled?: boolean;
  shortcut?: string;
}

interface MenuProps {
  items: MenuItem[];
  trigger?: React.ReactNode;
  variant?: 'default' | 'elevated';
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  className?: string;
}

export const Menu: React.FC<MenuProps> = ({
  items,
  trigger,
  variant = 'default',
  placement = 'bottom-start',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [focusedItem, setFocusedItem] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setActiveSubmenu(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setActiveSubmenu(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleItemClick = (item: MenuItem) => {
    if (item.disabled) return;

    if (item.onClick) {
      item.onClick();
    }

    if (!item.children) {
      setIsOpen(false);
      setActiveSubmenu(null);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, items: MenuItem[]) => {
    const currentIndex = focusedItem
      ? items.findIndex(item => item.id === focusedItem)
      : -1;

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        setFocusedItem(items[nextIndex].id);
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        setFocusedItem(items[prevIndex].id);
        break;
      }
      case 'ArrowRight': {
        event.preventDefault();
        const currentItem = items[currentIndex];
        if (currentItem?.children) {
          setActiveSubmenu(currentItem.id);
          if (currentItem.children.length > 0) {
            setFocusedItem(currentItem.children[0].id);
          }
        }
        break;
      }
      case 'ArrowLeft': {
        event.preventDefault();
        setActiveSubmenu(null);
        break;
      }
      case 'Enter':
      case ' ': {
        event.preventDefault();
        const currentItem = items[currentIndex];
        if (currentItem) {
          handleItemClick(currentItem);
        }
        break;
      }
    }
  };

  const renderMenuItem = (item: MenuItem, isSubmenu = false) => {
    const isActive = activeSubmenu === item.id;
    const isFocused = focusedItem === item.id;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div
        key={item.id}
        className={`
          menu-item
          ${hasChildren ? 'has-children' : ''}
          ${isActive ? 'active' : ''}
          ${isFocused ? 'focused' : ''}
          ${item.disabled ? 'disabled' : ''}
        `}
        onMouseEnter={() => {
          if (!item.disabled) {
            setFocusedItem(item.id);
            if (hasChildren) {
              setActiveSubmenu(item.id);
            }
          }
        }}
        onMouseLeave={() => {
          if (!isSubmenu) {
            setFocusedItem(null);
          }
        }}
      >
        <a
          href={item.href}
          className="menu-item-content"
          onClick={(e) => {
            e.preventDefault();
            handleItemClick(item);
          }}
          role="menuitem"
          aria-haspopup={hasChildren}
          aria-expanded={hasChildren ? isActive : undefined}
          tabIndex={isFocused ? 0 : -1}
        >
          {item.icon && (
            <span className="item-icon">{item.icon}</span>
          )}
          <span className="item-label">{item.label}</span>
          {item.shortcut && (
            <span className="item-shortcut">{item.shortcut}</span>
          )}
          {item.badge && (
            <span className="item-badge">{item.badge}</span>
          )}
          {hasChildren && (
            <ChevronRight size={16} className="item-arrow" />
          )}
        </a>

        {hasChildren && isActive && (
          <div className="submenu">
            {item.children.map(child => renderMenuItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`menu-container ${className}`}>
      <div
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="menu-trigger"
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {trigger || <button className="default-trigger">Menu</button>}
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className={`menu menu-${variant} menu-${placement}`}
          role="menu"
          onKeyDown={(e) => handleKeyDown(e, items)}
        >
          {items.map(item => renderMenuItem(item))}
        </div>
      )}

      <style jsx>{`
        .menu-container {
          position: relative;
          display: inline-block;
        }

        .menu-trigger {
          cursor: pointer;
        }

        .default-trigger {
          padding: 0.5rem 1rem;
          background: none;
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          color: var(--gw-text-primary);
          cursor: pointer;
          transition: var(--gw-transition);
        }

        .default-trigger:hover {
          background-color: var(--gw-background-secondary);
        }

        .menu {
          position: absolute;
          min-width: 12rem;
          padding: 0.5rem;
          background-color: var(--gw-background);
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          z-index: var(--gw-z-dropdown);
          animation: menu-slide 0.2s ease-out;
        }

        .menu-elevated {
          border: none;
          box-shadow: var(--gw-shadow-lg);
        }

        .menu-bottom-start { top: 100%; left: 0; margin-top: 0.5rem; }
        .menu-bottom-end { top: 100%; right: 0; margin-top: 0.5rem; }
        .menu-top-start { bottom: 100%; left: 0; margin-bottom: 0.5rem; }
        .menu-top-end { bottom: 100%; right: 0; margin-bottom: 0.5rem; }

        .menu-item {
          position: relative;
        }

        .menu-item-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 1rem;
          color: var(--gw-text-primary);
          text-decoration: none;
          border-radius: var(--gw-border-radius);
          cursor: pointer;
          transition: var(--gw-transition);
          user-select: none;
        }

        .menu-item:hover > .menu-item-content:not(.disabled) {
          background-color: var(--gw-background-secondary);
        }

        .menu-item.focused > .menu-item-content {
          background-color: var(--gw-background-secondary);
          outline: none;
        }

        .menu-item.disabled > .menu-item-content {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 1.25rem;
          height: 1.25rem;
          color: var(--gw-text-secondary);
        }

        .item-label {
          flex: 1;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-shortcut {
          font-size: 0.75rem;
          color: var(--gw-text-secondary);
          margin-left: auto;
          padding-left: 1rem;
        }

        .item-badge {
          padding: 0.125rem 0.375rem;
          font-size: 0.75rem;
          font-weight: 500;
          background-color: var(--gw-primary-100);
          color: var(--gw-primary-700);
          border-radius: 9999px;
          margin-left: auto;
        }

        .item-arrow {
          margin-left: auto;
          color: var(--gw-text-secondary);
        }

        .submenu {
          position: absolute;
          top: 0;
          left: 100%;
          margin-left: 0.5rem;
          min-width: 12rem;
          padding: 0.5rem;
          background-color: var(--gw-background);
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          box-shadow: var(--gw-shadow-lg);
          animation: submenu-slide 0.2s ease-out;
        }

        @keyframes menu-slide {
          from {
            opacity: 0;
            transform: translateY(-0.5rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes submenu-slide {
          from {
            opacity: 0;
            transform: translateX(-0.5rem);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Material Design styles */
        [data-design-system="material"] .menu {
          font-family: var(--gw-font-family);
          border-radius: 4px;
        }

        [data-design-system="material"] .menu-item-content {
          border-radius: 4px;
        }

        [data-design-system="material"] .item-badge {
          font-weight: 500;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};