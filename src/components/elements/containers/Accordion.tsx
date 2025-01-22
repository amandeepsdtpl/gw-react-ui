import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
  defaultExpanded?: boolean;
}

interface AccordionProps {
  items: AccordionItem[];
  expandMode?: 'single' | 'multiple';
  variant?: 'default' | 'bordered' | 'elevated';
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  expandMode = 'single',
  variant = 'default',
  className = '',
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
    const expanded = new Set<string>();
    items.forEach(item => {
      if (item.defaultExpanded) {
        expanded.add(item.id);
      }
    });
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

  return (
    <div className={`accordion accordion-${variant} ${className}`}>
      {items.map((item) => {
        const isExpanded = expandedItems.has(item.id);

        return (
          <div
            key={item.id}
            className={`
              accordion-item
              ${isExpanded ? 'expanded' : ''}
              ${item.disabled ? 'disabled' : ''}
            `}
          >
            <button
              className="accordion-header"
              onClick={() => !item.disabled && toggleItem(item.id)}
              aria-expanded={isExpanded}
              aria-disabled={item.disabled}
              disabled={item.disabled}
            >
              <span className="accordion-title">{item.title}</span>
              <ChevronDown
                size={20}
                className={`accordion-icon ${isExpanded ? 'expanded' : ''}`}
              />
            </button>
            {isExpanded && (
              <div className="accordion-content">
                {item.content}
              </div>
            )}
          </div>
        );
      })}

      <style jsx>{`
        .accordion {
          width: 100%;
          border-radius: var(--gw-border-radius);
        }

        .accordion-bordered {
          border: 1px solid var(--gw-border-color);
        }

        .accordion-elevated {
          box-shadow: var(--gw-shadow-md);
        }

        .accordion-item {
          border-bottom: 1px solid var(--gw-border-color);
        }

        .accordion-item:last-child {
          border-bottom: none;
        }

        .accordion-header {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: var(--gw-transition);
        }

        .accordion-header:hover:not(:disabled) {
          background-color: var(--gw-background-secondary);
        }

        .accordion-title {
          font-weight: 500;
          color: var(--gw-text-primary);
        }

        .accordion-icon {
          color: var(--gw-text-secondary);
          transition: transform var(--gw-transition);
        }

        .accordion-icon.expanded {
          transform: rotate(180deg);
        }

        .accordion-content {
          padding: 1rem;
          background-color: var(--gw-background-secondary);
          animation: accordion-slide 0.2s ease-out;
        }

        .accordion-item.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @keyframes accordion-slide {
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
        [data-design-system="material"] .accordion {
          font-family: var(--gw-font-family);
        }

        [data-design-system="material"] .accordion-elevated {
          box-shadow: var(--gw-shadow-lg);
        }

        [data-design-system="material"] .accordion-header {
          padding: 1rem 1.5rem;
        }

        [data-design-system="material"] .accordion-content {
          padding: 1rem 1.5rem;
        }
      `}</style>
    </div>
  );
};