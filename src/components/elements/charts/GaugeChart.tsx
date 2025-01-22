import React from 'react';
import { defaultColors } from './utils';

interface GaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  width?: number;
  height?: number;
  title?: string;
  className?: string;
  animate?: boolean;
  thickness?: number;
  color?: string;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
  thresholds?: Array<{
    value: number;
    color: string;
  }>;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  value,
  min = 0,
  max = 100,
  width = 300,
  height = 200,
  title,
  className = '',
  animate = true,
  thickness = 20,
  color = defaultColors[0],
  showValue = true,
  valueFormatter = (v: number) => v.toString(),
  thresholds = [],
}) => {
  const radius = Math.min(width / 2, height) - thickness;
  const centerX = width / 2;
  const centerY = height - 10;
  const startAngle = -180;
  const endAngle = 0;

  const getColor = (value: number): string => {
    const sortedThresholds = [...thresholds].sort((a, b) => b.value - a.value);
    const threshold = sortedThresholds.find(t => value >= t.value);
    return threshold?.color || color;
  };

  const calculateAngle = (value: number): number => {
    const percentage = (value - min) / (max - min);
    return startAngle + percentage * (endAngle - startAngle);
  };

  const describeArc = (angle: number): string => {
    const angleRad = (angle * Math.PI) / 180;
    const x = centerX + radius * Math.cos(angleRad);
    const y = centerY + radius * Math.sin(angleRad);
    const largeArcFlag = angle - startAngle <= 180 ? '0' : '1';

    return [
      'M',
      centerX + radius * Math.cos((startAngle * Math.PI) / 180),
      centerY + radius * Math.sin((startAngle * Math.PI) / 180),
      'A',
      radius,
      radius,
      0,
      largeArcFlag,
      1,
      x,
      y,
    ].join(' ');
  };

  const angle = calculateAngle(Math.min(Math.max(value, min), max));
  const gaugeColor = getColor(value);

  return (
    <div className={`chart-container ${className}`}>
      {title && <h3 className="chart-title">{title}</h3>}
      <svg width={width} height={height}>
        {/* Background arc */}
        <path
          d={describeArc(endAngle)}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={thickness}
          strokeLinecap="round"
        />

        {/* Value arc */}
        <path
          d={describeArc(angle)}
          fill="none"
          stroke={gaugeColor}
          strokeWidth={thickness}
          strokeLinecap="round"
          className={animate ? 'chart-animate-stroke' : ''}
        />

        {/* Ticks */}
        {Array.from({ length: 11 }).map((_, i) => {
          const tickAngle = startAngle + (i * (endAngle - startAngle)) / 10;
          const tickLength = i % 5 === 0 ? 10 : 5;
          const angleRad = (tickAngle * Math.PI) / 180;
          const innerRadius = radius - thickness / 2;
          const outerRadius = innerRadius - tickLength;

          return (
            <line
              key={i}
              x1={centerX + innerRadius * Math.cos(angleRad)}
              y1={centerY + innerRadius * Math.sin(angleRad)}
              x2={centerX + outerRadius * Math.cos(angleRad)}
              y2={centerY + outerRadius * Math.sin(angleRad)}
              stroke="#9ca3af"
              strokeWidth={2}
            />
          );
        })}

        {/* Value text */}
        {showValue && (
          <text
            x={centerX}
            y={centerY - 20}
            textAnchor="middle"
            className="chart-value"
            style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
          >
            {valueFormatter(value)}
          </text>
        )}
      </svg>
    </div>
  );
};