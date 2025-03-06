
import { ColorTheme } from "@/hooks/use-theme-detection";

interface GroundPlaneProps {
  theme: ColorTheme;
}

export const GroundPlane = ({ theme }: GroundPlaneProps) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial 
        color={theme === 'dark' ? "#404075" : "#f5faff"} 
        opacity={0.95}
        transparent
        roughness={0.5}
        metalness={0.2}
        emissive={theme === 'dark' ? "#202045" : "#e5f5ff"}
        emissiveIntensity={0.15}
      />
    </mesh>
  );
};
