
import { useThemeDetection } from "@/hooks/use-theme-detection";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

interface ThemeBasedLightingProps {
  optimizationLevel?: 'normal' | 'aggressive';
}

export const ThemeBasedLighting = ({ optimizationLevel = 'normal' }: ThemeBasedLightingProps) => {
  const { theme } = useThemeDetection();
  
  // Optimize lighting based on optimization level
  const ambientIntensity = optimizationLevel === 'aggressive' ? 0.6 : 0.8;
  const directionalIntensity = optimizationLevel === 'aggressive' ? 0.4 : 0.7;
  
  return (
    <>
      {/* Use regular Three.js components instead of drei imports */}
      <ambientLight 
        intensity={ambientIntensity}
        color={theme === 'dark' ? '#404060' : '#ffffff'} 
      />
      
      <directionalLight
        position={[10, 10, 5]}
        intensity={directionalIntensity}
        color={theme === 'dark' ? '#aaaaff' : '#ffffff'}
        castShadow={false}
      />
      
      {optimizationLevel !== 'aggressive' && (
        <directionalLight
          position={[-10, 5, -5]}
          intensity={0.4}
          color={theme === 'dark' ? '#8080ff' : '#ffffee'}
          castShadow={false}
        />
      )}
    </>
  );
};
