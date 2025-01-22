import React, { useState, useRef } from 'react';
import { Upload, X, File, Image, FileText, Film, Music, Archive } from 'lucide-react';

interface FileInputProps {
  value?: File | File[];
  onChange?: (files: File | File[]) => void;
  label?: string;
  error?: string;
  hint?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  showPreview?: boolean;
  variant?: 'default' | 'compact' | 'card';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  className?: string;
  onError?: (error: string) => void;
}

export const FileInput: React.FC<FileInputProps> = ({
  value,
  onChange,
  label,
  error,
  hint,
  accept,
  multiple = false,
  maxSize,
  maxFiles = 10,
  disabled = false,
  readOnly = false,
  required = false,
  showPreview = true,
  variant = 'default',
  size = 'medium',
  fullWidth = false,
  className = '',
  onError,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const files = Array.isArray(value) ? value : value ? [value] : [];

  const getFileIcon = (file: File) => {
    const type = file.type.split('/')[0];
    switch (type) {
      case 'image':
        return <Image size={24} />;
      case 'video':
        return <Film size={24} />;
      case 'audio':
        return <Music size={24} />;
      case 'application':
        return file.type.includes('zip') || file.type.includes('compressed') ? 
          <Archive size={24} /> : <FileText size={24} />;
      default:
        return <File size={24} />;
    }
  };

  const getFilePreview = (file: File) => {
    if (!showPreview) return null;

    if (file.type.startsWith('image/')) {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="file-preview-image"
          onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
        />
      );
    }

    return getFileIcon(file);
  };

  const validateFile = (file: File): boolean => {
    if (accept) {
      const acceptedTypes = accept.split(',').map(type => type.trim());
      const fileType = file.type;
      const fileExtension = `.${file.name.split('.').pop()}`;
      
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return type.toLowerCase() === fileExtension.toLowerCase();
        }
        if (type.endsWith('/*')) {
          return fileType.startsWith(type.slice(0, -2));
        }
        return type === fileType;
      });

      if (!isAccepted) {
        onError?.(`File type not accepted: ${file.name}`);
        return false;
      }
    }

    if (maxSize && file.size > maxSize) {
      onError?.(`File too large: ${file.name}`);
      return false;
    }

    return true;
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles || disabled || readOnly) return;

    const validFiles: File[] = [];
    const currentFiles = multiple ? files : [];

    for (let i = 0; i < newFiles.length; i++) {
      if (validFiles.length + currentFiles.length >= maxFiles) {
        onError?.(`Maximum number of files (${maxFiles}) exceeded`);
        break;
      }

      const file = newFiles[i];
      if (validateFile(file)) {
        validFiles.push(file);
      }
    }

    if (validFiles.length > 0) {
      const updatedFiles = multiple ? [...currentFiles, ...validFiles] : validFiles[0];
      onChange?.(updatedFiles);
    }
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !readOnly) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !readOnly) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !readOnly) {
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || readOnly) return;

    if (multiple) {
      const newFiles = files.filter((_, i) => i !== index);
      onChange?.(newFiles);
    } else {
      onChange?.(undefined as any);
    }
  };

  const handleClick = () => {
    if (!disabled && !readOnly) {
      inputRef.current?.click();
    }
  };

  return (
    <div className={`file-input-wrapper ${fullWidth ? 'full-width' : ''} ${className}`}>
      {label && (
        <label className="file-input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div
        ref={dropZoneRef}
        className={`
          file-input
          file-input-${variant}
          file-input-${size}
          ${isDragging ? 'dragging' : ''}
          ${error ? 'error' : ''}
          ${disabled ? 'disabled' : ''}
          ${readOnly ? 'readonly' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          disabled={disabled}
          required={required}
          className="file-input-hidden"
          tabIndex={-1}
        />
        
        {files.length === 0 ? (
          <div className="file-input-placeholder">
            <Upload size={24} className="upload-icon" />
            <div className="placeholder-text">
              <span className="primary-text">
                {multiple ? 'Drop files here or click to upload' : 'Drop a file here or click to upload'}
              </span>
              {accept && (
                <span className="secondary-text">
                  Accepted formats: {accept}
                </span>
              )}
              {maxSize && (
                <span className="secondary-text">
                  Maximum size: {(maxSize / (1024 * 1024)).toFixed(1)} MB
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="file-list">
            {files.map((file, index) => (
              <div key={index} className="file-item">
                <div className="file-preview">
                  {getFilePreview(file)}
                </div>
                <div className="file-info">
                  <span className="file-name">{file.name}</span>
                  <span className="file-size">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                {!readOnly && (
                  <button
                    type="button"
                    className="remove-file"
                    onClick={(e) => handleRemoveFile(index, e)}
                    aria-label={`Remove ${file.name}`}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {(error || hint) && (
        <div className={`file-input-message ${error ? 'error' : ''}`}>
          {error || hint}
        </div>
      )}

      <style jsx>{`
        .file-input-wrapper {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .file-input-wrapper.full-width {
          width: 100%;
        }

        .file-input-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--gw-text-secondary);
        }

        .required {
          color: var(--gw-error-500);
          margin-left: 0.25rem;
        }

        .file-input {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          border: 2px dashed var(--gw-border-color);
          border-radius: var(--gw-border-radius);
          background-color: var(--gw-background);
          cursor: pointer;
          transition: var(--gw-transition);
        }

        .file-input:hover:not(.disabled):not(.readonly) {
          border-color: var(--gw-primary);
          background-color: var(--gw-background-secondary);
        }

        .file-input.dragging {
          border-color: var(--gw-primary);
          background-color: var(--gw-primary-50);
        }

        .file-input.error {
          border-color: var(--gw-error-500);
        }

        .file-input.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background-color: var(--gw-background-secondary);
        }

        .file-input.readonly {
          cursor: default;
          background-color: var(--gw-background-secondary);
        }

        .file-input-hidden {
          position: absolute;
          width: 0;
          height: 0;
          opacity: 0;
        }

        /* Variants */
        .file-input-compact {
          padding: 0.5rem;
        }

        .file-input-card {
          border-style: solid;
          box-shadow: var(--gw-shadow-sm);
        }

        /* Sizes */
        .file-input-small {
          min-height: 100px;
          font-size: 0.875rem;
        }

        .file-input-medium {
          min-height: 150px;
          font-size: 1rem;
        }

        .file-input-large {
          min-height: 200px;
          font-size: 1.125rem;
        }

        .file-input-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          text-align: center;
        }

        .upload-icon {
          color: var(--gw-text-secondary);
        }

        .placeholder-text {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .primary-text {
          color: var(--gw-text-primary);
          font-weight: 500;
        }

        .secondary-text {
          color: var(--gw-text-secondary);
          font-size: 0.875rem;
        }

        .file-list {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .file-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem;
          background-color: var(--gw-background-secondary);
          border-radius: var(--gw-border-radius);
        }

        .file-preview {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          background-color: var(--gw-background);
          border-radius: var(--gw-border-radius);
          color: var(--gw-text-secondary);
          overflow: hidden;
        }

        .file-preview-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .file-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .file-name {
          color: var(--gw-text-primary);
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .file-size {
          color: var(--gw-text-secondary);
          font-size: 0.75rem;
        }

        .remove-file {
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

        .remove-file:hover {
          background-color: var(--gw-background);
          color: var(--gw-error-500);
        }

        .file-input-message {
          font-size: 0.75rem;
          color: var(--gw-text-secondary);
        }

        .file-input-message.error {
          color: var(--gw-error-500);
        }

        /* Material Design styles */
        [data-design-system="material"] .file-input-wrapper {
          font-family: var(--gw-font-family);
        }

        [data-design-system="material"] .file-input {
          border-radius: 4px;
        }

        [data-design-system="material"] .file-input-card {
          box-shadow: var(--gw-shadow-md);
        }

        [data-design-system="material"] .file-item {
          box-shadow: var(--gw-shadow-sm);
        }

        [data-design-system="material"] .remove-file {
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};