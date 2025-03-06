
import { useThemeDetection } from "@/hooks/use-theme-detection";
import { AmbientLight, DirectionalLight } from "@react-three/drei";

interface ThemeBasedLightingProps {
  optimizationLevel?: 'normal' | 'aggressive';
}

export const ThemeBasedLighting = ({ optimizationLevel = 'normal' }: ThemeBasedLightingProps) => {
  const theme = useThemeDetection();
  
  // Optimize lighting based on optimization level
  const ambientIntensity = optimizationLevel === 'aggressive' ? 0.6 : 0.8;
  const directionalIntensity = optimizationLevel === 'aggressive' ? 0.4 : 0.7;
  
  return (
    <>
      <AmbientLight 
        intensity={ambientIntensity}
        color={theme === 'dark' ? '#404060' : '#ffffff'} 
      />
      
      <DirectionalLight
        position={[10, 10, 5]}
        intensity={directionalIntensity}
        color={theme === 'dark' ? '#aaaaff' : '#ffffff'}
        castShadow={false}
      />
      
      {optimizationLevel !== 'aggressive' && (
        <DirectionalLight
          position={[-10, 5, -5]}
          intensity={0.4}
          color={theme === 'dark' ? '#8080ff' : '#ffffee'}
          castShadow={false}
        />
      )}
    </>
  );
};
