
import { ColorTheme } from "@/hooks/use-theme-detection";
import { OptimizationLevel, EnvironmentPreset } from "./SceneContainer";

interface EnvironmentEffectsProps {
  theme: ColorTheme;
  environmentPreset: EnvironmentPreset;
  optimizationLevel?: 'normal' | 'aggressive';
}

export const EnvironmentEffects = ({ 
  theme, 
  environmentPreset,
  optimizationLevel = 'normal'
}: EnvironmentEffectsProps) => {
  // In aggressive optimization mode, we provide minimal environment
  if (optimizationLevel === 'aggressive') {
    return (
      <fog
        attach="fog"
        color={theme === 'dark' ? '#14143a' : '#f8fafc'}
        near={30}
        far={90}
      />
    );
  }
  
  return (
    <>
      {/* Fog effect */}
      <fog
        attach="fog"
        color={theme === 'dark' ? '#14143a' : '#f8fafc'}
        near={40}
        far={100}
      />
      
      {/* We can add other environment effects here in the future */}
    </>
  );
};
