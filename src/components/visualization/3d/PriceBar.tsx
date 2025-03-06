
import { useRef, useState } from "react";
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
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  const spread = 20; // How spread out the bars are
  const spacing = total > 1 ? spread / total : spread; // Distance between each bar
  const position = index * spacing - (spread / 2); // Center the visualization

  // Scale height based on price relative to min/max
  const priceRange = maxPrice - minPrice;
  const normalizedPrice = priceRange > 0 ? (point.close - minPrice) / priceRange : 0.5;
  const height = Math.max(0.1, normalizedPrice * maxHeight);

  // Theme-aware colors
  const getUpColor = () => theme === 'dark' ? "#10b981" : "#059669";
  const getDownColor = () => theme === 'dark' ? "#ef4444" : "#dc2626";
  
  // Color based on trend
  const baseColor = point.trend === "up" ? getUpColor() : getDownColor();
  
  // Enhanced colors for interaction states
  const color = hovered 
    ? clicked 
      ? new THREE.Color(baseColor).multiplyScalar(1.5).getStyle() // Brighter when clicked
      : new THREE.Color(baseColor).multiplyScalar(1.2).getStyle() // Slightly brighter on hover
    : baseColor;
  
  // Emissive intensity changes based on interaction
  const emissiveIntensity = hovered 
    ? clicked 
      ? (theme === 'dark' ? 0.7 : 0.5) // Strongest when clicked
      : (theme === 'dark' ? 0.5 : 0.3) // Medium when hovered
    : (theme === 'dark' ? 0.3 : 0.1);  // Default

  // Add subtle animation
  useFrame((state) => {
    if (mesh.current) {
      // Basic animation
      mesh.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.02;
      
      // Add subtle hover effect
      const baseY = height / 2;
      const hoverOffset = hovered ? Math.sin(state.clock.getElapsedTime() * 2) * 0.1 : 0;
      const floatEffect = Math.sin(state.clock.getElapsedTime() * 0.5 + index * 0.2) * 0.05;
      
      mesh.current.position.y = baseY + floatEffect + hoverOffset;
      
      // Scale effect when clicked
      if (clicked) {
        const pulseScale = 1 + Math.sin(state.clock.getElapsedTime() * 3) * 0.05;
        mesh.current.scale.set(pulseScale, 1, pulseScale);
      } else {
        mesh.current.scale.setScalar(hovered ? 1.1 : 1);
      }
    }
  });

  return (
    <group position={[position, height / 2, 0]}>
      <mesh 
        ref={mesh} 
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setClicked(!clicked)}
      >
        <boxGeometry args={[0.4, height, 0.4]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={emissiveIntensity} 
          roughness={theme === 'dark' ? 0.3 : 0.5}
          metalness={theme === 'dark' ? 0.7 : 0.5}
        />
      </mesh>
      
      {/* Enhanced information display */}
      {(hovered || clicked) && (
        <Billboard 
          position={[0, height + 0.8, 0]}
          follow={true}
          lockX={false}
          lockY={false}
          lockZ={false}
        >
          <group>
            <mesh position={[0, 0, -0.01]}>
              <planeGeometry args={[2.5, clicked ? 2.5 : 1.8]} />
              <meshBasicMaterial 
                color={theme === 'dark' ? "#1f1f1f" : "#f8f8f8"} 
                transparent={true} 
                opacity={0.85}
              />
            </mesh>
            <Text
              position={[0, clicked ? 0.8 : 0.5, 0]}
              color={theme === 'dark' ? "#ffffff" : "#000000"}
              fontSize={0.3}
              anchorY="top"
              anchorX="center"
              maxWidth={2}
            >
              {`Price: $${point.close.toFixed(2)}`}
            </Text>
            
            {clicked && (
              <>
                <Text
                  position={[0, 0.2, 0]}
                  color={theme === 'dark' ? "#ffffff" : "#000000"}
                  fontSize={0.2}
                  anchorY="top"
                  anchorX="center"
                  maxWidth={2}
                >
                  {`Open: $${point.open.toFixed(2)}`}
                </Text>
                <Text
                  position={[0, -0.2, 0]}
                  color={theme === 'dark' ? "#ffffff" : "#000000"}
                  fontSize={0.2}
                  anchorY="top"
                  anchorX="center"
                  maxWidth={2}
                >
                  {`High: $${point.high.toFixed(2)}`}
                </Text>
                <Text
                  position={[0, -0.6, 0]}
                  color={theme === 'dark' ? "#ffffff" : "#000000"}
                  fontSize={0.2}
                  anchorY="top"
                  anchorX="center"
                  maxWidth={2}
                >
                  {`Low: $${point.low.toFixed(2)}`}
                </Text>
              </>
            )}
          </group>
        </Billboard>
      )}
      
      {/* Always visible minimal label */}
      {!hovered && !clicked && (
        <Billboard position={[0, height + 0.5, 0]}>
          <Text
            color={theme === 'dark' ? "#ffffff" : "#000000"}
            fontSize={0.3}
            anchorY="bottom"
          >
            {point.close.toFixed(0)}
          </Text>
        </Billboard>
      )}
    </group>
  );
};
