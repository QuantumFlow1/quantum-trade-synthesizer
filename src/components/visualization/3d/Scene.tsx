import { useState, useEffect, useMemo, useRef } from "react";
import { PriceBar } from "./PriceBar";
import { VolumeIndicator } from "./VolumeIndicator";
import { CoordinateSystem } from "./CoordinateSystem";
import { ThemeBasedLighting } from "./ThemeBasedLighting";
import { TradingDataPoint } from "@/utils/tradingData";
import { OrbitControls, Stars, Environment, Text } from "@react-three/drei";
import { useThemeDetection } from "@/hooks/use-theme-detection";
import * as THREE from "three";

interface SceneProps {
  data: TradingDataPoint[];
}

export const Scene = ({ data }: SceneProps) => {
  const [processedData, setProcessedData] = useState<TradingDataPoint[]>([]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const theme = useThemeDetection();
  
  const spotLight = useRef(new THREE.SpotLight(
    theme === 'dark' ? '#8b5cf6' : '#6d28d9',
    1,
    30,
    Math.PI / 6,
    0.5,
    0.5
  )).current;
  
  const spotLightTarget = useRef(new THREE.Object3D()).current;
  
  useEffect(() => {
    spotLight.target = spotLightTarget;
  }, [spotLight, spotLightTarget]);
  
  const marketSentiment = useMemo(() => {
    if (!processedData.length) return "neutral";
    
    const upCount = processedData.filter(d => d.trend === "up").length;
    const downCount = processedData.filter(d => d.trend === "down").length;
    
    if (upCount > downCount * 1.5) return "very-bullish";
    if (upCount > downCount) return "bullish";
    if (downCount > upCount * 1.5) return "very-bearish";
    if (downCount > upCount) return "bearish";
    return "neutral";
  }, [processedData]);
  
  const environmentPreset = useMemo(() => {
    if (theme === 'dark') {
      switch (marketSentiment) {
        case "very-bullish": return "night";
        case "bullish": return "sunset";
        case "very-bearish": return "dawn";
        case "bearish": return "warehouse";
        default: return "night";
      }
    } else {
      switch (marketSentiment) {
        case "very-bullish": return "sunset";
        case "bullish": return "park";
        case "very-bearish": return "dawn";
        case "bearish": return "city";
        default: return "park";
      }
    }
  }, [marketSentiment, theme]);
  
  useEffect(() => {
    try {
      if (data && Array.isArray(data) && data.length > 0) {
        console.log("Processing 3D visualization data:", data.length, "data points");
        setProcessedData(data);
      } else {
        console.warn("Empty or invalid data received, creating fallback data");
        const fallbackData: TradingDataPoint[] = Array.from({ length: 5 }).map((_, i) => ({
          name: `Fallback ${i + 1}`,
          open: 100 + i * 5,
          close: 105 + i * 5,
          high: 110 + i * 5,
          low: 95 + i * 5,
          volume: 1000 + i * 100,
          sma: 102 + i * 5,
          ema: 103 + i * 5,
          rsi: 50 + i,
          macd: 0.5 + i * 0.1,
          macdSignal: 0.3 + i * 0.1,
          macdHistogram: 0.2 + i * 0.1,
          bollingerUpper: 115 + i * 5,
          bollingerLower: 90 + i * 5,
          stochastic: 40 + i * 5,
          adx: 30 + i * 2,
          trend: i % 2 === 0 ? "up" : "down"
        }));
        setProcessedData(fallbackData);
      }
    } catch (error) {
      console.error("Error processing 3D visualization data:", error);
      setProcessedData([]);
    }
  }, [data]);
  
  const { maxPrice, minPrice, maxVolume } = useMemo(() => {
    try {
      if (!processedData || processedData.length === 0) {
        return { maxPrice: 100, minPrice: 0, maxVolume: 100 };
      }
      
      const maxP = Math.max(...processedData.map(d => d.close));
      const minP = Math.min(...processedData.map(d => d.close));
      const maxV = Math.max(...processedData.map(d => d.volume));
      
      return { maxPrice: maxP, minPrice: minP, maxVolume: maxV };
    } catch (error) {
      console.error("Error calculating min/max values:", error);
      return { maxPrice: 100, minPrice: 0, maxVolume: 100 };
    }
  }, [processedData]);
  
  useEffect(() => {
    if (hoveredIndex !== null && processedData[hoveredIndex]) {
      const spread = 20;
      const spacing = processedData.length > 1 ? spread / processedData.length : spread;
      const position = hoveredIndex * spacing - (spread / 2);
      
      spotLight.position.set(position, 10, 5);
      spotLightTarget.position.set(position, 0, 0);
    }
  }, [hoveredIndex, processedData, spotLight, spotLightTarget]);
  
  const getSentimentColor = () => {
    if (marketSentiment.includes("bullish")) {
      return theme === 'dark' ? "#10b981" : "#059669";
    } else if (marketSentiment.includes("bearish")) {
      return theme === 'dark' ? "#ef4444" : "#dc2626";
    }
    return theme === 'dark' ? "#ffffff" : "#000000";
  };
  
  const getSentimentText = () => {
    switch (marketSentiment) {
      case "very-bullish": return "VERY BULLISH";
      case "bullish": return "BULLISH";
      case "very-bearish": return "VERY BEARISH";
      case "bearish": return "BEARISH";
      default: return "NEUTRAL";
    }
  };
  
  return (
    <>
      <ThemeBasedLighting />
      
      <primitive object={spotLight} intensity={hoveredIndex !== null ? 1 : 0} />
      <primitive object={spotLightTarget} />
      
      {theme === 'dark' && (
        <Stars radius={100} depth={50} count={1000} factor={4} fade speed={1} />
      )}
      
      <group position={[0, 8, -10]}>
        <Text
          color={getSentimentColor()}
          fontSize={1.5}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor={theme === 'dark' ? "#000000" : "#ffffff"}
        >
          {getSentimentText()}
        </Text>
      </group>
      
      <CoordinateSystem theme={theme} />
      
      {processedData.length > 0 && processedData.map((point, index) => (
        <PriceBar 
          key={`price-${index}`}
          point={point} 
          index={index} 
          total={processedData.length} 
          maxPrice={maxPrice} 
          minPrice={minPrice}
          theme={theme}
        />
      ))}
      
      {processedData.length > 0 && processedData.map((point, index) => (
        <VolumeIndicator 
          key={`volume-${index}`}
          point={point} 
          index={index} 
          total={processedData.length} 
          maxVolume={maxVolume}
          theme={theme}
        />
      ))}
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color={theme === 'dark' ? "#1e1e2f" : "#f0f9ff"} 
          opacity={0.6}
          transparent
          roughness={0.8}
        />
      </mesh>
      
      <OrbitControls 
        enableZoom={true} 
        enablePan={true} 
        rotateSpeed={0.5}
        zoomSpeed={0.7}
        minDistance={5}
        maxDistance={30}
      />
      
      <Environment preset={environmentPreset} />
    </>
  );
};
