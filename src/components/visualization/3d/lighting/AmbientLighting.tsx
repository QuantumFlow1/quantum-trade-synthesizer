
import { ColorTheme } from "@/hooks/use-theme-detection";

interface AmbientLightingProps {
  theme: ColorTheme;
}

export const AmbientLighting = ({ theme }: AmbientLightingProps) => {
  return (
    <ambientLight 
      intensity={theme === 'dark' ? 0.3 : 0.6} 
      color={theme === 'dark' ? "#1a1a2e" : "#ffffff"} 
    />
  );
};
