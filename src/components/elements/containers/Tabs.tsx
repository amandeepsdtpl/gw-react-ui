import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: 'default' | 'bordered' | 'pills';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  variant = 'default',
  orientation = 'horizontal',
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  return (
    <div className={`tabs tabs-${variant} tabs-${orientation} ${className}`}>
      <div
        className="tabs-list"
        role="tablist"
        aria-orientation={orientation}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${tab.id === activeTab ? 'active' : ''} ${
              tab.disabled ? 'disabled' : ''
            }`}
            role="tab"
            aria-selected={tab.id === activeTab}
            aria-controls={`panel-${tab.id}`}
            aria-disabled={tab.disabled}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            tabIndex={tab.id === activeTab ? 0 : -1}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            id={`panel-${tab.id}`}
            className={`tab-panel ${tab.id === activeTab ? 'active' : ''}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            hidden={tab.id !== activeTab}
          >
            {tab.content}
          </div>
        ))}
      </div>

      <style jsx>{`
        .tabs {
          width: 100%;
        }

        .tabs-horizontal {
          display: flex;
          flex-direction: column;
        }

        .tabs-vertical {
          display: flex;
          gap: 1rem;
        }

        .tabs-list {
          display: flex;
          border-bottom: 1px solid var(--gw-border-color);
        }

        .tabs-vertical .tabs-list {
          flex-direction: column;
          border-bottom: none;
          border-right: 1px solid var(--gw-border-color);
        }

        .tab-button {
          padding: 0.75rem 1rem;
          border: none;
          background: none;
          color: var(--gw-text-secondary);
          font-weight: 500;
          cursor: pointer;
          transition: var(--gw-transition);
          white-space: nowrap;
        }

        .tab-button:hover:not(.disabled) {
          color: var(--gw-text-primary);
        }

        .tab-button.active {
          color: var(--gw-primary);
          box-shadow: inset 0 -2px 0 var(--gw-primary);
        }

        .tabs-vertical .tab-button.active {
          box-shadow: inset 2px 0 0 var(--gw-primary);
        }

        .tab-button.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .tabs-bordered .tab-button {
          border: 1px solid transparent;
          border-bottom: none;
          border-radius: var(--gw-border-radius) var(--gw-border-radius) 0 0;
          margin-bottom: -1px;
        }

        .tabs-bordered .tab-button.active {
          border-color: var(--gw-border-color);
          border-bottom: 1px solid var(--gw-background);
          box-shadow: none;
        }

        .tabs-vertical.tabs-bordered .tab-button {
          border-bottom: 1px solid transparent;
          border-right: none;
          border-radius: var(--gw-border-radius) 0 0 var(--gw-border-radius);
          margin-right: -1px;
        }

        .tabs-vertical.tabs-bordered .tab-button.active {
          border-color: var(--gw-border-color);
          border-right: 1px solid var(--gw-background);
        }

        .tabs-pills .tab-button {
          border-radius: 9999px;
          margin: 0.25rem;
        }

        .tabs-pills .tab-button.active {
          background-color: var(--gw-primary);
          color: white;
          box-shadow: none;
        }

        .tabs-content {
          flex: 1;
          min-width: 0;
          padding: 1rem 0;
        }

        .tabs-vertical .tabs-content {
          padding: 0 0 0 1rem;
        }

        .tab-panel {
          display: none;
        }

        .tab-panel.active {
          display: block;
          animation: tab-fade-in 0.2s ease-out;
        }

        @keyframes tab-fade-in {
          from {
            opacity: 0;
            transform: translateY(0.5rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Material Design styles */
        [data-design-system="material"] .tabs {
          font-family: var(--gw-font-family);
        }

        [data-design-system="material"] .tab-button {
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        [data-design-system="material"] .tabs-pills .tab-button {
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};