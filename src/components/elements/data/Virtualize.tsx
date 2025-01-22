import React, { useState, useRef, useEffect, useCallback } from 'react';

interface VirtualizeProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  onScroll?: (scrollTop: number) => void;
  className?: string;
}

export function Virtualize<T>({
  items,
  height,
  itemHeight,
  renderItem,
  overscan = 3,
  onScroll,
  className = '',
}: VirtualizeProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;
  const visibleItems = Math.ceil(height / itemHeight);
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length,
    Math.floor((scrollTop + height) / itemHeight) + overscan
  );

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = event.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    onScroll?.(newScrollTop);
  }, [onScroll]);

  // Update scroll position when items change
  useEffect(() => {
    if (containerRef.current) {
      const currentScrollTop = containerRef.current.scrollTop;
      if (currentScrollTop !== scrollTop) {
        setScrollTop(currentScrollTop);
      }
    }
  }, [items, scrollTop]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setScrollTop(containerRef.current.scrollTop);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const visibleItemsStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    transform: `translateY(${startIndex * itemHeight}px)`,
  } as const;

  return (
    <div
      ref={containerRef}
      className={`virtualize-container ${className}`}
      onScroll={handleScroll}
      style={{ height, position: 'relative', overflowY: 'auto' }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={visibleItemsStyle}>
          {items.slice(startIndex, endIndex + 1).map((item, index) => (
            <div
              key={startIndex + index}
              style={{ height: itemHeight }}
              className="virtualize-item"
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .virtualize-container {
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: var(--gw-border-color) transparent;
        }

        .virtualize-container::-webkit-scrollbar {
          width: 6px;
        }

        .virtualize-container::-webkit-scrollbar-track {
          background: transparent;
        }

        .virtualize-container::-webkit-scrollbar-thumb {
          background-color: var(--gw-border-color);
          border-radius: 3px;
        }

        .virtualize-container::-webkit-scrollbar-thumb:hover {
          background-color: var(--gw-text-secondary);
        }

        .virtualize-item {
          box-sizing: border-box;
        }

        /* Material Design styles */
        [data-design-system="material"] .virtualize-container {
          font-family: var(--gw-font-family);
        }

        [data-design-system="material"] .virtualize-container::-webkit-scrollbar-thumb {
          background-color: var(--gw-text-secondary);
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}