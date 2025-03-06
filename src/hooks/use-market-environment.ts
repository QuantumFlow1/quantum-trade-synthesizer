
import { useMemo } from "react";
import { ColorTheme } from "@/hooks/use-theme-detection";

export function useMarketEnvironment(
  sentiment: 'bullish' | 'bearish' | 'neutral',
  theme: ColorTheme
): 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby' {
  return useMemo(() => {
    // Map sentiment and theme to environment presets
    if (theme === 'dark') {
      if (sentiment === 'bullish') return 'city';
      if (sentiment === 'bearish') return 'night';
      return 'studio';
    } else {
      if (sentiment === 'bullish') return 'dawn';
      if (sentiment === 'bearish') return 'sunset';
      return 'park';
    }
  }, [sentiment, theme]);
}
