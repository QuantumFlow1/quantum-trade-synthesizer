
import { useState, useEffect } from 'react';

export type ColorTheme = 'dark' | 'light';

export function useThemeDetection(): ColorTheme {
  const [theme, setTheme] = useState<ColorTheme>('dark');

  useEffect(() => {
    // Check if document is defined (browser environment)
    if (typeof document !== 'undefined') {
      // Check if dark class is present on html element
      const isDarkMode = document.documentElement.classList.contains('dark');
      setTheme(isDarkMode ? 'dark' : 'light');

      // Listen for theme changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'class'
          ) {
            const isDark = document.documentElement.classList.contains('dark');
            setTheme(isDark ? 'dark' : 'light');
          }
        });
      });

      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  return theme;
}
