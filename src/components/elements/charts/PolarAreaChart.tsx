import React, { useState } from 'react';
import { ChartProps } from './types';
import { defaultColors, describeArc, formatNumber } from './utils';

export const PolarAreaChart: React.FC<ChartProps> = ({
  data,
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
  const maxRadius = Math.min(centerX, centerY) - 40;
  const angleStep = 360 / data.length;

  const maxValue = Math.max(...data.map(d => d.value));

  const createPolarSegment = (point: typeof data[0], index: number) => {
    const startAngle = index * angleStep;
    const endAngle = (index + 1) * angleStep;
    const radius = (point.value / maxValue) * maxRadius;
    const isActive = activeIndex === index;
    const scale = isActive ? 1.05 : 1;
    const color = point.color || defaultColors[index % defaultColors.length];

    const path = describeArc(0, 0, radius * scale, startAngle, endAngle);
    const midAngle = (startAngle + endAngle) / 2;
    const labelRadius = radius * scale * 0.7;
    const labelX = labelRadius * Math.cos((midAngle * Math.PI) / 180);
    const labelY = labelRadius * Math.sin((midAngle * Math.PI) / 180);

    return (
      <g key={index}>
        <path
          d={path}
          fill={color}
          stroke="white"
          strokeWidth={2}
          className={animate ? 'chart-animate-polar' : ''}
          onMouseEnter={() => setActiveIndex(index)}
          onMouseLeave={() => setActiveIndex(null)}
          style={{
            transform: isActive ? `scale(${scale})` : undefined,
            transformOrigin: 'center',
            transition: 'transform 0.2s ease',
          }}
        />
        {radius > maxRadius * 0.2 && (
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            className="chart-label"
          >
            {formatNumber(point.value)}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className={`chart-container ${className}`}>
      {title && <h3 className="chart-title">{title}</h3>}
      <svg width={width} height={height}>
        <g transform={`translate(${centerX}, ${centerY})`}>
          {/* Grid circles */}
          {[0.2, 0.4, 0.6, 0.8, 1].map((scale) => (
            <circle
              key={scale}
              cx={0}
              cy={0}
              r={maxRadius * scale}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={1}
              strokeDasharray="4,4"
            />
          ))}
          {data.map((point, i) => createPolarSegment(point, i))}
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