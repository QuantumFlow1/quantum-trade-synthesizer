
import { ColorTheme } from "@/hooks/use-theme-detection";
import { useEffect } from "react";
import { SpotLight } from "@react-three/drei";

interface BaseSceneLightingProps {
  theme: ColorTheme;
  optimizationLevel: 'normal' | 'aggressive';
}

export const BaseSceneLighting = ({
  theme,
  optimizationLevel
}: BaseSceneLightingProps) => {
  // Log rendering for debugging
  useEffect(() => {
    console.log(`Rendering base lighting with ${theme} theme and ${optimizationLevel} optimization`);
  }, [theme, optimizationLevel]);
  
  // Get light colors and intensities based on theme
  const ambientColor = theme === 'dark' ? '#334155' : '#f8fafc';
  const ambientIntensity = theme === 'dark' ? 0.4 : 0.6;
  
  const mainLightColor = theme === 'dark' ? '#94a3b8' : '#ffffff';
  const mainLightIntensity = theme === 'dark' ? 0.8 : 1.0;
  
  const fillLightColor = theme === 'dark' ? '#3b82f6' : '#dbeafe';
  const fillLightIntensity = theme === 'dark' ? 0.4 : 0.5;
  
  // Skip complex lighting in aggressive optimization mode
  const useComplexLighting = optimizationLevel !== 'aggressive';
  
  return (
    <>
      {/* Base ambient light */}
      <ambientLight color={ambientColor} intensity={ambientIntensity} />
      
      {/* Main directional light */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={mainLightIntensity}
        color={mainLightColor}
        castShadow={useComplexLighting}
        shadow-mapSize={useComplexLighting ? [1024, 1024] : [512, 512]}
      />
      
      {/* Fill light to reduce harsh shadows */}
      <directionalLight
        position={[-3, 4, -2]}
        intensity={fillLightIntensity * 0.5}
        color={fillLightColor}
        castShadow={false}
      />
      
      {/* Add spotlight for dramatic effect in normal mode */}
      {useComplexLighting && (
        <SpotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={0.7}
          intensity={theme === 'dark' ? 0.5 : 0.3}
          color={theme === 'dark' ? '#cbd5e1' : '#ffffff'}
          distance={20}
          attenuation={5}
          castShadow={true}
          shadow-mapSize={[512, 512]}
        />
      )}
    </>
  );
};
