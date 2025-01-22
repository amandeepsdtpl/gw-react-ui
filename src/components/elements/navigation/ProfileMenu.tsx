import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Settings, 
  LogOut, 
  Bell, 
  Mail, 
  ChevronDown,
  Shield,
  CreditCard,
  HelpCircle
} from 'lucide-react';

interface ProfileMenuItem {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  badge?: string | number;
  divider?: boolean;
  disabled?: boolean;
}

interface ProfileMenuProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
    role?: string;
  };
  items?: ProfileMenuItem[];
  onSignOut?: () => void;
  className?: string;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  user,
  items = [],
  onSignOut,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const defaultItems: ProfileMenuItem[] = [
    {
      icon: <User size={18} />,
      label: 'Profile',
      href: '/profile'
    },
    {
      icon: <Settings size={18} />,
      label: 'Settings',
      href: '/settings'
    },
    {
      icon: <Bell size={18} />,
      label: 'Notifications',
      href: '/notifications',
      badge: '3'
    },
    {
      icon: <Mail size={18} />,
      label: 'Messages',
      href: '/messages',
      badge: '5'
    },
    {
      divider: true
    },
    {
      icon: <Shield size={18} />,
      label: 'Privacy',
      href: '/privacy'
    },
    {
      icon: <CreditCard size={18} />,
      label: 'Billing',
      href: '/billing'
    },
    {
      icon: <HelpCircle size={18} />,
      label: 'Help Center',
      href: '/help'
    },
    {
      divider: true
    },
    {
      icon: <LogOut size={18} />,
      label: 'Sign Out',
      onClick: onSignOut
    }
  ];

  const menuItems = items.length > 0 ? items : defaultItems;

  const handleItemClick = (item: ProfileMenuItem) => {
    if (item.disabled) return;
    
    if (item.onClick) {
      item.onClick();
    }
    setIsOpen(false);
  };

  return (
    <div ref={menuRef} className={`profile-menu ${className}`}>
      <button
        className="profile-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="profile-avatar">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="avatar-image"
            />
          ) : (
            <User size={24} />
          )}
        </div>
        <div className="profile-info">
          <span className="profile-name">{user.name}</span>
          {user.role && (
            <span className="profile-role">{user.role}</span>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`profile-arrow ${isOpen ? 'open' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          className="profile-dropdown"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="profile-menu"
        >
          <div className="dropdown-header">
            <div className="header-avatar">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="avatar-image"
                />
              ) : (
                <User size={40} />
              )}
            </div>
            <div className="header-info">
              <span className="header-name">{user.name}</span>
              <span className="header-email">{user.email}</span>
            </div>
          </div>

          <div className="dropdown-content">
            {menuItems.map((item, index) => (
              item.divider ? (
                <div key={`divider-${index}`} className="dropdown-divider" />
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className={`dropdown-item ${item.disabled ? 'disabled' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick(item);
                  }}
                  role="menuitem"
                  tabIndex={0}
                >
                  {item.icon && (
                    <span className="item-icon">{item.icon}</span>
                  )}
                  <span className="item-label">{item.label}</span>
                  {item.badge && (
                    <span className="item-badge">{item.badge}</span>
                  )}
                </a>
              )
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .profile-menu {
          position: relative;
          display: inline-block;
        }

        .profile-trigger {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          border: none;
          background: none;
          color: var(--gw-text-primary);
          border-radius: var(--gw-border-radius);
          cursor: pointer;
          transition: var(--gw-transition);
        }

        .profile-trigger:hover {
          background-color: var(--gw-background-secondary);
        }

        .profile-avatar {
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--gw-background-tertiary);
          color: var(--gw-text-secondary);
          border-radius: 9999px;
          overflow: hidden;
        }

        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-info {
          display: none;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.125rem;
          text-align: left;
        }

        @media (min-width: 640px) {
          .profile-info {
            display: flex;
          }
        }

        .profile-name {
          font-weight: 500;
          line-height: 1.25;
        }

        .profile-role {
          font-size: 0.75rem;
          color: var(--gw-text-secondary);
        }

        .profile-arrow {
          color: var(--gw-text-secondary);
          transition: transform var(--gw-transition);
        }

        .profile-arrow.open {
          transform: rotate(180deg);
        }

        .profile-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          width: 280px;
          background-color: var(--gw-background);
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          box-shadow: var(--gw-shadow-lg);
          z-index: var(--gw-z-dropdown);
          animation: dropdown-slide 0.2s ease-out;
        }

        .dropdown-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-bottom: 1px solid var(--gw-border-color);
        }

        .header-avatar {
          width: 3rem;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--gw-background-tertiary);
          color: var(--gw-text-secondary);
          border-radius: 9999px;
          overflow: hidden;
        }

        .header-info {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
          min-width: 0;
        }

        .header-name {
          font-weight: 500;
          line-height: 1.25;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .header-email {
          font-size: 0.875rem;
          color: var(--gw-text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dropdown-content {
          padding: 0.5rem;
          max-height: calc(100vh - 20rem);
          overflow-y: auto;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          color: var(--gw-text-primary);
          text-decoration: none;
          border-radius: var(--gw-border-radius);
          cursor: pointer;
          transition: var(--gw-transition);
        }

        .dropdown-item:hover:not(.disabled) {
          background-color: var(--gw-background-secondary);
        }

        .dropdown-item.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .item-icon {
          flex-shrink: 0;
          color: var(--gw-text-secondary);
        }

        .item-label {
          flex: 1;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-badge {
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          background-color: var(--gw-primary-100);
          color: var(--gw-primary-700);
          border-radius: 9999px;
        }

        .dropdown-divider {
          margin: 0.5rem -0.5rem;
          border-top: 1px solid var(--gw-border-color);
        }

        @keyframes dropdown-slide {
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
        [data-design-system="material"] .profile-dropdown {
          border: none;
          border-radius: 4px;
        }

        [data-design-system="material"] .dropdown-item {
          border-radius: 4px;
        }

        [data-design-system="material"] .item-badge {
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};