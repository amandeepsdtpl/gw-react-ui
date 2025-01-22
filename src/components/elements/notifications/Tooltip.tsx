import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  delay?: number;
  className?: string;
  maxWidth?: number;
  arrow?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 200,
  className = '',
  maxWidth = 200,
  arrow = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    const updatePosition = () => {
      if (!isVisible || !tooltipRef.current || !targetRef.current) return;

      const tooltipEl = tooltipRef.current;
      const targetEl = targetRef.current;
      const targetRect = targetEl.getBoundingClientRect();
      const tooltipRect = tooltipEl.getBoundingClientRect();

      let top = 0;
      let left = 0;

      switch (position) {
        case 'top':
          top = targetRect.top - tooltipRect.height - 8;
          left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
          break;
        case 'bottom':
          top = targetRect.bottom + 8;
          left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
          break;
        case 'left':
          top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
          left = targetRect.left - tooltipRect.width - 8;
          break;
        case 'right':
          top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
          left = targetRect.right + 8;
          break;
      }

      // Keep tooltip within viewport
      const viewport = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      // Adjust horizontal position
      if (left < 8) {
        left = 8;
      } else if (left + tooltipRect.width > viewport.width - 8) {
        left = viewport.width - tooltipRect.width - 8;
      }

      // Adjust vertical position
      if (top < 8) {
        top = 8;
      } else if (top + tooltipRect.height > viewport.height - 8) {
        top = viewport.height - tooltipRect.height - 8;
      }

      tooltipEl.style.top = `${top}px`;
      tooltipEl.style.left = `${left}px`;
    };

    if (isVisible) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
    }

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible, position]);

  return (
    <>
      <div
        ref={targetRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="tooltip-trigger"
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          role="tooltip"
          className={`tooltip tooltip-${position} ${className}`}
          style={{ maxWidth }}
        >
          {content}
          {arrow && <div className="tooltip-arrow" />}
          <style jsx>{`
            .tooltip {
              position: fixed;
              z-index: var(--gw-z-tooltip);
              padding: 0.5rem 0.75rem;
              background-color: var(--gw-neutral-800);
              color: white;
              border-radius: var(--gw-border-radius);
              font-size: var(--gw-font-size-sm);
              line-height: 1.4;
              pointer-events: none;
              animation: tooltip-fade-in 0.2s ease-out;
            }

            .tooltip-arrow {
              position: absolute;
              width: 8px;
              height: 8px;
              background-color: var(--gw-neutral-800);
              transform: rotate(45deg);
            }

            .tooltip-top .tooltip-arrow {
              bottom: -4px;
              left: 50%;
              margin-left: -4px;
            }

            .tooltip-bottom .tooltip-arrow {
              top: -4px;
              left: 50%;
              margin-left: -4px;
            }

            .tooltip-left .tooltip-arrow {
              right: -4px;
              top: 50%;
              margin-top: -4px;
            }

            .tooltip-right .tooltip-arrow {
              left: -4px;
              top: 50%;
              margin-top: -4px;
            }

            /* Material Design styles */
            [data-design-system="material"] .tooltip {
              font-family: var(--gw-font-family);
              box-shadow: var(--gw-shadow-lg);
              font-weight: 500;
            }

            @keyframes tooltip-fade-in {
              from {
                opacity: 0;
                transform: scale(0.95);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
};