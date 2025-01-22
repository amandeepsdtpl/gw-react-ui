import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface PanelProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  className?: string;
}

export const Panel: React.FC<PanelProps> = ({
  children,
  header,
  footer,
  collapsible = false,
  defaultCollapsed = false,
  className = '',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div className={`panel ${className}`}>
      {header && (
        <div
          className={`panel-header ${collapsible ? 'collapsible' : ''}`}
          onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
        >
          {header}
          {collapsible && (
            <button
              className={`panel-toggle ${isCollapsed ? 'collapsed' : ''}`}
              aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}
            >
              <ChevronDown size={20} />
            </button>
          )}
        </div>
      )}
      <div className={`panel-content ${isCollapsed ? 'collapsed' : ''}`}>
        {children}
      </div>
      {footer && <div className="panel-footer">{footer}</div>}

      <style jsx>{`
        .panel {
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          background-color: var(--gw-background);
        }

        .panel-header {
          padding: 1rem;
          border-bottom: 1px solid var(--gw-border-color);
          background-color: var(--gw-background-secondary);
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .panel-header.collapsible {
          cursor: pointer;
        }

        .panel-header.collapsible:hover {
          background-color: var(--gw-background-tertiary);
        }

        .panel-toggle {
          background: none;
          border: none;
          padding: 0.25rem;
          cursor: pointer;
          color: var(--gw-text-secondary);
          transition: transform var(--gw-transition);
        }

        .panel-toggle.collapsed {
          transform: rotate(-180deg);
        }

        .panel-content {
          padding: 1rem;
          transition: max-height 0.2s ease-out;
        }

        .panel-content.collapsed {
          max-height: 0;
          padding: 0;
          overflow: hidden;
        }

        .panel-footer {
          padding: 1rem;
          border-top: 1px solid var(--gw-border-color);
          background-color: var(--gw-background-secondary);
        }

        /* Material Design styles */
        [data-design-system="material"] .panel {
          font-family: var(--gw-font-family);
          box-shadow: var(--gw-shadow-md);
          border: none;
        }

        [data-design-system="material"] .panel-header {
          padding: 1rem 1.5rem;
        }

        [data-design-system="material"] .panel-content {
          padding: 1.5rem;
        }

        [data-design-system="material"] .panel-footer {
          padding: 1rem 1.5rem;
        }
      `}</style>
    </div>
  );
};