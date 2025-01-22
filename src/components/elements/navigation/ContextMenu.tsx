import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

interface ContextMenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onClick?: () => void;
  children?: ContextMenuItem[];
  disabled?: boolean;
  divider?: boolean;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  trigger: React.ReactNode;
  className?: string;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  items,
  trigger,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
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

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    const x = event.clientX;
    const y = event.clientY;

    // Ensure menu stays within viewport
    const menuWidth = 220; // Approximate menu width
    const menuHeight = items.length * 36; // Approximate menu height
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const adjustedX = Math.min(x, viewportWidth - menuWidth);
    const adjustedY = Math.min(y, viewportHeight - menuHeight);

    setPosition({ x: adjustedX, y: adjustedY });
    setIsOpen(true);
    setFocusedItem(items[0]?.id);
  };

  const handleItemClick = (item: ContextMenuItem) => {
    if (item.disabled) return;

    if (item.onClick) {
      item.onClick();
    }

    if (!item.children) {
      setIsOpen(false);
      setActiveSubmenu(null);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, items: ContextMenuItem[]) => {
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

  const renderMenuItem = (item: ContextMenuItem, isSubmenu = false) => {
    if (item.divider) {
      return <div key={item.id} className="context-menu-divider" />;
    }

    const isActive = activeSubmenu === item.id;
    const isFocused = focusedItem === item.id;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div
        key={item.id}
        className={`
          context-menu-item
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
        <button
          className="context-menu-button"
          onClick={() => handleItemClick(item)}
          disabled={item.disabled}
          role="menuitem"
          aria-haspopup={hasChildren}
          aria-expanded={hasChildren ? isActive : undefined}
        >
          {item.icon && (
            <span className="item-icon">{item.icon}</span>
          )}
          <span className="item-label">{item.label}</span>
          {item.shortcut && (
            <span className="item-shortcut">{item.shortcut}</span>
          )}
          {hasChildren && (
            <ChevronRight size={16} className="item-arrow" />
          )}
        </button>

        {hasChildren && isActive && (
          <div className="context-submenu">
            {item.children.map(child => renderMenuItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div
        ref={triggerRef}
        onContextMenu={handleContextMenu}
        className="context-menu-trigger"
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          className={`context-menu ${className}`}
          style={{
            top: position.y,
            left: position.x,
          }}
          role="menu"
          onKeyDown={(e) => handleKeyDown(e, items)}
          tabIndex={-1}
        >
          {items.map(item => renderMenuItem(item))}
        </div>
      )}

      <style jsx>{`
        .context-menu-trigger {
          display: inline-block;
        }

        .context-menu {
          position: fixed;
          z-index: var(--gw-z-dropdown);
          min-width: 220px;
          padding: 0.5rem;
          background-color: var(--gw-background);
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          box-shadow: var(--gw-shadow-lg);
          outline: none;
          animation: menu-fade-in 0.2s ease-out;
        }

        .context-menu-item {
          position: relative;
        }

        .context-menu-button {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: none;
          background: none;
          color: var(--gw-text-primary);
          font-size: 0.875rem;
          text-align: left;
          border-radius: var(--gw-border-radius);
          cursor: pointer;
          transition: var(--gw-transition);
        }

        .context-menu-button:hover:not(:disabled) {
          background-color: var(--gw-background-secondary);
        }

        .context-menu-item.focused .context-menu-button {
          background-color: var(--gw-background-secondary);
        }

        .context-menu-item.disabled .context-menu-button {
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
          margin-left: 1rem;
          font-size: 0.75rem;
          color: var(--gw-text-secondary);
        }

        .item-arrow {
          margin-left: auto;
          color: var(--gw-text-secondary);
        }

        .context-menu-divider {
          margin: 0.5rem -0.5rem;
          border-top: 1px solid var(--gw-border-color);
        }

        .context-submenu {
          position: absolute;
          top: 0;
          left: 100%;
          margin-left: 0.5rem;
          min-width: 220px;
          padding: 0.5rem;
          background-color: var(--gw-background);
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          box-shadow: var(--gw-shadow-lg);
          animation: submenu-fade-in 0.2s ease-out;
        }

        @keyframes menu-fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes submenu-fade-in {
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
        [data-design-system="material"] .context-menu {
          font-family: var(--gw-font-family);
          border: none;
          border-radius: 4px;
        }

        [data-design-system="material"] .context-menu-button {
          border-radius: 4px;
        }

        [data-design-system="material"] .context-submenu {
          border: none;
          border-radius: 4px;
        }
      `}</style>
    </>
  );
};