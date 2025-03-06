
import { ColorTheme } from "@/hooks/use-theme-detection";

interface GroundPlaneProps {
  theme: ColorTheme;
}

export const GroundPlane = ({ theme }: GroundPlaneProps) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow={false}>
      <planeGeometry args={[40, 40]} /> {/* Reduced from 50x50 */}
      <meshStandardMaterial 
        color={theme === 'dark' ? "#404075" : "#f5faff"} 
        opacity={0.9}
        transparent
        roughness={0.7}
        metalness={0.1} // Reduced metalness
        emissive={theme === 'dark' ? "#202045" : "#e5f5ff"}
        emissiveIntensity={0.1} // Reduced emissive intensity
      />
    </mesh>
  );
};
