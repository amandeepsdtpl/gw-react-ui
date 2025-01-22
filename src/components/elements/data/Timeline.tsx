import React from 'react';
import { Circle, CheckCircle } from 'lucide-react';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  date?: string | Date;
  icon?: React.ReactNode;
  status?: 'pending' | 'completed' | 'error' | 'warning';
  color?: string;
  content?: React.ReactNode;
}

interface TimelineProps {
  items: TimelineItem[];
  variant?: 'default' | 'alternate' | 'compact';
  orientation?: 'vertical' | 'horizontal';
  lineStyle?: 'solid' | 'dashed' | 'dotted';
  showConnectors?: boolean;
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({
  items,
  variant = 'default',
  orientation = 'vertical',
  lineStyle = 'solid',
  showConnectors = true,
  className = '',
}) => {
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusIcon = (status?: TimelineItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} />;
      case 'error':
      case 'warning':
      case 'pending':
      default:
        return <Circle size={16} />;
    }
  };

  const getStatusColor = (status?: TimelineItem['status']) => {
    switch (status) {
      case 'completed':
        return 'var(--gw-success-500)';
      case 'error':
        return 'var(--gw-error-500)';
      case 'warning':
        return 'var(--gw-warning-500)';
      default:
        return 'var(--gw-primary-500)';
    }
  };

  const renderTimelineItem = (item: TimelineItem, index: number) => {
    const isLast = index === items.length - 1;
    const isAlternate = variant === 'alternate';
    const isEven = index % 2 === 0;
    const statusColor = item.color || getStatusColor(item.status);

    return (
      <div
        key={item.id}
        className={`
          timeline-item
          ${isAlternate ? (isEven ? 'even' : 'odd') : ''}
          ${isLast ? 'last' : ''}
          ${variant === 'compact' ? 'compact' : ''}
        `}
      >
        <div className="timeline-content">
          {variant !== 'compact' && (
            <div className="timeline-date">
              {formatDate(item.date)}
            </div>
          )}
          <div className="timeline-marker">
            <div
              className="timeline-icon"
              style={{ backgroundColor: statusColor }}
            >
              {item.icon || getStatusIcon(item.status)}
            </div>
            {showConnectors && !isLast && (
              <div
                className="timeline-line"
                style={{ borderStyle: lineStyle }}
              />
            )}
          </div>
          <div className="timeline-body">
            <div className="timeline-header">
              <h4 className="timeline-title">{item.title}</h4>
              {variant === 'compact' && item.date && (
                <span className="timeline-date-compact">
                  {formatDate(item.date)}
                </span>
              )}
            </div>
            {item.description && (
              <p className="timeline-description">{item.description}</p>
            )}
            {item.content && (
              <div className="timeline-custom-content">{item.content}</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`
        timeline
        timeline-${orientation}
        timeline-${variant}
        ${className}
      `}
    >
      {items.map((item, index) => renderTimelineItem(item, index))}

      <style jsx>{`
        .timeline {
          position: relative;
          width: 100%;
        }

        .timeline-vertical {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .timeline-horizontal {
          display: flex;
          gap: 2rem;
          overflow-x: auto;
          padding-bottom: 1rem;
        }

        .timeline-item {
          position: relative;
          flex: none;
        }

        .timeline-horizontal .timeline-item {
          width: 300px;
        }

        .timeline-content {
          display: flex;
          gap: 1rem;
        }

        .timeline-alternate .timeline-item.odd .timeline-content {
          flex-direction: row-reverse;
        }

        .timeline-date {
          width: 120px;
          font-size: 0.875rem;
          color: var(--gw-text-secondary);
          text-align: right;
          padding-top: 0.25rem;
        }

        .timeline-marker {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .timeline-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border-radius: 9999px;
          background-color: var(--gw-primary-500);
          color: white;
          z-index: 1;
        }

        .timeline-line {
          position: absolute;
          top: 2rem;
          bottom: -2rem;
          width: 2px;
          background-color: transparent;
          border-width: 0 0 0 2px;
          border-color: var(--gw-border-color);
        }

        .timeline-horizontal .timeline-line {
          top: 50%;
          left: 2rem;
          right: -2rem;
          bottom: auto;
          width: auto;
          height: 2px;
          border-width: 2px 0 0 0;
        }

        .timeline-body {
          flex: 1;
          min-width: 0;
        }

        .timeline-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 0.5rem;
        }

        .timeline-title {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--gw-text-primary);
        }

        .timeline-date-compact {
          font-size: 0.875rem;
          color: var(--gw-text-secondary);
          white-space: nowrap;
        }

        .timeline-description {
          margin: 0;
          font-size: 0.875rem;
          color: var(--gw-text-secondary);
          line-height: 1.5;
        }

        .timeline-custom-content {
          margin-top: 1rem;
        }

        .timeline-item.compact .timeline-content {
          gap: 0.75rem;
        }

        .timeline-item.compact .timeline-icon {
          width: 1.5rem;
          height: 1.5rem;
        }

        .timeline-item.compact .timeline-line {
          top: 1.5rem;
        }

        .timeline-item.last .timeline-line {
          display: none;
        }

        /* Material Design styles */
        [data-design-system="material"] .timeline-icon {
          box-shadow: var(--gw-shadow-sm);
        }

        [data-design-system="material"] .timeline-body {
          background-color: var(--gw-background);
          border-radius: 4px;
          padding: 1rem;
          box-shadow: var(--gw-shadow-sm);
        }

        [data-design-system="material"] .timeline-line {
          border-color: var(--gw-neutral-200);
        }
      `}</style>
    </div>
  );
};