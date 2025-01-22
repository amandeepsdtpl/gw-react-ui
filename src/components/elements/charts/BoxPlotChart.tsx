import React, { useState } from 'react';
import { defaultColors, formatNumber } from './utils';

interface BoxPlotData {
  label: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers?: number[];
  color?: string;
}

interface BoxPlotChartProps {
  data: BoxPlotData[];
  width?: number;
  height?: number;
  title?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  className?: string;
  animate?: boolean;
  yLabel?: string;
  boxWidth?: number;
}

export const BoxPlotChart: React.FC<BoxPlotChartProps> = ({
  data,
  width = 600,
  height = 400,
  title,
  showLegend = true,
  showTooltip = true,
  className = '',
  animate = true,
  yLabel = 'Values',
  boxWidth = 50,
}) => {
  const [activeBox, setActiveBox] = useState<number | null>(null);

  const padding = { top: 40, right: 40, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculate y-axis scale
  const allValues = data.flatMap(d => [
    d.min,
    d.q1,
    d.median,
    d.q3,
    d.max,
    ...(d.outliers || []),
  ]);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const yScale = (value: number) =>
    chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;

  // Calculate x positions for boxes
  const boxSpacing = chartWidth / (data.length + 1);

  const createBox = (item: BoxPlotData, index: number) => {
    const isActive = activeBox === index;
    const color = item.color || defaultColors[index % defaultColors.length];
    const x = (index + 1) * boxSpacing;
    const boxLeft = x - boxWidth / 2;

    // Calculate y positions
    const minY = yScale(item.min);
    const q1Y = yScale(item.q1);
    const medianY = yScale(item.median);
    const q3Y = yScale(item.q3);
    const maxY = yScale(item.max);

    return (
      <g
        key={index}
        onMouseEnter={() => setActiveBox(index)}
        onMouseLeave={() => setActiveBox(null)}
      >
        {/* Vertical line from min to max */}
        <line
          x1={x}
          y1={minY}
          x2={x}
          y2={maxY}
          stroke={color}
          strokeWidth={2}
          className={animate ? 'chart-animate-stroke' : ''}
        />

        {/* Horizontal lines at min and max */}
        <line
          x1={x - boxWidth / 4}
          y1={minY}
          x2={x + boxWidth / 4}
          y2={minY}
          stroke={color}
          strokeWidth={2}
          className={animate ? 'chart-animate-stroke' : ''}
        />
        <line
          x1={x - boxWidth / 4}
          y1={maxY}
          x2={x + boxWidth / 4}
          y2={maxY}
          stroke={color}
          strokeWidth={2}
          className={animate ? 'chart-animate-stroke' : ''}
        />

        {/* Box from Q1 to Q3 */}
        <rect
          x={boxLeft}
          y={q3Y}
          width={boxWidth}
          height={q1Y - q3Y}
          fill={color}
          fillOpacity={0.2}
          stroke={color}
          strokeWidth={2}
          className={animate ? 'chart-animate-fill' : ''}
        />

        {/* Median line */}
        <line
          x1={boxLeft}
          y1={medianY}
          x2={boxLeft + boxWidth}
          y2={medianY}
          stroke={color}
          strokeWidth={2}
          className={animate ? 'chart-animate-stroke' : ''}
        />

        {/* Outliers */}
        {item.outliers?.map((outlier, i) => (
          <circle
            key={i}
            cx={x}
            cy={yScale(outlier)}
            r={4}
            fill={color}
            stroke="white"
            strokeWidth={1}
            className={animate ? 'chart-animate-point' : ''}
          />
        ))}

        {/* Label */}
        <text
          x={x}
          y={chartHeight + 20}
          textAnchor="middle"
          className="chart-axis-label"
        >
          {item.label}
        </text>

        {/* Tooltip */}
        {isActive && showTooltip && (
          <g transform={`translate(${x + boxWidth}, ${chartHeight / 2})`}>
            <rect
              x={0}
              y={-80}
              width={120}
              height={160}
              rx={4}
              fill="white"
              stroke="#e5e7eb"
            />
            <text x={10} y={-60} className="chart-label">{item.label}</text>
            <text x={10} y={-40} className="chart-value">
              Max: {formatNumber(item.max)}
            </text>
            <text x={10} y={-20} className="chart-value">
              Q3: {formatNumber(item.q3)}
            </text>
            <text x={10} y={0} className="chart-value">
              Median: {formatNumber(item.median)}
            </text>
            <text x={10} y={20} className="chart-value">
              Q1: {formatNumber(item.q1)}
            </text>
            <text x={10} y={40} className="chart-value">
              Min: {formatNumber(item.min)}
            </text>
            {item.outliers && item.outliers.length > 0 && (
              <text x={10} y={60} className="chart-value">
                Outliers: {item.outliers.length}
              </text>
            )}
          </g>
        )}
      </g>
    );
  };

  const createYAxis = () => {
    const ticks = 5;
    return (
      <g>
        <line x1={0} y1={0} x2={0} y2={chartHeight} stroke="#e5e7eb" />
        {Array.from({ length: ticks + 1 }).map((_, i) => {
          const y = (chartHeight * i) / ticks;
          const value = maxValue - ((maxValue - minValue) * i) / ticks;
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
      </g>
    );
  };

  return (
    <div className={`chart-container ${className}`}>
      {title && <h3 className="chart-title">{title}</h3>}
      <svg width={width} height={height}>
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {/* Grid lines */}
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={i}
              x1={0}
              y1={(chartHeight * i) / 5}
              x2={chartWidth}
              y2={(chartHeight * i) / 5}
              stroke="#e5e7eb"
              strokeDasharray="4,4"
            />
          ))}
          {createYAxis()}
          {data.map((item, i) => createBox(item, i))}
        </g>
      </svg>

      {showLegend && (
        <div className="chart-legend">
          {data.map((item, i) => (
            <div
              key={i}
              className="chart-legend-item"
              onMouseEnter={() => setActiveBox(i)}
              onMouseLeave={() => setActiveBox(null)}
            >
              <span
                className="chart-legend-color"
                style={{
                  backgroundColor:
                    item.color || defaultColors[i % defaultColors.length],
                }}
              />
              <span className="chart-legend-label">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};