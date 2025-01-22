import React, { useState } from 'react';
import { ChartProps } from './types';
import { defaultColors, formatNumber } from './utils';

export const FunnelChart: React.FC<ChartProps> = ({
  data,
  width = 600,
  height = 400,
  title,
  showLegend = true,
  showTooltip = true,
  className = '',
  animate = true,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const padding = { top: 40, right: 40, bottom: 40, left: 120 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map(d => d.value));
  const stepHeight = chartHeight / data.length;

  const createFunnelSegment = (point: typeof data[0], index: number) => {
    const topWidth = (point.value / maxValue) * chartWidth;
    const nextPoint = data[index + 1];
    const bottomWidth = nextPoint
      ? (nextPoint.value / maxValue) * chartWidth
      : topWidth * 0.2;

    const y = index * stepHeight;
    const points = [
      `${(chartWidth - topWidth) / 2},${y}`,
      `${(chartWidth + topWidth) / 2},${y}`,
      `${(chartWidth + bottomWidth) / 2},${y + stepHeight}`,
      `${(chartWidth - bottomWidth) / 2},${y + stepHeight}`,
    ].join(' ');

    const isActive = activeIndex === index;
    const color = point.color || defaultColors[index % defaultColors.length];

    return (
      <g key={index}>
        <polygon
          points={points}
          fill={color}
          stroke="white"
          strokeWidth={2}
          className={animate ? 'chart-animate-funnel' : ''}
          onMouseEnter={() => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
          style={{
            transform: isActive ? 'translateX(10px)' : undefined,
            transition: 'transform 0.2s ease',
          }}
        />
        <text
          x={-10}
          y={y + stepHeight / 2}
          textAnchor="end"
          dominantBaseline="middle"
          className="chart-label"
        >
          {point.label}
        </text>
        <text
          x={chartWidth + 10}
          y={y + stepHeight / 2}
          textAnchor="start"
          dominantBaseline="middle"
          className="chart-value"
        >
          {formatNumber(point.value)}
        </text>
      </g>
    );
  };

  return (
    <div className={`chart-container ${className}`}>
      {title && <h3 className="chart-title">{title}</h3>}
      <svg width={width} height={height}>
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {data.map((point, i) => createFunnelSegment(point, i))}
        </g>
      </svg>

      {showLegend && (
        <div className="chart-legend">
          {data.map((point, i) => (
            <div
              key={i}
              className="chart-legend-item"
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <span
                className="chart-legend-color"
                style={{
                  backgroundColor:
                    point.color || defaultColors[i % defaultColors.length],
                }}
              />
              <span className="chart-legend-label">
                {point.label} ({formatNumber(point.value)})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};