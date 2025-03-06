
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ColorTheme } from "@/hooks/use-theme-detection";

interface DirectionalLightingProps {
  theme: ColorTheme;
}

export const DirectionalLighting = ({ theme }: DirectionalLightingProps) => {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null!);
  
  // Animate the main directional light
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    if (directionalLightRef.current) {
      // Subtle movement for directional light
      directionalLightRef.current.position.x = Math.sin(t * 0.1) * 10;
      directionalLightRef.current.position.z = Math.cos(t * 0.1) * 10;
    }
  });
  
  return (
    <>
      {/* Main directional light - simulates sunlight */}
      <directionalLight
        ref={directionalLightRef}
        position={[5, 10, 5]}
        intensity={theme === 'dark' ? 0.8 : 1.4}
        color={theme === 'dark' ? "#a78bfa" : "#ffffff"}
        castShadow
      />
      
      {/* Fill light to balance shadows */}
      <directionalLight
        position={[-5, 3, -5]}
        intensity={theme === 'dark' ? 0.4 : 0.6}
        color={theme === 'dark' ? "#9ca3af" : "#f3f4f6"}
      />
    </>
  );
};
