
import { useMemo } from "react";
import { ColorTheme } from "@/hooks/use-theme-detection";
import { SentimentType } from "@/components/visualization/3d/MarketSentiment";

export function useMarketEnvironment(marketSentiment: SentimentType, theme: ColorTheme) {
  const environmentPreset = useMemo(() => {
    if (theme === 'dark') {
      switch (marketSentiment) {
        case "very-bullish": return "night";
        case "bullish": return "sunset";
        case "very-bearish": return "dawn";
        case "bearish": return "warehouse";
        default: return "night";
      }
    } else {
      switch (marketSentiment) {
        case "very-bullish": return "sunset";
        case "bullish": return "park";
        case "very-bearish": return "dawn";
        case "bearish": return "city";
        default: return "park";
      }
    }
  }, [marketSentiment, theme]);
  
  return environmentPreset;
}
