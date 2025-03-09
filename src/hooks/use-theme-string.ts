
import { useThemeDetection } from './use-theme-detection';
import { ColorTheme } from './use-theme-detection';

/**
 * A wrapper hook that maintains backward compatibility with components
 * that expect the theme as a string instead of an object.
 * This is primarily for 3D visualization components.
 */
export function useThemeString(): ColorTheme {
  const { theme } = useThemeDetection();
  return theme;
}
