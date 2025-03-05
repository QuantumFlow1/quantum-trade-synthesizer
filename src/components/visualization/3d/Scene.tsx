
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
  // Calculate min/max for scaling
  const maxPrice = Math.max(...data.map(d => d.close));
  const minPrice = Math.min(...data.map(d => d.close));
  const maxVolume = Math.max(...data.map(d => d.volume));
  const theme = useThemeDetection();
  
  return (
    <>
      <ThemeBasedLighting />
      
      {/* Stars for dark theme only */}
      {theme === 'dark' && (
        <Stars radius={100} depth={50} count={1000} factor={4} fade speed={1} />
      )}
      
      {/* Price bars */}
      {data.map((point, index) => (
        <PriceBar 
          key={`price-${index}`}
          point={point} 
          index={index} 
          total={data.length} 
          maxPrice={maxPrice} 
          minPrice={minPrice}
          theme={theme}
        />
      ))}
      
      {/* Volume indicators */}
      {data.map((point, index) => (
        <VolumeIndicator 
          key={`volume-${index}`}
          point={point} 
          index={index} 
          total={data.length} 
          maxVolume={maxVolume}
          theme={theme}
        />
      ))}
      
      <CoordinateSystem theme={theme} />
      
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
