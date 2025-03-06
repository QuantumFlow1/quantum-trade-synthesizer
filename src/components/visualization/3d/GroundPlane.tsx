
import { useMemo } from "react";
import { ColorTheme } from "@/hooks/use-theme-detection";
import * as THREE from "three";

interface GroundPlaneProps {
  theme: ColorTheme;
  optimizationLevel?: 'normal' | 'aggressive';
}

export const GroundPlane = ({ theme, optimizationLevel = 'normal' }: GroundPlaneProps) => {
  // Calculate ground size and resolution based on optimization level
  const [planeSize, planeSegments] = useMemo(() => {
    return optimizationLevel === 'aggressive' 
      ? [100, 10]  // Lower resolution for aggressive optimization
      : [100, 50]; // Higher resolution for normal optimization
  }, [optimizationLevel]);
  
  // Create materials for the ground
  const material = useMemo(() => {
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: theme === 'dark' ? '#1e1e3f' : '#f8fafc',
      roughness: 0.8,
      metalness: 0.2,
      transparent: true,
      opacity: 0.7,
    });
    
    return groundMaterial;
  }, [theme]);
  
  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -0.5, 0]} 
      receiveShadow={true}
    >
      <planeGeometry args={[planeSize, planeSize, planeSegments, planeSegments]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};
