import React, { useState } from 'react';
import { MultiSeriesChartProps } from './types';
import { defaultColors, formatNumber } from './utils';

export const RadarChart: React.FC<MultiSeriesChartProps> = ({
  data,
  series,
  width = 500,
  height = 500,
  title,
  showLegend = true,
  showTooltip = true,
  className = '',
  animate = true,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) - 60;
  const angleStep = (Math.PI * 2) / data.length;

  const allValues = data.flatMap(d => d.values);
  const maxValue = Math.max(...allValues);

  const getPoint = (value: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const distance = (value / maxValue) * radius;
    return {
      x: centerX + distance * Math.cos(angle),
      y: centerY + distance * Math.sin(angle),
    };
  };

  const createRadarPath = (values: number[], index: number) => {
    const points = values.map((value, i) => getPoint(value, i));
    const path = points.reduce(
      (acc, point, i) => `${acc}${i === 0 ? 'M' : 'L'} ${point.x},${point.y}`,
      ''
    );

    return (
      <g key={index}>
        <path
          d={`${path} Z`}
          fill={defaultColors[index]}
          fillOpacity={0.2}
          stroke={defaultColors[index]}
          strokeWidth={2}
          className={animate ? 'chart-animate-radar' : ''}
        />
        {points.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={defaultColors[index]}
            stroke="white"
            strokeWidth={2}
            className={animate ? 'chart-animate-point' : ''}
          />
        ))}
      </g>
    );
  };

  const createAxis = (index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const endX = centerX + radius * Math.cos(angle);
    const endY = centerY + radius * Math.sin(angle);
    const labelX = centerX + (radius + 20) * Math.cos(angle);
    const labelY = centerY + (radius + 20) * Math.sin(angle);

    return (
      <g key={index}>
        <line
          x1={centerX}
          y1={centerY}
          x2={endX}
          y2={endY}
          stroke="#e5e7eb"
          strokeDasharray="4,4"
        />
        <text
          x={labelX}
          y={labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          className="chart-axis-label"
        >
          {data[index].label}
        </text>
      </g>
    );
  };

  const createGrid = () => {
    const levels = 5;
    return Array.from({ length: levels }).map((_, i) => {
      const radius = ((i + 1) * this.radius) / levels;
      const points = Array.from({ length: data.length })
        .map((_, j) => {
          const angle = j * angleStep - Math.PI / 2;
          return `${centerX + radius * Math.cos(angle)},${
            centerY + radius * Math.sin(angle)
          }`;
        })
        .join(' ');

      return (
        <polygon
          key={i}
          points={points}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={1}
          opacity={0.5}
        />
      );
    });
  };

  return (
    <div className={`chart-container ${className}`}>
      {title && <h3 className="chart-title">{title}</h3>}
      <svg width={width} height={height}>
        {createGrid()}
        {data.map((_, i) => createAxis(i))}
        {series.map((_, i) => createRadarPath(data.map(d => d.values[i]), i))}
      </svg>

      {showLegend && (
        <div className="chart-legend">
          {series.map((label, i) => (
            <div
              key={i}
              className="chart-legend-item"
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
            >
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