/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

type Theme = 'dark' | 'light' | 'system';

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isLockedLight: boolean;
  setLockLight: (lock: boolean) => void;
}

const initialState: ThemeProviderState = {
  theme: 'light',
  setTheme: () => null,
  isLockedLight: true,
  setLockLight: () => null,
};

export const ThemeContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  // Dark mode temporarily disabled post-login — pending full token audit
  const [theme, setTheme] = useState<Theme>('light');
  const [isLockedLight, setIsLockedLight] = useState<boolean>(true);

  const setLockLight = useCallback((lock: boolean) => {
    setIsLockedLight(lock);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;

    // Dark mode temporarily disabled post-login — pending full token audit
    // Always enforce light theme on root element across the entire application
    const applyTheme = () => {
      root.classList.remove('dark');
      root.classList.add('light');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    };

    applyTheme();
  }, [theme, isLockedLight]);

  const value = {
    theme,
    setTheme: (_newTheme: Theme) => {
      // Dark mode temporarily disabled post-login — pending full token audit
      localStorage.setItem(storageKey, 'light');
      setTheme('light');
    },
    isLockedLight,
    setLockLight,
  };

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
