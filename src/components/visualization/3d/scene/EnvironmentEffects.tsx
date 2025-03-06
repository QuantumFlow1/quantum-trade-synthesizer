
import { OrbitControls, Environment } from "@react-three/drei";
import { ColorTheme } from "@/hooks/use-theme-detection";

interface EnvironmentEffectsProps {
  theme: ColorTheme;
  environmentPreset: "sunset" | "dawn" | "night" | "warehouse" | "forest" | "apartment" | "studio" | "city" | "park" | "lobby";
}

export const EnvironmentEffects = ({ theme, environmentPreset }: EnvironmentEffectsProps) => {
  return (
    <>
      <OrbitControls 
        enableZoom={true} 
        enablePan={true} 
        rotateSpeed={0.5}
        zoomSpeed={0.7}
        minDistance={5}
        maxDistance={30}
      />
      
      <Environment preset={environmentPreset} />
    </>
  );
};
