import React, { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';

interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'loading'> {
  src: string;
  alt: string;
  aspectRatio?: '1/1' | '4/3' | '16/9' | '21/9' | string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  loading?: 'eager' | 'lazy';
  fallback?: React.ReactNode;
  showLoadingIndicator?: boolean;
  showErrorIndicator?: boolean;
  blur?: boolean;
  overlay?: React.ReactNode;
  rounded?: boolean | 'sm' | 'md' | 'lg' | 'full';
  variant?: 'default' | 'elevated' | 'bordered';
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const Image: React.FC<ImageProps> = ({
  src,
  alt,
  aspectRatio,
  objectFit = 'cover',
  loading = 'lazy',
  fallback,
  showLoadingIndicator = true,
  showErrorIndicator = true,
  blur = false,
  overlay,
  rounded = false,
  variant = 'default',
  className = '',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(!loading || loading === 'eager');

  useEffect(() => {
    if (loading === 'lazy') {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { rootMargin: '50px' }
      );

      const element = document.getElementById(`image-${src}`);
      if (element) {
        observer.observe(element);
      }

      return () => observer.disconnect();
    }
  }, [src, loading]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const getRoundedClass = () => {
    if (typeof rounded === 'boolean') {
      return rounded ? 'rounded' : '';
    }
    return `rounded-${rounded}`;
  };

  const renderPlaceholder = () => {
    if (hasError && showErrorIndicator) {
      return (
        <div className="image-placeholder error">
          {fallback || (
            <>
              <ImageOff size={24} />
              <span>Failed to load image</span>
            </>
          )}
        </div>
      );
    }

    if (isLoading && showLoadingIndicator) {
      return (
        <div className="image-placeholder loading">
          <div className="loading-spinner" />
        </div>
      );
    }

    return null;
  };

  return (
    <div
      id={`image-${src}`}
      className={`
        image-wrapper
        image-${variant}
        ${getRoundedClass()}
        ${className}
      `}
      style={{ aspectRatio }}
    >
      {isVisible && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`
            image
            ${isLoading ? 'loading' : ''}
            ${hasError ? 'error' : ''}
            ${blur ? 'blur' : ''}
          `}
          style={{ objectFit }}
          {...props}
        />
      )}
      {renderPlaceholder()}
      {overlay && <div className="image-overlay">{overlay}</div>}

      <style jsx>{`
        .image-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        /* Variants */
        .image-elevated {
          box-shadow: var(--gw-shadow-md);
        }

        .image-bordered {
          border: 1px solid var(--gw-border-color);
        }

        /* Rounded corners */
        .rounded {
          border-radius: var(--gw-border-radius);
        }

        .rounded-sm {
          border-radius: var(--gw-border-radius-sm);
        }

        .rounded-md {
          border-radius: var(--gw-border-radius-md);
        }

        .rounded-lg {
          border-radius: var(--gw-border-radius-lg);
        }

        .rounded-full {
          border-radius: 9999px;
        }

        .image {
          width: 100%;
          height: 100%;
          transition: opacity var(--gw-transition),
                    filter var(--gw-transition);
        }

        .image.loading {
          opacity: 0;
        }

        .image.error {
          display: none;
        }

        .image.blur {
          filter: blur(8px);
        }

        .image-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background-color: var(--gw-background-secondary);
          color: var(--gw-text-secondary);
          font-size: 0.875rem;
        }

        .image-placeholder.error {
          background-color: var(--gw-error-50);
          color: var(--gw-error-500);
        }

        .loading-spinner {
          width: 2rem;
          height: 2rem;
          border: 2px solid var(--gw-background-tertiary);
          border-top-color: var(--gw-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.3);
          opacity: 0;
          transition: opacity var(--gw-transition);
        }

        .image-wrapper:hover .image-overlay {
          opacity: 1;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Material Design styles */
        [data-design-system="material"] .image-wrapper {
          font-family: var(--gw-font-family);
        }

        [data-design-system="material"] .image-elevated {
          box-shadow: var(--gw-shadow-lg);
        }

        [data-design-system="material"] .rounded {
          border-radius: 4px;
        }

        [data-design-system="material"] .rounded-sm {
          border-radius: 2px;
        }

        [data-design-system="material"] .rounded-md {
          border-radius: 8px;
        }

        [data-design-system="material"] .rounded-lg {
          border-radius: 16px;
        }

        [data-design-system="material"] .loading-spinner {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
};