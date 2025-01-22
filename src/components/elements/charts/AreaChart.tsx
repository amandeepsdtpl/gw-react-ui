import React from 'react';
import { MultiSeriesChartProps } from './types';
import { defaultColors, calculateAxisBounds, formatNumber } from './utils';

export const AreaChart: React.FC<MultiSeriesChartProps> = ({
  data,
  series,
  width = 600,
  height = 400,
  title,
  showLegend = true,
  showTooltip = true,
  className = '',
  animate = true,
}) => {
  const padding = { top: 40, right: 40, bottom: 40, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const allValues = data.flatMap(d => d.values);
  const { min, max } = calculateAxisBounds(allValues);
  
  const xScale = chartWidth / (data.length - 1);
  const yScale = chartHeight / (max - min);

  const createPath = (values: number[], index: number) => {
    const points = values.map((value, i) => ({
      x: i * xScale,
      y: chartHeight - (value - min) * yScale,
    }));

    const path = points.reduce((acc, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      return `${acc} L ${point.x} ${point.y}`;
    }, '');

    const areaPath = `${path} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;
    const gradientId = `area-gradient-${index}`;

    return (
      <g key={index}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={defaultColors[index]} stopOpacity="0.4" />
            <stop offset="100%" stopColor={defaultColors[index]} stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <path
          d={areaPath}
          fill={`url(#${gradientId})`}
          stroke="none"
          className={animate ? 'chart-animate-fill' : ''}
        />
        <path
          d={path}
          fill="none"
          stroke={defaultColors[index]}
          strokeWidth={2}
          className={animate ? 'chart-animate-stroke' : ''}
        />
      </g>
    );
  };

  return (
    <div className={`chart-container ${className}`}>
      {title && <h3 className="chart-title">{title}</h3>}
      <svg width={width} height={height}>
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {/* Grid lines */}
          {Array.from({ length: 6 }).map((_, i) => {
            const y = (chartHeight * i) / 5;
            const value = max - ((max - min) * i) / 5;
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

          {/* Data */}
          {series.map((_, i) => createPath(data.map(d => d.values[i]), i))}

          {/* X-axis labels */}
          {data.map((point, i) => (
            <text
              key={i}
              x={i * xScale}
              y={chartHeight + 20}
              textAnchor="middle"
            >
              {point.label}
            </text>
          ))}
        </g>
      </svg>

      {showLegend && (
        <div className="chart-legend">
          {series.map((label, i) => (
            <div key={i} className="chart-legend-item">
              <span
                className="chart-legend-color"
                style={{ backgroundColor: defaultColors[i] }}
              />
              <span className="chart-legend-label">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};