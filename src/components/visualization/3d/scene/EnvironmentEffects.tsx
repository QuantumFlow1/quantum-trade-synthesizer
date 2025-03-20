
import { ColorTheme } from "@/hooks/use-theme-detection";
import { Environment } from "@react-three/drei";
import { OptimizationLevel, EnvironmentPreset } from "./SceneContainer";

interface EnvironmentEffectsProps {
  theme: ColorTheme;
  environmentPreset: EnvironmentPreset;
  optimizationLevel: OptimizationLevel;
}

export const EnvironmentEffects = ({ 
  theme,
  environmentPreset,
  optimizationLevel
}: EnvironmentEffectsProps) => {
  // Don't render advanced effects in extreme optimization mode
  if (optimizationLevel === 'extreme') {
    return null;
  }
  
  return (
    <>
      <Environment preset={environmentPreset} background={false} />
      
      {/* Add fog in normal optimization level */}
      {optimizationLevel === 'normal' && (
        <fog 
          attach="fog" 
          args={[
            theme === 'dark' ? '#111111' : '#f0f0f0', 
            20, 
            100
          ]} 
        />
      )}
    </>
  );
};
