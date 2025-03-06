
import { useRef, useEffect } from "react";
import { ColorTheme } from "@/hooks/use-theme-detection";
import { TradingDataPoint } from "@/utils/tradingData";
import * as THREE from "three";

interface SpotlightSystemProps {
  theme: ColorTheme;
  hoveredIndex: number | null;
  processedData: TradingDataPoint[];
}

export const SpotlightSystem = ({ theme, hoveredIndex, processedData }: SpotlightSystemProps) => {
  const spotlightGroupRef = useRef<THREE.Group>(null);
  
  // Update spotlight positions based on data and hovered index
  useEffect(() => {
    if (!spotlightGroupRef.current) return;
    
    // Position updates logic here
  }, [hoveredIndex, processedData]);
  
  return (
    <group ref={spotlightGroupRef}>
      {/* Main spotlight for hovered element */}
      {hoveredIndex !== null && (
        <spotLight
          position={[(hoveredIndex - processedData.length / 2) * 1.2, 8, 2]}
          angle={0.3}
          penumbra={0.8}
          intensity={1.5}
          color={theme === 'dark' ? '#6366f1' : '#4f46e5'}
          distance={20}
          castShadow={false}
        />
      )}
      
      {/* Ambient spotlights */}
      <spotLight
        position={[5, 10, 5]}
        angle={0.4}
        penumbra={0.5}
        intensity={0.8}
        color={theme === 'dark' ? '#818cf8' : '#6366f1'}
        distance={25}
        castShadow={false}
      />
      
      <spotLight
        position={[-5, 8, -2]}
        angle={0.4}
        penumbra={0.5}
        intensity={0.6}
        color={theme === 'dark' ? '#a5b4fc' : '#818cf8'}
        distance={20}
        castShadow={false}
      />
    </group>
  );
};
