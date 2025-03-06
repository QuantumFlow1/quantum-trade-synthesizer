
import { ColorTheme } from "@/hooks/use-theme-detection";

interface AmbientLightingProps {
  theme: ColorTheme;
}

export const AmbientLighting = ({ theme }: AmbientLightingProps) => {
  return (
    <ambientLight 
      intensity={theme === 'dark' ? 0.8 : 1.2} 
      color={theme === 'dark' ? "#5f5f9e" : "#ffffff"} 
    />
  );
};
