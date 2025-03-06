
import { useThemeDetection } from "@/hooks/use-theme-detection";
import { AmbientLighting } from "./lighting/AmbientLighting";
import { DirectionalLighting } from "./lighting/DirectionalLighting";
import { PointLighting } from "./lighting/PointLighting";
import { SpotLighting } from "./lighting/SpotLighting";

export const ThemeBasedLighting = () => {
  const theme = useThemeDetection();
  
  return (
    <>
      <AmbientLighting theme={theme} />
      <DirectionalLighting theme={theme} />
      <PointLighting theme={theme} />
      <SpotLighting theme={theme} />
    </>
  );
};
