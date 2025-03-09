
import { useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Text, Sphere } from '@react-three/drei';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Market3DViewProps {
  data: any[];
  isSimulationMode?: boolean;
  onError?: () => void;
  onLoaded?: () => void;
}

export const Market3DView = ({ 
  data, 
  isSimulationMode = false,
  onError,
  onLoaded 
}: Market3DViewProps) => {
  const [hasRendered, setHasRendered] = useState(false);
  const [hasError, setHasError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Reset error state when data changes
  useEffect(() => {
    setHasError(false);
  }, [data]);

  // Notify parent component when loaded
  useEffect(() => {
    if (hasRendered && !hasError && onLoaded) {
      onLoaded();
    }
  }, [hasRendered, hasError, onLoaded]);

  // Error handling
  const handleRenderError = () => {
    console.error('3D rendering error occurred');
    setHasError(true);
    if (onError) onError();
  };

  // Force a re-render
  const handleRefresh = () => {
    setHasRendered(false);
    setTimeout(() => setHasRendered(true), 100);
  };

  if (hasError) {
    return (
      <Card className="h-[500px] flex flex-col items-center justify-center p-6 bg-red-50 border-red-200">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-medium mb-2">Visualization Error</h3>
        <p className="text-center mb-4 text-gray-700">
          There was a problem rendering the 3D visualization. This might be due to WebGL compatibility issues.
        </p>
        <Button onClick={handleRefresh} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="h-[500px] flex items-center justify-center">
        <p className="text-gray-500">No data available for 3D visualization</p>
      </Card>
    );
  }

  // Process data for visualization
  const maxPrice = Math.max(...data.map(d => d.high || d.close || 0));
  const minPrice = Math.min(...data.map(d => d.low || d.close || 0));
  const priceRange = maxPrice - minPrice;
  
  const maxVolume = Math.max(...data.map(d => d.volume || 0));

  const normalizeData = data.map((item, index) => {
    const price = item.close || 0;
    const normalizedPrice = priceRange ? (price - minPrice) / priceRange * 2 - 1 : 0;
    const normalizedVolume = maxVolume ? (item.volume || 0) / maxVolume * 0.5 : 0.1;
    
    // Determine color based on price change
    const priceChange = index > 0 ? price - (data[index - 1].close || 0) : 0;
    const color = priceChange > 0 ? '#22c55e' : priceChange < 0 ? '#ef4444' : '#3b82f6';
    
    return {
      position: [index * 0.3 - data.length * 0.15, normalizedPrice, 0],
      size: [0.1, 0.1, normalizedVolume * 5 + 0.1],
      color,
      price,
      volume: item.volume || 0,
      date: item.name || `Day ${index}`
    };
  });

  return (
    <Card className="relative h-[500px] shadow-lg overflow-hidden" style={{ background: '#111' }}>
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, 5], fov: 60 }}
        onCreated={() => setHasRendered(true)}
        onError={handleRenderError}
        style={{ width: '100%', height: '100%' }}
        shadows
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {/* Price data visualization */}
        {normalizeData.map((item, index) => (
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
        
        {/* Price labels */}
        {normalizeData.filter((_, i) => i % 5 === 0).map((item, index) => (
          <Text
            key={`text-${index}`}
            position={[item.position[0], item.position[1] + 0.2, item.position[2]]}
            fontSize={0.1}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            ${item.price.toFixed(2)}
          </Text>
        ))}
        
        {/* Reference sphere at origin */}
        <Sphere position={[0, 0, 0]} args={[0.05]}>
          <meshStandardMaterial color="white" />
        </Sphere>
        
        {/* Grid and controls */}
        <gridHelper args={[20, 20, '#333', '#222']} />
        <OrbitControls enableDamping dampingFactor={0.2} />
      </Canvas>
      
      {/* Overlay controls */}
      <div className="absolute bottom-4 right-4">
        <Button
          variant="secondary"
          size="sm"
          className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
          onClick={handleRefresh}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh View
        </Button>
      </div>
      
      {/* Data source indicator */}
      <div className="absolute top-2 left-2 bg-black/40 backdrop-blur-sm px-2 py-1 rounded text-xs text-white/80">
        {isSimulationMode ? 'Simulated Data' : 'Live Market Data'}
      </div>
    </Card>
  );
};
