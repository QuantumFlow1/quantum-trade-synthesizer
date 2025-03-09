import { useTheme } from '@/hooks/useTheme';

// This hook extracts just the theme name as a string from the useTheme hook
export const useThemeString = (): string => {
  const { theme } = useTheme();
  
  // If theme is an object (from the context), extract just the string value
  if (typeof theme === 'object' && theme !== null && 'theme' in theme) {
    return (theme as any).theme;
  }
  
  // Otherwise return the theme as is
  return theme as string;
};
