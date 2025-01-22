import React, { useState, useRef, useEffect } from 'react';

interface Mark {
  value: number;
  label?: React.ReactNode;
}

interface SliderProps {
  value?: number | [number, number];
  onChange?: (value: number | [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  marks?: Mark[];
  label?: string;
  disabled?: boolean;
  readOnly?: boolean;
  showTooltip?: boolean;
  tooltipPrefix?: string;
  tooltipSuffix?: string;
  tooltipFormatter?: (value: number) => string;
  orientation?: 'horizontal' | 'vertical';
  size?: 'small' | 'medium' | 'large';
  color?: string;
  error?: string;
  className?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  marks,
  label,
  disabled = false,
  readOnly = false,
  showTooltip = true,
  tooltipPrefix = '',
  tooltipSuffix = '',
  tooltipFormatter,
  orientation = 'horizontal',
  size = 'medium',
  color,
  error,
  className = '',
}) => {
  const isRange = Array.isArray(value);
  const [localValue, setLocalValue] = useState<number | [number, number]>(
    value ?? (isRange ? [min, max] : min)
  );
  const [isDragging, setIsDragging] = useState<number | null>(null);
  const [showTooltips, setShowTooltips] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Update local value when prop changes
  useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value);
    }
  }, [value]);

  // Format value for display
  const formatValue = (val: number) => {
    if (tooltipFormatter) return tooltipFormatter(val);
    return `${tooltipPrefix}${val}${tooltipSuffix}`;
  };

  // Calculate percentage for a value
  const getPercentage = (val: number) => {
    return ((val - min) / (max - min)) * 100;
  };

  // Get value from percentage
  const getValueFromPercentage = (percentage: number) => {
    const rawValue = (percentage * (max - min)) / 100 + min;
    const steppedValue = Math.round(rawValue / step) * step;
    return Math.min(Math.max(steppedValue, min), max);
  };

  // Get value from mouse/touch position
  const getValueFromPosition = (clientX: number, clientY: number) => {
    if (!trackRef.current) return null;

    const rect = trackRef.current.getBoundingClientRect();
    const position = orientation === 'horizontal'
      ? ((clientX - rect.left) / rect.width) * 100
      : ((rect.bottom - clientY) / rect.height) * 100;

    return getValueFromPercentage(Math.min(Math.max(position, 0), 100));
  };

  // Handle mouse/touch events
  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (disabled || readOnly) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const newValue = getValueFromPosition(clientX, clientY);

    if (newValue === null) return;

    if (isRange) {
      const [start, end] = localValue as [number, number];
      const distanceToStart = Math.abs(newValue - start);
      const distanceToEnd = Math.abs(newValue - end);
      setIsDragging(distanceToStart < distanceToEnd ? 0 : 1);
    } else {
      setIsDragging(0);
    }

    setShowTooltips(true);
  };

  const handleMove = (e: MouseEvent | TouchEvent) => {
    if (isDragging === null) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const newValue = getValueFromPosition(clientX, clientY);

    if (newValue === null) return;

    let updatedValue: number | [number, number];

    if (isRange) {
      const values = [...(localValue as [number, number])];
      values[isDragging] = newValue;

      // Ensure start <= end
      if (isDragging === 0) {
        values[0] = Math.min(values[0], values[1]);
      } else {
        values[1] = Math.max(values[0], values[1]);
      }

      updatedValue = values as [number, number];
    } else {
      updatedValue = newValue;
    }

    setLocalValue(updatedValue);
    onChange?.(updatedValue);
  };

  const handleEnd = () => {
    setIsDragging(null);
    setShowTooltips(false);
  };

  // Add/remove event listeners
  useEffect(() => {
    if (isDragging !== null) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, index?: number) => {
    if (disabled || readOnly) return;

    const step = e.shiftKey ? 10 : 1;
    let newValue: number | [number, number] = localValue;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        if (isRange && index !== undefined) {
          const values = [...(newValue as [number, number])];
          values[index] = Math.min(values[index] + step, index === 0 ? values[1] : max);
          newValue = values as [number, number];
        } else {
          newValue = Math.min((newValue as number) + step, max);
        }
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        if (isRange && index !== undefined) {
          const values = [...(newValue as [number, number])];
          values[index] = Math.max(values[index] - step, index === 0 ? min : values[0]);
          newValue = values as [number, number];
        } else {
          newValue = Math.max((newValue as number) - step, min);
        }
        break;
      default:
        return;
    }

    e.preventDefault();
    setLocalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className={`slider-wrapper ${className}`}>
      {label && (
        <label className="slider-label">{label}</label>
      )}
      <div
        className={`
          slider
          slider-${orientation}
          slider-${size}
          ${disabled ? 'disabled' : ''}
          ${error ? 'error' : ''}
        `}
      >
        <div
          ref={trackRef}
          className="slider-track"
          onMouseDown={handleStart}
          onTouchStart={handleStart}
        >
          <div
            className="slider-track-fill"
            style={{
              backgroundColor: color,
              [orientation === 'horizontal' ? 'left' : 'bottom']: isRange
                ? `${getPercentage((localValue as [number, number])[0])}%`
                : '0%',
              [orientation === 'horizontal' ? 'width' : 'height']: isRange
                ? `${
                    getPercentage((localValue as [number, number])[1]) -
                    getPercentage((localValue as [number, number])[0])
                  }%`
                : `${getPercentage(localValue as number)}%`,
            }}
          />
          {isRange ? (
            <>
              <div
                className="slider-thumb"
                style={{
                  [orientation === 'horizontal' ? 'left' : 'bottom']: `${getPercentage(
                    (localValue as [number, number])[0]
                  )}%`,
                }}
                onMouseDown={() => !disabled && !readOnly && setIsDragging(0)}
                onTouchStart={() => !disabled && !readOnly && setIsDragging(0)}
                tabIndex={disabled || readOnly ? -1 : 0}
                role="slider"
                aria-valuemin={min}
                aria-valuemax={(localValue as [number, number])[1]}
                aria-valuenow={(localValue as [number, number])[0]}
                aria-orientation={orientation}
                onKeyDown={(e) => handleKeyDown(e, 0)}
              >
                {showTooltip && (showTooltips || isDragging === 0) && (
                  <div className="slider-tooltip">
                    {formatValue((localValue as [number, number])[0])}
                  </div>
                )}
              </div>
              <div
                className="slider-thumb"
                style={{
                  [orientation === 'horizontal' ? 'left' : 'bottom']: `${getPercentage(
                    (localValue as [number, number])[1]
                  )}%`,
                }}
                onMouseDown={() => !disabled && !readOnly && setIsDragging(1)}
                onTouchStart={() => !disabled && !readOnly && setIsDragging(1)}
                tabIndex={disabled || readOnly ? -1 : 0}
                role="slider"
                aria-valuemin={(localValue as [number, number])[0]}
                aria-valuemax={max}
                aria-valuenow={(localValue as [number, number])[1]}
                aria-orientation={orientation}
                onKeyDown={(e) => handleKeyDown(e, 1)}
              >
                {showTooltip && (showTooltips || isDragging === 1) && (
                  <div className="slider-tooltip">
                    {formatValue((localValue as [number, number])[1])}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div
              className="slider-thumb"
              style={{
                [orientation === 'horizontal' ? 'left' : 'bottom']: `${getPercentage(
                  localValue as number
                )}%`,
              }}
              onMouseDown={() => !disabled && !readOnly && setIsDragging(0)}
              onTouchStart={() => !disabled && !readOnly && setIsDragging(0)}
              tabIndex={disabled || readOnly ? -1 : 0}
              role="slider"
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={localValue as number}
              aria-orientation={orientation}
              onKeyDown={handleKeyDown}
            >
              {showTooltip && (showTooltips || isDragging === 0) && (
                <div className="slider-tooltip">
                  {formatValue(localValue as number)}
                </div>
              )}
            </div>
          )}
          {marks && (
            <div className="slider-marks">
              {marks.map((mark) => (
                <div
                  key={mark.value}
                  className="slider-mark"
                  style={{
                    [orientation === 'horizontal' ? 'left' : 'bottom']: `${getPercentage(
                      mark.value
                    )}%`,
                  }}
                >
                  <div className="mark-line" />
                  {mark.label && <div className="mark-label">{mark.label}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {error && <div className="slider-error">{error}</div>}

      <style jsx>{`
        .slider-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          touch-action: none;
        }

        .slider-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--gw-text-secondary);
        }

        .slider {
          position: relative;
          padding: 1rem 0;
        }

        .slider-vertical {
          height: 200px;
          padding: 0 1rem;
        }

        .slider-track {
          position: relative;
          height: 4px;
          background-color: var(--gw-background-tertiary);
          border-radius: 9999px;
          cursor: pointer;
        }

        .slider-vertical .slider-track {
          width: 4px;
          height: 100%;
        }

        .slider-track-fill {
          position: absolute;
          height: 100%;
          background-color: var(--gw-primary);
          border-radius: 9999px;
        }

        .slider-vertical .slider-track-fill {
          width: 100%;
        }

        .slider-thumb {
          position: absolute;
          width: 16px;
          height: 16px;
          background-color: white;
          border: 2px solid var(--gw-primary);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          cursor: grab;
          transition: box-shadow var(--gw-transition);
          outline: none;
        }

        .slider-vertical .slider-thumb {
          transform: translate(50%, 50%);
        }

        .slider-thumb:hover,
        .slider-thumb:focus-visible {
          box-shadow: 0 0 0 4px var(--gw-primary-100);
        }

        .slider-thumb:active {
          cursor: grabbing;
        }

        /* Sizes */
        .slider-small .slider-track {
          height: 2px;
        }

        .slider-small.slider-vertical .slider-track {
          width: 2px;
        }

        .slider-small .slider-thumb {
          width: 12px;
          height: 12px;
        }

        .slider-large .slider-track {
          height: 6px;
        }

        .slider-large.slider-vertical .slider-track {
          width: 6px;
        }

        .slider-large .slider-thumb {
          width: 20px;
          height: 20px;
        }

        /* States */
        .slider.disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .slider.disabled .slider-track,
        .slider.disabled .slider-thumb {
          cursor: not-allowed;
        }

        .slider.error .slider-track-fill {
          background-color: var(--gw-error-500);
        }

        .slider.error .slider-thumb {
          border-color: var(--gw-error-500);
        }

        .slider.error .slider-thumb:hover,
        .slider.error .slider-thumb:focus-visible {
          box-shadow: 0 0 0 4px var(--gw-error-100);
        }

        /* Tooltip */
        .slider-tooltip {
          position: absolute;
          top: -32px;
          left: 50%;
          transform: translateX(-50%);
          padding: 0.25rem 0.5rem;
          background-color: var(--gw-neutral-800);
          color: white;
          font-size: 0.75rem;
          border-radius: var(--gw-border-radius);
          white-space: nowrap;
        }

        .slider-vertical .slider-tooltip {
          top: 50%;
          left: -8px;
          transform: translate(-100%, -50%);
        }

        .slider-tooltip::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-top: 4px solid var(--gw-neutral-800);
        }

        .slider-vertical .slider-tooltip::after {
          left: auto;
          right: -4px;
          top: 50%;
          transform: translateY(-50%);
          border-top: 4px solid transparent;
          border-bottom: 4px solid transparent;
          border-left: 4px solid var(--gw-neutral-800);
        }

        /* Marks */
        .slider-marks {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }

        .slider-mark {
          position: absolute;
          transform: translateX(-50%);
        }

        .slider-vertical .slider-mark {
          transform: translateY(50%);
        }

        .mark-line {
          width: 2px;
          height: 8px;
          background-color: var(--gw-border-color);
          margin: 8px auto 4px;
        }

        .slider-vertical .mark-line {
          width: 8px;
          height: 2px;
          margin: 0 4px 0 8px;
        }

        .mark-label {
          font-size: 0.75rem;
          color: var(--gw-text-secondary);
          text-align: center;
          transform: translateX(-50%);
          white-space: nowrap;
        }

        .slider-vertical .mark-label {
          transform: translateY(50%);
          margin-left: 8px;
        }

        .slider-error {
          font-size: 0.75rem;
          color: var(--gw-error-500);
        }

        /* Material Design styles */
        [data-design-system="material"] .slider-track {
          height: 2px;
        }

        [data-design-system="material"].slider-vertical .slider-track {
          width: 2px;
        }

        [data-design-system="material"] .slider-thumb {
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        [data-design-system="material"] .slider-thumb:hover,
        [data-design-system="material"] .slider-thumb:focus-visible {
          transform: translate(-50%, -50%) scale(1.5);
        }

        [data-design-system="material"].slider-vertical .slider-thumb:hover,
        [data-design-system="material"].slider-vertical .slider-thumb:focus-visible {
          transform: translate(50%, 50%) scale(1.5);
        }
      `}</style>
    </div>
  );
};