
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
      pointLightRef.current.intensity = theme === 'dark' ? 0.6 * pulseIntensity : 0.3 * pulseIntensity;
    }
  });
  
  return (
    <pointLight
      ref={pointLightRef}
      position={[0, 5, -5]}
      intensity={theme === 'dark' ? 0.5 : 0.3}
      color={theme === 'dark' ? "#4f46e5" : "#7dd3fc"}
      distance={25}
    />
  );
};
