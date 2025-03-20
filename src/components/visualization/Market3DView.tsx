
import { useEffect, useState, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Text, Sphere, Grid, Environment } from '@react-three/drei';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, ZoomIn, ZoomOut, RotateCcw, Eye } from 'lucide-react';
import { useThemeString } from '@/hooks/use-theme-string';
import { TradingFloorEnvironment } from './environment/environments/TradingHubEnvironment';

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
  const [viewMode, setViewMode] = useState<'default' | 'volume' | 'price'>('default');
  const [dataDensity, setDataDensity] = useState(50);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useThemeString();
  const controlsRef = useRef<any>(null);

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

  // Process data for visualization
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Take a subset of data based on data density
    const stepSize = Math.max(1, Math.floor(data.length / (dataDensity / 10)));
    const filteredData = data.filter((_, i) => i % stepSize === 0);
    
    // Process the data for visualization
    const maxPrice = Math.max(...filteredData.map(d => d.high || d.close || 0));
    const minPrice = Math.min(...filteredData.map(d => d.low || d.close || 0));
    const priceRange = maxPrice - minPrice;
    const maxVolume = Math.max(...filteredData.map(d => d.volume || 0));

    return filteredData.map((item, index) => {
      const price = item.close || 0;
      const normalizedPrice = priceRange ? (price - minPrice) / priceRange * 2 - 1 : 0;
      const normalizedVolume = maxVolume ? (item.volume || 0) / maxVolume : 0.1;
      
      // Determine color based on price change
      const priceChange = index > 0 ? price - (filteredData[index - 1].close || 0) : 0;
      const color = priceChange > 0 ? '#22c55e' : priceChange < 0 ? '#ef4444' : '#3b82f6';
      
      return {
        position: [index * 0.3 - filteredData.length * 0.15, normalizedPrice, 0],
        size: viewMode === 'volume' 
          ? [0.1, normalizedVolume * 3, 0.1] 
          : viewMode === 'price'
          ? [0.1, Math.abs(normalizedPrice) * 2, 0.1]
          : [0.1, 0.1, normalizedVolume * 5 + 0.1],
        color,
        price,
        volume: item.volume || 0,
        date: item.name || `Day ${index}`
      };
    });
  }, [data, dataDensity, viewMode]);

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

  // Reset view
  const handleResetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  // Change view mode
  const cycleViewMode = () => {
    if (viewMode === 'default') setViewMode('volume');
    else if (viewMode === 'volume') setViewMode('price');
    else setViewMode('default');
  };

  if (hasError) {
    return (
      <Card className="h-[500px] flex flex-col items-center justify-center p-6 bg-card/50 border-border">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-xl font-medium mb-2">Visualization Error</h3>
        <p className="text-center mb-4 text-muted-foreground">
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
        <p className="text-muted-foreground">No data available for 3D visualization</p>
      </Card>
    );
  }

  return (
    <Card className="relative h-[500px] shadow-lg overflow-hidden bg-background/10 backdrop-blur-sm border border-border/30">
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, 5], fov: 60 }}
        onCreated={() => setHasRendered(true)}
        onError={handleRenderError}
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
      </Canvas>
      
      {/* Visualization controls */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="bg-background/20 backdrop-blur-sm hover:bg-background/40"
          onClick={handleResetView}
          title="Reset View"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          className="bg-background/20 backdrop-blur-sm hover:bg-background/40"
          onClick={cycleViewMode}
          title={`Current: ${viewMode} mode - Click to change`}
        >
          <Eye className="h-4 w-4" />
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          className="bg-background/20 backdrop-blur-sm hover:bg-background/40"
          onClick={() => setDataDensity(Math.min(100, dataDensity + 10))}
          title="Increase Data Detail"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          className="bg-background/20 backdrop-blur-sm hover:bg-background/40"
          onClick={() => setDataDensity(Math.max(10, dataDensity - 10))}
          title="Decrease Data Detail"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          className="bg-background/20 backdrop-blur-sm hover:bg-background/40"
          onClick={handleRefresh}
          title="Refresh View"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Data source indicator */}
      <div className="absolute top-2 left-2 bg-background/40 backdrop-blur-sm px-2 py-1 rounded text-xs text-foreground/80">
        {isSimulationMode ? 'Simulated Data' : 'Live Market Data'} • {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
      </div>
      
      {/* Instruction overlay */}
      <div className="absolute bottom-2 left-2 text-xs text-foreground/70 bg-background/20 backdrop-blur-sm px-2 py-1 rounded">
        Drag to rotate • Scroll to zoom • Right-click to pan
      </div>
    </Card>
  );
};
