
import { ColorTheme } from "@/hooks/use-theme-detection";

interface AmbientLightingProps {
  theme: ColorTheme;
}

export const AmbientLighting = ({ theme }: AmbientLightingProps) => {
  return (
    <ambientLight 
      intensity={theme === 'dark' ? 1.2 : 1.5} 
      color={theme === 'dark' ? "#6a6ab3" : "#ffffff"} 
    />
  );
};
