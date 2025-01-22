import React, { useState } from 'react';
import { ChartProps } from './types';
import { defaultColors, describeArc, formatNumber } from './utils';

export const PieChart: React.FC<ChartProps> = ({
  data,
  width = 400,
  height = 400,
  title,
  showLegend = true,
  showTooltip = true,
  className = '',
  animate = true,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const total = data.reduce((sum, point) => sum + point.value, 0);
  const radius = Math.min(width, height) / 2 - 40;
  const centerX = width / 2;
  const centerY = height / 2;

  let startAngle = 0;
  const slices = data.map((point, index) => {
    const percentage = (point.value / total) * 100;
    const angle = (percentage / 100) * 360;
    const slice = {
      ...point,
      startAngle,
      endAngle: startAngle + angle,
      percentage,
      color: point.color || defaultColors[index % defaultColors.length],
    };
    startAngle += angle;
    return slice;
  });

  return (
    <div className={`chart-container ${className}`}>
      {title && <h3 className="chart-title">{title}</h3>}
      <svg width={width} height={height}>
        <g transform={`translate(${centerX}, ${centerY})`}>
          {slices.map((slice, i) => {
            const isActive = activeIndex === i;
            const scale = isActive ? 1.05 : 1;
            const path = describeArc(
              0,
              0,
              radius * scale,
              slice.startAngle,
              slice.endAngle
            );

            return (
              <g key={i}>
                <path
                  d={path}
                  fill={slice.color}
                  stroke="white"
                  strokeWidth={2}
                  className={animate ? 'chart-animate-slice' : ''}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                  style={{
                    transform: isActive ? `scale(${scale})` : undefined,
                    transformOrigin: 'center',
                    transition: 'transform 0.2s ease',
                  }}
                />
                {slice.percentage >= 5 && (
                  <text
                    x={
                      (radius / 2) *
                      Math.cos(((slice.startAngle + slice.endAngle) / 2) * (Math.PI / 180))
                    }
                    y={
                      (radius / 2) *
                      Math.sin(((slice.startAngle + slice.endAngle) / 2) * (Math.PI / 180))
                    }
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                  >
                    {`${slice.percentage.toFixed(1)}%`}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {showLegend && (
        <div className="chart-legend">
          {slices.map((slice, i) => (
            <div
              key={i}
              className="chart-legend-item"
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <span
                className="chart-legend-color"
                style={{ backgroundColor: slice.color }}
              />
              <span className="chart-legend-label">
                {slice.label} ({formatNumber(slice.value)})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};