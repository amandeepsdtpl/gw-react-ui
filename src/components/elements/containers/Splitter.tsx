import React, { useState, useRef, useEffect } from 'react';

interface SplitterProps {
  children: [React.ReactNode, React.ReactNode];
  direction?: 'horizontal' | 'vertical';
  defaultSizes?: [number, number];
  minSizes?: [number, number];
  className?: string;
}

export const Splitter: React.FC<SplitterProps> = ({
  children,
  direction = 'horizontal',
  defaultSizes = [50, 50],
  minSizes = [0, 0],
  className = '',
}) => {
  const [sizes, setSizes] = useState(defaultSizes);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current.getBoundingClientRect();
      let newSizes: [number, number];

      if (direction === 'horizontal') {
        const offsetX = e.clientX - container.left;
        const totalWidth = container.width;
        const percentage = (offsetX / totalWidth) * 100;
        
        newSizes = [
          Math.max(minSizes[0], Math.min(100 - minSizes[1], percentage)),
          Math.max(minSizes[1], Math.min(100 - minSizes[0], 100 - percentage))
        ];
      } else {
        const offsetY = e.clientY - container.top;
        const totalHeight = container.height;
        const percentage = (offsetY / totalHeight) * 100;
        
        newSizes = [
          Math.max(minSizes[0], Math.min(100 - minSizes[1], percentage)),
          Math.max(minSizes[1], Math.min(100 - minSizes[0], 100 - percentage))
        ];
      }

      setSizes(newSizes);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, direction, minSizes]);

  return (
    <div
      ref={containerRef}
      className={`splitter splitter-${direction} ${className}`}
    >
      <div
        className="splitter-panel"
        style={{ [direction === 'horizontal' ? 'width' : 'height']: `${sizes[0]}%` }}
      >
        {children[0]}
      </div>
      <div
        ref={handleRef}
        className="splitter-handle"
        onMouseDown={() => setIsDragging(true)}
      >
        <div className="splitter-handle-line" />
      </div>
      <div
        className="splitter-panel"
        style={{ [direction === 'horizontal' ? 'width' : 'height']: `${sizes[1]}%` }}
      >
        {children[1]}
      </div>

      <style jsx>{`
        .splitter {
          display: flex;
          width: 100%;
          height: 100%;
          min-height: 0;
          min-width: 0;
        }

        .splitter-vertical {
          flex-direction: column;
        }

        .splitter-panel {
          flex: none;
          overflow: auto;
          min-height: 0;
          min-width: 0;
        }

        .splitter-handle {
          flex: none;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--gw-background);
          cursor: col-resize;
          transition: background-color var(--gw-transition);
        }

        .splitter-horizontal .splitter-handle {
          width: 8px;
          margin: 0 -4px;
          z-index: 1;
        }

        .splitter-vertical .splitter-handle {
          height: 8px;
          margin: -4px 0;
          cursor: row-resize;
        }

        .splitter-handle:hover,
        .splitter-handle:active {
          background-color: var(--gw-primary-100);
        }

        .splitter-handle-line {
          width: 2px;
          height: 2rem;
          background-color: var(--gw-border-color);
          border-radius: 1px;
          transition: background-color var(--gw-transition);
        }

        .splitter-vertical .splitter-handle-line {
          width: 2rem;
          height: 2px;
        }

        .splitter-handle:hover .splitter-handle-line,
        .splitter-handle:active .splitter-handle-line {
          background-color: var(--gw-primary);
        }

        /* Material Design styles */
        [data-design-system="material"] .splitter {
          font-family: var(--gw-font-family);
        }

        [data-design-system="material"] .splitter-handle {
          background-color: var(--gw-background-secondary);
        }

        [data-design-system="material"] .splitter-handle:hover,
        [data-design-system="material"] .splitter-handle:active {
          background-color: var(--gw-primary-50);
        }
      `}</style>
    </div>
  );
};