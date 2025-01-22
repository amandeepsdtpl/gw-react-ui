import React from 'react';
import * as LucideIcons from 'lucide-react';

type IconName = keyof typeof LucideIcons;

interface IconProps {
  name: IconName;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  className?: string;
  variant?: 'default' | 'solid' | 'outline' | 'dual';
  rotate?: 0 | 90 | 180 | 270;
  flip?: 'horizontal' | 'vertical' | 'both';
  spin?: boolean;
  onClick?: () => void;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  strokeWidth = 2,
  className = '',
  variant = 'default',
  rotate = 0,
  flip,
  spin = false,
  onClick,
}) => {
  const IconComponent = LucideIcons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Lucide icons`);
    return null;
  }

  const getFlipTransform = () => {
    switch (flip) {
      case 'horizontal':
        return 'scaleX(-1)';
      case 'vertical':
        return 'scaleY(-1)';
      case 'both':
        return 'scale(-1)';
      default:
        return 'none';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'solid':
        return {
          fill: 'currentColor',
          stroke: 'none',
        };
      case 'outline':
        return {
          fill: 'none',
          stroke: 'currentColor',
        };
      case 'dual':
        return {
          fill: 'currentColor',
          stroke: 'currentColor',
          strokeOpacity: 0.4,
        };
      default:
        return {
          fill: 'none',
          stroke: 'currentColor',
        };
    }
  };

  return (
    <div
      className={`icon icon-${variant} ${spin ? 'spin' : ''} ${className}`}
      onClick={onClick}
      style={{
        color,
        width: size,
        height: size,
        transform: `rotate(${rotate}deg) ${getFlipTransform()}`,
        cursor: onClick ? 'pointer' : undefined,
      }}
    >
      <IconComponent
        size={size}
        strokeWidth={strokeWidth}
        style={getVariantStyles()}
      />

      <style jsx>{`
        .icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          vertical-align: middle;
          transition: var(--gw-transition);
        }

        .icon:hover {
          opacity: 0.8;
        }

        .icon.spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Variant styles */
        .icon-solid {
          color: var(--gw-text-primary);
        }

        .icon-outline {
          color: var(--gw-text-secondary);
        }

        .icon-dual {
          color: var(--gw-primary);
        }

        /* Material Design styles */
        [data-design-system="material"] .icon {
          font-family: var(--gw-font-family);
        }

        [data-design-system="material"] .icon-solid {
          transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        [data-design-system="material"] .icon-solid:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};