
import { TradingDataPoint } from "@/utils/tradingData";
import { ColorTheme } from "@/hooks/use-theme-detection";
import { VolumeIndicator } from "../VolumeIndicator";

interface VolumeVisualizationProps {
  processedData: TradingDataPoint[];
  maxVolume: number;
  theme: ColorTheme;
  optimizationLevel?: 'normal' | 'aggressive';
}

export const VolumeVisualization = ({ 
  processedData, 
  maxVolume,
  theme,
  optimizationLevel = 'normal'
}: VolumeVisualizationProps) => {
  if (processedData.length === 0) return null;
  
  // In aggressive mode, we render fewer volume indicators
  const dataToRender = optimizationLevel === 'aggressive'
    ? processedData.filter((_, index) => index % 3 === 0)  // Only render every third point for volume 
    : processedData;
  
  return (
    <>
      {dataToRender.map((point, index) => (
        <VolumeIndicator 
          key={`volume-${index}`}
          point={point} 
          index={index} 
          total={dataToRender.length} 
          maxVolume={maxVolume}
          theme={theme}
          optimizationLevel={optimizationLevel}
        />
      ))}
    </>
  );
};
