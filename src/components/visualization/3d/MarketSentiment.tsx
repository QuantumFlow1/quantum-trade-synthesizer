
import { Text } from "@react-three/drei";
import { ColorTheme } from "@/hooks/use-theme-detection";

export type SentimentType = "very-bullish" | "bullish" | "neutral" | "bearish" | "very-bearish";

interface MarketSentimentProps {
  sentiment: SentimentType;
  theme: ColorTheme;
}

export const MarketSentiment = ({ sentiment, theme }: MarketSentimentProps) => {
  const getSentimentColor = () => {
    if (sentiment.includes("bullish")) {
      return theme === 'dark' ? "#10b981" : "#059669";
    } else if (sentiment.includes("bearish")) {
      return theme === 'dark' ? "#ef4444" : "#dc2626";
    }
    return theme === 'dark' ? "#ffffff" : "#000000";
  };
  
  const getSentimentText = () => {
    switch (sentiment) {
      case "very-bullish": return "VERY BULLISH";
      case "bullish": return "BULLISH";
      case "very-bearish": return "VERY BEARISH";
      case "bearish": return "BEARISH";
      default: return "NEUTRAL";
    }
  };
  
  return (
    <group position={[0, 8, -10]}>
      <Text
        color={getSentimentColor()}
        fontSize={1.5}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor={theme === 'dark' ? "#000000" : "#ffffff"}
      >
        {getSentimentText()}
      </Text>
    </group>
  );
};
