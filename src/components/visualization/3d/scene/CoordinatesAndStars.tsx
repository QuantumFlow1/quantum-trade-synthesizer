
import { Stars } from "@react-three/drei";
import { ColorTheme } from "@/hooks/use-theme-detection";
import { CoordinateSystem } from "../CoordinateSystem";
import { MarketSentiment } from "../MarketSentiment";
import { SentimentType } from "../MarketSentiment";

interface CoordinatesAndStarsProps {
  theme: ColorTheme;
  sentiment: SentimentType;
  optimizationLevel?: 'normal' | 'aggressive';
}

export const CoordinatesAndStars = ({ theme, sentiment, optimizationLevel = 'normal' }: CoordinatesAndStarsProps) => {
  // Optimize stars based on optimization level
  const starsCount = optimizationLevel === 'aggressive' ? 200 : 1000;
  const starsFactor = optimizationLevel === 'aggressive' ? 2 : 4;
  
  return (
    <>
      {theme === 'dark' && (
        <Stars 
          radius={100} 
          depth={50} 
          count={starsCount} 
          factor={starsFactor} 
          fade 
          speed={optimizationLevel === 'aggressive' ? 0.5 : 1} 
        />
      )}
      
      <MarketSentiment sentiment={sentiment} theme={theme} />
      
      <CoordinateSystem theme={theme} />
    </>
  );
};
