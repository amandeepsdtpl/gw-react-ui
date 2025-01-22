import React, { useState } from 'react';
import { defaultColors, formatNumber } from './utils';

interface HeatmapCell {
  x: number;
  y: number;
  value: number;
}

interface HeatmapChartProps {
  data: HeatmapCell[];
  width?: number;
  height?: number;
  title?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  className?: string;
  animate?: boolean;
  xLabel?: string;
  yLabel?: string;
  colors?: string[];
}

export const HeatmapChart: React.FC<HeatmapChartProps> = ({
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
  colors = ['#f7fbff', '#08519c'],
}) => {
  const [activeCell, setActiveCell] = useState<HeatmapCell | null>(null);

  const padding = { top: 40, right: 40, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const xValues = Array.from(new Set(data.map(d => d.x))).sort((a, b) => a - b);
  const yValues = Array.from(new Set(data.map(d => d.y))).sort((a, b) => a - b);
  const cellWidth = chartWidth / xValues.length;
  const cellHeight = chartHeight / yValues.length;

  const minValue = Math.min(...data.map(d => d.value));
  const maxValue = Math.max(...data.map(d => d.value));

  const getColor = (value: number) => {
    const normalizedValue = (value - minValue) / (maxValue - minValue);
    const gradientPosition = normalizedValue * (colors.length - 1);
    const index = Math.floor(gradientPosition);
    const remainder = gradientPosition - index;

    if (index === colors.length - 1) return colors[index];

    const startColor = colors[index];
    const endColor = colors[index + 1];

    const interpolateComponent = (start: number, end: number) =>
      Math.round(start + (end - start) * remainder);

    const startRGB = startColor.match(/\w\w/g)?.map(c => parseInt(c, 16)) || [0, 0, 0];
    const endRGB = endColor.match(/\w\w/g)?.map(c => parseInt(c, 16)) || [0, 0, 0];

    const r = interpolateComponent(startRGB[0], endRGB[0]);
    const g = interpolateComponent(startRGB[1], endRGB[1]);
    const b = interpolateComponent(startRGB[2], endRGB[2]);

    return `rgb(${r}, ${g}, ${b})`;
  };

  const createCell = (cell: HeatmapCell) => {
    const xIndex = xValues.indexOf(cell.x);
    const yIndex = yValues.indexOf(cell.y);
    const x = xIndex * cellWidth;
    const y = yIndex * cellHeight;
    const isActive = activeCell === cell;

    return (
      <g key={`${cell.x}-${cell.y}`}>
        <rect
          x={x}
          y={y}
          width={cellWidth}
          height={cellHeight}
          fill={getColor(cell.value)}
          stroke="white"
          strokeWidth={1}
          className={animate ? 'chart-animate-fill' : ''}
          onMouseEnter={() => setActiveCell(cell)}
          onMouseLeave={() => setActiveCell(null)}
          style={{
            transition: 'fill 0.2s ease',
          }}
        />
        {isActive && showTooltip && (
          <g transform={`translate(${x + cellWidth / 2}, ${y + cellHeight / 2})`}>
            <rect
              x={-60}
              y={-40}
              width={120}
              height={60}
              rx={4}
              fill="white"
              stroke="#e5e7eb"
            />
            <text x={0} y={-20} textAnchor="middle" className="chart-label">
              ({formatNumber(cell.x)}, {formatNumber(cell.y)})
            </text>
            <text x={0} y={0} textAnchor="middle" className="chart-value">
              Value: {formatNumber(cell.value)}
            </text>
          </g>
        )}
      </g>
    );
  };

  const createAxes = () => (
    <g>
      {/* X-axis */}
      <line
        x1={0}
        y1={chartHeight}
        x2={chartWidth}
        y2={chartHeight}
        stroke="#e5e7eb"
      />
      {xValues.map((value, i) => (
        <g
          key={value}
          transform={`translate(${i * cellWidth + cellWidth / 2}, ${chartHeight})`}
        >
          <line y2={5} stroke="#e5e7eb" />
          <text
            y={20}
            textAnchor="middle"
            className="chart-axis-label"
            transform="rotate(45)"
          >
            {formatNumber(value)}
          </text>
        </g>
      ))}
      <text
        x={chartWidth / 2}
        y={chartHeight + 50}
        textAnchor="middle"
        className="chart-axis-label"
      >
        {xLabel}
      </text>

      {/* Y-axis */}
      <line x1={0} y1={0} x2={0} y2={chartHeight} stroke="#e5e7eb" />
      {yValues.map((value, i) => (
        <g
          key={value}
          transform={`translate(0, ${i * cellHeight + cellHeight / 2})`}
        >
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
      ))}
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

  const createLegend = () => {
    const gradientId = 'heatmap-gradient';
    const legendWidth = 200;
    const legendHeight = 20;

    return (
      <div className="chart-legend" style={{ marginTop: '1rem' }}>
        <svg width={legendWidth} height={legendHeight + 30}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              {colors.map((color, i) => (
                <stop
                  key={i}
                  offset={`${(i / (colors.length - 1)) * 100}%`}
                  stopColor={color}
                />
              ))}
            </linearGradient>
          </defs>
          <rect
            x={0}
            y={0}
            width={legendWidth}
            height={legendHeight}
            fill={`url(#${gradientId})`}
          />
          <text
            x={0}
            y={legendHeight + 20}
            className="chart-axis-label"
          >
            {formatNumber(minValue)}
          </text>
          <text
            x={legendWidth}
            y={legendHeight + 20}
            textAnchor="end"
            className="chart-axis-label"
          >
            {formatNumber(maxValue)}
          </text>
        </svg>
      </div>
    );
  };

  return (
    <div className={`chart-container ${className}`}>
      {title && <h3 className="chart-title">{title}</h3>}
      <svg width={width} height={height}>
        <g transform={`translate(${padding.left}, ${padding.top})`}>
          {createAxes()}
          {data.map(cell => createCell(cell))}
        </g>
      </svg>
      {showLegend && createLegend()}
    </div>
  );
};