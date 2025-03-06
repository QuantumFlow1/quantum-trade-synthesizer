
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { TradingDataPoint } from "@/utils/tradingData";
import { ColorTheme } from "@/hooks/use-theme-detection";
import * as THREE from "three";

interface PriceBarProps {
  point: TradingDataPoint;
  index: number;
  total: number;
  maxPrice: number;
  minPrice: number;
  theme: ColorTheme;
  onHover?: () => void;
  onBlur?: () => void;
}

export const PriceBar = ({ 
  point, 
  index, 
  total, 
  maxPrice, 
  minPrice, 
  theme,
  onHover,
  onBlur
}: PriceBarProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  // Position bar along X-axis based on index
  const xPosition = (index - total / 2) * 1.2;
  
  // Calculate height based on price
  const priceRange = maxPrice - minPrice;
  const height = priceRange > 0 
    ? ((point.close - minPrice) / priceRange) * 5 + 0.5 // Scale height between 0.5 and 5.5
    : 1; // Default height if there's no price range
  
  // Determine color based on price trend
  const getBarColor = () => {
    if (point.trend === 'up') {
      return theme === 'dark' ? '#10b981' : '#059669'; // Green
    } else if (point.trend === 'down') {
      return theme === 'dark' ? '#ef4444' : '#dc2626'; // Red
    }
    return theme === 'dark' ? '#6366f1' : '#4f46e5'; // Default/neutral (indigo)
  };
  
  // Animate the bar on creation
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Simple slight rotation animation
      meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5 + index * 0.1) * 0.05;
      
      // Emissive pulse for hover effect if this is the hovered bar
      if (meshRef.current.userData.hovered) {
        const material = meshRef.current.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = 0.3 + Math.sin(state.clock.getElapsedTime() * 2) * 0.2;
      }
    }
  });
  
  // Handle hover state
  const handlePointerOver = () => {
    if (meshRef.current) {
      meshRef.current.userData.hovered = true;
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissive = new THREE.Color(getBarColor());
      material.emissiveIntensity = 0.5;
      document.body.style.cursor = 'pointer';
      if (onHover) onHover();
    }
  };
  
  const handlePointerOut = () => {
    if (meshRef.current) {
      meshRef.current.userData.hovered = false;
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = 0;
      document.body.style.cursor = 'auto';
      if (onBlur) onBlur();
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={[xPosition, height / 2, 0]}
      castShadow
      receiveShadow
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <boxGeometry args={[0.8, height, 0.8]} />
      <meshStandardMaterial
        color={getBarColor()}
        roughness={0.4}
        metalness={0.6}
        emissive={new THREE.Color(getBarColor())}
        emissiveIntensity={0}
      />
    </mesh>
  );
};
