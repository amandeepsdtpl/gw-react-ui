import React, { useState, useRef, useEffect } from 'react';
import { X, Check } from 'lucide-react';

interface ColorPickerProps {
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  format?: 'hex' | 'rgb' | 'hsl';
  alpha?: boolean;
  presetColors?: string[];
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'filled' | 'underlined';
  fullWidth?: boolean;
  className?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value = '#000000',
  onChange,
  label,
  error,
  hint,
  disabled = false,
  readOnly = false,
  required = false,
  format = 'hex',
  alpha = false,
  presetColors = [
    '#000000', '#ffffff', '#f44336', '#e91e63', '#9c27b0',
    '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
    '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b',
    '#ffc107', '#ff9800', '#ff5722', '#795548', '#9e9e9e'
  ],
  size = 'medium',
  variant = 'outlined',
  fullWidth = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(value);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [alphaValue, setAlphaValue] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const alphaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value) {
      setCurrentColor(value);
      const { h, s, l, a } = parseColor(value);
      setHue(h);
      setSaturation(s);
      setLightness(l);
      setAlphaValue(a);
    }
  }, [value]);

  const parseColor = (color: string) => {
    let h = 0, s = 100, l = 50, a = 1;

    if (color.startsWith('#')) {
      const hex = color.substring(1);
      const rgb = {
        r: parseInt(hex.substr(0, 2), 16),
        g: parseInt(hex.substr(2, 2), 16),
        b: parseInt(hex.substr(4, 2), 16),
      };
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      h = hsl.h;
      s = hsl.s;
      l = hsl.l;
    } else if (color.startsWith('rgb')) {
      const matches = color.match(/\d+/g);
      if (matches) {
        const rgb = {
          r: parseInt(matches[0]),
          g: parseInt(matches[1]),
          b: parseInt(matches[2]),
        };
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        h = hsl.h;
        s = hsl.s;
        l = hsl.l;
        if (matches.length === 4) {
          a = parseFloat(matches[3]);
        }
      }
    } else if (color.startsWith('hsl')) {
      const matches = color.match(/\d+/g);
      if (matches) {
        h = parseInt(matches[0]);
        s = parseInt(matches[1]);
        l = parseInt(matches[2]);
        if (matches.length === 4) {
          a = parseFloat(matches[3]);
        }
      }
    }

    return { h, s, l, a };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h *= 60;
    }

    return {
      h: Math.round(h),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const hslToHex = (h: number, s: number, l: number, a = 1) => {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    const toHex = (n: number) => {
      const hex = Math.round((n + m) * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    if (alpha && a < 1) {
      const alphaHex = Math.round(a * 255).toString(16).padStart(2, '0');
      return `#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}`;
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const handlePaletteChange = (e: React.MouseEvent) => {
    if (!paletteRef.current) return;

    const rect = paletteRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    const s = (x / rect.width) * 100;
    const l = 100 - (y / rect.height) * 100;

    setSaturation(s);
    setLightness(l);
    updateColor(hue, s, l, alphaValue);
  };

  const handleHueChange = (e: React.MouseEvent) => {
    if (!hueRef.current) return;

    const rect = hueRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const h = (x / rect.width) * 360;

    setHue(h);
    updateColor(h, saturation, lightness, alphaValue);
  };

  const handleAlphaChange = (e: React.MouseEvent) => {
    if (!alphaRef.current || !alpha) return;

    const rect = alphaRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const a = x / rect.width;

    setAlphaValue(a);
    updateColor(hue, saturation, lightness, a);
  };

  const updateColor = (h: number, s: number, l: number, a: number) => {
    let newColor: string;

    switch (format) {
      case 'rgb':
        newColor = alpha
          ? `rgba(${hslToRgb(h, s, l).join(',')},${a})`
          : `rgb(${hslToRgb(h, s, l).join(',')})`;
        break;
      case 'hsl':
        newColor = alpha
          ? `hsla(${Math.round(h)},${Math.round(s)}%,${Math.round(l)}%,${a})`
          : `hsl(${Math.round(h)},${Math.round(s)}%,${Math.round(l)}%)`;
        break;
      default:
        newColor = hslToHex(h, s, l, a);
    }

    setCurrentColor(newColor);
    onChange?.(newColor);
  };

  const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [
      Math.round(255 * f(0)),
      Math.round(255 * f(8)),
      Math.round(255 * f(4)),
    ];
  };

  return (
    <div
      ref={containerRef}
      className={`color-picker-wrapper ${fullWidth ? 'full-width' : ''} ${className}`}
    >
      {label && (
        <label className="color-picker-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div
        className={`
          color-picker-container
          color-picker-${variant}
          color-picker-${size}
          ${error ? 'error' : ''}
          ${isOpen ? 'open' : ''}
          ${disabled ? 'disabled' : ''}
          ${readOnly ? 'readonly' : ''}
        `}
        onClick={() => !disabled && !readOnly && setIsOpen(!isOpen)}
      >
        <div
          className="color-preview"
          style={{ backgroundColor: currentColor }}
        />
        <span className="color-value">{currentColor}</span>
        <div className="color-picker-actions">
          {!disabled && !readOnly && (
            <button
              type="button"
              className="clear-button"
              onClick={(e) => {
                e.stopPropagation();
                onChange?.('#000000');
              }}
              aria-label="Reset color"
            >
              <X size={16} />
            </button>
          )}
          <ChevronDown
            size={16}
            className={`dropdown-icon ${isOpen ? 'open' : ''}`}
          />
        </div>
      </div>
      {isOpen && (
        <div className="color-picker-dropdown">
          <div
            ref={paletteRef}
            className="color-palette"
            style={{
              backgroundColor: `hsl(${hue}, 100%, 50%)`,
            }}
            onClick={handlePaletteChange}
            onMouseDown={handlePaletteChange}
          >
            <div className="palette-overlay" />
            <div
              className="palette-thumb"
              style={{
                left: `${saturation}%`,
                top: `${100 - lightness}%`,
              }}
            />
          </div>
          <div
            ref={hueRef}
            className="hue-slider"
            onClick={handleHueChange}
            onMouseDown={handleHueChange}
          >
            <div
              className="hue-thumb"
              style={{ left: `${(hue / 360) * 100}%` }}
            />
          </div>
          {alpha && (
            <div
              ref={alphaRef}
              className="alpha-slider"
              style={{
                background: `linear-gradient(to right, transparent, ${currentColor})`,
              }}
              onClick={handleAlphaChange}
              onMouseDown={handleAlphaChange}
            >
              <div
                className="alpha-thumb"
                style={{ left: `${alphaValue * 100}%` }}
              />
            </div>
          )}
          {presetColors.length > 0 && (
            <div className="color-presets">
              {presetColors.map((color, index) => (
                <button
                  key={index}
                  className={`preset-color ${color === currentColor ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const { h, s, l, a } = parseColor(color);
                    setHue(h);
                    setSaturation(s);
                    setLightness(l);
                    setAlphaValue(a);
                    updateColor(h, s, l, a);
                  }}
                  aria-label={`Select color ${color}`}
                >
                  {color === currentColor && <Check size={12} />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {(error || hint) && (
        <div className={`color-picker-message ${error ? 'error' : ''}`}>
          {error || hint}
        </div>
      )}

      <style jsx>{`
        .color-picker-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          position: relative;
        }

        .color-picker-wrapper.full-width {
          width: 100%;
        }

        .color-picker-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--gw-text-secondary);
        }

        .required {
          color: var(--gw-error-500);
          margin-left: 0.25rem;
        }

        .color-picker-container {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          cursor: pointer;
          transition: var(--gw-transition);
        }

        /* Variants */
        .color-picker-outlined {
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          background-color: var(--gw-background);
        }

        .color-picker-outlined.open {
          border-color: var(--gw-primary);
          box-shadow: 0 0 0 2px var(--gw-primary-100);
        }

        .color-picker-filled {
          border: none;
          border-radius: var(--gw-border-radius);
          background-color: var(--gw-background-secondary);
        }

        .color-picker-filled.open {
          background-color: var(--gw-background-tertiary);
        }

        .color-picker-underlined {
          border: none;
          border-bottom: 1px solid var(--gw-border-color);
          border-radius: 0;
          background-color: transparent;
        }

        .color-picker-underlined.open {
          border-bottom-color: var(--gw-primary);
        }

        /* Sizes */
        .color-picker-small {
          min-height: 2rem;
          font-size: 0.875rem;
        }

        .color-picker-medium {
          min-height: 2.5rem;
          font-size: 1rem;
        }

        .color-picker-large {
          min-height: 3rem;
          font-size: 1.125rem;
        }

        /* States */
        .color-picker-container.error {
          border-color: var(--gw-error-500);
        }

        .color-picker-container.error.open {
          box-shadow: 0 0 0 2px var(--gw-error-100);
        }

        .color-picker-container.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background-color: var(--gw-background-secondary);
        }

        .color-picker-container.readonly {
          cursor: default;
          background-color: var(--gw-background-secondary);
        }

        .color-preview {
          width: 1.5rem;
          height: 1.5rem;
          border-radius: var(--gw-border-radius);
          border: 1px solid var(--gw-border-color);
          background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
            linear-gradient(-45deg, #ccc 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #ccc 75%),
            linear-gradient(-45deg, transparent 75%, #ccc 75%);
          background-size: 10px 10px;
          background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
        }

        .color-value {
          flex: 1;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .color-picker-actions {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .clear-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.25rem;
          border: none;
          background: none;
          color: var(--gw-text-secondary);
          cursor: pointer;
          border-radius: var(--gw-border-radius);
          transition: var(--gw-transition);
        }

        .clear-button:hover {
          background-color: var(--gw-background-secondary);
          color: var(--gw-text-primary);
        }

        .dropdown-icon {
          color: var(--gw-text-secondary);
          transition: transform var(--gw-transition);
        }

        .dropdown-icon.open {
          transform: rotate(180deg);
        }

        .color-picker-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 0.25rem;
          padding: 1rem;
          background-color: var(--gw-background);
          border: 1px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          box-shadow: var(--gw-shadow-lg);
          z-index: 10;
          animation: dropdown-slide 0.2s ease-out;
        }

        .color-palette {
          position: relative;
          width: 100%;
          height: 150px;
          border-radius: var(--gw-border-radius);
          margin-bottom: 1rem;
          cursor: crosshair;
        }

        .palette-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            white,
            transparent
          ), linear-gradient(
            to top,
            black,
            transparent
          );
          border-radius: inherit;
        }

        .palette-thumb {
          position: absolute;
          width: 12px;
          height: 12px;
          background-color: white;
          border: 2px solid white;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1),
                    0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .hue-slider {
          position: relative;
          width: 100%;
          height: 12px;
          background: linear-gradient(
            to right,
            #f00 0%,
            #ff0 17%,
            #0f0 33%,
            #0ff 50%,
            #00f 67%,
            #f0f 83%,
            #f00 100%
          );
          border-radius: var(--gw-border-radius);
          margin-bottom: 0.5rem;
          cursor: pointer;
        }

        .hue-thumb {
          position: absolute;
          width: 12px;
          height: 12px;
          background-color: white;
          border: 2px solid white;
          border-radius: 50%;
          transform: translateX(-50%);
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1),
                    0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .alpha-slider {
          position: relative;
          width: 100%;
          height: 12px;
          background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
            linear-gradient(-45deg, #ccc 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #ccc 75%),
            linear-gradient(-45deg, transparent 75%, #ccc 75%);
          background-size: 10px 10px;
          background-position: 0 0, 0 5px, 5px -5px, -5px 0px;
          border-radius: var(--gw-border-radius);
          margin-bottom: 1rem;
          cursor: pointer;
        }

        .alpha-thumb {
          position: absolute;
          width: 12px;
          height: 12px;
          background-color: white;
          border: 2px solid white;
          border-radius: 50%;
          transform: translateX(-50%);
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1),
                    0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .color-presets {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(24px, 1fr));
          gap: 0.5rem;
          padding-top: 0.5rem;
          border-top: 1px solid var(--gw-border-color);
        }

        .preset-color {
          position: relative;
          width: 24px;
          height: 24px;
          padding: 0;
          border: 2px solid var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          cursor: pointer;
          transition: transform var(--gw-transition);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .preset-color:hover {
          transform: scale(1.1);
        }

        .preset-color.selected {
          border-color: var(--gw-primary);
        }

        .color-picker-message {
          font-size: 0.75rem;
          color: var(--gw-text-secondary);
        }

        .color-picker-message.error {
          color: var(--gw-error-500);
        }

        @keyframes dropdown-slide {
          from {
            opacity: 0;
            transform: translateY(-0.5rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Material Design styles */
        [data-design-system="material"] .color-picker-wrapper {
          font-family: var(--gw-font-family);
        }

        [data-design-system="material"] .color-picker-outlined {
          border-radius: 4px;
        }

        [data-design-system="material"] .color-picker-filled {
          border-radius: 4px 4px 0 0;
        }

        [data-design-system="material"] .color-picker-underlined {
          border-bottom-width: 2px;
        }

        [data-design-system="material"] .color-picker-dropdown {
          border-radius: 4px;
          box-shadow: var(--gw-shadow-lg);
        }

        [data-design-system="material"] .clear-button {
          border-radius: 50%;
        }

        [data-design-system="material"] .preset-color {
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};