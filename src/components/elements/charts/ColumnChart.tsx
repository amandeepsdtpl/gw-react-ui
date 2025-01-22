import React, { useState } from 'react';
import { ChartProps } from './types';
import { defaultColors, formatNumber } from './utils';

export const ColumnChart: React.FC<ChartProps> = ({
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

  const padding = { top: 40, right: 40, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map(d => d.value));
  const columnWidth = (chartWidth / data.length) * 0.8;
  const columnGap = (chartWidth / data.length) * 0.2;

  return (
    <div className={`chart-container ${className}`}>
      {title && <h3 className="chart-title">{title}</h3>}
      <svg width={width} height={height}>
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {/* Grid lines */}
          {Array.from({ length: 6 }).map((_, i) => {
            const y = (chartHeight * i) / 5;
            const value = maxValue - (maxValue * i) / 5;
            return (
              <g key={i}>
                <line
                  x1={0}
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeDasharray="4,4"
                />
                <text x={-10} y={y} textAnchor="end" dominantBaseline="middle">
                  {formatNumber(value)}
                </text>
              </g>
            );
          })}

          {/* Columns */}
          {data.map((point, i) => {
            const columnHeight = (point.value / maxValue) * chartHeight;
            const x = i * (columnWidth + columnGap);
            const y = chartHeight - columnHeight;
            const isActive = activeIndex === i;

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={chartHeight}
                  width={columnWidth}
                  height={0}
                  fill={point.color || defaultColors[i % defaultColors.length]}
                  className={animate ? 'chart-animate-column' : ''}
                  style={{
                    transform: `scaleY(${columnHeight / chartHeight})`,
                    transformOrigin: `${x + columnWidth / 2}px ${chartHeight}px`,
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                />
                <text
                  x={x + columnWidth / 2}
                  y={chartHeight + 20}
                  textAnchor="middle"
                  transform={`rotate(45, ${x + columnWidth / 2}, ${chartHeight + 20})`}
                >
                  {point.label}
                </text>

                {isActive && showTooltip && (
                  <g transform={`translate(${x + columnWidth / 2}, ${y - 10})`}>
                    <rect
                      x={-40}
                      y={-30}
                      width={80}
                      height={25}
                      rx={4}
                      fill="white"
                      stroke="#e5e7eb"
                    />
                    <text
                      x={0}
                      y={-15}
                      textAnchor="middle"
                      className="chart-value"
                    >
                      {formatNumber(point.value)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
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