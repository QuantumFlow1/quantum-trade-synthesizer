
import { ColorTheme } from "@/hooks/use-theme-detection";

interface AmbientLightingProps {
  theme: ColorTheme;
}

export const AmbientLighting = ({ theme }: AmbientLightingProps) => {
  return (
    <ambientLight 
      intensity={theme === 'dark' ? 0.8 : 1.0} 
      color={theme === 'dark' ? "#6a6ab3" : "#ffffff"} 
    />
  );
};
