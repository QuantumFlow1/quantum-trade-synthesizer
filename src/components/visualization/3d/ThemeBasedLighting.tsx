
import { useThemeDetection } from "@/hooks/use-theme-detection";

export const ThemeBasedLighting = () => {
  const theme = useThemeDetection();
  
  return (
    <>
      {/* Ambient light - softer in dark theme, brighter in light theme */}
      <ambientLight intensity={theme === 'dark' ? 0.3 : 0.6} />
      
      {/* Main directional light */}
      <directionalLight 
        position={[10, 10, 10]} 
        intensity={theme === 'dark' ? 0.7 : 1.2} 
        color={theme === 'dark' ? "#8b5cf6" : "#4a9eff"} 
        castShadow
      />
      
      {/* Secondary fill light */}
      <pointLight 
        position={[-10, 15, -10]} 
        intensity={theme === 'dark' ? 0.4 : 0.7} 
        color={theme === 'dark' ? "#ff4a4a" : "#10b981"} 
      />
      
      {/* Soft spotlight */}
      <spotLight 
        position={[-10, 15, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={theme === 'dark' ? 0.5 : 0.8} 
        castShadow 
        color={theme === 'dark' ? "#ffffff" : "#ffffff"}
      />
    </>
  );
};
