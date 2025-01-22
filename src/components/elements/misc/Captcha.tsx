import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

interface CaptchaProps {
  onVerify: (isValid: boolean) => void;
  length?: number;
  caseSensitive?: boolean;
  includeNumbers?: boolean;
  refreshable?: boolean;
  className?: string;
}

export const Captcha: React.FC<CaptchaProps> = ({
  onVerify,
  length = 6,
  caseSensitive = false,
  includeNumbers = true,
  refreshable = true,
  className = '',
}) => {
  const [captchaText, setCaptchaText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);

  const generateCaptchaText = useCallback(() => {
    const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ' + // Excluding I and O to avoid confusion
      (includeNumbers ? '23456789' : ''); // Excluding 0, 1 for clarity
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  }, [length, includeNumbers]);

  const drawCaptcha = useCallback((text: string) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise (dots)
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.2)`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        Math.random() * 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Add lines
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.2)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Draw text
    const fontSize = Math.min(canvas.height * 0.8, canvas.width / text.length);
    ctx.font = `${fontSize}px 'Courier New', monospace`;
    ctx.textBaseline = 'middle';

    // Draw each character with random rotation and position
    const charWidth = canvas.width / (text.length + 1);
    text.split('').forEach((char, i) => {
      ctx.save();
      const x = (i + 1) * charWidth;
      const y = canvas.height / 2 + (Math.random() * 10 - 5);
      const rotation = (Math.random() * 30 - 15) * Math.PI / 180;
      
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      // Random color for each character
      const hue = Math.random() * 360;
      ctx.fillStyle = `hsl(${hue}, 50%, 30%)`;
      ctx.fillText(char, -fontSize/3, 0);
      
      ctx.restore();
    });
  }, [canvas]);

  const refreshCaptcha = useCallback(() => {
    const newText = generateCaptchaText();
    setCaptchaText(newText);
    setUserInput('');
    onVerify(false);
  }, [generateCaptchaText, onVerify]);

  useEffect(() => {
    refreshCaptcha();
  }, [refreshCaptcha]);

  useEffect(() => {
    if (captchaText) {
      drawCaptcha(captchaText);
    }
  }, [captchaText, drawCaptcha]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
    
    const isValid = caseSensitive
      ? value === captchaText
      : value.toUpperCase() === captchaText.toUpperCase();
    
    onVerify(isValid);
  };

  return (
    <div className={`captcha ${className}`}>
      <div className="captcha-container">
        <canvas
          ref={setCanvas}
          width={200}
          height={60}
          className="captcha-canvas"
        />
        {refreshable && (
          <button
            className="captcha-refresh"
            onClick={refreshCaptcha}
            type="button"
            aria-label="Refresh captcha"
          >
            <RefreshCw size={20} />
          </button>
        )}
      </div>
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Enter the code above"
        className="captcha-input"
        maxLength={length}
      />

      <style jsx>{`
        .captcha {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          max-width: 200px;
        }

        .captcha-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .captcha-canvas {
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius);
          background-color: var(--background);
        }

        .captcha-refresh {
          position: absolute;
          right: 0.5rem;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.25rem;
          border-radius: var(--border-radius);
          transition: var(--transition);
        }

        .captcha-refresh:hover {
          color: var(--text-primary);
          background-color: rgba(0, 0, 0, 0.05);
        }

        .captcha-input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius);
          font-size: 1rem;
          text-align: center;
          letter-spacing: 0.25em;
          transition: var(--transition);
        }

        .captcha-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 1px var(--primary-color);
        }
      `}</style>
    </div>
  );
};