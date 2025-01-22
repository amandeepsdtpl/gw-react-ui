import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SplitButtonOption {
  id: string;
  label: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

interface SplitButtonProps {
  mainOption: SplitButtonOption;
  options: SplitButtonOption[];
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  disabled?: boolean;
}

export const SplitButton: React.FC<SplitButtonProps> = ({
  mainOption,
  options,
  variant = 'primary',
  size = 'medium',
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMainClick = () => {
    if (!disabled) {
      mainOption.onClick();
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (option: SplitButtonOption) => {
    if (!option.disabled) {
      option.onClick();
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={buttonRef}
      className={`split-button split-button-${variant} split-button-${size} ${
        disabled ? 'disabled' : ''
      } ${className}`}
    >
      <button
        className="split-button-main"
        onClick={handleMainClick}
        disabled={disabled || mainOption.disabled}
      >
        {mainOption.label}
      </button>
      <button
        className="split-button-toggle"
        onClick={handleToggle}
        disabled={disabled}
      >
        <ChevronDown size={16} />
      </button>
      {isOpen && !disabled && (
        <div className="split-button-dropdown">
          {options.map((option) => (
            <button
              key={option.id}
              className={`split-button-option ${option.disabled ? 'disabled' : ''}`}
              onClick={() => handleOptionClick(option)}
              disabled={option.disabled}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};