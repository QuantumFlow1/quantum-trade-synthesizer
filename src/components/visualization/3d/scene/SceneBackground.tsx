
import { ColorTheme } from "@/hooks/use-theme-detection";
import { CoordinatesAndStars } from "./CoordinatesAndStars";
import { EnvironmentEffects } from "./EnvironmentEffects";
import { OptimizationLevel, EnvironmentPreset } from "./SceneContainer";

interface SceneBackgroundProps {
  theme: ColorTheme;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  showStars: boolean;
  optimizationLevel: OptimizationLevel;
  environmentPreset: EnvironmentPreset;
}

export const SceneBackground = ({ 
  theme, 
  sentiment,
  showStars,
  optimizationLevel,
  environmentPreset
}: SceneBackgroundProps) => {
  // Convert optimization level to the format needed by child components
  const childOptimizationLevel = optimizationLevel === 'extreme' ? 'aggressive' : optimizationLevel;
  
  return (
    <>
      {showStars && (
        <CoordinatesAndStars 
          theme={theme} 
          sentiment={sentiment} 
          optimizationLevel={childOptimizationLevel}
        />
      )}
      
      <EnvironmentEffects 
        theme={theme} 
        environmentPreset={environmentPreset}
        optimizationLevel={childOptimizationLevel}
      />
    </>
  );
};
