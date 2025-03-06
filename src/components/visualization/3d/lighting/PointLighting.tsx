
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ColorTheme } from "@/hooks/use-theme-detection";

interface PointLightingProps {
  theme: ColorTheme;
}

export const PointLighting = ({ theme }: PointLightingProps) => {
  const pointLightRef = useRef<THREE.PointLight>(null!);
  
  // Simpler animation with lower intensity variations
  useFrame(({ clock }) => {
    if (!pointLightRef.current) return;
    
    // Reduce animation complexity
    const t = clock.getElapsedTime();
    const pulseIntensity = (Math.sin(t * 0.3) * 0.05 + 0.95); // Much smaller variation
    pointLightRef.current.intensity = theme === 'dark' ? 1.0 * pulseIntensity : 0.8 * pulseIntensity;
  });
  
  return (
    <pointLight
      ref={pointLightRef}
      position={[0, 5, -5]}
      intensity={theme === 'dark' ? 1.0 : 0.8}
      color={theme === 'dark' ? "#5a51f0" : "#82d8fc"}
      distance={20} // Reduced from 30
      castShadow={false} // Disable shadow casting for performance
    />
  );
};
