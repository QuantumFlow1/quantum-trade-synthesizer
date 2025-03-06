
import { Stars } from "@react-three/drei";
import { ColorTheme } from "@/hooks/use-theme-detection";
import { CoordinateSystem } from "../CoordinateSystem";
import { MarketSentiment } from "../MarketSentiment";
import { SentimentType } from "../MarketSentiment";

interface CoordinatesAndStarsProps {
  theme: ColorTheme;
  sentiment: SentimentType;
}

export const CoordinatesAndStars = ({ theme, sentiment }: CoordinatesAndStarsProps) => {
  return (
    <>
      {theme === 'dark' && (
        <Stars radius={100} depth={50} count={1000} factor={4} fade speed={1} />
      )}
      
      <MarketSentiment sentiment={sentiment} theme={theme} />
      
      <CoordinateSystem theme={theme} />
    </>
  );
};
