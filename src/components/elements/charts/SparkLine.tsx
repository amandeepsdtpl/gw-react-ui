import React from 'react';
import { defaultColors } from './utils';

interface SparkLineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  filled?: boolean;
  showPoints?: boolean;
  className?: string;
  animate?: boolean;
}

export const SparkLine: React.FC<SparkLineProps> = ({
  data,
  width = 100,
  height = 30,
  color = defaultColors[0],
  strokeWidth = 1.5,
  filled = false,
  showPoints = false,
  className = '',
  animate = true,
}) => {
  if (data.length < 2) return null;

  const padding = 2;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min;

  const points = data.map((value, index) => ({
    x: (index / (data.length - 1)) * chartWidth + padding,
    y: chartHeight - ((value - min) / range) * chartHeight + padding,
  }));

  const path = points.reduce(
    (acc, point, i) =>
      `${acc}${i === 0 ? 'M' : 'L'} ${point.x},${point.y}`,
    ''
  );

  const areaPath = filled
    ? `${path} L ${points[points.length - 1].x},${height - padding} L ${
        points[0].x
      },${height - padding} Z`
    : path;

  return (
    <svg
      width={width}
      height={height}
      className={`sparkline ${className}`}
      style={{ display: 'block' }}
    >
      {filled && (
        <defs>
          <linearGradient id="sparkline-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>
      )}
      <path
        d={areaPath}
        fill={filled ? 'url(#sparkline-gradient)' : 'none'}
        stroke={color}
        strokeWidth={strokeWidth}
        className={animate ? 'chart-animate-stroke' : ''}
      />
      {showPoints &&
        points.map((point, i) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r={2}
            fill="white"
            stroke={color}
            strokeWidth={strokeWidth}
            className={animate ? 'chart-animate-point' : ''}
          />
        ))}
    </svg>
  );
};