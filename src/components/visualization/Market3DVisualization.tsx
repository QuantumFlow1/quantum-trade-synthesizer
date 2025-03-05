
import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Billboard, Environment, Stars } from "@react-three/drei";
import { TradingDataPoint } from "@/utils/tradingData";
import { BarChart3, Activity, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as THREE from "three";

interface Market3DVisualizationProps {
  data: TradingDataPoint[];
  isSimulationMode?: boolean;
}

const PriceBar = ({ 
  point, 
  index, 
  total, 
  maxPrice, 
  minPrice, 
  maxHeight = 10 
}: { 
  point: TradingDataPoint; 
  index: number; 
  total: number; 
  maxPrice: number; 
  minPrice: number;
  maxHeight?: number;
}) => {
  const mesh = useRef<THREE.Mesh>(null);
  const spread = 20; // How spread out the bars are
  const spacing = spread / total; // Distance between each bar
  const position = index * spacing - (spread / 2); // Center the visualization
  
  // Scale height based on price relative to min/max
  const priceRange = maxPrice - minPrice;
  const normalizedPrice = (point.close - minPrice) / priceRange;
  const height = Math.max(0.1, normalizedPrice * maxHeight);
  
  // Color based on trend
  const color = point.trend === "up" ? "#10b981" : "#ef4444";
  
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
          emissiveIntensity={0.2} 
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      <Billboard position={[0, height + 0.5, 0]}>
        <Text
          color="#ffffff"
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

const VolumeIndicator = ({ 
  point, 
  index, 
  total, 
  maxVolume 
}: { 
  point: TradingDataPoint; 
  index: number; 
  total: number; 
  maxVolume: number;
}) => {
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

// Add a coordinate grid to help with spatial understanding
const CoordinateSystem = () => {
  return (
    <group>
      <gridHelper args={[30, 30, "#304050", "#203040"]} position={[0, -3, 0]} />
      
      {/* X-axis */}
      <line>
        <bufferGeometry attach="geometry" args={[new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-15, -3, 0),
          new THREE.Vector3(15, -3, 0)
        ])]} />
        <lineBasicMaterial attach="material" color="#4a9eff" linewidth={2} />
      </line>
      
      {/* Y-axis */}
      <line>
        <bufferGeometry attach="geometry" args={[new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, -3, 0),
          new THREE.Vector3(0, 7, 0)
        ])]} />
        <lineBasicMaterial attach="material" color="#ff4a4a" linewidth={2} />
      </line>
    </group>
  );
};

const Scene = ({ data }: { data: TradingDataPoint[] }) => {
  // Calculate min/max for scaling
  const maxPrice = Math.max(...data.map(d => d.close));
  const minPrice = Math.min(...data.map(d => d.close));
  const maxVolume = Math.max(...data.map(d => d.volume));
  
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[-10, 15, 10]} angle={0.15} penumbra={1} intensity={0.5} castShadow />
      
      <Stars radius={100} depth={50} count={1000} factor={4} fade speed={1} />
      
      {/* Price bars */}
      {data.map((point, index) => (
        <PriceBar 
          key={`price-${index}`}
          point={point} 
          index={index} 
          total={data.length} 
          maxPrice={maxPrice} 
          minPrice={minPrice}
        />
      ))}
      
      {/* Volume indicators */}
      {data.map((point, index) => (
        <VolumeIndicator 
          key={`volume-${index}`}
          point={point} 
          index={index} 
          total={data.length} 
          maxVolume={maxVolume}
        />
      ))}
      
      <CoordinateSystem />
      
      <OrbitControls 
        enableZoom={true} 
        enablePan={true} 
        rotateSpeed={0.5}
        zoomSpeed={0.7}
        minDistance={5}
        maxDistance={30}
      />
      
      <Environment preset="sunset" />
    </>
  );
};

export const Market3DVisualization = ({ data, isSimulationMode }: Market3DVisualizationProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  
  return (
    <div className={`bg-black/90 rounded-lg overflow-hidden border border-gray-800 ${
      isFullscreen ? "fixed inset-0 z-50" : "h-[500px]"
    }`}>
      <div className="flex justify-between items-center p-2 bg-black/50 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <span className="font-medium text-gray-200">Market 3D View</span>
          {isSimulationMode && (
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              Simulation
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="h-7 px-2 bg-gray-800/50 hover:bg-gray-700/50 border-gray-700"
            onClick={toggleFullscreen}
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Canvas shadows camera={{ position: [0, 5, 14], fov: 50 }}>
        <Scene data={data} />
      </Canvas>
      
      <div className="absolute bottom-2 left-2 text-xs text-gray-500">
        <span>Drag to rotate • Scroll to zoom</span>
      </div>
    </div>
  );
};
