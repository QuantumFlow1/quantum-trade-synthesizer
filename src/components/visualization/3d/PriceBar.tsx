
import { useRef, useMemo } from "react";
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
  optimizationLevel?: 'normal' | 'aggressive';
}

export const PriceBar = ({ 
  point, 
  index, 
  total, 
  maxPrice, 
  minPrice, 
  theme,
  onHover,
  onBlur,
  optimizationLevel = 'normal'
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
  
  // Memoize the material to prevent unnecessary recreations
  const material = useMemo(() => {
    const barColor = getBarColor();
    return new THREE.MeshStandardMaterial({
      color: barColor,
      roughness: optimizationLevel === 'aggressive' ? 0.7 : 0.4,  // Increase roughness in aggressive mode
      metalness: optimizationLevel === 'aggressive' ? 0.3 : 0.6,  // Decrease metalness in aggressive mode
      emissive: new THREE.Color(barColor),
      emissiveIntensity: 0
    });
  }, [theme, point.trend, optimizationLevel]);
  
  // Reduce geometry segments in aggressive optimization mode
  const boxGeometryArgs = optimizationLevel === 'aggressive' 
    ? [0.8, height, 0.8, 1, 1, 1]  // Reduced segments
    : [0.8, height, 0.8];
  
  // Animate the bar on creation - simplified for aggressive mode
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    if (optimizationLevel === 'aggressive') {
      // Minimal animation in aggressive mode, only if hovered
      if (meshRef.current.userData.hovered) {
        meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.05;
        const mat = meshRef.current.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.3;
      }
    } else {
      // Normal animation
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
    if (!meshRef.current) return;
    
    meshRef.current.userData.hovered = true;
    const material = meshRef.current.material as THREE.MeshStandardMaterial;
    material.emissive = new THREE.Color(getBarColor());
    material.emissiveIntensity = 0.5;
    document.body.style.cursor = 'pointer';
    if (onHover) onHover();
  };
  
  const handlePointerOut = () => {
    if (!meshRef.current) return;
    
    meshRef.current.userData.hovered = false;
    const material = meshRef.current.material as THREE.MeshStandardMaterial;
    material.emissiveIntensity = 0;
    document.body.style.cursor = 'auto';
    if (onBlur) onBlur();
  };

  return (
    <mesh
      ref={meshRef}
      position={[xPosition, height / 2, 0]}
      castShadow={false}
      receiveShadow={false}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <boxGeometry args={boxGeometryArgs} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};
