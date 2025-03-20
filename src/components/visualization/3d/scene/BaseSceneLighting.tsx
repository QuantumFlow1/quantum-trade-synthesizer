
import { ColorTheme } from "@/hooks/use-theme-detection";

interface BaseSceneLightingProps {
  theme: ColorTheme;
  optimizationLevel: 'normal' | 'aggressive';
}

export const BaseSceneLighting = ({ theme, optimizationLevel }: BaseSceneLightingProps) => {
  // Reduce lighting complexity for aggressive optimization
  const ambientIntensity = optimizationLevel === 'aggressive' ? 0.6 : 0.8;
  const directionalIntensity = optimizationLevel === 'aggressive' ? 0.5 : 0.7;
  
  return (
    <>
      {/* Ambient light */}
      <ambientLight 
        intensity={ambientIntensity} 
        color={theme === 'dark' ? '#2a2a4a' : '#f0f0ff'} 
      />
      
      {/* Main directional light (sun/moon) */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={directionalIntensity}
        color={theme === 'dark' ? '#8080ff' : '#ffffee'}
        castShadow={false}
      />
      
      {/* Secondary fill light - skip in aggressive mode */}
      {optimizationLevel === 'normal' && (
        <directionalLight
          position={[-10, 5, -5]}
          intensity={0.3}
          color={theme === 'dark' ? '#6060ff' : '#ffffe0'}
          castShadow={false}
        />
      )}
      
      {/* Small point light for accent - skip in aggressive mode */}
      {optimizationLevel === 'normal' && (
        <pointLight
          position={[0, 5, 0]}
          intensity={0.5}
          color={theme === 'dark' ? '#6040ff' : '#ffffd0'}
          distance={15}
          decay={2}
        />
      )}
    </>
  );
};
