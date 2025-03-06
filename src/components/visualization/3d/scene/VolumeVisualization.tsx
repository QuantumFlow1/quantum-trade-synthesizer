
import { useMemo } from "react";
import { TradingDataPoint } from "@/utils/tradingData";
import { ColorTheme } from "@/hooks/use-theme-detection";
import * as THREE from "three";

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
  // Create a volume indicator geometry
  const volumeGeometry = useMemo(() => {
    // Skip volume visualization in aggressive optimization mode
    if (optimizationLevel === 'aggressive') {
      return null;
    }
    
    const geometry = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];
    
    // Create a line below the price bars
    processedData.forEach((point, index) => {
      const xPosition = (index - processedData.length / 2) * 1.2;
      const normalizedVolume = maxVolume ? point.volume / maxVolume : 0;
      const lineHeight = normalizedVolume * 2; // Scale for better visibility
      
      // Start point at ground level
      positions.push(xPosition, -0.45, 0);
      
      // End point above ground based on volume
      positions.push(xPosition, -0.45 + lineHeight, 0);
      
      // Add colors based on trend
      const color = new THREE.Color(
        point.trend === 'up' 
          ? theme === 'dark' ? '#10b981' : '#059669'  // Green
          : theme === 'dark' ? '#ef4444' : '#dc2626'  // Red
      );
      
      colors.push(color.r, color.g, color.b);
      colors.push(color.r, color.g, color.b);
    });
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    return geometry;
  }, [processedData, maxVolume, theme, optimizationLevel]);
  
  // Skip rendering in aggressive optimization mode
  if (optimizationLevel === 'aggressive' || !volumeGeometry) {
    return null;
  }
  
  return (
    <lineSegments>
      <primitive object={volumeGeometry} attach="geometry" />
      <lineBasicMaterial vertexColors={true} linewidth={1} />
    </lineSegments>
  );
};
