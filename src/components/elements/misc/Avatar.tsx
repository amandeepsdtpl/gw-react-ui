import React from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'small' | 'medium' | 'large' | number;
  shape?: 'circle' | 'square';
  fallback?: React.ReactNode;
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'medium',
  shape = 'circle',
  fallback,
  status,
  className = '',
}) => {
  const [error, setError] = React.useState(false);

  const getSizeValue = () => {
    if (typeof size === 'number') return size;
    switch (size) {
      case 'small': return 32;
      case 'large': return 64;
      default: return 40;
    }
  };

  const sizeValue = getSizeValue();

  const renderFallback = () => {
    if (fallback) return fallback;
    return (
      <div
        className="avatar-fallback"
        style={{
          width: sizeValue,
          height: sizeValue,
        }}
      >
        <User size={sizeValue * 0.6} />
      </div>
    );
  };

  return (
    <div
      className={`avatar avatar-${shape} ${className}`}
      style={{
        width: sizeValue,
        height: sizeValue,
      }}
    >
      {!error && src ? (
        <img
          src={src}
          alt={alt || 'Avatar'}
          onError={() => setError(true)}
          className="avatar-image"
        />
      ) : (
        renderFallback()
      )}
      {status && <span className={`avatar-status status-${status}`} />}
    </div>
  );
};