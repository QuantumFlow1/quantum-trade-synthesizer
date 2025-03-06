
import { TradingDataPoint } from "@/utils/tradingData";
import { ColorTheme } from "@/hooks/use-theme-detection";
import { VolumeIndicator } from "../VolumeIndicator";

interface VolumeVisualizationProps {
  processedData: TradingDataPoint[];
  maxVolume: number;
  theme: ColorTheme;
}

export const VolumeVisualization = ({ 
  processedData, 
  maxVolume,
  theme
}: VolumeVisualizationProps) => {
  if (processedData.length === 0) return null;
  
  return (
    <>
      {processedData.map((point, index) => (
        <VolumeIndicator 
          key={`volume-${index}`}
          point={point} 
          index={index} 
          total={processedData.length} 
          maxVolume={maxVolume}
          theme={theme}
        />
      ))}
    </>
  );
};
