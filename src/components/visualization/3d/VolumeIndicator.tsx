
import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { TradingDataPoint } from "@/utils/tradingData";
import * as THREE from "three";
import { ColorTheme } from "@/hooks/use-theme-detection";
import { Billboard, Text } from "@react-three/drei";

interface VolumeIndicatorProps {
  point: TradingDataPoint;
  index: number;
  total: number;
  maxVolume: number;
  theme: ColorTheme;
  optimizationLevel?: 'normal' | 'aggressive';
}

export const VolumeIndicator = ({
  point,
  index,
  total,
  maxVolume,
  theme,
  optimizationLevel = 'normal'
}: VolumeIndicatorProps) => {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  const spread = 20;
  const spacing = total > 1 ? spread / total : spread;
  const position = index * spacing - (spread / 2);
  
  const normalizedVolume = maxVolume > 0 ? point.volume / maxVolume : 0.5;
  const size = Math.max(0.1, normalizedVolume * 0.7);
  
  // Theme-based colors
  const baseColor = theme === 'dark' ? '#8b5cf6' : '#6d28d9';
  
  // Enhanced colors for interaction states
  const color = hovered 
    ? clicked 
      ? new THREE.Color(baseColor).multiplyScalar(1.5).getStyle() 
      : new THREE.Color(baseColor).multiplyScalar(1.2).getStyle() 
    : baseColor;
  
  // Emissive intensity based on interaction
  const emissiveIntensity = hovered 
    ? clicked 
      ? (theme === 'dark' ? 0.6 : 0.4)
      : (theme === 'dark' ? 0.45 : 0.25)
    : (theme === 'dark' ? 0.3 : 0.1);
  
  // Memoize material to prevent recreation on every render
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: color,
    transparent: true,
    opacity: theme === 'dark' ? 0.6 : 0.5,
    emissive: color,
    emissiveIntensity: emissiveIntensity,
    roughness: optimizationLevel === 'aggressive' ? 0.8 : 0.5,
    metalness: optimizationLevel === 'aggressive' ? 0.2 : 0.4
  }), [color, theme, emissiveIntensity, optimizationLevel]);
  
  // Optimize sphere geometry detail in aggressive mode
  const sphereDetail = optimizationLevel === 'aggressive' ? 8 : 16;
  
  useFrame((state) => {
    if (!mesh.current) return;
    
    // Simplified animations in aggressive mode
    if (optimizationLevel === 'aggressive') {
      // Minimal or no animations in aggressive mode
      if (hovered) {
        // Only animate when hovered
        mesh.current.rotation.x = state.clock.getElapsedTime() * 0.2;
        mesh.current.rotation.z = state.clock.getElapsedTime() * 0.1;
        mesh.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        
        // Simple scale up when hovered
        mesh.current.scale.setScalar(clicked ? 1.1 : 1.05);
      } else {
        mesh.current.rotation.y = state.clock.getElapsedTime() * 0.1;
        mesh.current.scale.setScalar(1);
      }
    } else {
      // Basic rotation animation
      mesh.current.rotation.x = state.clock.getElapsedTime() * 0.3;
      mesh.current.rotation.z = state.clock.getElapsedTime() * 0.2;
      
      // Interactive animations
      if (hovered) {
        // Faster rotation when hovered
        mesh.current.rotation.y = state.clock.getElapsedTime() * 0.8;
        
        // Pulsing effect when clicked
        if (clicked) {
          const pulseScale = 1 + Math.sin(state.clock.getElapsedTime() * 3) * 0.1;
          mesh.current.scale.setScalar(pulseScale);
        } else {
          mesh.current.scale.setScalar(1.1); // Just slightly larger when hovered
        }
      } else {
        mesh.current.rotation.y = state.clock.getElapsedTime() * 0.2;
        mesh.current.scale.setScalar(1);
      }
    }
  });
  
  // Don't render labels in aggressive optimization mode unless clicked
  const shouldShowLabel = optimizationLevel !== 'aggressive' || clicked;
  
  return (
    <group position={[position, -2, 0]}>
      <mesh 
        ref={mesh}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setClicked(!clicked)}
      >
        <sphereGeometry args={[size, sphereDetail, sphereDetail]} />
        <primitive object={material} attach="material" />
      </mesh>
      
      {/* Volume information display on interaction */}
      {shouldShowLabel && (hovered || clicked) && (
        <Billboard 
          position={[0, size + 0.5, 0]}
          follow={true}
          lockX={false}
          lockY={false}
          lockZ={false}
        >
          <group>
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[2.2, clicked ? 1.8 : 1]} />
              <meshBasicMaterial 
                color={theme === 'dark' ? "#1f1f1f" : "#f8f8f8"} 
                transparent={true} 
                opacity={0.85}
              />
            </mesh>
            <Text
              position={[0, clicked ? 0.5 : 0.2, 0]}
              color={theme === 'dark' ? "#ffffff" : "#000000"}
              fontSize={0.25}
              anchorY="top"
              anchorX="center"
              maxWidth={2}
            >
              {`Volume: ${point.volume.toFixed(0)}`}
            </Text>
            
            {clicked && (
              <>
                <Text
                  position={[0, 0, 0]}
                  color={theme === 'dark' ? "#ffffff" : "#000000"}
                  fontSize={0.2}
                  anchorY="top"
                  anchorX="center"
                  maxWidth={2}
                >
                  {`${(normalizedVolume * 100).toFixed(1)}% of Max`}
                </Text>
                <Text
                  position={[0, -0.4, 0]}
                  color={theme === 'dark' ? "#ffffff" : "#000000"}
                  fontSize={0.2}
                  anchorY="top"
                  anchorX="center"
                  maxWidth={2}
                >
                  {point.trend === 'up' ? '▲ Buying Pressure' : '▼ Selling Pressure'}
                </Text>
              </>
            )}
          </group>
        </Billboard>
      )}
    </group>
  );
};
