
import { TradingDataPoint } from "@/utils/tradingData";
import { ColorTheme } from "@/hooks/use-theme-detection";
import { PriceBar } from "../PriceBar";

interface PriceBarVisualizationProps {
  processedData: TradingDataPoint[];
  maxPrice: number;
  minPrice: number;
  theme: ColorTheme;
  onHoverChange: (index: number | null) => void;
}

export const PriceBarVisualization = ({ 
  processedData, 
  maxPrice, 
  minPrice,
  theme,
  onHoverChange
}: PriceBarVisualizationProps) => {
  if (processedData.length === 0) return null;
  
  return (
    <>
      {processedData.map((point, index) => (
        <PriceBar 
          key={`price-${index}`}
          point={point} 
          index={index} 
          total={processedData.length} 
          maxPrice={maxPrice} 
          minPrice={minPrice}
          theme={theme}
          onHover={() => onHoverChange(index)}
          onBlur={() => onHoverChange(null)}
        />
      ))}
    </>
  );
};
