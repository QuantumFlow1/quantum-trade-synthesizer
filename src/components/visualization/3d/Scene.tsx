
import { PriceBar } from "./PriceBar";
import { VolumeIndicator } from "./VolumeIndicator";
import { CoordinateSystem } from "./CoordinateSystem";
import { ThemeBasedLighting } from "./ThemeBasedLighting";
import { TradingDataPoint } from "@/utils/tradingData";
import { OrbitControls, Stars, Environment } from "@react-three/drei";
import { useThemeDetection } from "@/hooks/use-theme-detection";
import { useState, useEffect } from "react";

interface SceneProps {
  data: TradingDataPoint[];
}

export const Scene = ({ data }: SceneProps) => {
  const [processedData, setProcessedData] = useState<TradingDataPoint[]>([]);
  const theme = useThemeDetection();
  
  // Ensure data is processed before rendering
  useEffect(() => {
    if (data && data.length > 0) {
      setProcessedData(data);
    } else {
      // If no data, create a fallback empty array
      setProcessedData([]);
    }
  }, [data]);
  
  // Calculate min/max for scaling
  const maxPrice = processedData.length > 0 ? Math.max(...processedData.map(d => d.close)) : 100;
  const minPrice = processedData.length > 0 ? Math.min(...processedData.map(d => d.close)) : 0;
  const maxVolume = processedData.length > 0 ? Math.max(...processedData.map(d => d.volume)) : 100;
  
  return (
    <>
      <ThemeBasedLighting />
      
      {/* Stars for dark theme only */}
      {theme === 'dark' && (
        <Stars radius={100} depth={50} count={1000} factor={4} fade speed={1} />
      )}
      
      {/* Coordinate system */}
      <CoordinateSystem theme={theme} />
      
      {/* Price bars */}
      {processedData.map((point, index) => (
        <PriceBar 
          key={`price-${index}`}
          point={point} 
          index={index} 
          total={processedData.length} 
          maxPrice={maxPrice} 
          minPrice={minPrice}
          theme={theme}
        />
      ))}
      
      {/* Volume indicators */}
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
      
      <OrbitControls 
        enableZoom={true} 
        enablePan={true} 
        rotateSpeed={0.5}
        zoomSpeed={0.7}
        minDistance={5}
        maxDistance={30}
      />
      
      <Environment preset={theme === "dark" ? "night" : "sunset"} />
    </>
  );
};
