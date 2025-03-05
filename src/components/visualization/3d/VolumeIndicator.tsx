
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { TradingDataPoint } from "@/utils/tradingData";
import * as THREE from "three";

interface VolumeIndicatorProps {
  point: TradingDataPoint;
  index: number;
  total: number;
  maxVolume: number;
}

export const VolumeIndicator = ({
  point,
  index,
  total,
  maxVolume
}: VolumeIndicatorProps) => {
  const mesh = useRef<THREE.Mesh>(null);
  const spread = 20;
  const spacing = spread / total;
  const position = index * spacing - (spread / 2);
  
  const normalizedVolume = point.volume / maxVolume;
  const size = Math.max(0.1, normalizedVolume * 0.7);
  
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
          color="#8b5cf6" 
          transparent 
          opacity={0.6} 
          emissive="#8b5cf6"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  );
};
