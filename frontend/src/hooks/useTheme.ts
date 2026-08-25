import { useContext, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function useLockLightTheme() {
  const { setLockLight } = useTheme();

  useEffect(() => {
    setLockLight(true);
    const root = window.document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    root.setAttribute('data-theme', 'light');
    root.style.colorScheme = 'light';

    return () => {
      setLockLight(false);
      root.removeAttribute('data-theme');
    };
  }, [setLockLight]);
}
