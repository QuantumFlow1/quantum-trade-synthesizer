
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { ColorTheme } from "@/hooks/use-theme-detection";
import { TradingDataPoint } from "@/utils/tradingData";

interface SpotlightSystemProps {
  theme: ColorTheme;
  hoveredIndex: number | null;
  processedData: TradingDataPoint[];
}

export const SpotlightSystem = ({ theme, hoveredIndex, processedData }: SpotlightSystemProps) => {
  const spotLight = useRef(new THREE.SpotLight(
    theme === 'dark' ? '#8b5cf6' : '#6d28d9',
    1,
    30,
    Math.PI / 6,
    0.5,
    0.5
  )).current;
  
  const spotLightTarget = useRef(new THREE.Object3D()).current;
  
  useEffect(() => {
    spotLight.target = spotLightTarget;
  }, [spotLight, spotLightTarget]);
  
  useEffect(() => {
    if (hoveredIndex !== null && processedData[hoveredIndex]) {
      const spread = 20;
      const spacing = processedData.length > 1 ? spread / processedData.length : spread;
      const position = hoveredIndex * spacing - (spread / 2);
      
      spotLight.position.set(position, 10, 5);
      spotLightTarget.position.set(position, 0, 0);
    }
  }, [hoveredIndex, processedData, spotLight, spotLightTarget]);

  return (
    <>
      <primitive object={spotLight} intensity={hoveredIndex !== null ? 1 : 0} />
      <primitive object={spotLightTarget} />
    </>
  );
};
