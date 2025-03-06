
import { ColorTheme } from "@/hooks/use-theme-detection";

interface GroundPlaneProps {
  theme: ColorTheme;
  optimizationLevel?: 'normal' | 'aggressive';
}

export const GroundPlane = ({ theme, optimizationLevel = 'normal' }: GroundPlaneProps) => {
  // Simplified plane in aggressive mode
  const planeSize = optimizationLevel === 'aggressive' ? 30 : 40;
  const planeSegments = optimizationLevel === 'aggressive' ? 1 : undefined; // Use default in normal mode
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow={false}>
      <planeGeometry args={[planeSize, planeSize, planeSegments, planeSegments]} />
      <meshStandardMaterial 
        color={theme === 'dark' ? "#404075" : "#f5faff"} 
        opacity={0.9}
        transparent
        roughness={optimizationLevel === 'aggressive' ? 0.9 : 0.7}
        metalness={optimizationLevel === 'aggressive' ? 0 : 0.1} // No metalness in aggressive mode
        emissive={theme === 'dark' ? "#202045" : "#e5f5ff"}
        emissiveIntensity={optimizationLevel === 'aggressive' ? 0 : 0.1} // No emission in aggressive mode
      />
    </mesh>
  );
};
