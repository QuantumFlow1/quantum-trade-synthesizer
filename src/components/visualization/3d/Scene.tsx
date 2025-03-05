
import { useState, useEffect, useMemo } from "react";
import { PriceBar } from "./PriceBar";
import { VolumeIndicator } from "./VolumeIndicator";
import { CoordinateSystem } from "./CoordinateSystem";
import { ThemeBasedLighting } from "./ThemeBasedLighting";
import { TradingDataPoint } from "@/utils/tradingData";
import { OrbitControls, Stars, Environment } from "@react-three/drei";
import { useThemeDetection } from "@/hooks/use-theme-detection";

interface SceneProps {
  data: TradingDataPoint[];
}

export const Scene = ({ data }: SceneProps) => {
  const [processedData, setProcessedData] = useState<TradingDataPoint[]>([]);
  const theme = useThemeDetection();
  
  // Ensure data is processed before rendering
  useEffect(() => {
    try {
      if (data && Array.isArray(data) && data.length > 0) {
        console.log("Processing 3D visualization data:", data.length, "data points");
        setProcessedData(data);
      } else {
        console.warn("Empty or invalid data received, creating fallback data");
        setProcessedData([]);
      }
    } catch (error) {
      console.error("Error processing 3D visualization data:", error);
      setProcessedData([]);
    }
  }, [data]);
  
  // Calculate min/max for scaling
  const { maxPrice, minPrice, maxVolume } = useMemo(() => {
    try {
      if (processedData.length === 0) {
        return { maxPrice: 100, minPrice: 0, maxVolume: 100 };
      }
      
      const maxP = Math.max(...processedData.map(d => d.close));
      const minP = Math.min(...processedData.map(d => d.close));
      const maxV = Math.max(...processedData.map(d => d.volume));
      
      return { maxPrice: maxP, minPrice: minP, maxVolume: maxV };
    } catch (error) {
      console.error("Error calculating min/max values:", error);
      return { maxPrice: 100, minPrice: 0, maxVolume: 100 };
    }
  }, [processedData]);
  
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
      {processedData.length > 0 && processedData.map((point, index) => (
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
      {processedData.length > 0 && processedData.map((point, index) => (
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
