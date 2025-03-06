
import { ColorTheme } from "@/hooks/use-theme-detection";

interface AmbientLightingProps {
  theme: ColorTheme;
}

export const AmbientLighting = ({ theme }: AmbientLightingProps) => {
  return (
    <ambientLight 
      intensity={theme === 'dark' ? 0.5 : 0.8} 
      color={theme === 'dark' ? "#3f3f6e" : "#ffffff"} 
    />
  );
};
