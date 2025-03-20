
import { ColorTheme } from "@/hooks/use-theme-detection";
import { TradingDataPoint } from "@/utils/tradingData";
import { OptimizationLevel } from "./SceneContainer";

interface SceneLightingProps {
  theme: ColorTheme;
  hoveredIndex: number | null;
  processedData: TradingDataPoint[];
  optimizationLevel: OptimizationLevel;
}

export const SceneLighting = ({ 
  theme, 
  hoveredIndex, 
  processedData,
  optimizationLevel
}: SceneLightingProps) => {
  // Determine intensity based on optimization level
  const ambientIntensity = optimizationLevel === 'normal' ? 0.5 : 0.3;
  const pointIntensity = optimizationLevel === 'normal' ? 1.0 : 0.7;
  
  return (
    <>
      {/* Global lighting */}
      <ambientLight intensity={ambientIntensity} />
      <pointLight 
        position={[10, 10, 10]} 
        intensity={pointIntensity} 
        castShadow={optimizationLevel === 'normal'} 
      />
      
      {/* Extra lights based on optimization level */}
      {optimizationLevel === 'normal' && (
        <>
          <pointLight position={[-10, 5, -10]} intensity={0.5} />
          <directionalLight
            position={[0, 10, 0]}
            intensity={0.3}
            castShadow={true}
          />
        </>
      )}
    </>
  );
};
