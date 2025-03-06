
import { ColorTheme } from "@/hooks/use-theme-detection";

interface GroundPlaneProps {
  theme: ColorTheme;
}

export const GroundPlane = ({ theme }: GroundPlaneProps) => {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial 
        color={theme === 'dark' ? "#353565" : "#f0f9ff"} 
        opacity={0.9}
        transparent
        roughness={0.6}
        metalness={0.3}
        emissive={theme === 'dark' ? "#151530" : "#e0f2fe"}
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};
