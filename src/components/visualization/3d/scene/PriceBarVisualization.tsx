
import { useState } from "react";
import { TradingDataPoint } from "@/utils/tradingData";
import { ColorTheme } from "@/hooks/use-theme-detection";
import { PriceBar } from "../PriceBar";

interface PriceBarVisualizationProps {
  processedData: TradingDataPoint[];
  maxPrice: number;
  minPrice: number;
  theme: ColorTheme;
  onHoverChange: (index: number | null) => void;
  optimizationLevel?: 'normal' | 'aggressive';
}

export const PriceBarVisualization = ({
  processedData,
  maxPrice,
  minPrice,
  theme,
  onHoverChange,
  optimizationLevel = 'normal'
}: PriceBarVisualizationProps) => {
  // Manage local hover state to handle hover effects
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  
  // Handle hover changes
  const handleHover = (index: number) => {
    setHoveredBar(index);
    onHoverChange(index);
  };
  
  // Handle hover out
  const handleBlur = () => {
    setHoveredBar(null);
    onHoverChange(null);
  };
  
  return (
    <group>
      {processedData.map((point, index) => (
        <PriceBar 
          key={`price-bar-${index}`}
          point={point}
          index={index}
          total={processedData.length}
          maxPrice={maxPrice}
          minPrice={minPrice}
          theme={theme}
          onHover={() => handleHover(index)}
          onBlur={handleBlur}
          optimizationLevel={optimizationLevel}
        />
      ))}
    </group>
  );
};
