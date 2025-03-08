
import { useState, useEffect } from 'react';

export type ColorTheme = 'light' | 'dark';

export function useThemeDetection() {
  const [theme, setTheme] = useState<ColorTheme>('dark');

  useEffect(() => {
    // Check if user prefers dark mode
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial theme
    setTheme(darkModeMediaQuery.matches ? 'dark' : 'light');
    
    // Add listener for theme changes
    const themeChangeHandler = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };
    
    darkModeMediaQuery.addEventListener('change', themeChangeHandler);
    
    // Clean up
    return () => {
      darkModeMediaQuery.removeEventListener('change', themeChangeHandler);
    };
  }, []);

  return theme;
}
