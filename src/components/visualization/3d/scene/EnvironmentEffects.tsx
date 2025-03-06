
import { OrbitControls, Environment } from "@react-three/drei";
import { ColorTheme } from "@/hooks/use-theme-detection";

interface EnvironmentEffectsProps {
  theme: ColorTheme;
  environmentPreset: "sunset" | "dawn" | "night" | "warehouse" | "forest" | "apartment" | "studio" | "city" | "park" | "lobby";
  optimizationLevel?: 'normal' | 'aggressive';
}

export const EnvironmentEffects = ({ 
  theme, 
  environmentPreset, 
  optimizationLevel = 'normal' 
}: EnvironmentEffectsProps) => {
  // Adjust controls based on optimization level
  const zoomSpeed = optimizationLevel === 'aggressive' ? 0.5 : 0.7;
  const rotateSpeed = optimizationLevel === 'aggressive' ? 0.3 : 0.5;
  const maxDistance = optimizationLevel === 'aggressive' ? 25 : 30;
  
  return (
    <>
      <OrbitControls 
        enableZoom={true} 
        enablePan={true} 
        rotateSpeed={rotateSpeed}
        zoomSpeed={zoomSpeed}
        minDistance={5}
        maxDistance={maxDistance}
        enableDamping={false} // Disable damping for better performance
        screenSpacePanning={false} // Disable screen space panning
      />
      
      {optimizationLevel === 'aggressive' ? (
        // Use a simple directional light instead of environment in aggressive mode
        <directionalLight position={[0, 10, 5]} intensity={1.5} />
      ) : (
        <Environment preset={environmentPreset} />
      )}
    </>
  );
};
