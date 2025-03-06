
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ColorTheme } from "@/hooks/use-theme-detection";

interface PointLightingProps {
  theme: ColorTheme;
}

export const PointLighting = ({ theme }: PointLightingProps) => {
  const pointLightRef = useRef<THREE.PointLight>(null!);
  
  // Animate the point light
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    if (pointLightRef.current) {
      // Pulsing effect for point light
      const pulseIntensity = (Math.sin(t * 0.5) * 0.2 + 0.8);
      pointLightRef.current.intensity = theme === 'dark' ? 1.2 * pulseIntensity : 0.8 * pulseIntensity;
    }
  });
  
  return (
    <pointLight
      ref={pointLightRef}
      position={[0, 5, -5]}
      intensity={theme === 'dark' ? 1.2 : 0.8}
      color={theme === 'dark' ? "#4f46e5" : "#7dd3fc"}
      distance={25}
      castShadow
      shadow-mapSize-width={1024}
      shadow-mapSize-height={1024}
    />
  );
};
