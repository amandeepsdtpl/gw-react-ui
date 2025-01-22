import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark' | 'high-contrast' | 'sepia' | 'nord';
type DesignSystem = 'default' | 'material';

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  designSystem: DesignSystem;
  setDesignSystem: (system: DesignSystem) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  setMode: () => {},
  designSystem: 'default',
  setDesignSystem: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
  defaultDesignSystem?: DesignSystem;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultMode = 'light',
  defaultDesignSystem = 'default',
}) => {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);
  const [designSystem, setDesignSystem] = useState<DesignSystem>(defaultDesignSystem);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
    document.documentElement.setAttribute('data-design-system', designSystem);
  }, [mode, designSystem]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, designSystem, setDesignSystem }}>
      {children}
    </ThemeContext.Provider>
  );
};