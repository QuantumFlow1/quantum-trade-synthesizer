import { useThemeDetection } from './use-theme-detection';

// This hook extracts just the theme name as a string from the useTheme hook
export const useThemeString = (): string => {
  const { theme } = useThemeDetection();
  
  // If theme is an object (from the context), extract just the string value
  if (typeof theme === 'object' && theme !== null && 'theme' in theme) {
    return (theme as any).theme;
  }
  
  // Otherwise return the theme as is
  return theme ? theme.toString() : 'light'; // Default to light if theme is null
};
