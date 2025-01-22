import React from 'react';
import { ChartProps } from './types';
import { defaultColors, formatNumber } from './utils';

export const BarChart: React.FC<ChartProps> = ({
  data,
  width = 600,
  height = 400,
  title,
  showLegend = true,
  showTooltip = true,
  className = '',
  animate = true,
}) => {
  const padding = { top: 40, right: 40, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = (chartWidth / data.length) * 0.8;
  const barGap = (chartWidth / data.length) * 0.2;

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

          {/* Bars */}
          {data.map((point, i) => {
            const barHeight = (point.value / maxValue) * chartHeight;
            const x = i * (barWidth + barGap);
            const y = chartHeight - barHeight;

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={chartHeight}
                  width={barWidth}
                  height={0}
                  fill={point.color || defaultColors[i % defaultColors.length]}
                  className={animate ? 'chart-animate-bar' : ''}
                  style={{ transform: `scaleY(${barHeight / chartHeight})` }}
                  transform-origin={`${x + barWidth / 2} ${chartHeight}`}
                />
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 20}
                  textAnchor="middle"
                  transform={`rotate(45, ${x + barWidth / 2}, ${chartHeight + 20})`}
                >
                  {point.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {showLegend && (
        <div className="chart-legend">
          {data.map((point, i) => (
            <div key={i} className="chart-legend-item">
              <span
                className="chart-legend-color"
                style={{
                  backgroundColor:
                    point.color || defaultColors[i % defaultColors.length],
                }}
              />
              <span className="chart-legend-label">{point.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};