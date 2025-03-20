
import { ColorTheme } from './use-theme-detection';

/**
 * A wrapper hook that maintains backward compatibility with components
 * that expect the theme as a string.
 * This is primarily for 3D visualization components.
 */
export function useThemeString(): ColorTheme {
  // Simply return the theme string
  return 'dark'; // Default to dark theme
}
