
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { TradingDataPoint } from "@/utils/tradingData";
import * as THREE from "three";
import { ColorTheme } from "@/hooks/use-theme-detection";

interface VolumeIndicatorProps {
  point: TradingDataPoint;
  index: number;
  total: number;
  maxVolume: number;
  theme: ColorTheme;
}

export const VolumeIndicator = ({
  point,
  index,
  total,
  maxVolume,
  theme
}: VolumeIndicatorProps) => {
  const mesh = useRef<THREE.Mesh>(null);
  const spread = 20;
  const spacing = total > 1 ? spread / total : spread;
  const position = index * spacing - (spread / 2);
  
  const normalizedVolume = maxVolume > 0 ? point.volume / maxVolume : 0.5;
  const size = Math.max(0.1, normalizedVolume * 0.7);
  
  // Theme-based colors
  const sphereColor = theme === 'dark' ? '#8b5cf6' : '#6d28d9';
  const emissiveIntensity = theme === 'dark' ? 0.3 : 0.1;
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.getElapsedTime() * 0.3;
      mesh.current.rotation.z = state.clock.getElapsedTime() * 0.2;
    }
  });
  
  return (
    <group position={[position, -2, 0]}>
      <mesh ref={mesh}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial 
          color={sphereColor} 
          transparent 
          opacity={theme === 'dark' ? 0.6 : 0.5} 
          emissive={sphereColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </group>
  );
};
