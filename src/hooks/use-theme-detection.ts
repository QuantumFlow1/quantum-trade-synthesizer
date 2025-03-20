
export type ColorTheme = 'dark' | 'light';

export const useThemeDetection = (): ColorTheme => {
  // For simplicity, we'll just return a hardcoded theme
  // In a real application, this would detect the system/user preference
  return 'dark';
};
