import React from 'react';
import { Sun, Moon, Palette, Monitor } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { mode, setMode, designSystem, setDesignSystem } = useTheme();

  return (
    <div className={`theme-toggle ${className}`}>
      <div className="theme-toggle-group">
        <button
          className={`theme-toggle-btn ${mode === 'light' ? 'active' : ''}`}
          onClick={() => setMode('light')}
          title="Light Mode"
        >
          <Sun size={20} />
        </button>
        <button
          className={`theme-toggle-btn ${mode === 'dark' ? 'active' : ''}`}
          onClick={() => setMode('dark')}
          title="Dark Mode"
        >
          <Moon size={20} />
        </button>
        <button
          className={`theme-toggle-btn ${mode === 'high-contrast' ? 'active' : ''}`}
          onClick={() => setMode('high-contrast')}
          title="High Contrast"
        >
          <Monitor size={20} />
        </button>
      </div>

      <div className="theme-toggle-group">
        <button
          className={`theme-toggle-btn ${designSystem === 'default' ? 'active' : ''}`}
          onClick={() => setDesignSystem('default')}
          title="Default Design"
        >
          Default
        </button>
        <button
          className={`theme-toggle-btn ${designSystem === 'material' ? 'active' : ''}`}
          onClick={() => setDesignSystem('material')}
          title="Material Design"
        >
          Material
        </button>
      </div>

      <style jsx>{`
        .theme-toggle {
          display: flex;
          gap: 1rem;
          padding: 0.5rem;
          background-color: var(--gw-background-secondary);
          border-radius: var(--gw-border-radius);
        }

        .theme-toggle-group {
          display: flex;
          gap: 0.25rem;
        }

        .theme-toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem;
          border: none;
          background: none;
          color: var(--gw-text-secondary);
          border-radius: var(--gw-border-radius);
          cursor: pointer;
          transition: var(--gw-transition);
        }

        .theme-toggle-btn:hover {
          background-color: var(--gw-background-tertiary);
          color: var(--gw-text-primary);
        }

        .theme-toggle-btn.active {
          background-color: var(--gw-primary);
          color: white;
        }
      `}</style>
    </div>
  );
};