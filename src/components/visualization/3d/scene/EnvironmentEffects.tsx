
import { useThree } from "@react-three/fiber";
import { useMemo, useEffect } from "react";
import { Environment } from "@react-three/drei";
import { ColorTheme } from "@/hooks/use-theme-detection";
import { EnvironmentPreset } from "./SceneContainer";

interface EnvironmentEffectsProps {
  theme: ColorTheme;
  environmentPreset: EnvironmentPreset;
  optimizationLevel: 'normal' | 'aggressive';
}

export const EnvironmentEffects = ({
  theme,
  environmentPreset = 'night',
  optimizationLevel
}: EnvironmentEffectsProps) => {
  const { gl } = useThree();

  // Set up renderer properties safely based on theme and optimization level
  useEffect(() => {
    if (gl) {
      try {
        // Set background color based on theme
        gl.setClearColor(
          theme === 'dark' ? '#0f1729' : '#f8fafc', 
          1
        );
        
        // Set pixel ratio based on optimization level
        const pixelRatio = optimizationLevel === 'aggressive' 
          ? Math.min(window.devicePixelRatio, 1.5) 
          : Math.min(window.devicePixelRatio, 2.0);
          
        gl.setPixelRatio(pixelRatio);
        
        // Use toneMapping appropriate for the scene
        gl.toneMapping = theme === 'dark' ? 3 : 4; // ACESFilmicToneMapping for dark, LinearToneMapping for light
        gl.toneMappingExposure = theme === 'dark' ? 0.8 : 1.0;
        
        console.log(`Environment effects applied: ${theme} theme, ${optimizationLevel} optimization`);
      } catch (e) {
        console.warn("Error applying environment effects:", e);
      }
    }
  }, [gl, theme, optimizationLevel]);
  
  // Select appropriate environment preset based on theme if not specified
  const effectivePreset = useMemo(() => {
    if (environmentPreset) return environmentPreset;
    return theme === 'dark' ? 'night' : 'sunset';
  }, [environmentPreset, theme]);
  
  // Skip expensive environment in aggressive optimization mode
  if (optimizationLevel === 'aggressive') {
    return null;
  }
  
  return (
    <Environment
      preset={effectivePreset}
      background={false}
    />
  );
};
