
import { useState, useEffect } from 'react';

export type ColorTheme = 'light' | 'dark';

export function useThemeDetection() {
  const [theme, setTheme] = useState<ColorTheme>('dark');

  useEffect(() => {
    // First check localStorage for saved preference
    const savedTheme = localStorage.getItem('color-theme') as ColorTheme | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(savedTheme);
    } else {
      // If no saved preference, check system preference
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const initialTheme = darkModeMediaQuery.matches ? 'dark' : 'light';
      
      // Set initial theme
      setTheme(initialTheme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(initialTheme);
      
      // Save to localStorage
      localStorage.setItem('color-theme', initialTheme);
    }
    
    // Add listener for theme changes in system preferences
    const themeChangeHandler = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setTheme(newTheme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newTheme);
      localStorage.setItem('color-theme', newTheme);
    };
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', themeChangeHandler);
    
    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', themeChangeHandler);
    };
  }, []);

  // Function to manually toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    localStorage.setItem('color-theme', newTheme);
  };

  return { theme, toggleTheme };
}
