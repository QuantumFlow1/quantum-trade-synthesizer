
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard, Text } from "@react-three/drei";
import { TradingDataPoint } from "@/utils/tradingData";
import * as THREE from "three";
import { ColorTheme } from "@/hooks/use-theme-detection";

interface PriceBarProps {
  point: TradingDataPoint;
  index: number;
  total: number;
  maxPrice: number;
  minPrice: number;
  maxHeight?: number;
  theme: ColorTheme;
}

export const PriceBar = ({
  point,
  index,
  total,
  maxPrice,
  minPrice,
  maxHeight = 10,
  theme
}: PriceBarProps) => {
  const mesh = useRef<THREE.Mesh>(null);
  const spread = 20; // How spread out the bars are
  const spacing = spread / total; // Distance between each bar
  const position = index * spacing - (spread / 2); // Center the visualization

  // Scale height based on price relative to min/max
  const priceRange = maxPrice - minPrice;
  const normalizedPrice = (point.close - minPrice) / priceRange;
  const height = Math.max(0.1, normalizedPrice * maxHeight);

  // Theme-aware colors
  const getUpColor = () => theme === 'dark' ? "#10b981" : "#059669";
  const getDownColor = () => theme === 'dark' ? "#ef4444" : "#dc2626";
  
  // Color based on trend
  const color = point.trend === "up" ? getUpColor() : getDownColor();

  // Add subtle animation
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.02;
      
      // Add subtle hover effect
      mesh.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5 + index * 0.2) * 0.05 + height / 2;
    }
  });

  return (
    <group position={[position, height / 2, 0]}>
      <mesh ref={mesh}>
        <boxGeometry args={[0.4, height, 0.4]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={theme === 'dark' ? 0.3 : 0.1} 
          roughness={theme === 'dark' ? 0.3 : 0.5}
          metalness={theme === 'dark' ? 0.7 : 0.5}
        />
      </mesh>
      <Billboard position={[0, height + 0.5, 0]}>
        <Text
          color={theme === 'dark' ? "#ffffff" : "#000000"}
          fontSize={0.3}
          font="/fonts/Inter-Medium.woff"
          anchorY="bottom"
        >
          {point.close.toFixed(0)}
        </Text>
      </Billboard>
    </group>
  );
};
