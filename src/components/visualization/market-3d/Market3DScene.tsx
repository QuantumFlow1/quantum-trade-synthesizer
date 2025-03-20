
import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Text, Sphere, Grid, Environment } from '@react-three/drei';
import { TradingHubEnvironment } from '../environment/environments/TradingHubEnvironment';
import { useThemeString } from '@/hooks/use-theme-string';

interface ProcessedDataPoint {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  price: number;
  volume: number;
  date: string;
}

interface Market3DSceneProps {
  processedData: ProcessedDataPoint[];
  onCreated: () => void;
  onError: () => void;
  onControlsRef: (ref: any) => void;
  theme: string;
}

export const Market3DScene: React.FC<Market3DSceneProps> = ({
  processedData,
  onCreated,
  onError,
  onControlsRef,
  theme
}) => {
  const controlsRef = useRef<any>(null);

  React.useEffect(() => {
    if (controlsRef.current) {
      onControlsRef(controlsRef.current);
    }
  }, [controlsRef, onControlsRef]);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      onCreated={onCreated}
      onError={onError}
      style={{ width: '100%', height: '100%' }}
      shadows
    >
      <color attach="background" args={[theme === 'dark' ? '#111' : '#f5f5f5']} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      {/* Environment */}
      <Environment preset={theme === 'dark' ? 'night' : 'sunset'} />
      
      {/* Market data visualization */}
      {processedData.map((item, index) => (
        <Box 
          key={index} 
          position={item.position} 
          args={item.size}
          castShadow
        >
          <meshStandardMaterial 
            color={item.color} 
            metalness={0.6}
            roughness={0.2}
            emissive={item.color}
            emissiveIntensity={0.2}
          />
        </Box>
      ))}
      
      {/* Price labels for every 5th item */}
      {processedData.filter((_, i) => i % 5 === 0).map((item, index) => (
        <Text
          key={`text-${index}`}
          position={[item.position[0], item.position[1] + 0.2, item.position[2]]}
          fontSize={0.1}
          color={theme === 'dark' ? 'white' : 'black'}
          anchorX="center"
          anchorY="middle"
        >
          ${item.price.toFixed(2)}
        </Text>
      ))}
      
      {/* Reference sphere at origin */}
      <Sphere position={[0, 0, 0]} args={[0.05]}>
        <meshStandardMaterial color={theme === 'dark' ? 'white' : 'black'} />
      </Sphere>
      
      {/* Grid and controls */}
      <Grid args={[20, 20]} infiniteGrid cellColor={theme === 'dark' ? '#444' : '#ddd'} sectionColor={theme === 'dark' ? '#666' : '#bbb'} />
      <OrbitControls 
        ref={controlsRef}
        enableDamping
        dampingFactor={0.2}
        minDistance={2}
        maxDistance={10}
      />
      
      {/* Include the trading hub environment */}
      <TradingHubEnvironment />
    </Canvas>
  );
};
