
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ColorTheme } from "@/hooks/use-theme-detection";

interface PointLightingProps {
  theme: ColorTheme;
}

export const PointLighting = ({ theme }: PointLightingProps) => {
  const pointLightRef = useRef<THREE.PointLight>(null!);
  
  // Animate the point light with a more stable approach
  useFrame(({ clock }) => {
    if (!pointLightRef.current) return;
    
    try {
      // Pulsing effect for point light with more conservative values
      const t = clock.getElapsedTime();
      const pulseIntensity = (Math.sin(t * 0.5) * 0.15 + 0.85);
      pointLightRef.current.intensity = theme === 'dark' ? 1.5 * pulseIntensity : 1.0 * pulseIntensity;
    } catch (err) {
      console.error("Error in PointLighting animation:", err);
    }
  });
  
  return (
    <pointLight
      ref={pointLightRef}
      position={[0, 5, -5]}
      intensity={theme === 'dark' ? 1.5 : 1.0}
      color={theme === 'dark' ? "#5a51f0" : "#82d8fc"}
      distance={30}
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
    />
  );
};
