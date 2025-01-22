import React, { useState } from 'react';
import { defaultColors, formatNumber } from './utils';

interface TreemapItem {
  label: string;
  value: number;
  color?: string;
  children?: TreemapItem[];
}

interface TreemapChartProps {
  data: TreemapItem[];
  width?: number;
  height?: number;
  title?: string;
  showTooltip?: boolean;
  className?: string;
  animate?: boolean;
  padding?: number;
}

interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
  data: TreemapItem;
}

export const TreemapChart: React.FC<TreemapChartProps> = ({
  data,
  width = 600,
  height = 400,
  title,
  showTooltip = true,
  className = '',
  animate = true,
  padding = 1,
}) => {
  const [activeRect, setActiveRect] = useState<Rectangle | null>(null);

  const calculateTreemap = (
    items: TreemapItem[],
    x: number,
    y: number,
    width: number,
    height: number
  ): Rectangle[] => {
    const total = items.reduce((sum, item) => sum + item.value, 0);
    const scale = (width * height) / total;

    const rectangles: Rectangle[] = [];
    let currentX = x;
    let currentY = y;
    let rowHeight = 0;
    let rowWidth = 0;
    let rowItems: Rectangle[] = [];

    const processRow = () => {
      if (rowItems.length === 0) return;

      const rowScale = height / rowWidth;
      let xOffset = currentX;

      rowItems.forEach(rect => {
        rect.x = xOffset;
        rect.width = rect.data.value * rowScale;
        rect.height = rowHeight;
        xOffset += rect.width;
      });

      currentY += rowHeight;
      rowItems = [];
      rowWidth = 0;
      rowHeight = 0;
    };

    items.forEach(item => {
      const area = item.value * scale;
      const idealHeight = height;
      const idealWidth = area / idealHeight;

      if (rowWidth + idealWidth > width) {
        processRow();
        currentX = x;
      }

      if (rowItems.length === 0) {
        rowHeight = height - (currentY - y);
      }

      rowItems.push({
        x: currentX,
        y: currentY,
        width: idealWidth,
        height: rowHeight,
        data: item,
      });

      rowWidth += idealWidth;
      rectangles.push(rowItems[rowItems.length - 1]);
    });

    processRow();
    return rectangles;
  };

  const rectangles = calculateTreemap(data, 0, 0, width, height);

  return (
    <div className={`chart-container ${className}`}>
      {title && <h3 className="chart-title">{title}</h3>}
      <svg width={width} height={height}>
        {rectangles.map((rect, index) => {
          const isActive = activeRect === rect;
          const color = rect.data.color || defaultColors[index % defaultColors.length];

          return (
            <g key={index}>
              <rect
                x={rect.x + padding}
                y={rect.y + padding}
                width={rect.width - padding * 2}
                height={rect.height - padding * 2}
                fill={color}
                fillOpacity={isActive ? 0.8 : 0.6}
                stroke={color}
                strokeWidth={1}
                className={animate ? 'chart-animate-fill' : ''}
                onMouseEnter={() => setActiveRect(rect)}
                onMouseLeave={() => setActiveRect(null)}
              />
              {rect.width > 60 && rect.height > 30 && (
                <text
                  x={rect.x + rect.width / 2}
                  y={rect.y + rect.height / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="chart-label"
                  fill="white"
                >
                  {rect.data.label}
                </text>
              )}
              {isActive && showTooltip && (
                <g transform={`translate(${rect.x + rect.width / 2}, ${rect.y + rect.height / 2})`}>
                  <rect
                    x={-60}
                    y={-40}
                    width={120}
                    height={40}
                    rx={4}
                    fill="white"
                    stroke="#e5e7eb"
                  />
                  <text
                    x={0}
                    y={-20}
                    textAnchor="middle"
                    className="chart-label"
                  >
                    {rect.data.label}
                  </text>
                  <text
                    x={0}
                    y={0}
                    textAnchor="middle"
                    className="chart-value"
                  >
                    {formatNumber(rect.data.value)}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};