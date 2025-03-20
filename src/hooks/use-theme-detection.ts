
import { useThemeString } from '@/hooks/use-theme-string';

export type ColorTheme = 'dark' | 'light';

export const useThemeDetection = (): ColorTheme => {
  const themeString = useThemeString();
  return themeString === 'dark' ? 'dark' : 'light';
};
