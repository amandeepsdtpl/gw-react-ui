import React, { useState } from 'react';
import { ScatterChartProps } from './types';
import { defaultColors, formatNumber } from './utils';

interface BubbleChartProps extends Omit<ScatterChartProps, 'data'> {
  data: Array<{
    x: number;
    y: number;
    size: number;
    label?: string;
    color?: string;
  }>;
  minBubbleSize?: number;
  maxBubbleSize?: number;
}

export const BubbleChart: React.FC<BubbleChartProps> = ({
  data,
  width = 600,
  height = 400,
  title,
  showLegend = true,
  showTooltip = true,
  className = '',
  animate = true,
  xLabel = 'X Axis',
  yLabel = 'Y Axis',
  minBubbleSize = 10,
  maxBubbleSize = 50,
}) => {
  const [activePoint, setActivePoint] = useState<number | null>(null);

  const padding = { top: 40, right: 40, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const xMin = Math.min(...data.map(d => d.x));
  const xMax = Math.max(...data.map(d => d.x));
  const yMin = Math.min(...data.map(d => d.y));
  const yMax = Math.max(...data.map(d => d.y));
  const sizeMin = Math.min(...data.map(d => d.size));
  const sizeMax = Math.max(...data.map(d => d.size));

  const xScale = (x: number) => ((x - xMin) / (xMax - xMin)) * chartWidth;
  const yScale = (y: number) => chartHeight - ((y - yMin) / (yMax - yMin)) * chartHeight;
  const sizeScale = (size: number) =>
    ((size - sizeMin) / (sizeMax - sizeMin)) * (maxBubbleSize - minBubbleSize) + minBubbleSize;

  const createBubble = (point: typeof data[0], index: number) => {
    const isActive = activePoint === index;
    const cx = xScale(point.x);
    const cy = yScale(point.y);
    const r = sizeScale(point.size);
    const color = point.color || defaultColors[index % defaultColors.length];

    return (
      <g key={index}>
        <circle
          cx={cx}
          cy={cy}
          r={isActive ? r * 1.1 : r}
          fill={color}
          fillOpacity={0.6}
          stroke={color}
          strokeWidth={2}
          className={animate ? 'chart-animate-point' : ''}
          onMouseEnter={() => setActivePoint(index)}
          onMouseLeave={() => setActivePoint(null)}
          style={{ transition: 'r 0.2s ease' }}
        />
        {isActive && showTooltip && (
          <g transform={`translate(${cx + r + 10}, ${cy})`}>
            <rect
              x={0}
              y={-30}
              width={120}
              height={60}
              rx={4}
              fill="white"
              stroke="#e5e7eb"
            />
            <text x={10} y={-10} className="chart-label">
              {point.label || `Point ${index + 1}`}
            </text>
            <text x={10} y={10} className="chart-value">
              X: {formatNumber(point.x)}
            </text>
            <text x={10} y={30} className="chart-value">
              Y: {formatNumber(point.y)}
            </text>
          </g>
        )}
      </g>
    );
  };

  const createAxis = () => {
    const xTicks = 5;
    const yTicks = 5;

    return (
      <g>
        {/* X-axis */}
        <line
          x1={0}
          y1={chartHeight}
          x2={chartWidth}
          y2={chartHeight}
          stroke="#e5e7eb"
        />
        {Array.from({ length: xTicks + 1 }).map((_, i) => {
          const x = (chartWidth * i) / xTicks;
          const value = xMin + ((xMax - xMin) * i) / xTicks;
          return (
            <g key={i} transform={`translate(${x}, ${chartHeight})`}>
              <line y2={5} stroke="#e5e7eb" />
              <text
                y={20}
                textAnchor="middle"
                className="chart-axis-label"
              >
                {formatNumber(value)}
              </text>
            </g>
          );
        })}
        <text
          x={chartWidth / 2}
          y={chartHeight + 40}
          textAnchor="middle"
          className="chart-axis-label"
        >
          {xLabel}
        </text>

        {/* Y-axis */}
        <line x1={0} y1={0} x2={0} y2={chartHeight} stroke="#e5e7eb" />
        {Array.from({ length: yTicks + 1 }).map((_, i) => {
          const y = (chartHeight * i) / yTicks;
          const value = yMax - ((yMax - yMin) * i) / yTicks;
          return (
            <g key={i} transform={`translate(0, ${y})`}>
              <line x2={-5} stroke="#e5e7eb" />
              <text
                x={-10}
                textAnchor="end"
                dominantBaseline="middle"
                className="chart-axis-label"
              >
                {formatNumber(value)}
              </text>
            </g>
          );
        })}
        <text
          x={-40}
          y={chartHeight / 2}
          textAnchor="middle"
          transform={`rotate(-90, -40, ${chartHeight / 2})`}
          className="chart-axis-label"
        >
          {yLabel}
        </text>

        {/* Grid */}
        {Array.from({ length: xTicks + 1 }).map((_, i) => {
          const x = (chartWidth * i) / xTicks;
          return (
            <line
              key={i}
              x1={x}
              y1={0}
              x2={x}
              y2={chartHeight}
              stroke="#e5e7eb"
              strokeDasharray="4,4"
              opacity={0.5}
            />
          );
        })}
        {Array.from({ length: yTicks + 1 }).map((_, i) => {
          const y = (chartHeight * i) / yTicks;
          return (
            <line
              key={i}
              x1={0}
              y1={y}
              x2={chartWidth}
              y2={y}
              stroke="#e5e7eb"
              strokeDasharray="4,4"
              opacity={0.5}
            />
          );
        })}
      </g>
    );
  };

  return (
    <div className={`chart-container ${className}`}>
      {title && <h3 className="chart-title">{title}</h3>}
      <svg width={width} height={height}>
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {createAxis()}
          {data.map((point, i) => createBubble(point, i))}
        </g>
      </svg>

      {showLegend && (
        <div className="chart-legend">
          {data.map((point, i) => (
            <div
              key={i}
              className="chart-legend-item"
              onMouseEnter={() => setActivePoint(i)}
              onMouseLeave={() => setActivePoint(null)}
            >
              <span
                className="chart-legend-color"
                style={{
                  backgroundColor:
                    point.color || defaultColors[i % defaultColors.length],
                }}
              />
              <span className="chart-legend-label">
                {point.label || `Point ${i + 1}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};