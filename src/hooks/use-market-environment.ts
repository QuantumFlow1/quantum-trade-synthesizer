
import { ColorTheme } from '@/hooks/use-theme-detection';

// This hook returns an appropriate environment preset based on market sentiment and theme
export const useMarketEnvironment = (
  sentiment: 'bullish' | 'bearish' | 'neutral',
  theme: ColorTheme
): 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby' => {
  
  // Map sentiment and theme to environment preset
  if (theme === 'dark') {
    switch (sentiment) {
      case 'bullish': return 'city';
      case 'bearish': return 'night';
      default: return 'warehouse';
    }
  } else {
    switch (sentiment) {
      case 'bullish': return 'park';
      case 'bearish': return 'sunset';
      default: return 'dawn';
    }
  }
};
