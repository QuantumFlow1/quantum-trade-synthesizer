
import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { TradingDataPoint } from "@/utils/tradingData";
import { ColorTheme } from "@/hooks/use-theme-detection";
import * as THREE from "three";
import { OptimizationLevel } from "./scene/types";

interface PriceBarProps {
  point: TradingDataPoint;
  index: number;
  total: number;
  maxPrice: number;
  minPrice: number;
  theme: ColorTheme;
  onHover?: () => void;
  onBlur?: () => void;
  optimizationLevel?: OptimizationLevel;
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
  
  // Calculate position and dimensions once
  const { xPosition, height, material, geometry } = useMemo(() => {
    // Position bar along X-axis based on index
    const xPos = (index - total / 2) * 1.2;
    
    // Calculate height based on price
    const priceRange = maxPrice - minPrice;
    const barHeight = priceRange > 0 
      ? ((point.close - minPrice) / priceRange) * 5 + 0.5 // Scale height between 0.5 and 5.5
      : 1; // Default height if there's no price range
    
    // Determine color based on price trend
    const barColor = getBarColor(point.trend, theme);
    
    // Create material with optimized properties
    const mat = new THREE.MeshStandardMaterial({
      color: barColor,
      roughness: optimizationLevel === 'aggressive' ? 0.7 : 0.4,
      metalness: optimizationLevel === 'aggressive' ? 0.3 : 0.6,
      emissive: new THREE.Color(barColor).multiplyScalar(0.2),
      emissiveIntensity: 0
    });
    
    // Create geometry with appropriate detail level
    const segments = optimizationLevel === 'aggressive' ? 1 : (optimizationLevel === 'extreme' ? 1 : 2);
    const geo = new THREE.BoxGeometry(0.8, barHeight, 0.8, segments, segments, segments);
    
    return { xPosition: xPos, height: barHeight, material: mat, geometry: geo };
  }, [index, total, point.close, point.trend, maxPrice, minPrice, theme, optimizationLevel]);
  
  // Separate function for getting bar color
  const getBarColor = (trend: "up" | "down" | "neutral", currentTheme: ColorTheme): string => {
    if (trend === 'up') {
      return currentTheme === 'dark' ? '#10b981' : '#059669'; // Green
    } else if (trend === 'down') {
      return currentTheme === 'dark' ? '#ef4444' : '#dc2626'; // Red
    }
    return currentTheme === 'dark' ? '#6366f1' : '#4f46e5'; // Default/neutral (indigo)
  };
  
  // Log initial render only for first item
  useEffect(() => {
    if (index === 0) {
      console.log(`Rendering price bars with theme: ${theme}, optimization: ${optimizationLevel}`);
    }
  }, [index, theme, optimizationLevel]);
  
  // Optimize animations based on optimization level
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    
    if (optimizationLevel === 'extreme') {
      // Almost no animation in extreme mode for maximum performance
      if (meshRef.current.userData.hovered) {
        // Only update emissive when hovered
        updateMaterialEmissive(meshRef.current, 0.3);
      }
      return;
    }
    
    if (optimizationLevel === 'aggressive') {
      // Minimal animation in aggressive mode
      if (meshRef.current.userData.hovered) {
        // Simple rotation for hover effect
        meshRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.05;
        updateMaterialEmissive(meshRef.current, 0.3);
      }
      return;
    }
    
    // Normal animation for standard optimization
    meshRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5 + index * 0.1) * 0.05;
    
    // Emissive pulse for hover effect
    if (meshRef.current.userData.hovered) {
      updateMaterialEmissive(
        meshRef.current, 
        0.3 + Math.sin(clock.getElapsedTime() * 2) * 0.2
      );
    }
  });
  
  // Helper function to safely update material properties
  const updateMaterialEmissive = (mesh: THREE.Mesh, intensity: number) => {
    if (mesh.material instanceof THREE.MeshStandardMaterial) {
      mesh.material.emissiveIntensity = intensity;
    }
  };
  
  // Handle pointer events
  const handlePointerOver = () => {
    if (!meshRef.current) return;
    
    meshRef.current.userData.hovered = true;
    
    // Update material properties
    if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
      const barColor = getBarColor(point.trend, theme);
      meshRef.current.material.emissive = new THREE.Color(barColor);
      meshRef.current.material.emissiveIntensity = 0.5;
      document.body.style.cursor = 'pointer';
    }
    
    // Call external event handler
    if (onHover) onHover();
  };
  
  const handlePointerOut = () => {
    if (!meshRef.current) return;
    
    meshRef.current.userData.hovered = false;
    
    // Reset material properties
    if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
      meshRef.current.material.emissiveIntensity = 0;
      document.body.style.cursor = 'auto';
    }
    
    // Call external event handler
    if (onBlur) onBlur();
  };

  // Render the mesh with pre-calculated properties
  return (
    <mesh
      ref={meshRef}
      position={[xPosition, height / 2, 0]}
      castShadow={false}
      receiveShadow={false}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <primitive object={geometry} attach="geometry" />
      <primitive object={material} attach="material" />
    </mesh>
  );
};
